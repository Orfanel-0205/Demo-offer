// Records the demo walkthrough videos frame by frame (desktop computer only).
// Usage:  cd tools && npm install && node record-videos.mjs [vertical|landscape]
// Needs Google Chrome and ffmpeg (https://ffmpeg.org) on the PATH.
// Output: videos/harbor-hearth-phone-demo.mp4 (1080×1920)
//         videos/harbor-hearth-desktop-demo.mp4 (1920×1080)
//
// Each frame is a screenshot of tools/video/stage.html, which shows the real
// website inside phone/browser frames. Scrolling, captions and taps are driven
// by the timelines below, so the output is smooth and repeatable.
import { chromium } from "playwright-core";
import { spawn } from "node:child_process";
import { readFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { startServer } from "./serve.mjs";

const FPS = 30;
const PORT = 8152;
const ORIGIN = `http://localhost:${PORT}`;
const VIDEOS = fileURLToPath(new URL("../videos/", import.meta.url));
const STAGE_HTML = await readFile(new URL("./video/stage.html", import.meta.url), "utf8");
// Friday 6:30 PM Eastern, so the sample hours read "Open now · Closes 10 PM".
const FIXED_TIME = new Date("2026-10-30T18:30:00-04:00");

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a, b, t) => a + (b - a) * t;

class Recorder {
  constructor(page, outFile, posterAt) {
    this.page = page;
    this.outFile = outFile;
    this.posterAt = posterAt;
    this.frameNo = 0;
    this.state = {
      scroll: Object.fromEntries(page.__devices.map((d) => [d.id, 0])),
      elScroll: [],
      caption: { prev: "", text: "", t: 1 },
      captionStart: -999,
      tap: null,
      cards: { intro: 0, end: 0 },
    };
    this.ff = spawn("ffmpeg", [
      "-y", "-loglevel", "error",
      "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-",
      // Screenshots are full-range sRGB JPEGs; convert to standard limited-range
      // BT.709 yuv420p so phones and social apps show the colors correctly.
      "-vf", "scale=in_range=full:out_range=limited:in_color_matrix=bt601:out_color_matrix=bt709,format=yuv420p",
      "-c:v", "libx264", "-preset", "slow", "-crf", "20",
      "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv",
      "-movflags", "+faststart", outFile,
    ], { stdio: ["pipe", "inherit", "inherit"] });
    this.done = new Promise((res, rej) => this.ff.on("close", (code) => (code === 0 ? res() : rej(new Error("ffmpeg exited " + code)))));
  }

  async frame() {
    const s = this.state;
    // Captions fade out, then the next one fades in (no overlapping text).
    s.caption.t = Math.min(1, (this.frameNo - s.captionStart) / 18);
    await this.page.evaluate((st) => window.stage.render(st), s);
    const jpg = await this.page.screenshot({ type: "jpeg", quality: 92 });
    if (!this.ff.stdin.write(jpg)) await new Promise((r) => this.ff.stdin.once("drain", r));
    this.frameNo++;
  }

  async hold(seconds) {
    for (let i = 0, n = Math.round(seconds * FPS); i < n; i++) await this.frame();
  }

  caption(text) {
    this.state.caption = { prev: this.state.caption.text, text, t: 0 };
    this.state.captionStart = this.frameNo;
  }

  async target(device, where, offset = 0) {
    if (typeof where === "number") return where;
    return this.page.evaluate(([d, sel, off]) => window.stage.scrollTargetOf(d, sel, off), [device, where, offset]);
  }

  // Smoothly scroll one or more devices at the same time: { phone: "#menu", desktop: 0 }
  async scroll(targets, seconds, offsets = {}) {
    const from = { ...this.state.scroll };
    const to = {};
    for (const [d, where] of Object.entries(targets)) to[d] = await this.target(d, where, offsets[d] || 0);
    const n = Math.max(1, Math.round(seconds * FPS));
    for (let i = 1; i <= n; i++) {
      const t = ease(i / n);
      for (const d of Object.keys(to)) this.state.scroll[d] = Math.round(lerp(from[d], to[d], t));
      await this.frame();
    }
  }

