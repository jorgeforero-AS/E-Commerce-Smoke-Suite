# E-Commerce Smoke Suite - Playwright + TypeScript

Assignment: Demonstrate Playwright's superior speed vs. traditional tools by building a fully parallel, cross-browser smoke suite for [SauceDemo](https://www.saucedemo.com).

---

## Features

| Feature       | Details                                                       |
| ------------- | ------------------------------------------------------------- |
| Architecture  | POM + Page Fixtures pattern with TypeScript strict mode       |
| Path Aliases  | `@pages/*`, `@fixtures/*`, `@data/*`, `@utils/*`              |
| Auth State    | `storageState` shared across all tests - no re-login per spec |
| Cross-browser | Chromium, Firefox and WebKit run in parallel                  |
| Tracing       | Trace Viewer activated on the first retry of every failure    |
| Reporting     | HTML Report + JSON + List (CLI)                               |
| Code Quality  | Prettier + ESLint (TypeScript + flat config)                  |
| CI/CD         | GitHub Actions workflow included                              |

---

## Project Structure

```
e-comerce-project/
├── .github/
│   └── workflows/
│       └── playwright.yml
├── src/
│   ├── data/
│   │   ├── checkout.ts
│   │   └── users.ts
│   ├── fixtures/
│   │   └── pages.ts          # page fixtures (tests receive page objects via destructuring)
│   ├── pages/
│   │   ├── BasePage.ts
│   │   ├── LoginPage.ts
│   │   ├── InventoryPage.ts
│   │   ├── CartPage.ts
│   │   ├── CheckoutPage.ts
│   │   ├── OrderConfirmationPage.ts
│   │   ├── ProductDetailPage.ts
│   │   └── index.ts
│   ├── setup/
│   │   └── global-setup.ts
│   └── utils/
│       └── env.ts
├── tests/
│   ├── auth.setup.ts
│   ├── login.spec.ts
│   ├── cart.spec.ts
│   ├── checkout.spec.ts
│   ├── product.spec.ts
│   └── failure.spec.ts
├── .env.example              # copy to .env locally (.env is gitignored)
├── playwright.config.ts
├── tsconfig.json
├── .prettierrc
└── eslint.config.js
```

---

## Quick Start

### Prerequisites

- Node.js >= 18
- npm >= 9

### 1 - Clone & install

```bash
git clone <your-repo-url>
cd e-comerce-project
npm install
npx playwright install --with-deps
```

### 2 - Configure environment

```bash
cp .env.example .env
# default values already work for SauceDemo, no edits needed
```

### 3 - Run the full suite (all browsers in parallel)

```bash
npm test
```

### 4 - Run specific suites

```bash
npm run test:smoke        # login + cart + checkout + product
npm run test:login
npm run test:cart
npm run test:checkout
npm run test:failure      # generates trace.zip
```

### 5 - Single browser

```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

### 6 - View the HTML report

```bash
npm run report
```

---

## Trace Viewer Demo

The `failure.spec.ts` file contains intentionally failing tests to demonstrate the Trace Viewer:

```bash
npm run test:failure

npx playwright show-trace test-results/<folder>/trace.zip
```

The trace captures every network request, DOM snapshot, console log and screenshot so you can step through the test like a video.

---

## Architecture

### Page Object Model (POM)

Each page maps to a dedicated class that encapsulates locators, actions and queries.

```
BasePage (abstract)
  ├── LoginPage
  ├── InventoryPage
  ├── CartPage
  ├── CheckoutPage
  ├── OrderConfirmationPage
  └── ProductDetailPage
```

Tests never instantiate page objects directly. Instead, `src/fixtures/pages.ts` extends the Playwright `test` object so specs receive them via destructuring:

```typescript
test('example', async ({ inventoryPage, cartPage }) => { ... });
```

### storageState - Shared Auth

The `tests/auth.setup.ts` runs once as the `setup` project before all browser projects. It logs in as `standard_user` and saves `auth/storageState.json`, so tests start already authenticated saving roughly 1 second per test.

### Parallel Execution

`fullyParallel: true` in `playwright.config.ts` means every individual test runs in its own worker. Combined with three browser projects, the suite gets maximum throughput.

---

## Code Quality

```bash
npm run format          # format all files with Prettier
npm run format:check    # CI-friendly format check
npm run lint            # ESLint
npm run lint:fix        # auto-fix lint issues
npm run typecheck       # TypeScript strict type check
```

---

## CI/CD (GitHub Actions)

The workflow at `.github/workflows/playwright.yml`:

1. Installs dependencies and browsers (`npm ci` uses `.npmrc` → public registry only)
2. Runs type check, lint, and format check
3. Executes the smoke suite
4. Runs the failure spec to capture traces
5. Uploads the HTML report and test-results/ as artefacts

**Environment variables in CI:** `.env` is gitignored. The workflow injects vars from
GitHub Secrets with SauceDemo public defaults as fallback — no secrets configuration needed for this project.

---

## Deliverables

- Source code in this repository
- `trace.zip` generated automatically in `test-results/` after running `npm run test:failure`

---

## Test Users

| Username                  | Notes                                 |
| ------------------------- | ------------------------------------- |
| `standard_user`           | Used for all smoke tests              |
| `locked_out_user`         | Login blocked - tested in login suite |
| `problem_user`            | Broken images / interactions          |
| `performance_glitch_user` | Slow responses                        |
| `error_user`              | Cart errors                           |
| `visual_user`             | Visual defects                        |

Password for all users: `secret_sauce`
