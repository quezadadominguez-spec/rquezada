// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: 'html',

  // ⏳ Tiempo máximo por TEST (ej: 2 minutos)
  timeout: 120000,

  // ⏳ Tiempo máximo para expect()
  expect: {
    timeout: 30000,
  },

  use: {
    // ⏳ Tiempo máximo por ACCIÓN (click, fill, etc.)
    actionTimeout: 60000,

    // ⏳ Tiempo máximo para navegación
    navigationTimeout: 60000,

    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});