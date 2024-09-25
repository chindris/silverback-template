import { defineConfig, devices } from '@playwright/test';

import defaults from './playwright.config.default';

export default defineConfig({
  ...defaults,
  testDir: './specs/drupal',
  webServer: [
    {
      command: 'pnpm run --filter "@custom/cms" start',
      port: 8888,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'pnpm run --filter "@custom/website" serve',
      port: 8000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'pnpm run --filter "@custom/preview" start',
      port: 8001,
      reuseExistingServer: !process.env.CI,
    },
  ],
  projects: [
    {
      name: 'setup',
      testMatch: /drupal\/setup\.ts/,
    },
    {
      name: 'chromium',
      testMatch: /\.*.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
  ],
});
