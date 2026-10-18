import { test, expect, type Locator, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(__dirname, "../..");
const SCREENSHOT_DIR = path.join(ROOT, "test-results", "themes");
const SCENE_THEME = "claude";
const STATIC_THEME = "meadow";
const UNIQUE_NAME = (extension: string) => new RegExp(`-\\d{4}-\\d{2}-\\d{2}-\\d{6}-[a-z0-9]{1,4}\\.${extension}$`);

function readThemeIds() {
  const index = readFileSync(path.join(ROOT, "src/components/presets/themes/index.ts"), "utf8");
  const dirs = [...index.matchAll(/from "\.\.\/([^/]+)\/theme"/g)].map(([, dir]) => dir);
  return dirs.map((dir) => {
    const source = readFileSync(path.join(ROOT, "src/components/presets", dir, "theme.ts"), "utf8");
    const id = source.match(/id:\s*"([^"]+)"/)?.[1];
    if (!id) throw new Error(`No theme id in ${dir}/theme.ts`);
    return id;
  });
}

function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  return errors;
}

async function setStore(page: Page, key: string, value: unknown) {
  await page.evaluate(
    ([storeKey, json]) => {
      localStorage.setItem(storeKey, json);
      window.dispatchEvent(new StorageEvent("storage", { key: storeKey, newValue: json, storageArea: localStorage }));
    },
    [key, JSON.stringify(value)] as const,
  );
}

async function ensureSlidesStored(page: Page) {
  const stored = await page.evaluate(() => localStorage.getItem("slides"));
  if (stored) return;
  await page.getByRole("combobox", { name: "Theme" }).click();
  await page.getByRole("option", { name: /^Noir/ }).click();
  await expect.poll(() => page.evaluate(() => localStorage.getItem("slides"))).not.toBeNull();
}

async function openPopover(page: Page, trigger: string, content: Locator) {
  await expect(async () => {
    if (!(await content.isVisible())) await page.getByRole("button", { name: trigger, exact: true }).click();
    await expect(content).toBeVisible({ timeout: 3_000 });
  }).toPass({ timeout: 30_000 });
}

async function setTheme(page: Page, themeId: string) {
  await ensureSlidesStored(page);
  const state = JSON.parse((await page.evaluate(() => localStorage.getItem("slides")))!);
  for (const element of Object.values<{ properties: { theme: string } }>(state.elements)) {
    element.properties.theme = themeId;
  }
  await setStore(page, "slides", state);
}

async function openEditor(page: Page, store: Record<string, unknown> = {}) {
  await page.goto("/", { timeout: 90_000 });
  await expect(page.locator("#frame")).toBeVisible({ timeout: 60_000 });
  await page.waitForFunction(
    () => {
      const frame = document.querySelector("#frame");
      return !!frame && Object.keys(frame).some((key) => key.startsWith("__reactFiber"));
    },
    undefined,
    { timeout: 60_000 },
  );
  await page.waitForTimeout(500);
  for (const [key, value] of Object.entries(store)) await setStore(page, key, value);
}