  // Swipe a horizontal scroller (gallery, menu filters) inside a device.
  // to: a pixel offset, or "end" for the far right.
  async swipe(device, selector, seconds, to = "end") {
    const [current, max] = await this.page.evaluate(([d, sel]) => {
      const el = window.stage.doc(d).querySelector(sel);
      return [el.scrollLeft, el.scrollWidth - el.clientWidth];
    }, [device, selector]);
    let entry = this.state.elScroll.find((e) => e.id === device && e.selector === selector);
    if (!entry) this.state.elScroll.push((entry = { id: device, selector, x: current }));
    const from = entry.x;
    const target = to === "end" ? max : Math.min(max, to);
    const n = Math.max(1, Math.round(seconds * FPS));
    for (let i = 1; i <= n; i++) {
      entry.x = Math.round(lerp(from, target, ease(i / n)));
      await this.frame();
    }
  }

  // Show a finger-tap indicator on an element; optionally click it at the press.
  async tap(device, selector, { click = false, seconds = 0.9 } = {}) {
    const p = await this.page.evaluate(([d, sel]) => window.stage.pointOf(d, sel), [device, selector]);
    const n = Math.round(seconds * FPS);
    const pressAt = Math.round(n * 0.35);
    for (let i = 0; i < n; i++) {
      const t = i / n;
      const scale = t < 0.35 ? lerp(1.35, 0.85, ease(t / 0.35)) : lerp(0.85, 1.25, (t - 0.35) / 0.65);
      const opacity = t < 0.15 ? t / 0.15 : t > 0.6 ? Math.max(0, 1 - (t - 0.6) / 0.4) : 1;
      this.state.tap = { x: p.x, y: p.y, scale, opacity };
      if (click && i === pressAt) {
        await this.page.evaluate(([d, sel]) => window.stage.doc(d).querySelector(sel).click(), [device, selector]);
      }
      await this.frame();
    }
    this.state.tap = null;
  }

  async card(name, fadeIn, hold, fadeOut) {
    const fi = Math.round(fadeIn * FPS);
    for (let i = 1; i <= fi; i++) {
      this.state.cards[name] = ease(i / fi);
      await this.frame();
    }
    this.state.cards[name] = 1;
    await this.hold(hold);
    const fo = Math.round(fadeOut * FPS);
    for (let i = 1; i <= fo; i++) {
      this.state.cards[name] = 1 - ease(i / fo);
      await this.frame();
    }
  }

  async finish() {
    this.ff.stdin.end();
    await this.done;
    console.log(`  ${this.frameNo} frames (${(this.frameNo / FPS).toFixed(1)} s)`);
    // Poster image (thumbnail) taken from the finished video.
    const poster = this.outFile.replace(/\.mp4$/, "-poster.jpg");
    await new Promise((res, rej) =>
      spawn("ffmpeg", ["-y", "-loglevel", "error", "-ss", String(this.posterAt), "-i", this.outFile, "-frames:v", "1", "-q:v", "3", poster], { stdio: "inherit" })
        .on("close", (code) => (code === 0 ? res() : rej(new Error("poster failed")))));
  }
}

async function openStage(browser, layout) {
  const size = layout === "v" ? { width: 540, height: 960 } : { width: 1280, height: 720 };
  const scale = layout === "v" ? 2 : 1.5;
  const context = await browser.newContext({ viewport: size, deviceScaleFactor: scale, reducedMotion: "reduce" });
  await context.clock.setFixedTime(FIXED_TIME);
  const page = await context.newPage();
  await page.route(`${ORIGIN}/__stage.html*`, (route) => route.fulfill({ contentType: "text/html", body: STAGE_HTML }));
  await page.goto(`${ORIGIN}/__stage.html?layout=${layout}`, { waitUntil: "networkidle" });
  await page.evaluate(() => window.stage.ready());
  page.__devices = await page.evaluate(() => window.stage.devices);
  // Visit every part of each page once so lazy images are loaded before recording.
  await page.evaluate(async () => {
    for (const d of window.stage.devices) {
      const w = window.stage.win(d.id);
      for (let y = 0; y < w.document.documentElement.scrollHeight; y += 300) {
        w.scrollTo({ top: y, behavior: "instant" });
        await new Promise((r) => setTimeout(r, 40));
      }
      w.scrollTo({ top: 0, behavior: "instant" });
    }
  });
  await page.waitForLoadState("networkidle");
  const hours = await page.evaluate(() => window.stage.doc("phone").querySelector("[data-hours-text]").textContent);
  console.log(`  hours indicator in recording: "${hours}"`);
  return { page, context };
}

