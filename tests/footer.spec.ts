import { test, expect } from "@playwright/test";

test("footer redesign — ownership credit left-aligned with dashed divider", async ({ page }) => {
  await page.goto("/");

  // New footer exists and is left-aligned
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
  // Left alignment
  const p = footer.locator("p").first();
  await expect(p).toHaveCSS("text-align", "left");
  await expect(p).toHaveCSS("font-size", "14px");

  // Legacy removed
  await expect(page.getByText("Legacy snapshot preserved")).toHaveCount(0);

  // Inspora credit still above footer
  await expect(page.getByText("Visual reference: Inspora Weather Widget")).toBeVisible();
});
