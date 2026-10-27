// Takes the screenshots used on the Bright Site Tech portfolio cards
// (site/assets/img/work-<demo>-phone.jpg and -desktop.jpg).
// Run again whenever a demo's design changes. Desktop computer only.
//
// Usage:  cd tools && npm install && node capture-portfolio.mjs
// Uses the Google Chrome installed on the computer.
import { chromium } from "playwright-core";
import { readdir, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { startServer } from "./serve.mjs";

const PORT = 8161;
const OUT = fileURLToPath(new URL("../site/assets/img/", import.meta.url));
const DEMOS = fileURLToPath(new URL("../site/demos/", import.meta.url));
// A Friday afternoon, so every sample shows "Open now" in its own time zone.
const FIXED_TIME = new Date("2026-10-30T15:30:00-06:00");

await mkdir(OUT, { recursive: true });
const demos = (await readdir(DEMOS, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name);
const server = await startServer(PORT);
const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || "chrome" });

async function shot(demo, { width, height, scale, mobile }, file) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: scale,
    isMobile: mobile,
    hasTouch: mobile,
    reducedMotion: "reduce",
  });
  await context.clock.setFixedTime(FIXED_TIME);
  const page = await context.newPage();
  await page.goto(`http://localhost:${PORT}/demos/${demo}/`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  // Hide the demo banner and fixed phone bar for a clean "first screen".
  await page.addStyleTag({ content: ".demo-bar,.mobile-actions{display:none!important}" });
  await page.waitForTimeout(250);
  await page.screenshot({ path: OUT + file, type: "jpeg", quality: 84 });
  await context.close();
  console.log("saved", file);
}

for (const demo of demos) {
  await shot(demo, { width: 390, height: 780, scale: 2, mobile: true }, `work-${demo}-phone.jpg`);
  await shot(demo, { width: 1366, height: 820, scale: 1, mobile: false }, `work-${demo}-desktop.jpg`);
}

await browser.close();
server.close();
