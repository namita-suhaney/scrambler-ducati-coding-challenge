import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
  paths: ['tests/features/*.feature'],
  require: ['tests/steps/*.ts'],
});

export default defineConfig({
  testDir,
  // Kept the time out to 80 seconds for the umage to load completely
  timeout: 80000,
  expect: {timeout: 100000},
  /* Run tests in files in parallel */
  fullyParallel: false,
  reporter: 'html',
  use: {
    baseURL: 'https://hacktheicon.scramblerducati.com',
  },
  projects: [
    {
      name: 'chromium',
      use: {
         ...devices['Desktop Chrome'],
         bypassCSP: true, // add this to disable cors
         launchOptions: {
           args: ['--disable-web-security'], // add this to disable cors
         },
    },
  },
  ],
});
