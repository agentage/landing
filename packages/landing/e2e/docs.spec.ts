/**
 * Landing - docs section (@full). Availability + titles for every registered
 * page, sidebar nav completeness and default collapse state, in-page
 * navigation, retired slugs 404, and the markdown mirrors. The page list comes
 * from the registry, so a new doc page is covered the moment it is registered.
 */
import { test, expect } from '@playwright/test';
import { docMdPath, docPath, pick } from './support';
import { docPages, getDoc } from '../src/docs/registry';
import { docsNav } from '../src/docs/nav';

// React escapes text children, so registry titles must be escaped before they
// are matched against raw HTML.
const escapeHtml = (s: string): string =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');

// Same rule as docs/seo.ts: the index is titled "Docs", every other page by name.
const expectedTitle = (slug: string, title: string): string => (slug === '' ? 'Docs' : title);

const DOCS_NAV_SELECTOR = 'nav[aria-label="Docs"]';

test.describe('Landing - docs', { tag: '@full' }, () => {
  test('every registered doc page serves 200 with its title', async ({ request }) => {
    const pages = docPages();
    expect(pages.length, 'registry has pages').toBeGreaterThan(5);

    for (const doc of pages) {
      const path = docPath(doc.slug);
      const res = await request.get(path);
      expect(res.status(), `${path} status`).toBe(200);

      const html = await res.text();
      expect(pick(html, /<h1[^>]*>([^<]*)<\/h1>/i), `${path} h1`).toBe(escapeHtml(doc.title));
      expect(pick(html, /<title>([^<]*)<\/title>/i) ?? '', `${path} <title>`).toContain(
        escapeHtml(expectedTitle(doc.slug, doc.title))
      );
    }
  });

  test('sidebar lists every group, with stubs inert and secondary areas collapsed', async ({
    page,
  }) => {
    await page.goto(docPath(''));
    const nav = page.locator(DOCS_NAV_SELECTOR);

    for (const group of docsNav) {
      await expect(
        nav.getByRole('button', { name: group.title, exact: true }),
        `group ${group.title}`
      ).toBeVisible();
    }

    // The active route's group is pinned open; secondary areas start shut.
    await expect(nav.getByRole('button', { name: 'Get started', exact: true })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
    await expect(nav.getByRole('button', { name: 'Tools', exact: true })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
    await expect(nav.getByRole('button', { name: /Connect a client/ })).toHaveAttribute(
      'aria-expanded',
      'false'
    );

    // SOON stubs render as inert text, never as links.
    for (const label of ['Catalog MCP', 'Catalog API']) {
      await expect(nav.getByText(label, { exact: true }), `${label} stub`).toBeVisible();
      await expect(nav.locator('a', { hasText: label }), `${label} is not a link`).toHaveCount(0);
    }
  });

  test('an active nested route opens its parent', async ({ page }) => {
    await page.goto(docPath('claude-code'));
    const nav = page.locator(DOCS_NAV_SELECTOR);
    await expect(nav.getByRole('button', { name: /Connect a client/ })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
    await expect(nav.locator('a[href="/docs/claude-code"]')).toHaveAttribute(
      'aria-current',
      'page'
    );
  });

  test('a sidebar link navigates and the page carries prev/next', async ({ page }) => {
    const target = getDoc('mcp-server');
    expect(target, 'mcp-server is registered').toBeTruthy();

    await page.goto(docPath(''));
    await page.locator(`${DOCS_NAV_SELECTOR} a[href="/docs/mcp-server"]`).click();
    await expect(page.locator('h1')).toHaveText(target!.title);

    const pager = page.locator('nav[aria-label="Docs pages"]');
    await expect(pager.locator('a')).toHaveCount(2);
  });

  test('unregistered doc slugs 404', async ({ request }) => {
    for (const slug of ['cli', 'local-api', 'zzz-not-a-doc']) {
      const path = docPath(slug);
      expect((await request.get(path)).status(), path).toBe(404);
    }
  });

  test('markdown mirrors serve as text/markdown', async ({ request }) => {
    for (const slug of ['', 'rest-api']) {
      const path = docMdPath(slug);
      const res = await request.get(path);
      expect(res.status(), `${path} status`).toBe(200);
      expect(res.headers()['content-type'], `${path} content-type`).toContain('text/markdown');
      expect((await res.text()).length, `${path} body`).toBeGreaterThan(200);
    }
  });
});
