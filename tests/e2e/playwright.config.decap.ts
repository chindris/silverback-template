import { defineConfig, devices } from '@playwright/test';

import defaults from './playwright.config.default';

export default defineConfig({
  ...defaults,
  testDir: './specs/decap',
  webServer: [
    {
      command: 'pnpm run --filter "@custom/website" serve',
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
