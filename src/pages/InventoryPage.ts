import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  readonly pageTitle: Locator;
  readonly productList: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly sortDropdown: Locator;
  readonly burgerMenuButton: Locator;
  readonly logoutLink: Locator;
  // only used by failure.spec.ts to demonstrate Trace Viewer - intentionally broken locator
  readonly demoNonExistentElement: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('.title');
    this.productList = page.locator('.inventory_list');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.burgerMenuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.demoNonExistentElement = page.locator('[data-test="non-existent-element"]');
  }

  async navigate(): Promise<void> {
    await this.goto('/inventory.html');
  }

  // builds the data-test id from the product name, e.g. "Sauce Labs Backpack" -> "sauce-labs-backpack"
  async addProductToCart(productName: string): Promise<void> {
    const id = productName.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '');
    await this.page.locator(`[data-test="add-to-cart-${id}"]`).click();
  }

  async removeProductFromCart(productName: string): Promise<void> {
    const id = productName.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '');
    await this.page.locator(`[data-test="remove-${id}"]`).click();
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async logout(): Promise<void> {
    await this.burgerMenuButton.click();
    await this.logoutLink.click();
  }

  async getCartCount(): Promise<number> {
    const visible = await this.cartBadge.isVisible();
    if (!visible) return 0;
    const text = await this.cartBadge.textContent();
    return parseInt(text ?? '0', 10);
  }

  async getProductNames(): Promise<string[]> {
    return this.page.locator('.inventory_item_name').allTextContents();
  }

  async getProductPrices(): Promise<number[]> {
    const texts = await this.page.locator('.inventory_item_price').allTextContents();
    return texts.map((t) => parseFloat(t.replace('$', '')));
  }

  // clicks the product name link to open the product detail page
  async viewProduct(productName: string): Promise<void> {
    await this.page.locator('.inventory_item_name').filter({ hasText: productName }).click();
  }
}
