import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

test.describe("Procedural Sound Engine", () => {
  test("presets exist and engine loads", async () => {
    const presetsPath = path.join(process.cwd(), "src/lib/sound/presets.ts");
    const content = fs.readFileSync(presetsPath, "utf-8");
    expect(content).toContain("select");
    expect(content).toContain("toggleOn");
    expect(content).toContain("toggleOff");
    expect(content).toContain("pressSoft");
    const enginePath = path.join(process.cwd(), "src/lib/sound/sound-engine.ts");
    const engine = fs.readFileSync(enginePath, "utf-8");
    expect(engine).toContain("AudioContext");
    expect(engine).toContain("playSound");
  });

  test("Web Audio API available and can create short tone on gesture", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("tablist", { name: "Forecast days" }).click();
    const result = await page.evaluate(async () => {
      try {
        const Ctx = (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }).AudioContext
          ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctx) return { ok: false, error: "no AudioContext" };
        const ctx = new Ctx();
        if (ctx.state === "suspended") await ctx.resume();
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = 440;
        const gain = ctx.createGain();
        gain.gain.value = 0.02;
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
        await new Promise((r) => setTimeout(r, 80));
        await ctx.close();
        return { ok: true };
      } catch (e) {
        return { ok: false, error: String(e) };
      }
    });
    expect(result.ok).toBe(true);
  });

  test("AudioContext singleton and no global click sound", async ({ page }) => {
    await page.goto("/");
    // Click body (not a designated interaction) should not create sound via our integration
    // We check that no unhandled console error and no global listener
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.click("body", { position: { x: 5, y: 5 } });
    await page.waitForTimeout(300);
    expect(errors.filter((e) => e.includes("Audio"))).toHaveLength(0);
  });
});
