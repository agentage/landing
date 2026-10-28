import { defineConfig } from '@playwright/test';
import { AUTH_STATE_PATH } from './auth-state.js';

// Post-deploy checks against the LIVE site (needs the AS, unlike the hermetic suites in ../).
export default defineConfig({
  testDir: '.',
  globalSetup: './global-setup.ts',
  globalTeardown: './global-teardown.ts',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.LANDING_BASE_URL ?? 'https://agentage.io',
    headless: true,
    trace: 'on-first-retry',
    storageState: AUTH_STATE_PATH,
    extraHTTPHeaders: { 'x-client-type': 'test' },
  },
});
