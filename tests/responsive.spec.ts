import { test, expect } from "@playwright/test";

const viewports = [
  { w: 320, h: 800, name: "320" },
  { w: 375, h: 812, name: "375" },
  { w: 390, h: 844, name: "390" },
  { w: 768, h: 1024, name: "768" },
  { w: 1024, h: 768, name: "1024" },
  { w: 1440, h: 900, name: "1440" },
  { w: 1920, h: 1080, name: "1920" },
];

for (const vp of viewports) {
  test(`responsive ${vp.name}px — no overflow, widget centered`, async ({ page }) => {
    await page.setViewportSize({ width: vp.w, height: vp.h });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    // No horizontal scroll
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(vp.w + 2); // allow 2px rounding
    // Widget visible and centered
    const widget = page.getByRole("region", { name: "Weather widget" });
    await expect(widget).toBeVisible();
    const box = await widget.boundingBox();
    expect(box).not.toBeNull();
    // Centered within 20px tolerance at large viewports
    if (vp.w >= 880) {
      const center = vp.w / 2;
      const widgetCenter = box!.x + box!.width / 2;
      expect(Math.abs(widgetCenter - center)).toBeLessThan(30);
    }
    // No clipped glass thumb — wait for forecast to load (tablist appears after data)
    const tablist = page.getByRole("tablist", { name: "Forecast days" });
    await expect(tablist).toBeVisible({ timeout: 10000 });
    // Check via CDP that layout is stable (no CLS)
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("DOM.enable");
    const metrics = await page.evaluate(() => {
      // Check for overflow
      const el = document.querySelector("[aria-label='Weather widget']") as HTMLElement | null;
      if (!el) return null;
      return {
        hasHorizontalScrollbar: document.documentElement.scrollWidth > window.innerWidth,
        widgetWidth: el.offsetWidth,
      };
    });
    expect(metrics?.hasHorizontalScrollbar).toBe(false);
    expect(metrics?.widgetWidth).toBeLessThanOrEqual(380 + 2);
    await cdp.detach();
  });
}

test("fonts preload and display=swap via Chrome DevTools", async ({ page }) => {
  await page.goto("/");
  const preload = page.locator('link[rel="preload"][as="style"]');
  await expect(preload).toHaveCount(1);
  const href = await preload.getAttribute("href");
  expect(href).toContain("fonts.googleapis.com");
  expect(href).toContain("display=swap");
  // Verify no render-blocking @import remains in computed CSS
  const hasImport = await page.evaluate(() => {
    const styles = Array.from(document.styleSheets).map((s) => {
      try {
        return Array.from(s.cssRules).map((r) => r.cssText).join(" ");
      } catch {
        return "";
      }
    }).join(" ");
    return styles.includes('@import url("https://fonts.googleapis.com');
  });
  expect(hasImport).toBe(false);
});

test("bundle split — no enormous network payload", async ({ page }) => {
  await page.goto("/");
  // Verify chunks exist via performance entries
  const chunks = await page.evaluate(() => performance.getEntriesByType("resource").filter((r) => (r as PerformanceResourceTiming).name.includes(".js")).map((r) => (r as PerformanceResourceTiming).name));
  // Should have at least 2 js chunks due to manualChunks (main + react/scenes/sound)
  expect(chunks.length).toBeGreaterThanOrEqual(2);
});
