// Exports the Bright Site Tech logo (brand/svg/*.svg) to PNG files for social
// media, email signatures and the website (link-preview image, app icon).
// Desktop computer only:  cd tools && npm install && node render-brand.mjs
import { chromium } from "playwright-core";
import { readFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const svgDir = root + "brand/svg/";
const pngDir = root + "brand/png/";
await mkdir(pngDir, { recursive: true });

const svg = async (name) => (await readFile(svgDir + name, "utf8")).replace(/<\?xml[^>]*>/, "");
const NAVY = "#0B1B33";
const FONT = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&display=swap";

const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || "chrome" });

async function render(file, width, height, body, { transparent = false, background = "transparent" } = {}) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="${FONT}">
    <style>html,body{margin:0;width:${width}px;height:${height}px;overflow:hidden;background:${background};font-family:"Plus Jakarta Sans",sans-serif}
    svg{display:block}</style></head><body>${body}</body></html>`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const opts = { path: file, omitBackground: transparent };
  if (file.endsWith(".jpg")) Object.assign(opts, { type: "jpeg", quality: 88 });
  await page.screenshot(opts);
  await page.close();
  console.log("saved", file.replace(root, ""));
}

const sized = (markup, w) => markup.replace(/width="[^"]*" height="[^"]*"/, `width="${w}" height="auto" style="width:${w}px;height:auto"`);
const logo = await svg("logo.svg");
const logoWhite = await svg("logo-white.svg");
const logoInline = await svg("logo-inline.svg");
const mark = await svg("mark.svg");
const favicon = await svg("favicon.svg");
const center = (inner) => `<div style="display:grid;place-items:center;width:100%;height:100%">${inner}</div>`;

// Transparent logos (for documents, invoices, social posts)
await render(pngDir + "logo-1200.png", 1200, 319, center(sized(logo, 1200)), { transparent: true });
await render(pngDir + "logo-white-1200.png", 1200, 319, center(sized(logoWhite, 1200)), { transparent: true });
await render(pngDir + "logo-inline-1200.png", 1200, 219, center(sized(logoInline, 1200)), { transparent: true });
await render(pngDir + "mark-1024.png", 1024, 1024, center(sized(mark, 1024)), { transparent: true });

// Email signature (white background, small)
await render(pngDir + "email-signature-logo.png", 480, 88, center(sized(logoInline, 460)), { background: "#fff" });

// Social profile picture: full navy square (works with circle crops)
await render(pngDir + "profile-1024.png", 1024, 1024,
  center(`<div style="width:1024px;height:1024px;background:${NAVY};display:grid;place-items:center">${sized(favicon, 760)}</div>`));

// Facebook / LinkedIn style cover (1640 × 624)
const cover = (w, h, extra = "") => `
  <div style="position:relative;width:${w}px;height:${h}px;background:${NAVY};overflow:hidden;color:#C9D3E3">
    <div style="position:absolute;width:${h * 2.2}px;height:${h * 2.2}px;right:${-h * 0.7}px;bottom:${-h * 1.5}px;border-radius:50%;
      background:radial-gradient(circle, rgba(255,176,32,.38) 0%, rgba(255,176,32,.08) 45%, transparent 68%)"></div>
    <div style="position:absolute;left:${w * 0.07}px;top:50%;transform:translateY(-50%)">
      ${sized(logoWhite, Math.round(w * 0.36))}
      <p style="margin:${h * 0.07}px 0 0;color:#fff;font-weight:800;font-size:${Math.round(h * 0.085)}px;letter-spacing:-.02em;line-height:1.15">Websites for local businesses</p>
      <p style="margin:${h * 0.03}px 0 0;font-weight:500;font-size:${Math.round(h * 0.05)}px">Restaurants &middot; Auto shops &middot; Salons &middot; Home services</p>
    </div>${extra}
  </div>`;
await render(pngDir + "social-cover-1640x624.png", 1640, 624, cover(1640, 624));

// Website assets
const shot = async (name) => "data:image/jpeg;base64," + (await readFile(root + "site/assets/img/" + name)).toString("base64");
const desktopShot = await shot("work-auto-repair-desktop.jpg");
const phoneShot = await shot("work-restaurant-phone.jpg");
// Link-preview image for the website (1200 × 630): text left, mockups right.
const og = `
  <div style="position:relative;width:1200px;height:630px;background:${NAVY};overflow:hidden;color:#C9D3E3">
    <div style="position:absolute;width:1300px;height:1300px;right:-520px;bottom:-900px;border-radius:50%;
      background:radial-gradient(circle, rgba(255,176,32,.4) 0%, rgba(255,176,32,.08) 45%, transparent 68%)"></div>
    <div style="position:absolute;left:64px;top:96px;width:520px">
      ${sized(logoWhite, 340)}
      <p style="margin:44px 0 0;color:#fff;font-weight:800;font-size:50px;letter-spacing:-.03em;line-height:1.08">Websites for local businesses</p>
      <p style="margin:20px 0 0;font-weight:500;font-size:24px;line-height:1.4">Restaurants, auto shops and local services. Fixed prices from $149.</p>
    </div>
    <div style="position:absolute;left:640px;top:110px;width:600px;border-radius:12px;overflow:hidden;box-shadow:0 30px 60px rgba(0,0,0,.4)">
      <div style="height:22px;background:#E9EDF3"></div><img src="${desktopShot}" style="display:block;width:100%">
    </div>
    <div style="position:absolute;left:600px;top:250px;width:160px;padding:5px;border-radius:22px;background:#0A0F18;box-shadow:0 24px 50px rgba(0,0,0,.5)">
      <img src="${phoneShot}" style="display:block;width:100%;border-radius:17px">
    </div>
  </div>`;
await render(root + "site/assets/img/og-image.jpg", 1200, 630, og);
await render(root + "site/apple-touch-icon.png", 180, 180,
  `<div style="width:180px;height:180px;background:${NAVY};display:grid;place-items:center">${sized(favicon, 150)}</div>`);

await browser.close();
