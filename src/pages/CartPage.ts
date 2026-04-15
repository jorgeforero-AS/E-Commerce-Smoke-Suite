import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = this.page.locator('.title');
    this.cartItems = this.page.locator('.cart_item');
    this.checkoutButton = this.page.locator('[data-test="checkout"]');
    this.continueShoppingButton = this.page.locator('[data-test="continue-shopping"]');
  }

  async navigate(): Promise<void> {
    await this.goto('/cart.html');
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async removeItem(productName: string): Promise<void> {
    const id = productName.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '');
    await this.page.locator(`[data-test="remove-${id}"]`).click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async getItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async getItemNames(): Promise<string[]> {
    return this.page.locator('.inventory_item_name').allTextContents();
  }

  async isEmpty(): Promise<boolean> {
    return (await this.cartItems.count()) === 0;
  }
}
