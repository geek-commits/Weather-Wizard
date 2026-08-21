import { test, expect } from "@playwright/test";

test("smoke loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("region", { name: "Weather widget" })).toBeVisible();
  await expect(page.getByRole("tablist", { name: "Forecast days" })).toBeVisible();
});
