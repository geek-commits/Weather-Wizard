import { test, expect } from "@playwright/test";

test.describe("Forecast Glass — Fixes 1-4", () => {
  test("glass stays on selected tab after ResizeObserver (no stale snap)", async ({ page }) => {
    await page.goto("/");

    const tablist = page.getByRole("tablist", { name: "Forecast days" });
    await expect(tablist).toBeVisible();
    const tabs = tablist.getByRole("tab");
    // initial active is first
    await expect(tabs.first()).toHaveAttribute("aria-selected", "true");

    // pick third tab (Sun 23 style — index 2)
    const target = tabs.nth(2);
    await target.click();

    // wait for glass slide 460ms + width 420ms
    await page.waitForTimeout(600);

    // glass thumb is the element with backdrop-filter / glass class
    const glass = page.locator(".ww-glass-fallback").first().locator(".."); // the thumb container
    // Actually thumb is parent with pointer-events-none left-0 top-1/2
    const thumb = page.locator('[aria-hidden="true"].pointer-events-none.absolute.left-0').first();
    await expect(thumb).toBeVisible();

    // Verify thumb x aligns with target tab's offsetLeft via CDP / evaluate
    const alignment = await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('[role="tab"]')) as HTMLElement[];
      const thumb = document.querySelector('[aria-hidden="true"].pointer-events-none.absolute.left-0') as HTMLElement | null;
      if (!thumb || tabs.length < 3) return null;
      const active = tabs.find((t) => t.getAttribute("aria-selected") === "true");
      if (!active) return null;
      const thumbRect = thumb.getBoundingClientRect();
      const activeRect = active.getBoundingClientRect();
      return {
        thumbLeft: thumbRect.left,
        activeLeft: activeRect.left,
        diff: Math.abs(thumbRect.left - activeRect.left),
        thumbWidth: thumbRect.width,
        activeWidth: activeRect.width,
        widthDiff: Math.abs(thumbRect.width - activeRect.width),
      };
    });
    expect(alignment).not.toBeNull();
    expect(alignment!.diff).toBeLessThan(2); // thumb left should match active tab left
    expect(alignment!.widthDiff).toBeLessThan(2);

    // Trigger ResizeObserver via font/layout change simulation — change should not snap back to Fri
    await page.evaluate(() => window.dispatchEvent(new Event("resize")));
    await page.waitForTimeout(300);
    const afterResize = await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('[role="tab"]')) as HTMLElement[];
      const thumb = document.querySelector('[aria-hidden="true"].pointer-events-none.absolute.left-0') as HTMLElement | null;
      const active = tabs.find((t) => t.getAttribute("aria-selected") === "true");
      if (!thumb || !active) return null;
      return Math.abs(thumb.getBoundingClientRect().left - active.getBoundingClientRect().left);
    });
    expect(afterResize).toBeLessThan(2);
  });

  test("thumb vertically centered (no duplicate -50%)", async ({ page }) => {
    await page.goto("/");
    const tablist = page.getByRole("tablist", { name: "Forecast days" });
    await expect(tablist).toBeVisible();
    await page.waitForTimeout(400);
    const vertical = await page.evaluate(() => {
      const thumb = document.querySelector('[aria-hidden="true"].pointer-events-none.absolute.left-0') as HTMLElement | null;
      const tab = document.querySelector('[role="tab"][aria-selected="true"]') as HTMLElement | null;
      if (!thumb || !tab) return null;
      const t = thumb.getBoundingClientRect();
      const b = tab.getBoundingClientRect();
      const thumbCenterY = t.top + t.height / 2;
      const tabCenterY = b.top + b.height / 2;
      return Math.abs(thumbCenterY - tabCenterY);
    });
    expect(vertical).not.toBeNull();
    expect(vertical!).toBeLessThan(2);
  });

  test("uniform font 600 for all labels", async ({ page }) => {
    await page.goto("/");
    const weights = await page.evaluate(() =>
      Array.from(document.querySelectorAll('[role="tab"]')).map((el) => getComputedStyle(el).fontWeight)
    );
    // All should be 600
    for (const w of weights) expect(w).toBe("600");
  });

  test("Chromium glass material present with CDP", async ({ page }) => {
    await page.goto("/");
    const tablist = page.getByRole("tablist", { name: "Forecast days" });
    await expect(tablist).toBeVisible();
    // wait for thumb to measure
    const thumb = page.locator(".pointer-events-none.absolute.left-0").first();
    await expect(thumb).toBeVisible({ timeout: 3000 });
    await page.waitForTimeout(400);
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("DOM.enable");
    const style = await page.evaluate(() => {
      const thumbEl = document.querySelector(".pointer-events-none.absolute.left-0") as HTMLElement | null;
      if (!thumbEl) return null;
      const cs = getComputedStyle(thumbEl);
      const fallback = thumbEl.querySelector(".ww-glass-fallback") as HTMLElement | null;
      return {
        borderRadius: cs.borderRadius,
        backgroundColor: cs.backgroundColor,
        backdropFallback: fallback ? getComputedStyle(fallback).getPropertyValue("backdrop-filter") : null,
      };
    });
    expect(style).not.toBeNull();
    expect(style!.borderRadius).toContain("9999px");
    expect(style!.backgroundColor).toMatch(/rgba\(255,\s*255,\s*255,\s*0\.48\)/);
    await cdp.detach();
  });
});
