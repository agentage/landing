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

// Raw response body for a path (uses the config baseURL).
export const body = async (request: APIRequestContext, path: string): Promise<string> =>
  (await request.get(path)).text();

// First capture group of `re` in `html`, or null.
export const pick = (html: string, re: RegExp): string | null => html.match(re)?.[1] ?? null;
