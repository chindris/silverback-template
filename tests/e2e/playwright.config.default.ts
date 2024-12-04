import { ChromaticConfig } from '@chromatic-com/playwright';
import { defineConfig } from '@playwright/test';

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
});
