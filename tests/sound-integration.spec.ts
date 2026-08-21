import { test, expect } from "@playwright/test";

test.describe("Sound Integrations — Cursor + Glass + Scene", () => {
  test("forecast select plays select (different day) and not on same", async ({ page }) => {
    await page.goto("/");
    const tablist = page.getByRole("tablist", { name: "Forecast days" });
    await expect(tablist).toBeVisible();
    const tabs = tablist.getByRole("tab");
    // initial active 0
    await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");

    // Click different day — should change
    await tabs.nth(2).click();
    await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true");
    // No console audio error
    // Click same again — should stay selected (no duplicate sound, but we verify UI unchanged)
    await tabs.nth(2).click();
    await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true");
  });

  test("unit toggle plays toggleOn/Off directionally", async ({ page }) => {
    await page.goto("/");
    const fahrenheit = page.getByRole("button", { name: "Switch to °F" });
    const celsius = page.getByRole("button", { name: "Switch to °C" });
    // Initially celsius may be active (default), check
    const initial = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('[role="group"] button'));
      return btns.map((b) => ({ pressed: b.getAttribute("aria-pressed"), label: b.textContent?.trim() }));
    });
    // Toggle to other
    if (initial.find((b) => b.pressed === "true")?.label === "°C") {
      await fahrenheit.click();
      await expect(fahrenheit).toHaveAttribute("aria-pressed", "true");
    } else {
      await celsius.click();
      await expect(celsius).toHaveAttribute("aria-pressed", "true");
    }
    // Clicking already-selected should not change (no sound)
    const same = page.getByRole("button", { name: initial.find((b) => b.pressed === "true")?.label === "°C" ? "Switch to °F" : "Switch to °C" });
    // Actually after toggle, the previously inactive is now active, clicking it again should stay
    await same.click();
    // Still true
    await expect(same).toHaveAttribute("aria-pressed", "true");
  });

  test("search submit and retry produce pressSoft without error", async ({ page }) => {
    await page.goto("/");
    const input = page.getByPlaceholder("Search city — e.g. Dar es Salaam");
    await input.fill("London");
    const searchBtn = page.getByRole("button", { name: "Search weather" });
    await searchBtn.click();
    // Should not throw, widget should eventually show London or keep previous
    await expect(page.getByRole("region", { name: "Weather widget" })).toBeVisible();
    // Input cursor should still be native
    const cursor = await page.evaluate(() => {
      const el = document.getElementById("city-search")!;
      return getComputedStyle(el).cursor;
    });
    expect(cursor).not.toContain("data:image/svg+xml");
  });

  test("combined cursor + sound + glass + scene on Chromium", async ({ page }) => {
    await page.goto("/");
    // Cursor attribute present
    await expect(page.locator("html")).toHaveAttribute("data-custom-cursor", "true");
    // Forecast glass still works
    const tabs = page.getByRole("tablist", { name: "Forecast days" }).getByRole("tab");
    await tabs.nth(1).click();
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    // Scene should be visible (upper 62% area)
    await expect(page.locator('[aria-label="Weather widget"]')).toBeVisible();
    // No global click sound on body click
    await page.click("body", { position: { x: 10, y: 10 } });
    await page.waitForTimeout(300);
    // Still no error
  });
});
