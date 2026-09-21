import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Retry on CI only */
  retries: 1,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html'],['list'],['allure-playwright']],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    trace: "retain-on-failure"
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'api-testing',
      testMatch: 'crudFramework*',
      dependencies: ['smoke-tests', 'negative-tests']
     },
     {
      name: 'smoke-tests',
      testMatch: 'smoke*'
     },
     {
      name: 'negative-tests',
      testMatch: 'negative*'
     }
  ],


});
