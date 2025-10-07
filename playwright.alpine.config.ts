import { defineConfig } from "@playwright/test"
import baseConfig, { getWebServer } from "./playwright.config"

process.env.FRAMEWORK = process.env.FRAMEWORK || "alpine"
const webServer = getWebServer()

export default defineConfig({
  ...baseConfig,
  webServer,
  use: {
    baseURL: webServer.url,
  },

  testMatch: ["**/accordion.e2e.ts"],
})
