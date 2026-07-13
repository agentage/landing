import { test, expect } from '@playwright/test';

test.describe('Landing - SSR', { tag: '@smoke' }, () => {
  test('home is server-rendered (hero in raw HTML, no JS)', async ({ request }) => {
    const res = await request.get('/');
    expect(res.status()).toBe(200);
    const html = await res.text();
    // Hero copy + connect block must be present in the server response itself.
    expect(html).toContain('in every AI');
    expect(html).toContain('memory.agentage.io/mcp');
    expect(html).toContain('Claude Code');
  });
});

test.describe('Landing - Home', { tag: '@smoke' }, () => {
  test('hero renders', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Your memory,');
    await expect(page.locator('h1')).toContainText('in every AI');
    await expect(page.getByRole('link', { name: 'Connect your AI' }).first()).toBeVisible();
    await expect(page.getByText('https://memory.agentage.io/mcp').first()).toBeVisible();
  });

  test('connect block + newsletter are present', async ({ page }) => {
    await page.goto('/');
    // Setup-first: the tabbed connect block is the primary action; the email path is
    // the demoted "Get news" newsletter.
    await expect(page.getByRole('button', { name: 'Claude Code' })).toBeVisible();
    await expect(page.locator('input[type="email"][name="email"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]', { hasText: 'Get news' })).toBeVisible();
  });
});

test.describe('Landing - Header', { tag: '@smoke' }, () => {
  test('logo links to home', async ({ page }) => {
    await page.goto('/');
    const logo = page.locator('header a').first();
    await expect(logo).toContainText('Age');
    await expect(logo).toHaveAttribute('href', '/');
  });

  test('desktop nav links are visible', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    const nav = page.locator('header nav').first();
    await expect(nav.locator('a', { hasText: 'Home' })).toBeVisible();
    await expect(nav.locator('a', { hasText: 'Docs' })).toBeVisible();
    await expect(nav.locator('a', { hasText: 'Dashboard' })).toBeVisible();
    await expect(nav.locator('a', { hasText: 'GitHub' })).toBeVisible();
  });

  test('GitHub link opens in a new tab', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    const gh = page.locator('header nav a', { hasText: 'GitHub' }).first();
    await expect(gh).toHaveAttribute('target', '_blank');
    await expect(gh).toHaveAttribute('rel', /noopener/);
  });

  test('mobile hamburger opens the menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    const toggle = page.locator('button[aria-label="Toggle menu"]');
    await expect(toggle).toBeVisible();
    await toggle.click();
    await expect(page.locator('nav').nth(1).locator('a', { hasText: 'Docs' })).toBeVisible();
  });
});

test.describe('Landing - Footer', { tag: '@smoke' }, () => {
  test('footer shows the tagline copyright', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer).toContainText('Agentage');
    await expect(footer).toContainText('One memory. Every AI. Owned by you.');
  });

  test('footer Docs link uses a relative path', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('footer a', { hasText: 'Docs' })).toHaveAttribute('href', '/docs');
  });
});

test.describe('Landing - Routes', { tag: '@smoke' }, () => {
  test('/docs renders', async ({ page }) => {
    await page.goto('/docs');
    await expect(page.locator('h1')).toContainText('Agentage Memory');
  });

  test('/mcp redirects to the catalog host', async ({ request }) => {
    const res = await request.get('/mcp', { maxRedirects: 0 });
    expect(res.status()).toBe(308);
    expect(res.headers()['location']).toBe('https://catalog.agentage.io/mcp');
  });

  test('/mcp deep links carry the path through', async ({ request }) => {
    const res = await request.get('/mcp/io-agentage-mcp-catalog', { maxRedirects: 0 });
    expect(res.status()).toBe(308);
    expect(res.headers()['location']).toBe(
      'https://catalog.agentage.io/mcp/io-agentage-mcp-catalog'
    );
  });
});
