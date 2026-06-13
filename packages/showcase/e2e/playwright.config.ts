import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';

// Run from the repo root so the webServer can build the libs + start the playground.
const root = fileURLToPath(new URL('../../..', import.meta.url));
const PORT = 3011;
const baseURL = process.env.SHOWCASE_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: '.',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    headless: true,
    trace: 'on-first-retry',
  },
  // Auto-start the playground unless SHOWCASE_BASE_URL targets an already-running one.
  webServer: process.env.SHOWCASE_BASE_URL
    ? undefined
    : {
        command: 'npm run dev:showcase',
        cwd: root,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
