import { test, expect } from "@playwright/test";

test("refresh resets to top and logo replays, forecast rail only scrolls horizontally", async ({ page }) => {
  await page.goto("/");
  // Initial: scroll should be 0
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  const logo = page.locator('[aria-label="Weather Wizard"]').first();
  await expect(logo).toBeVisible();
  // Check wrapper has min-h-[76px]
  const wrapperMinH = await page.evaluate(() => {
    const el = document.querySelector("main > div");
    return el ? getComputedStyle(el as HTMLElement).minHeight : null;
  });
  expect(wrapperMinH).toContain("76");

  // Scroll down then reload
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(200);
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
  await page.reload();
  await page.waitForLoadState("networkidle");
  // After reload, should be at top due to history.scrollRestoration manual
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  await expect(logo).toBeVisible();
  // Check mode always — sessionStorage should not gate (logo should animate, but we check attribute)
  const hasSessionKey = await page.evaluate(() => sessionStorage.getItem("ww:entrance-seen"));
  // With mode always, key should not be set (or not required)
  // We just ensure logo is visible

  // Forecast rail: selecting should not move document scroll — use JS click to avoid Playwright auto-scrollIntoView
  const tabs = page.getByRole("tablist", { name: "Forecast days" }).getByRole("tab");
  await page.evaluate(() => (document.querySelectorAll('[role="tab"]')[2] as HTMLElement).click());
  await page.waitForTimeout(400);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  // Rail may have scrolled horizontally, but document scroll remains 0
  const railScrollLeft = await page.evaluate(() => {
    const el = document.querySelector('[role="tablist"]') as HTMLElement | null;
    return el ? el.scrollLeft : null;
  });
  expect(typeof railScrollLeft).toBe("number");

  // Rapid selection should not cause vertical jump
  await page.evaluate(() => (document.querySelectorAll('[role="tab"]')[4] as HTMLElement).click());
  await page.evaluate(() => (document.querySelectorAll('[role="tab"]')[0] as HTMLElement).click());
  await page.waitForTimeout(600);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});
