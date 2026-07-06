/**
 * Landing - SEO / social / PWA (@p0). Canonical + OG/Twitter unfurl, icons +
 * manifest, the Google Limited-Use disclosure, host-aware robots, and a valid
 * sitemap. Ported from the deployed-site gate, adapted to the local build
 * (host = the target under test; robots is noindex unless pointed at prod).
 */
import { test, expect } from '@playwright/test';
import { body, pick, targetHost, isProdTarget } from './support';

test.describe('Landing - SEO/PWA', { tag: '@p0' }, () => {
  test('home canonical + og:url point at the target host', async ({ request }) => {
    const html = await body(request, '/');
    const canon = pick(html, /<link rel="canonical" href="([^"]+)"/i);
    const ogUrl = pick(html, /<meta property="og:url" content="([^"]+)"/i);
    expect(canon, 'canonical present').toBeTruthy();
    expect(ogUrl, 'og:url present').toBeTruthy();
    expect(new URL(canon!).host).toBe(targetHost());
    expect(new URL(ogUrl!).host).toBe(targetHost());
  });

  test('/docs is self-canonical', async ({ request }) => {
    const canon = pick(await body(request, '/docs'), /<link rel="canonical" href="([^"]+)"/i);
    expect(canon, 'docs canonical present').toBeTruthy();
    expect(new URL(canon!).pathname).toBe('/docs');
  });

  test('title + meta description are present', async ({ request }) => {
    const html = await body(request, '/');
    expect(pick(html, /<title>([^<]+)<\/title>/i)?.trim().length ?? 0).toBeGreaterThan(10);
    expect(
      pick(html, /<meta name="description" content="([^"]+)"/i)?.trim().length ?? 0
    ).toBeGreaterThan(20);
  });

  test('Twitter card + @agentage handle', async ({ request }) => {
    const html = await body(request, '/');
    expect(pick(html, /<meta name="twitter:card" content="([^"]+)"/i)).toBe('summary_large_image');
    expect(pick(html, /<meta name="twitter:site" content="([^"]+)"/i)).toBe('@agentage');
  });

  test('OG + Twitter images serve as PNG', async ({ request }) => {
    for (const path of ['/opengraph-image', '/twitter-image']) {
      const res = await request.get(path);
      expect(res.status(), path).toBe(200);
      expect(res.headers()['content-type'], path).toContain('image/png');
    }
  });

  test('OG tags present and 1200x630', async ({ request }) => {
    const html = await body(request, '/');
    expect(pick(html, /<meta property="og:title" content="([^"]+)"/i)).toBeTruthy();
    expect(pick(html, /<meta property="og:description" content="([^"]+)"/i)).toBeTruthy();
    expect(pick(html, /<meta property="og:image" content="([^"]+)"/i)).toBeTruthy();
    expect(pick(html, /<meta property="og:image:width" content="([^"]+)"/i)).toBe('1200');
    expect(pick(html, /<meta property="og:image:height" content="([^"]+)"/i)).toBe('630');
  });

  test('every referenced icon + the PWA assets serve 200', async ({ request }) => {
    const html = await body(request, '/');
    const refs = [
      ...html.matchAll(
        /<link rel="(?:[^"]*icon[^"]*|apple-touch-icon|manifest)"[^>]*href="([^"]+)"/gi
      ),
    ].map((m) => m[1]);
    expect(refs.length, 'icon/manifest refs in <head>').toBeGreaterThan(2);
    for (const href of new Set([...refs, '/icon-192.png', '/icon-512.png', '/logo.png'])) {
      expect((await request.get(href!)).status(), href!).toBe(200);
    }
  });

  test('web manifest is valid + branded', async ({ request }) => {
    const res = await request.get('/manifest.webmanifest');
    expect(res.status()).toBe(200);
    const m = JSON.parse(await res.text());
    expect(m.name).toContain('Agentage');
    expect(m.theme_color).toBe('#f3a52b');
    const sizes = (m.icons ?? []).map((i: { sizes: string }) => i.sizes);
    expect(sizes).toEqual(expect.arrayContaining(['192x192', '512x512']));
  });

  test('vaults JSON Schema serves as JSON (fixes live 404)', async ({ request }) => {
    const res = await request.get('/schemas/vaults.schema.json');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('application/json');
    const schema = JSON.parse(await res.text());
    expect(schema.$schema).toBe('https://json-schema.org/draft/2020-12/schema');
    expect(schema.required).toContain('version');
  });

  test('/privacy carries the Google Limited-Use disclosure', async ({ request }) => {
    const html = await body(request, '/privacy');
    expect(html).toContain('Limited Use');
    expect(html).toContain('Google API Services User Data Policy');
  });

  test('homepage + privacy expose a contact', async ({ page, request }) => {
    await page.goto('/');
    await expect(page.locator('footer a[href="/contacts"]').first()).toBeVisible();
    expect(await body(request, '/contacts')).toContain('mailto:');
    expect(await body(request, '/privacy')).toContain('mailto:');
  });

  test('robots: a non-prod target is noindex', async ({ request }) => {
    test.skip(isProdTarget(), 'prod indexability is verified against the deployed site');
    expect(await body(request, '/robots.txt'), 'non-prod must be noindex').toMatch(
      /Disallow:\s*\//i
    );
  });

  test('sitemap is valid XML covering the core routes', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('xml');
    const xml = await res.text();
    expect(xml).toContain('<urlset');
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    expect(locs.length, 'sitemap has <loc> entries').toBeGreaterThan(3);
    for (const loc of locs)
      expect(new URL(loc).host, `sitemap <loc> host: ${loc}`).toBe(targetHost());
    const paths = locs.map((l) => new URL(l).pathname);
    for (const p of ['/', '/docs', '/blog', '/blog/agentage-memory-is-open']) {
      expect(paths, `sitemap lists ${p}`).toContain(p);
    }
  });
});
