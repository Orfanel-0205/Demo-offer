// Makes the gallery thumbnails for the sample designs (site/designs/thumbs/<id>.webp):
// opens each design at laptop size, waits for fonts and photos, and saves a
// 640×400 WebP of the top of the page.
//
// Usage:  cd tools && npm install && node capture-designs.mjs [design-id …]
//   With no ids, every design in site/designs/catalog.js is captured.
//   Needs Google Chrome installed (or set PW_CHANNEL=msedge).
import { chromium } from "playwright-core";
import { readFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { startServer } from "./serve.mjs";

const PORT = 8162;
const OUT = fileURLToPath(new URL("../site/designs/thumbs/", import.meta.url));
const CATALOG = fileURLToPath(new URL("../site/designs/catalog.js", import.meta.url));

const sandbox = { window: {} };
vm.runInNewContext(await readFile(CATALOG, "utf8"), sandbox);
const all = sandbox.window.DESIGN_CATALOG.designs.filter((d) => !d.featured);
const wanted = process.argv.slice(2);
const designs = wanted.length ? all.filter((d) => wanted.includes(d.id)) : all;
if (wanted.length && designs.length !== wanted.length) {
  console.error("Unknown design id(s):", wanted.filter((id) => !all.some((d) => d.id === id)).join(", "));
  process.exit(1);
}

await mkdir(OUT, { recursive: true });
const server = await startServer(PORT);
const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || "chrome" });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 0.5, reducedMotion: "reduce" });
const problems = [];
page.on("pageerror", (err) => problems.push(String(err)));

for (const design of designs) {
  await page.goto(`http://localhost:${PORT}/designs/${design.url}`, { waitUntil: "networkidle" });
  await page.waitForSelector(".hero img");
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: ".demo-bar,.mobile-actions,.photo-credit{display:none!important}" });
  const broken = await page.$$eval("img", (imgs) => imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src));
  if (broken.length) problems.push(`${design.id}: broken image ${broken.join(", ")}`);
  await page.screenshot({ path: `${OUT}${design.id}.webp`, type: "webp", quality: 72 }).catch(async () => {
    // Older Chrome builds can't encode WebP screenshots; fall back to JPEG.
    await page.screenshot({ path: `${OUT}${design.id}.jpg`, type: "jpeg", quality: 72 });
    problems.push(`${design.id}: saved as .jpg (update the catalog's thumb path)`);
  });
  console.log("✓", design.id);
}

await browser.close();
server.close();
if (problems.length) {
  console.error("\nProblems:\n" + problems.join("\n"));
  process.exitCode = 1;
}
