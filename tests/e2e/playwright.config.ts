import { ChromaticConfig } from '@chromatic-com/playwright';
import { defineConfig, devices } from '@playwright/test';

export default defineConfig<ChromaticConfig>({
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    trace: process.env.CI ? 'retain-on-failure' : 'on',
    actionTimeout: 10_000,
    ignoreSelectors: [
      // Ignore the following selectors in the visual regression tests
      // these contain dynamic content that changes on every page load
      'div#edit-meta-changed',
      'article.profile > .form-item',
    ],
  },
  testDir: './specs',
  webServer: [
    {
      command: 'pnpm run --filter "@custom/cms" start >> /tmp/cms.log 2>&1',
      port: 8888,
      reuseExistingServer: !process.env.CI,
    },
    {
      command:
        'pnpm run --filter "@custom/website" serve >> /tmp/website.log 2>&1',
      port: 8000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command:
        'pnpm run --filter "@custom/preview" start >> /tmp/preview.log 2>&1',
      port: 8001,
      reuseExistingServer: !process.env.CI,
    },
  ],
  projects: [
    {
      name: 'setup',
      testMatch: /setup\.ts/,
    },
    {
      name: 'chromium',
      testMatch: /\.*.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
  ],
});
