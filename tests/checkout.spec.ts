import { test, expect } from '@fixtures/pages';
import { type InventoryPage } from '@pages/InventoryPage';
import { type CartPage } from '@pages/CartPage';
import { type CheckoutPage } from '@pages/CheckoutPage';
import { CheckoutData } from '@data/checkout';

// helper to add products and land on checkout step one
async function addItemsAndGoToCheckout(
  inventoryPage: InventoryPage,
  cartPage: CartPage,
  checkoutPage: CheckoutPage,
  products: string[],
): Promise<void> {
  await inventoryPage.navigate();
  for (const product of products) {
    await inventoryPage.addProductToCart(product);
  }
  await inventoryPage.goToCart();
  await cartPage.proceedToCheckout();
  await checkoutPage.waitForUrl(/.*checkout-step-one/);
}

test.describe('Checkout', () => {
  test('should complete the full checkout flow successfully', async ({
    inventoryPage,
    cartPage,
    checkoutPage,
    confirmationPage,
  }) => {
    await addItemsAndGoToCheckout(inventoryPage, cartPage, checkoutPage, [
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
    ]);

    await checkoutPage.fillForm(CheckoutData.valid);

    await checkoutPage.waitForUrl(/.*checkout-step-two/);
    expect(await checkoutPage.getSubtotalText()).toContain('Item total');

    await checkoutPage.finishOrder();

    await confirmationPage.waitForUrl(/.*checkout-complete/);
    await expect(confirmationPage.confirmationHeader).toBeVisible();
    expect(await confirmationPage.getHeaderText()).toContain('Thank you for your order');
  });

  test('should display correct order total on summary page', async ({
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await addItemsAndGoToCheckout(inventoryPage, cartPage, checkoutPage, ['Sauce Labs Backpack']);

    await checkoutPage.fillForm(CheckoutData.valid);

    await checkoutPage.waitForUrl(/.*checkout-step-two/);

    // backpack is $29.99 so total with tax should be something above that
    const total = await checkoutPage.getTotalAmount();
    expect(total).toBeGreaterThan(0);
    expect(await checkoutPage.getTotalText()).toContain('Total: $');
  });

  test('should show validation error when first name is missing', async ({
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await addItemsAndGoToCheckout(inventoryPage, cartPage, checkoutPage, ['Sauce Labs Backpack']);

    await checkoutPage.fillForm(CheckoutData.missingFirstName);

    await checkoutPage.waitForUrl(/.*checkout-step-one/);
    await expect(checkoutPage.errorMessage).toBeVisible();
    expect(await checkoutPage.getErrorMessage()).toContain('First Name is required');
  });

  test('should allow cancelling checkout and returning to cart', async ({
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await addItemsAndGoToCheckout(inventoryPage, cartPage, checkoutPage, ['Sauce Labs Backpack']);

    await checkoutPage.cancel();

    await cartPage.waitForUrl(/.*cart/);
  });

  test('should show Back to Products button after order and navigate home', async ({
    inventoryPage,
    cartPage,
    checkoutPage,
    confirmationPage,
  }) => {
    await addItemsAndGoToCheckout(inventoryPage, cartPage, checkoutPage, [
      'Sauce Labs Fleece Jacket',
    ]);

    await checkoutPage.fillForm(CheckoutData.valid);
    await checkoutPage.finishOrder();

    await confirmationPage.waitForUrl(/.*checkout-complete/);
    await expect(confirmationPage.backHomeButton).toBeVisible();

    await confirmationPage.backToProducts();
    await inventoryPage.waitForUrl(/.*inventory/);
  });

  test('should complete checkout with multiple different products', async ({
    inventoryPage,
    cartPage,
    checkoutPage,
    confirmationPage,
  }) => {
    await addItemsAndGoToCheckout(inventoryPage, cartPage, checkoutPage, [
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt',
      'Sauce Labs Fleece Jacket',
    ]);

    await checkoutPage.fillForm(CheckoutData.valid);

    expect(await checkoutPage.summaryItems.count()).toBe(4);

    await checkoutPage.finishOrder();

    await expect(confirmationPage.confirmationHeader).toBeVisible();
    expect(await confirmationPage.isOrderConfirmed()).toBe(true);
  });
});
