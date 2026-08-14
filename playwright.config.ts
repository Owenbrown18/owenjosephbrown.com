import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  // The background canvas now runs on every page, so each parallel worker
  // holds a WebGL context alongside image decoding. Image-heavy case
  // studies can exceed the 30s default under that contention while being
  // fine in isolation; a real hang still fails.
  timeout: 45_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    {
      name: "mobile",
      use: { ...devices["iPhone 13"] },
      testMatch: /smoke\.spec\.ts/,
    },
  ],
  webServer: {
    command: "npm run start",
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
