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

  testMatch: [
    "**/accordion.e2e.ts",
    "**/avatar.e2e.ts",
    "**/bottom-sheet.e2e.ts",
    "**/carousel.e2e.ts",
    "**/checkbox.e2e.ts",
    "**/clipboard.e2e.ts",
    "**/combobox.e2e.ts",
    "**/dialog.e2e.ts",
    "**/popover.e2e.ts",
  ],
})
