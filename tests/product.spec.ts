import { test, expect } from '@fixtures/pages';

test.describe('Product Detail', () => {
  test('should open product detail page when clicking a product name', async ({
    inventoryPage,
    productDetailPage,
  }) => {
    await inventoryPage.navigate();
    await inventoryPage.viewProduct('Sauce Labs Backpack');

    await productDetailPage.waitForUrl(/.*inventory-item/);
    await expect(productDetailPage.productName).toBeVisible();
    await expect(productDetailPage.productDescription).toBeVisible();
    await expect(productDetailPage.productPrice).toBeVisible();
    await expect(productDetailPage.productImage).toBeVisible();

    expect(await productDetailPage.getProductName()).toBe('Sauce Labs Backpack');
    expect(await productDetailPage.getProductPrice()).toBe('$29.99');
  });

  test('should add product to cart from the detail page', async ({
    inventoryPage,
    productDetailPage,
  }) => {
    await inventoryPage.navigate();
    await inventoryPage.viewProduct('Sauce Labs Bike Light');

    await productDetailPage.waitForUrl(/.*inventory-item/);
    await productDetailPage.addToCart();

    await expect(productDetailPage.cartBadge).toHaveText('1');
    await expect(productDetailPage.removeButton).toBeVisible();
    await expect(productDetailPage.addToCartButton).not.toBeVisible();
  });

  test('should navigate back to inventory from product detail page', async ({
    inventoryPage,
    productDetailPage,
  }) => {
    await inventoryPage.navigate();
    await inventoryPage.viewProduct('Sauce Labs Bolt T-Shirt');

    await productDetailPage.waitForUrl(/.*inventory-item/);
    await productDetailPage.goBack();

    await inventoryPage.waitForUrl(/.*inventory/);
    await expect(inventoryPage.productList).toBeVisible();
  });
});
