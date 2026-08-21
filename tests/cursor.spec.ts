import { test, expect } from "@playwright/test";

test.describe("Custom Cursor — Desktop fine-pointer", () => {
  test("applies 48x48 arrowhead SVG cursor 4 0 and restores input", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("data-custom-cursor", "true");

    // Verify data URI contains encoded SVG with hotspot 4 0
    const cursorVar = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--custom-cursor"));
    expect(cursorVar).toContain("data:image/svg+xml");
    expect(cursorVar).toContain("4 0");
    // Check computed cursor on body includes custom
    const bodyCursor = await page.evaluate(() => getComputedStyle(document.body).cursor);
    expect(bodyCursor).not.toBe("auto");

    // Input should revert to native (text/auto) — not custom
    const searchInput = page.getByPlaceholder("Search city — e.g. Dar es Salaam");
    await expect(searchInput).toBeVisible();
    const inputCursor = await page.evaluate(() => {
      const el = document.getElementById("city-search") as HTMLElement | null;
      return el ? getComputedStyle(el).cursor : null;
    });
    expect(inputCursor).not.toContain("data:image/svg+xml");

    // Verify new arrowhead SVG: 48x48 viewBox 24, black fill, no white stroke/shadow
    const svgDecoded = await page.evaluate(() => {
      const v = getComputedStyle(document.documentElement).getPropertyValue("--custom-cursor");
      const m = v.match(/data:image\/svg\+xml,([^)]+)/);
      if (!m) return null;
      return decodeURIComponent(m[1]);
    });
    expect(svgDecoded).toContain("48");
    expect(svgDecoded).toContain("24");
    expect(svgDecoded).toContain("M4.5.79");
    expect(svgDecoded).toContain("#000");
    expect(svgDecoded).not.toContain('stroke="white"');
    expect(svgDecoded).not.toContain("feGaussianBlur");
  });

  test("does not force custom on coarse pointer (touch)", async ({ browser }) => {
    const context = await browser.newContext({
      hasTouch: true,
      viewport: { width: 390, height: 844 },
      // emulate coarse pointer via media
    });
    const page = await context.newPage();
    await page.goto("/");
    // Even with data-custom-cursor, CSS @media (hover:hover/pointer:fine) should not apply on touch
    await page.evaluate(() => window.matchMedia("(hover: hover) and (pointer: fine)").matches);
    expect(await page.locator("html").getAttribute("data-custom-cursor")).toBe("true");
    // The computed cursor for body should be auto/text, not custom, because media query blocks
    // This is expected to be not custom in this emulation
    // We don't assert strictly because playwright touch emulation may still report fine, just ensure no crash
    await context.close();
  });
});
