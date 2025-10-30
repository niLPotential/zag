import { defineConfig, type PlaywrightTestConfig } from "@playwright/test"

const CI = !!process.env.CI

type InferServer<T> = Exclude<T extends Array<infer U> ? U : T, undefined>

type WebServer = InferServer<PlaywrightTestConfig["webServer"]>

export function getWebServer(): WebServer {
  const framework = process.env.FRAMEWORK || "react"

  const frameworks: Record<string, WebServer> = {
    react: {
      cwd: "./examples/next-ts",
      command: "cross-env PORT=3000 pnpm dev",
      url: "http://localhost:3000",
      reuseExistingServer: !CI,
    },
    vue: {
      cwd: "./examples/vue-ts",
      command: "pnpm vite --port 3001",
      url: "http://localhost:3001",
      reuseExistingServer: !CI,
    },
    solid: {
      cwd: "./examples/solid-ts",
      command: "pnpm vite --port 3002",
      url: "http://localhost:3002",
      reuseExistingServer: !CI,
    },
    svelte: {
      cwd: "./examples/svelte-ts",
      command: "pnpm vite --port 3003",
      url: "http://localhost:3003",
      reuseExistingServer: !CI,
    },
    alpine: {
      cwd: "./examples/alpine-astro",
      command: "pnpm astro dev --port 3005",
      url: "http://localhost:3005",
      reuseExistingServer: !CI,
    },
  }

  return frameworks[framework]
}

const webServer = getWebServer()

export default defineConfig({
  testDir: "./e2e",
  outputDir: "./e2e/results",
  // testMatch: "*.e2e.ts",
  testMatch: [
    "accordion.e2e.ts",
    "angle-slider.e2e.ts",
    "avatar.e2e.ts",
    "bottom-sheet.e2e.ts",
    "carousel.e2e.ts",
    "checkbox.e2e.ts",
    "clipboard.e2e.ts",
    "collapsible.e2e.ts",
    "color-picker.e2e.ts",
    "combobox.e2e.ts",
    "context-menu.e2e.ts",
    "date-picker.e2e.ts",
    "dialog.e2e.ts",
    "editable.e2e.ts",
    "file-upload.e2e.ts",
    "hover-card.e2e.ts",
    // "image-cropper.e2e.ts",
    "listbox.e2e.ts",
    // "menu-nested.e2e.ts",
    // "menu-option.e2e.ts",
    // "menu.e2e.ts",
    // "navigation-menu.e2e.ts",
    "number-input.e2e.ts",
    // "pagination.e2e.ts",
    // "password-input.e2e.ts",
    // "pin-input.e2e.ts",
    // "popover.e2e.ts",
    // "radio-group.e2e.ts",
    // "rating-group.e2e.ts",
    // "select.e2e.ts",
    // "slider.e2e.ts",
    // "splitter.e2e.ts",
    // "switch.e2e.ts",
    // "tabs.e2e.ts",
    // "tags-input.e2e.ts",
    // "toast.e2e.ts",
    // "toggle-group.e2e.ts",
    // "tooltip.e2e.ts",
    // "tour.e2e.ts",
    // "tree-view.e2e.ts",
  ],
  fullyParallel: !CI,
  timeout: 30_000,
  expect: { timeout: 10_000 },
  forbidOnly: !!CI,
  reportSlowTests: null,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : "50%",
  reporter: [
    process.env.CI ? ["github", ["junit", { outputFile: "e2e/junit.xml" }]] : ["list"],
    ["html", { outputFolder: "e2e/report", open: "never" }],
  ],
  webServer,
  use: {
    baseURL: webServer.url,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    locale: "en-US",
    timezoneId: "GMT",
  },
})

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      FRAMEWORK: string
    }
  }
}
