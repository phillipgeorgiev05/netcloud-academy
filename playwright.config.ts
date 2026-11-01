import { defineConfig, devices } from '@playwright/test';

const PORT = 4174;

export default defineConfig({
  testDir: 'e2e',
  testMatch: '*.e2e.ts', // eigene Endung, damit Vitest diese Dateien nicht aufsammelt
  timeout: 120_000,
  use: { baseURL: `http://localhost:${PORT}`, ...devices['Pixel 7'], viewport: { width: 375, height: 812 } },
  webServer: {
    command: `npm run dev -- --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
  },
});
