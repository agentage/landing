import { defineConfig } from '@playwright/test';

// Estate test-traffic contract: the edge classifier keys on this exact header to keep e2e out of real-user metrics.
const CLIENT_TYPE_HEADER = 'x-client-type';
import { fileURLToPath } from 'node:url';

// Run from the repo root so the webServer can build the libs + start the site.
const root = fileURLToPath(new URL('../../..', import.meta.url));
const PORT = 3000;
const baseURL = process.env.LANDING_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: '.',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    headless: true,
    trace: 'on-first-retry',
    extraHTTPHeaders: { [CLIENT_TYPE_HEADER]: 'test' },
  },
  // Auto-start the site unless LANDING_BASE_URL targets an already-running one.
  webServer: process.env.LANDING_BASE_URL
    ? undefined
    : {
        command: 'npm run dev:landing',
        cwd: root,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
