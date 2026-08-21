import { test, expect } from "@playwright/test";

test("footer redesign — centered ownership credit with dashed divider, no Inspora", async ({ page }) => {
  await page.goto("/");

  // New footer exists and is centered
  const footer = page.locator("footer");
  await expect(footer).toBeVisible();
  await expect(footer).toHaveClass(/mt-auto/);
  // Check text
  await expect(footer).toContainText("Weather Wizard © 2026 - Design + Code by");
  await expect(footer).toContainText("Gad Mollel");

  // Link
  const link = footer.getByRole("link", { name: "Gad Mollel" });
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute("href", "https://www.gadnex.us/");
  await expect(link).toHaveAttribute("target", "_blank");
  await expect(link).toHaveAttribute("rel", "noreferrer");
  // Color check via computed style
  const color = await link.evaluate((el) => getComputedStyle(el).color);
  // #2563EB => rgb(37, 99, 235)
  expect(color).toBe("rgb(37, 99, 235)");

  // Dashed divider
  const divider = footer.locator("div").first();
  await expect(divider).toHaveCSS("border-bottom-style", "dashed");
  // Centered alignment
  const p = footer.locator("p").first();
  await expect(p).toHaveCSS("text-align", "center");
  await expect(p).toHaveCSS("font-size", "14px");

  // Legacy and Inspora removed — page goes directly widget → footer
  await expect(page.getByText("Legacy snapshot preserved")).toHaveCount(0);
  await expect(page.getByText("Visual reference: Inspora Weather Widget")).toHaveCount(0);
});
