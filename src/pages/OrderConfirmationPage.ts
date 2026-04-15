import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class OrderConfirmationPage extends BasePage {
  readonly confirmationHeader: Locator;
  readonly confirmationText: Locator;
  readonly backHomeButton: Locator;
  readonly ponyExpressImage: Locator;

  constructor(page: Page) {
    super(page);
    this.confirmationHeader = page.locator('[data-test="complete-header"]');
    this.confirmationText = page.locator('[data-test="complete-text"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
    this.ponyExpressImage = page.locator('.pony_express');
  }

  async backToProducts(): Promise<void> {
    await this.backHomeButton.click();
  }

  async getHeaderText(): Promise<string | null> {
    return this.confirmationHeader.textContent();
  }

  async getConfirmationText(): Promise<string | null> {
    return this.confirmationText.textContent();
  }

  async isOrderConfirmed(): Promise<boolean> {
    return this.confirmationHeader.isVisible();
  }
}
