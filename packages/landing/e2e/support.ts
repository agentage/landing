import type { APIRequestContext } from '@playwright/test';

export const TIMEOUTS = {
  element: 5_000,
  api: 10_000,
  navigation: 15_000,
} as const;

// Host of the target under test (the local build by default). Host-aware
// assertions (canonical, og:url, sitemap <loc>, robots) branch on it. Override
// with LANDING_EXPECTED_HOST when the server renders a different public origin
// than where it's reached - e.g. the prod image in CI, hit on localhost but
// serving SITE_FQDN=agentage.io.
export const targetHost = (): string =>
  process.env.LANDING_EXPECTED_HOST ??
  new URL(process.env.LANDING_BASE_URL ?? 'http://localhost:3000').host;

// True only when pointed at the production apex (not localhost / a dev. host).
export const isProdTarget = (): boolean => !/^(localhost|127\.0\.0\.1|dev\.)/.test(targetHost());

// Docs base the target renders into canonical/sitemap URLs: their own host once a
// real FQDN is configured, the site's /docs path locally. Mirrors links().docs.
export const docsBase = (): string =>
  isProdTarget() ? `https://docs.${targetHost()}` : `http://${targetHost()}/docs`;

// URL of a doc page under docsBase ('' is the index).
export const docsUrl = (slug: string): string =>
  slug === '' ? docsBase() : `${docsBase()}/${slug}`;

// Host requests actually land on - distinct from targetHost(), which is what the
// server renders (the deploy gate curls the prod image on localhost).
const requestHost = (): string =>
  new URL(process.env.LANDING_BASE_URL ?? 'http://localhost:3000').host;

// docs.<apex> serves the docs tree at its root; every other host keeps the /docs prefix.
export const isDocsHostTarget = (): boolean => requestHost().startsWith('docs.');

// Request path of a doc page on the target host ('' is the docs index).
export const docPath = (slug: string): string => {
  const root = isDocsHostTarget() ? '' : '/docs';
  return slug === '' ? root || '/' : `${root}/${slug}`;
};

// Request path of a doc page's markdown mirror - the index mirror is /docs.md on every host.
export const docMdPath = (slug: string): string =>
  slug === '' ? '/docs.md' : `${docPath(slug)}.md`;

// Raw response body for a path (uses the config baseURL).
export const body = async (request: APIRequestContext, path: string): Promise<string> =>
  (await request.get(path)).text();

// First capture group of `re` in `html`, or null.
export const pick = (html: string, re: RegExp): string | null => html.match(re)?.[1] ?? null;