// ---------------------------------------------------------------------------
// Vertical phone walkthrough (Reels, Stories, Messenger, showing on a phone)
// ---------------------------------------------------------------------------
async function recordVertical(browser) {
  console.log("Recording vertical phone demo…");
  const { page, context } = await openStage(browser, "v");
  const r = new Recorder(page, VIDEOS + "harbor-hearth-phone-demo.mp4", 4.2);
  const P = "phone";

  r.state.cards.intro = 1;
  r.caption("Everything a guest needs, on the first screen.");
  r.state.captionStart = 0;
  await r.card("intro", 0, 2.4, 0.7);
  await r.hold(1.6);

  r.caption("Live opening hours that update on their own.");
  await r.scroll({ [P]: 330 }, 1.4);
  await r.hold(1.6);

  r.caption("One tap to the full menu.");
  await r.tap(P, ".hero .btn--primary");
  await r.scroll({ [P]: "#menu" }, 1.2);
  await r.hold(0.8);

  r.caption("Dishes, descriptions and prices, easy to read.");
  await r.scroll({ [P]: "#menu-cat-starters" }, 1.2, { [P]: -24 });
  await r.hold(0.6);
  await r.scroll({ [P]: "#menu-cat-mains" }, 2.2, { [P]: -24 });
  await r.hold(0.8);

  r.caption("Filter the menu by category.");
  await r.scroll({ [P]: ".menu-filters" }, 1.0, { [P]: -120 });
  await r.tap(P, '.filter-btn[data-filter="desserts"]', { click: true });
  await r.hold(1.4);
  await r.swipe(P, ".menu-filters", 0.7, "end");
  await r.tap(P, '.filter-btn[data-filter="drinks"]', { click: true });
  await r.hold(1.4);
  await r.swipe(P, ".menu-filters", 0.7, 0);
  await r.tap(P, '.filter-btn[data-filter="all"]', { click: true });

  r.caption("The restaurant's story, in the owner's words.");
  await r.scroll({ [P]: "#about" }, 1.6);
  await r.hold(1.2);
  await r.scroll({ [P]: ".about__media" }, 1.4, { [P]: -40 });
  await r.hold(0.8);

  r.caption("Photos of signature dishes.");
  await r.scroll({ [P]: ".gallery-wrap" }, 1.4, { [P]: -30 });
  await r.swipe(P, ".gallery", 2.4);
  await r.hold(0.6);

  r.caption("Links to the ordering services they already use.");
  await r.scroll({ [P]: "#order" }, 1.6, { [P]: 120 });
  await r.hold(0.6);
  await r.tap(P, '.btn--demo[data-demo-link*="reservation"]', { click: true });
  await r.scroll({ [P]: ".order-card" }, 0.8, { [P]: 40 });
  await r.hold(2.0);

  r.caption("Address, hours, tap-to-call and directions.");
  await r.scroll({ [P]: "#visit" }, 1.6);
  await r.hold(0.6);
  await r.scroll({ [P]: ".visit__actions" }, 1.2, { [P]: -220 });
  await r.tap(P, ".visit__actions .btn--primary");
  await r.tap(P, ".visit__actions .btn--outline");
  await r.scroll({ [P]: ".visit__hours" }, 1.4, { [P]: -20 });
  await r.hold(1.6);

  r.caption("Menu, Call and Directions are always one tap away.");
  await r.tap(P, ".mobile-actions__link:nth-child(2)", { seconds: 1.0 });
  await r.hold(0.6);

  r.caption("Clear navigation, built for thumbs.");
  await r.scroll({ [P]: "#menu" }, 1.2, { [P]: -200 });
  await r.tap(P, "[data-nav-toggle]", { click: true });
  await r.hold(1.8);
  await r.tap(P, "[data-nav-toggle]", { click: true });
  await r.hold(0.4);

  r.caption("Want a site like this? Simple, upfront pricing.");
  await r.scroll({ [P]: "#packages" }, 1.8, { [P]: 40 });
  await r.hold(1.4);
  await r.scroll({ [P]: ".package--featured" }, 1.6, { [P]: -30 });
  await r.hold(1.2);

  await r.card("end", 0.8, 5.5, 0);
  await r.finish();
  await context.close();
}

