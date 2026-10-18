import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { chromium, type Browser } from "playwright";

const BRAND_IDS = [
  "vercel",
  "supabase",
  "claude",
  "resend",
  "clerk",
  "triggerdev",
  "mintlify",
  "browserbase",
  "prisma",
  "nuxt",
  "elevenlabs",
  "tailwind",
  "cloudflare",
  "openai",
  "stripe",
  "gemini",
];
const OUT_DIR = "exports/videos";
const PAGE_TIMEOUT_MS = 120_000;
const EXPORT_TIMEOUT_MS = 20 * 60_000;
const SETTLE_MS = 3000;
const CHROME_ARGS = [
  "--disable-background-timer-throttling",
  "--disable-renderer-backgrounding",
  "--disable-backgrounding-occluded-windows",
];

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { only: { type: "string" }, force: { type: "boolean", default: false } },
});
const baseUrl = positionals[0] ?? "http://localhost:3000";

function pickIds() {
  if (!values.only) return BRAND_IDS;
  const wanted = values.only.split(",").map((id) => id.trim());
  const unknown = wanted.filter((id) => !BRAND_IDS.includes(id));
  if (unknown.length > 0) throw new Error(`Unknown brand ids: ${unknown.join(", ")}`);
  return wanted;
}

async function renderBrand(browser: Browser, id: string, outPath: string) {
  const context = await browser.newContext({ viewport: { width: 1600, height: 1000 }, acceptDownloads: true });
  const page = await context.newPage();
  try {
    await page.goto(`${baseUrl}/?theme=${id}&render=4k`, { timeout: PAGE_TIMEOUT_MS });
    await page.locator(`[data-shown-theme="${id}"]`).waitFor({ state: "attached", timeout: PAGE_TIMEOUT_MS });
    await page.waitForTimeout(SETTLE_MS);
    await page.getByRole("button", { name: "Export video" }).click();
    const exportButton = page.getByRole("button", { name: "Export MP4" });
    await exportButton.waitFor({ timeout: PAGE_TIMEOUT_MS });
    const download = page.waitForEvent("download", { timeout: EXPORT_TIMEOUT_MS });
    await exportButton.click();
    await (await download).saveAs(outPath);
  } finally {
    await context.close();
  }
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({ channel: "chrome", headless: false, args: CHROME_ARGS });
  const failed: string[] = [];
  try {
    for (const id of pickIds()) {
      const outPath = join(OUT_DIR, `${id}.mp4`);
      if (existsSync(outPath) && !values.force) {
        console.log(`skip ${id}, ${outPath} exists`);
        continue;
      }
      console.log(`render ${id}`);
      const startedAt = Date.now();
      try {
        await renderBrand(browser, id, outPath);
        console.log(`saved ${outPath} in ${Math.round((Date.now() - startedAt) / 1000)}s`);
      } catch (error) {
        failed.push(id);
        console.error(`failed ${id}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  } finally {
    await browser.close();
  }
  if (failed.length === 0) return;
  console.error(`failed: ${failed.join(",")}`);
  process.exitCode = 1;
}

main();
