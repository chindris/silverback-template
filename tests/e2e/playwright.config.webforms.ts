import { defineConfig, devices } from '@playwright/test';

import defaults from './playwright.config.default';

export default defineConfig({
  ...defaults,
  testDir: './webform-snapshots',
  webServer: [
    {
      command: 'pnpm run --filter "@custom/cms" start >> /tmp/cms.log 2>&1',
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
