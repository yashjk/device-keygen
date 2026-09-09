import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./tests/browser",
    webServer: {
        command: "npm --prefix example run dev -- --host 127.0.0.1",
        url: "http://127.0.0.1:4173",
        reuseExistingServer: !process.env.CI,
    },
    use: { baseURL: "http://127.0.0.1:4173" },
    projects: [
        {
            name: "chromium",
            use: {
                ...devices["Desktop Chrome"],
                launchOptions: process.env.PLAYWRIGHT_CHROME_PATH
                    ? { executablePath: process.env.PLAYWRIGHT_CHROME_PATH }
                    : undefined,
            },
        },
        { name: "firefox", use: { ...devices["Desktop Firefox"] } },
        { name: "webkit", use: { ...devices["Desktop Safari"] } },
    ],
});
