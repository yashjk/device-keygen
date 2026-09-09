import { expect, test } from "@playwright/test";

test("generates and copies a browser identifier", async ({ page, context, browserName }) => {
    if (browserName === "chromium") {
        await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    }
    await page.goto("/");
    await page.getByRole("button", { name: /generate/i }).click();
    const value = page.locator(".glow-pulse");
    await expect(value).toContainText(/^\d+$/, { timeout: 5000 });
    await page.getByRole("button", { name: /copy/i }).click();
    await expect(page.getByRole("button", { name: /copied/i })).toBeVisible();
    if (browserName === "chromium") {
        await expect.poll(() => page.evaluate(() => navigator.clipboard.readText()))
            .toBe((await value.textContent())?.trim());
    }
});
