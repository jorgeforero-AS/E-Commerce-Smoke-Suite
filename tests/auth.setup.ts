import { test as setup, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { LoginPage } from '@pages/LoginPage';
import { InventoryPage } from '@pages/InventoryPage';

dotenv.config();

// logs in once and saves the session - the three browser projects reuse this file
// so we dont have to repeat the login in every single test

const AUTH_DIR = path.resolve('auth');
const STORAGE_STATE = path.join(AUTH_DIR, 'storageState.json');

setup('authenticate as standard user', async ({ page }) => {
  if (!fs.existsSync(AUTH_DIR)) {
    fs.mkdirSync(AUTH_DIR, { recursive: true });
  }

  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  const username = process.env.STANDARD_USER ?? 'standard_user';
  const password = process.env.PASSWORD ?? 'secret_sauce';

  await loginPage.navigate();
  await loginPage.login(username, password);

  await inventoryPage.waitForUrl(/.*inventory/);
  await expect(inventoryPage.productList).toBeVisible();

  await page.context().storageState({ path: STORAGE_STATE });
});