// ---------------------------------------------------------------------------
// Landscape desktop + phone (YouTube, Facebook, email, laptop presentations)
// ---------------------------------------------------------------------------
async function recordLandscape(browser) {
  console.log("Recording landscape desktop demo…");
  const { page, context } = await openStage(browser, "h");
  const r = new Recorder(page, VIDEOS + "harbor-hearth-desktop-demo.mp4", 4.5);
  const D = "desktop", P = "phone";

  r.state.cards.intro = 1;
  r.caption("One website that works on every screen.");
  r.state.captionStart = 0;
  await r.card("intro", 0, 2.4, 0.7);
  await r.hold(2.2);

  r.caption("The menu, organized and easy to read.");
  await r.tap(D, ".hero .btn--primary");
  await r.scroll({ [D]: "#menu", [P]: "#menu" }, 1.4);
  await r.hold(1.0);
  await r.scroll({ [D]: "#menu-cat-mains", [P]: "#menu-cat-starters" }, 2.0, { [D]: -20, [P]: -20 });
  await r.hold(0.8);

  r.caption("Category filters that work with a tap or a click.");
  await r.scroll({ [D]: ".menu-filters" }, 0.9, { [D]: -140 });
  await r.tap(D, '.filter-btn[data-filter="desserts"]', { click: true });
  await r.hold(1.6);
  await r.tap(D, '.filter-btn[data-filter="all"]', { click: true });

  r.caption("The restaurant's story and signature dishes.");
  await r.scroll({ [D]: "#about", [P]: "#about" }, 1.6);
  await r.hold(1.0);
  await r.scroll({ [D]: ".gallery-wrap", [P]: ".about__media" }, 1.6, { [D]: -80, [P]: -40 });
  await r.hold(1.4);

  r.caption("Links to the ordering services they already use.");
  await r.scroll({ [D]: "#order", [P]: "#order" }, 1.6, { [D]: -20, [P]: 120 });
  await r.hold(0.6);
  await r.tap(D, '.btn--demo[data-demo-link*="reservation"]', { click: true });
  await r.hold(2.0);

  r.caption("Hours, location, tap-to-call and directions.");
  await r.scroll({ [D]: "#visit", [P]: "#visit" }, 1.6);
  await r.hold(1.0);
  await r.scroll({ [P]: ".visit__hours" }, 1.4, { [P]: -20 });
  await r.hold(1.6);

  r.caption("Simple, introductory packages.");
  await r.scroll({ [D]: "#packages", [P]: "#packages" }, 2.0, { [D]: 40, [P]: 40 });
  await r.hold(1.0);
  await r.scroll({ [D]: ".packages", [P]: ".package--featured" }, 1.6, { [D]: -40, [P]: -30 });
  await r.hold(2.4);

  await r.card("end", 0.8, 5.5, 0);
  await r.finish();
  await context.close();
}

await mkdir(VIDEOS, { recursive: true });
const which = process.argv[2];
const server = await startServer(PORT);
const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || "chrome" });
try {
  if (!which || which === "vertical") await recordVertical(browser);
  if (!which || which === "landscape") await recordLandscape(browser);
} finally {
  await browser.close();
  server.close();
}
console.log("Videos saved in", VIDEOS);
