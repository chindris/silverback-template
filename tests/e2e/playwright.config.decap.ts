import { defineConfig, devices } from '@playwright/test';

import defaults from './playwright.config.default';

export default defineConfig({
  ...defaults,
  testDir: './specs/decap',
  webServer: [
    {
      command:
        'pnpm run --filter "@custom/website" serve >> /tmp/website.log 2>&1',
      port: 8000,
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
