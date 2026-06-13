import { test, expect } from '@playwright/test';

// Showcase is a single Next.js page mounting the design-system playground
// (`<App />`). It is a client component, but Next server-renders the default
// ("Foundations") state into the initial HTML.

test.describe('Showcase - smoke', () => {
  test('home is server-rendered (default page in raw HTML)', async ({ request }) => {
    const res = await request.get('/');
    expect(res.status()).toBe(200);
    const html = await res.text();
    expect(html).toContain('Design System');
    expect(html).toContain('Foundations');
  });

  test('header renders the branded logo and section nav', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Home' })).toContainText('Age');
    const nav = page.locator('header nav');
    await expect(nav.getByRole('button', { name: 'Foundations', exact: true })).toBeVisible();
    await expect(nav.getByRole('button', { name: 'Forms', exact: true })).toBeVisible();
  });

  test('default page shows the Foundations heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Foundations');
  });

  test('nav swaps the active page', async ({ page }) => {
    await page.goto('/');
    await page.locator('header nav').getByRole('button', { name: 'Forms', exact: true }).click();
    await expect(page.locator('h1')).toContainText('Forms');
  });
});
