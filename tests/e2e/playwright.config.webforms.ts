import { defineConfig, devices } from '@playwright/test';

import defaults from './playwright.config';

export default defineConfig({
  ...defaults,
  testDir: './webform-snapshots',
  webServer: [
    {
      command: 'pnpm run --filter "@custom/cms" start',
      port: 8888,
      reuseExistingServer: !process.env.CI,
    },
  ],
  projects: [
    {
      name: 'chromium',
      testMatch: /\.*.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
