import { test, expect } from '@fixtures/pages';
import { Users } from '@data/users';

test.describe('Login', () => {
  // these tests hit the login form directly so we clear any saved session
  test.use({ storageState: { cookies: [], origins: [] } });

  test('should display login page elements correctly', async ({ loginPage }) => {
    await loginPage.navigate();

    expect(await loginPage.getTitle()).toMatch(/Swag Labs/);
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('should log in successfully with standard_user', async ({ loginPage, inventoryPage }) => {
    await loginPage.navigate();
    await loginPage.login(Users.standard.username, Users.standard.password);

    await inventoryPage.waitForUrl(/.*inventory/);
    await expect(inventoryPage.pageTitle).toHaveText('Products');
    await expect(inventoryPage.productList).toBeVisible();
  });

  test('should show error for locked_out_user', async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.login(Users.lockedOut.username, Users.lockedOut.password);

    await expect(loginPage.errorMessage).toBeVisible();
    expect(await loginPage.getErrorMessage()).toContain('locked out');
  });

  test('should show error for invalid credentials', async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.login('invalid_user', 'wrong_password');

    await expect(loginPage.errorMessage).toBeVisible();
    expect(await loginPage.getErrorMessage()).toContain('Username and password do not match');
  });

  test('should dismiss the error banner when X is clicked', async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.login('bad_user', 'bad_pass');

    await expect(loginPage.errorMessage).toBeVisible();
    await loginPage.dismissError();
    await expect(loginPage.errorMessage).not.toBeVisible();
  });

  test('should show error when username is empty', async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.login('', Users.standard.password);

    await expect(loginPage.errorMessage).toBeVisible();
    expect(await loginPage.getErrorMessage()).toContain('Username is required');
  });

  test('should show error when password is empty', async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.login(Users.standard.username, '');

    await expect(loginPage.errorMessage).toBeVisible();
    expect(await loginPage.getErrorMessage()).toContain('Password is required');
  });
});
