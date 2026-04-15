import { test, expect } from '@fixtures/pages';

test.describe('Shopping Cart', () => {
  test('should add a single product to the cart', async ({ inventoryPage }) => {
    await inventoryPage.navigate();
    await inventoryPage.addProductToCart('Sauce Labs Backpack');

    await expect(inventoryPage.cartBadge).toHaveText('1');
    expect(await inventoryPage.getCartCount()).toBe(1);
  });

  test('should add multiple products to the cart', async ({ inventoryPage }) => {
    await inventoryPage.navigate();
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');
    await inventoryPage.addProductToCart('Sauce Labs Bolt T-Shirt');

    await expect(inventoryPage.cartBadge).toHaveText('3');
    expect(await inventoryPage.getCartCount()).toBe(3);
  });

  test('should update cart badge when item is removed from inventory page', async ({
    inventoryPage,
  }) => {
    await inventoryPage.navigate();
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');

    expect(await inventoryPage.getCartCount()).toBe(2);

    await inventoryPage.removeProductFromCart('Sauce Labs Backpack');

    await expect(inventoryPage.cartBadge).toHaveText('1');
    expect(await inventoryPage.getCartCount()).toBe(1);
  });

  test('should display correct items in the cart page', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.navigate();
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');
    await inventoryPage.goToCart();

    await cartPage.waitForUrl(/.*cart/);
    await expect(cartPage.pageTitle).toHaveText('Your Cart');

    expect(await cartPage.getItemCount()).toBe(2);

    const itemNames = await cartPage.getItemNames();
    expect(itemNames).toContain('Sauce Labs Backpack');
    expect(itemNames).toContain('Sauce Labs Bike Light');
  });

  test('should remove an item from the cart page', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.navigate();
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');
    await inventoryPage.goToCart();

    await cartPage.removeItem('Sauce Labs Backpack');

    expect(await cartPage.getItemCount()).toBe(1);

    const itemNames = await cartPage.getItemNames();
    expect(itemNames).not.toContain('Sauce Labs Backpack');
    expect(itemNames).toContain('Sauce Labs Bike Light');
  });

  test('should show an empty cart badge when all items are removed', async ({ inventoryPage }) => {
    await inventoryPage.navigate();
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.removeProductFromCart('Sauce Labs Backpack');

    await expect(inventoryPage.cartBadge).not.toBeVisible();
    expect(await inventoryPage.getCartCount()).toBe(0);
  });

  test('should navigate back to inventory from cart', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.navigate();
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();

    await cartPage.waitForUrl(/.*cart/);
    await cartPage.continueShopping();

    await inventoryPage.waitForUrl(/.*inventory/);
    await expect(inventoryPage.productList).toBeVisible();
  });
});
