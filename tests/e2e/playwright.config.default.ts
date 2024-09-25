import { defineConfig } from '@playwright/test';

export default defineConfig({
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    trace: process.env.CI ? 'retain-on-failure' : 'on',
    actionTimeout: 10_000,
  },
});