test.describe("editor", () => {
  test.describe.configure({ timeout: 120_000 });

  test("every theme renders", async ({ page }) => {
    test.setTimeout(240_000);
    const themeIds = readThemeIds();
    await openEditor(page);
    const errors = trackErrors(page);
    const failures: string[] = [];

    for (const themeId of themeIds) {
      errors.length = 0;
      await setTheme(page, themeId);
      await page.waitForTimeout(700);
      const frame = page.locator("#frame");
      const problems: string[] = [];
      if (!(await frame.isVisible())) problems.push("#frame not visible");
      if ((await frame.locator('input[type="text"]').count()) === 0) problems.push("no filename input in #frame");
      problems.push(...errors);
      await frame.screenshot({ path: path.join(SCREENSHOT_DIR, `${themeId}.png`) }).catch((error: Error) => {
        problems.push(`screenshot: ${error.message}`);
      });
      if (problems.length) failures.push(`${themeId}: ${problems.join(" | ")}`);
    }

    expect(failures, failures.join("\n")).toEqual([]);
  });

  test("typing replay renders progressively", async ({ page }) => {
    await openEditor(page);
    const errors = trackErrors(page);
    const replay = page.getByRole("group", { name: "Typing mode" }).getByText("Replay", { exact: true });
    await openPopover(page, "Typing animation", replay);
    await replay.click();
    await page.keyboard.press("Escape");

    const lengths: number[] = [];
    for (let sample = 0; sample < 12; sample++) {
      lengths.push(await page.locator("#frame").evaluate((frame) => frame.textContent?.length ?? 0));
      await page.waitForTimeout(250);
    }
    const grew = lengths.some((length, index) => index > 0 && length > lengths[index - 1]);
    expect(grew, `text lengths: ${lengths.join(",")}`).toBe(true);
    expect(errors).toEqual([]);
  });

  const CANVAS_RATIOS = [
    { size: "square", label: "1:1", ratio: 1 },
    { size: "portrait", label: "9:16", ratio: 9 / 16 },
    { size: "landscape", label: "16:9", ratio: 16 / 9 },
  ];

  for (const { size, label, ratio } of CANVAS_RATIOS) {
    test(`canvas ${label} has the right aspect ratio`, async ({ page }) => {
      await openEditor(page, { canvas_size: size });
      const frame = page.locator("#frame");
      await expect(frame).toHaveAttribute("data-canvas-size", size);
      await page.waitForTimeout(500);
      const box = (await frame.boundingBox())!;
      expect(Math.abs(box.width / box.height - ratio) / ratio).toBeLessThan(0.01);
      const safeZones = frame.locator("[data-ignore-in-export][aria-hidden='true']");
      if (size === "portrait") await expect(safeZones).toHaveCount(1);
      else await expect(safeZones).toHaveCount(0);
    });
  }

  test("PNG export downloads a uniquely named file", async ({ page }) => {
    await openEditor(page);
    const errors = trackErrors(page);
    const downloadPromise = page.waitForEvent("download", { timeout: 30_000 });
    await page.getByRole("button", { name: "Export", exact: true }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(UNIQUE_NAME("png"));
    expect(errors).toEqual([]);
  });

  async function openVideoEditor(page: Page, themeId: string, canvasSize = "auto") {
    await openEditor(page, { video_length: 3000, canvas_size: canvasSize });
    await setTheme(page, themeId);
    await page.waitForTimeout(700);
  }

  async function selectStaticTyping(page: Page) {
    const record = page.getByRole("group", { name: "Typing mode" }).getByText("Record", { exact: true });
    await openPopover(page, "Typing animation", record);
    await record.click();
    await page.keyboard.press("Escape");
  }

  async function exportVideo(page: Page, format: "GIF" | "MP4" | "WebM") {
    const videoTab = page.getByRole("group", { name: "Export type" }).getByText("Video", { exact: true });
    await openPopover(page, "Export options", videoTab);
    await videoTab.click();
    const formatGroup = page.getByRole("group", { name: "Video format" });
    await expect(formatGroup).toBeVisible();
    const option = formatGroup.getByText(format, { exact: true });
    if (!(await option.isVisible())) return { skipped: `format ${format} not offered: ${await formatGroup.innerText()}` };
    await option.click();
    const downloadPromise = page.waitForEvent("download", { timeout: 120_000 });
    await page.getByRole("button", { name: /^Export (video|reel)$/ }).click();
    const download = await downloadPromise;
    const bytes = readFileSync((await download.path())!);
    return { name: download.suggestedFilename(), bytes };
  }

  function lightPixelShareOfVideo(page: Page, bytes: Buffer) {
    return page.evaluate(async (base64) => {
      const data = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
      const video = document.createElement("video");
      video.muted = true;
      video.src = URL.createObjectURL(new Blob([data], { type: "video/mp4" }));
      await new Promise((resolve, reject) => {
        video.onloadeddata = resolve;
        video.onerror = () => reject(new Error("MP4 could not be decoded"));
      });
      video.currentTime = 1;
      await new Promise((resolve) => (video.onseeked = resolve));
      const canvas = Object.assign(document.createElement("canvas"), { width: 64, height: 64 });
      const context = canvas.getContext("2d")!;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      let light = 0;
      for (let index = 0; index < pixels.length; index += 4) {
        if (Math.max(pixels[index], pixels[index + 1], pixels[index + 2]) > 32) light += 1;
      }
      return light / (pixels.length / 4);
    }, bytes.toString("base64"));
  }

  function differingPixelShare(page: Page, gif: Buffer, reference: Buffer) {
    return page.evaluate(
      async ([gifBase64, referenceBase64]) => {
        const load = async (source: string) => {
          const image = new Image();
          image.src = source;
          await image.decode();
          return image;
        };
        const gifImage = await load(`data:image/gif;base64,${gifBase64}`);
        const referenceImage = await load(`data:image/png;base64,${referenceBase64}`);
        const pixelsOf = (image: HTMLImageElement) => {
          const canvas = Object.assign(document.createElement("canvas"), { width: gifImage.width, height: gifImage.height });
          const context = canvas.getContext("2d")!;
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          return context.getImageData(0, 0, canvas.width, canvas.height).data;
        };
        const gifPixels = pixelsOf(gifImage);
        const referencePixels = pixelsOf(referenceImage);
        let differing = 0;
        for (let index = 0; index < gifPixels.length; index += 4) {
          const red = Math.abs(gifPixels[index] - referencePixels[index]);
          const green = Math.abs(gifPixels[index + 1] - referencePixels[index + 1]);
          const blue = Math.abs(gifPixels[index + 2] - referencePixels[index + 2]);
          if (Math.max(red, green, blue) > 48) differing += 1;
        }
        return differing / (gifPixels.length / 4);
      },
      [gif.toString("base64"), reference.toString("base64")] as const,
    );
  }

  test("GIF export of a 3s scene completes", async ({ page }) => {
    test.setTimeout(180_000);
    const errors = trackErrors(page);
    await openVideoEditor(page, SCENE_THEME);
    const result = await exportVideo(page, "GIF");
    expect(result.skipped).toBeUndefined();
    expect(result.name).toMatch(UNIQUE_NAME("gif"));
    expect(result.bytes!.length).toBeGreaterThan(0);
    expect(result.bytes!.subarray(0, 3).toString("ascii")).toBe("GIF");
    expect(errors).toEqual([]);
  });

  test("MP4 export of a 3s scene completes", async ({ page }) => {
    test.setTimeout(180_000);
    const errors = trackErrors(page);
    await openVideoEditor(page, SCENE_THEME);
    const result = await exportVideo(page, "MP4");
    expect(result.skipped).toBeUndefined();
    expect(result.name).toMatch(UNIQUE_NAME("mp4"));
    expect(result.bytes!.length).toBeGreaterThan(0);
    expect(result.bytes!.subarray(4, 8).toString("ascii")).toBe("ftyp");
    expect(errors).toEqual([]);
  });

  test("static MP4 export is not black", async ({ page }) => {
    test.setTimeout(180_000);
    await openVideoEditor(page, STATIC_THEME, "landscape");
    await selectStaticTyping(page);
    const result = await exportVideo(page, "MP4");
    test.skip(Boolean(result.skipped), result.skipped);
    expect(await lightPixelShareOfVideo(page, result.bytes!)).toBeGreaterThan(0.5);
  });

  test("free static GIF export carries the tiled watermark", async ({ page }) => {
    test.setTimeout(180_000);
    await openVideoEditor(page, STATIC_THEME, "landscape");
    await selectStaticTyping(page);
    const reference = await page.locator("#frame").screenshot();
    const result = await exportVideo(page, "GIF");
    expect(result.skipped).toBeUndefined();
    expect(await differingPixelShare(page, result.bytes!, reference)).toBeGreaterThan(0.1);
  });
});
