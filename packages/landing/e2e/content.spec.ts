/**
 * Landing - content + a11y + blog (@full). Section inventory, docs guidance,
 * blog unfurl + richness, 404s, accessibility basics, JSON-LD, unsubscribe,
 * legal canonicals. Ported from the deployed-site full suite; deployment-only
 * checks (GA-on-prod, www→apex redirect, sentinel audit) are intentionally
 * omitted - they belong to the deployed-site gate, not the local build.
 */
import { test, expect } from '@playwright/test';
import { body, pick } from './support';

test.describe('Landing - content/a11y', { tag: '@full' }, () => {
  test('home sections render', async ({ request }) => {
    const html = await body(request, '/');
    for (const marker of [
      'Right now, you are the memory layer',
      'Shared everywhere',
      'Not a closed database',
    ]) {
      expect(html, marker).toContain(marker);
    }
  });

  test('docs shows connector guidance', async ({ request }) => {
    const html = await body(request, '/docs/mcp-server');
    for (const token of ['memory.agentage.io', 'ChatGPT', 'Cursor']) {
      expect(html, token).toContain(token);
    }
  });

  test('blog announcement is reachable and unfurls', async ({ page, request }) => {
    await page.goto('/blog');
    await expect(page.locator('a[href="/blog/agentage-memory-is-open"]').first()).toBeVisible();
    const html = await body(request, '/blog/agentage-memory-is-open');
    expect(
      pick(html, /<meta property="og:image" content="([^"]+)"/i),
      'post og:image'
    ).toBeTruthy();
    expect(pick(html, /<meta property="og:type" content="([^"]+)"/i)).toBe('article');
    expect(html, 'post JSON-LD').toContain('application/ld+json');
    await page.goto('/blog/agentage-memory-is-open');
    await expect(page.locator('h1').first()).toContainText('Agentage Memory is open');
  });

  test('blog post is rich (author, reading time, back link)', async ({ page }) => {
    await page.goto('/blog/agentage-memory-is-open');
    await expect(page.getByText('Volodymyr Vreshch').first()).toBeVisible();
    await expect(page.getByText(/\d+ min read/).first()).toBeVisible();
    await expect(page.locator('a[href="/blog"]').first()).toBeVisible();
  });

  test('unknown blog slug → 404', async ({ request }) => {
    expect((await request.get('/blog/zzz-does-not-exist')).status()).toBe(404);
  });

  test('unknown route → custom 404 with back-to-home', async ({ page }) => {
    const res = await page.goto('/zzz-does-not-exist');
    expect(res?.status()).toBe(404);
    await expect(page.getByText(/back to home/i).first()).toBeVisible();
  });

  test('a11y basics (single h1, labelled email, safe external links)', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('input[type="email"][name="email"]').first()).toHaveAttribute(
      'autocomplete',
      'email'
    );
    const gh = page.locator('header a[href*="github.com"]').first();
    await expect(gh).toHaveAttribute('target', '_blank');
    await expect(gh).toHaveAttribute('rel', /noopener/);
  });

  test('no horizontal overflow at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const overflow = (await page.evaluate(
      'document.documentElement.scrollWidth - document.documentElement.clientWidth'
    )) as number;
    expect(overflow, 'no horizontal scroll at 375px').toBeLessThanOrEqual(2);
  });

  test('JSON-LD graph parses with the core types', async ({ request }) => {
    const block = (await body(request, '/')).match(
      /<script type="application\/ld\+json">(.*?)<\/script>/s
    )?.[1];
    expect(block, 'ld+json present').toBeTruthy();
    const json = JSON.stringify(JSON.parse(block!));
    for (const type of ['Organization', 'WebSite', 'SoftwareApplication']) {
      expect(json, type).toContain(type);
    }
  });

  test('unsubscribe page renders', async ({ request }) => {
    expect((await request.get('/unsubscribe')).status()).toBe(200);
  });

  test('legal pages are self-canonical with a title', async ({ request }) => {
    for (const path of ['/privacy', '/terms']) {
      const html = await body(request, path);
      const canon = pick(html, /<link rel="canonical" href="([^"]+)"/i);
      expect(canon, `${path} canonical`).toBeTruthy();
      expect(new URL(canon!).pathname, `${path} canonical path`).toBe(path);
      expect(pick(html, /<title>([^<]+)<\/title>/i)?.length ?? 0, `${path} title`).toBeGreaterThan(
        5
      );
    }
  });
});
