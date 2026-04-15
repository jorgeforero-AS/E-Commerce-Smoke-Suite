import { test, expect } from '@fixtures/pages';

// these tests are intentionally broken - they exist purely to generate a trace.zip
// so you can open it in the Trace Viewer and see what the debugging experience looks like
//
// run with: npx playwright test tests/failure.spec.ts --trace on
// then:     npx playwright show-trace test-results/<folder>/trace.zip

test.describe('Intentional Failure - Trace Viewer Demo', () => {
  test('INTENTIONAL FAILURE - wrong product count assertion', async ({ inventoryPage }) => {
    await inventoryPage.navigate();

    const productNames = await inventoryPage.getProductNames();

    // saucedemo always has 6 products, asserting 99 guarantees a failure
    expect(
      productNames.length,
      `Expected 99 products but found ${productNames.length}. This is intentional.`,
    ).toBe(99);
  });

  test('INTENTIONAL FAILURE - non-existent element assertion', async ({ inventoryPage }) => {
    await inventoryPage.navigate();

    // this element doesnt exist, will timeout and fail
    await expect(
      inventoryPage.demoNonExistentElement,
      'intentional failure to demo the trace viewer',
    ).toBeVisible({ timeout: 3000 });
  });
});
