import { expect, test } from "@playwright/test";

test("generates and copies a browser identifier", async ({ page, context, browserName }) => {
    if (browserName === "chromium") {
        await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    }
    await page.goto("/");
    await expect(page.getByRole("button", { name: /^copy$/i })).toBeDisabled();
    await page.getByRole("button", { name: /generate/i }).click();
    const value = page.locator(".glow-pulse");
    await expect(value).toContainText(/^\d+$/, { timeout: 5000 });
    await expect(page.getByRole("button", { name: /^copy$/i })).toBeEnabled();
    await page.getByRole("button", { name: /copy/i }).click();
    await expect(page.getByRole("button", { name: /copied/i })).toBeVisible();
    if (browserName === "chromium") {
        await expect.poll(() => page.evaluate(() => navigator.clipboard.readText()))
            .toBe((await value.textContent())?.trim());
    }
});

test("offers a valid UPI support flow", async ({ page, context, browserName }) => {
    if (browserName === "chromium") {
        await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    }
    await page.goto("/support");
    await expect(page.getByRole("heading", { name: /help maintain device keygen/i })).toBeVisible();
    await expect(page.getByLabel("UPI payment QR code")).toBeVisible();
    await expect(page.getByText("yash-joshi-1@yescred", { exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: /pay with upi/i }))
        .toHaveAttribute("href", /^upi:\/\/pay\?pa=yash-joshi-1%40yescred/);
    await page.getByRole("button", { name: /copy upi id/i }).click();
    await expect(page.getByRole("button", { name: /copied/i })).toBeVisible();
    if (browserName === "chromium") {
        await expect.poll(() => page.evaluate(() => navigator.clipboard.readText()))
            .toBe("yash-joshi-1@yescred");
    }
});
