// Automated checks for the Bright Site Tech website and every demo (desktop computer only).
// Usage:  cd tools && npm install && node test-site.mjs
// Uses the Google Chrome already installed on the computer (no browser download).
// Screenshots are written to tools/output/ (ignored by git).
import { chromium } from "playwright-core";
import { readFile, readdir, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { join, relative } from "node:path";
import { startServer } from "./serve.mjs";

const require = createRequire(import.meta.url);
const AXE_SOURCE = await readFile(require.resolve("axe-core/axe.min.js"), "utf8");
const PORT = 8137;
const ORIGIN = `http://localhost:${PORT}`;
const OUT = new URL("./output/", import.meta.url);
const ROOT = fileURLToPath(new URL("..", import.meta.url));
await mkdir(OUT, { recursive: true });

const PAGES = {
  studio: "/",
  restaurant: "/demos/restaurant/",
  auto: "/demos/auto-repair/",
};

const results = [];
const check = (name, ok, detail = "") => {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};

const server = await startServer(PORT);
const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || "chrome" });

async function openPage(path, viewport, { mobile = false, timezoneId, configPatch, agencyPatch, routes } = {}) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile, timezoneId });
  const page = await context.newPage();
  const problems = [];
  const requests = [];
  page.on("console", (msg) => {
    if (["error", "warning"].includes(msg.type())) problems.push(`console.${msg.type()}: ${msg.text()}`);
  });
  page.on("pageerror", (err) => problems.push(`pageerror: ${err.message}`));
  page.on("requestfailed", (req) => {
    if (!/^mailto:/.test(req.url())) problems.push(`request failed: ${req.url()}`);
  });
  page.on("request", (req) => requests.push(req.url()));
  page.on("response", (res) => {
    if (res.status() >= 400) problems.push(`HTTP ${res.status()}: ${res.url()}`);
  });
  const patch = async (glob, fn) =>
    page.route(glob, async (route) => {
      const original = await (await route.fetch()).text();
      await route.fulfill({ contentType: "text/javascript", body: fn(original) });
    });
  if (configPatch) await patch("**/config.js", configPatch);
  if (agencyPatch) await patch("**/agency.config.js", agencyPatch);
  for (const [glob, handler] of Object.entries(routes || {})) await page.route(glob, handler);
  await page.goto(ORIGIN + path, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  return { page, context, problems, requests };
}

async function scrollThrough(page) {
  // Trigger lazy images and scroll-reveal before screenshots/assertions.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 70));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(800); // let fade-in transitions finish
}

async function waitForScrollEnd(page) {
  // Smooth scrolling takes a moment; wait until the position stops changing.
  let last = -1;
  for (let i = 0; i < 40; i++) {
    await page.waitForTimeout(100);
    const y = await page.evaluate(() => window.scrollY);
    if (y === last) return;
    last = y;
  }
}

async function runAxe(page) {
  await page.addScriptTag({ content: AXE_SOURCE });
  return page.evaluate(async () => {
    const r = await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] } });
    return r.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.length} node(s) — ${v.nodes.slice(0, 2).map((n) => n.target.join(" ")).join("; ")}`);
  });
}

const sectionTop = (page, id) => page.evaluate((i) => document.getElementById(i).getBoundingClientRect().top, id);

// ---------------------------------------------------------------------------
// 0. Every demo carries an identical copy of the master engine
// ---------------------------------------------------------------------------
{
  async function list(dir) {
    const out = [];
    for (const e of await readdir(dir, { withFileTypes: true })) {
      const full = join(dir, e.name);
      if (e.isDirectory()) out.push(...(await list(full)));
      else out.push(full);
    }
    return out;
  }
  const master = join(ROOT, "engine");
  const files = await list(master);
  for (const demo of ["restaurant", "auto-repair"]) {
    const stale = [];
    for (const f of files) {
      const copy = join(ROOT, "site", "demos", demo, "engine", relative(master, f));
      const same = await readFile(copy).then((b) => b.equals(Buffer.from(require("node:fs").readFileSync(f)))).catch(() => false);
      if (!same) stale.push(relative(master, f));
    }
    check(`[${demo}] engine copy matches engine/ (run tools/sync-engine.mjs if not)`, stale.length === 0, stale.join(", "));
  }
}

// ---------------------------------------------------------------------------
// 1. Layout at common screen sizes: overflow, console errors, broken assets
// ---------------------------------------------------------------------------
const VIEWPORTS = [
  { name: "phone-320", width: 320, height: 640, mobile: true },
  { name: "phone-360", width: 360, height: 780, mobile: true },
  { name: "phone-390", width: 390, height: 844, mobile: true },
  { name: "phone-430", width: 430, height: 932, mobile: true },
  { name: "tablet-768", width: 768, height: 1024, mobile: true },
  { name: "laptop-1280", width: 1280, height: 800 },
  { name: "desktop-1536", width: 1536, height: 864 },
];

for (const [key, path] of Object.entries(PAGES)) {
  for (const vp of VIEWPORTS) {
    const { page, context, problems } = await openPage(path, { width: vp.width, height: vp.height }, { mobile: vp.mobile });
    await scrollThrough(page);
    const overflow = await page.evaluate(() => {
      const docW = document.documentElement.clientWidth;
      const offenders = [];
      document.querySelectorAll("body *").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width && (r.right > docW + 1 || r.left < -1)) {
          // Intentional horizontal scrollers, off-screen helpers and decorative glows are fine.
          if (!el.closest(".gallery, .menu-filters, .hp, .skip-link, .sticky-cta, .hero__visual")) offenders.push(`${el.tagName.toLowerCase()}.${el.className}`);
        }
      });
      return { scrollW: document.documentElement.scrollWidth, docW, offenders: offenders.slice(0, 5) };
    });
    const label = `[${key} · ${vp.name}]`;
    check(`${label} no horizontal page overflow`, overflow.scrollW <= overflow.docW && !overflow.offenders.length,
      `scrollWidth ${overflow.scrollW} / viewport ${overflow.docW}${overflow.offenders.length ? " — " + overflow.offenders.join(", ") : ""}`);
    check(`${label} no console errors, warnings or broken requests`, problems.length === 0, problems.join(" | "));
    const imgs = await page.evaluate(() => [...document.images].map((img) => ({ src: img.getAttribute("src"), ok: img.complete && img.naturalWidth > 0 })));
    check(`${label} all images loaded`, imgs.every((i) => i.ok), imgs.filter((i) => !i.ok).map((i) => i.src).join(", "));
    await page.screenshot({ path: fileURLToPath(new URL(`${key}-${vp.name}.png`, OUT)) });
    await context.close();
  }
}

// ---------------------------------------------------------------------------
// 2. Structure, links and accessibility
// ---------------------------------------------------------------------------
const EXPECTED_TEL = { studio: null, restaurant: "tel:+12075550142", auto: "tel:+12085550187" };
for (const [key, path] of Object.entries(PAGES)) {
  const { page, context } = await openPage(path, { width: 390, height: 844 }, { mobile: true });
  await scrollThrough(page);
  const headings = await page.evaluate(() => [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => Number(h.tagName[1])));
  let skipped = false;
  headings.reduce((prev, level) => {
    if (level > prev + 1) skipped = true;
    return level;
  }, 0);
  check(`[${key}] exactly one <h1>`, headings.filter((l) => l === 1).length === 1);
  check(`[${key}] heading levels never skip`, !skipped, headings.join(" "));
  const alts = await page.evaluate(() => [...document.images].filter((i) => !i.closest("[aria-hidden='true']")).map((i) => i.getAttribute("alt")));
  check(`[${key}] every meaningful image has alt text`, alts.every((a) => a && a.trim().length > 5), alts.join(" | "));

  const links = await page.evaluate(() =>
    [...document.querySelectorAll("a")].map((a) => ({ href: a.getAttribute("href"), target: a.target, rel: a.rel, text: a.textContent.trim() }))
  );
  check(`[${key}] no empty, '#' or javascript: links`, links.every((l) => l.href && l.href !== "#" && !/^javascript:/i.test(l.href)));
  const anchors = [...new Set(links.filter((l) => l.href.startsWith("#")).map((l) => l.href.slice(1)))];
  const missing = await page.evaluate((ids) => ids.filter((id) => !document.getElementById(id)), anchors);
  check(`[${key}] all in-page links point to existing sections`, missing.length === 0, missing.join(", "));
  const external = links.filter((l) => /^https?:/.test(l.href));
  check(`[${key}] external links open safely in a new tab`, external.every((l) => l.target === "_blank" && l.rel.includes("noopener")));
  check(`[${key}] no invented external URLs (only Google Maps directions)`, external.every((l) => l.href.startsWith("https://www.google.com/maps/dir/?api=1&destination=")),
    external.map((l) => l.href).join(", "));
  if (EXPECTED_TEL[key]) {
    const tel = links.filter((l) => l.href.startsWith("tel:"));
    check(`[${key}] click-to-call links use the configured number`, tel.length >= 3 && tel.every((l) => l.href === EXPECTED_TEL[key]), `${tel.length} tel: links`);
  }
  const internal = [...new Set(links.filter((l) => /^(\.\.\/|demos\/)/.test(l.href)).map((l) => new URL(l.href.split("#")[0], ORIGIN + path).href))];
  for (const url of internal) {
    const status = await page.evaluate((u) => fetch(u).then((r) => r.status), url);
    check(`[${key}] link to ${url.replace(ORIGIN, "")} works`, status === 200, `HTTP ${status}`);
  }
  const axe = await runAxe(page);
  check(`[${key}] axe-core accessibility scan: 0 violations (phone)`, axe.length === 0, axe.join(" | "));
  await context.close();

  const desk = await openPage(path, { width: 1280, height: 800 });
  await scrollThrough(desk.page);
  const axeD = await runAxe(desk.page);
  check(`[${key}] axe-core accessibility scan: 0 violations (desktop)`, axeD.length === 0, axeD.join(" | "));
  await desk.context.close();
}

// ---------------------------------------------------------------------------
// 3a. Restaurant demo interactions on a phone
// ---------------------------------------------------------------------------
{
  const { page, context, problems } = await openPage(PAGES.restaurant, { width: 390, height: 844 }, { mobile: true });
  const toggle = page.locator("[data-nav-toggle]");
  const nav = page.locator("#site-nav");
  check("[restaurant] mobile nav starts closed", (await toggle.getAttribute("aria-expanded")) === "false" && !(await nav.isVisible()));
  await toggle.tap();
  check("[restaurant] tapping the menu button opens the nav", (await toggle.getAttribute("aria-expanded")) === "true" && (await nav.isVisible()));
  const box = await toggle.boundingBox();
  check("[restaurant] menu button is at least 44×44 px", box.width >= 44 && box.height >= 44, `${box.width}×${box.height}`);
  await page.locator(".site-nav__link", { hasText: "Visit" }).tap();
  await waitForScrollEnd(page);
  check("[restaurant] choosing a nav link closes the nav", (await toggle.getAttribute("aria-expanded")) === "false");
  const visitTop = await sectionTop(page, "visit");
  check("[restaurant] nav link scrolls to its section below the sticky header", visitTop >= 40 && visitTop < 140, `section top at ${Math.round(visitTop)}px`);
  await toggle.tap();
  await page.keyboard.press("Escape");
  check("[restaurant] Escape closes the nav and returns focus to the button",
    (await toggle.getAttribute("aria-expanded")) === "false" && (await page.evaluate(() => document.activeElement.hasAttribute("data-nav-toggle"))));

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.locator(".hero .btn", { hasText: "Explore Our Menu" }).tap();
  await waitForScrollEnd(page);
  const menuTop = await sectionTop(page, "menu");
  check("[restaurant] 'Explore Our Menu' scrolls to the menu", menuTop >= 40 && menuTop < 140, `menu top at ${Math.round(menuTop)}px`);

  const visibleGroups = () => page.$$eval(".menu-group", (gs) => gs.filter((g) => !g.hidden).map((g) => g.dataset.category));
  check("[restaurant] menu shows all 4 categories by default", (await visibleGroups()).length === 4);
  await page.locator(".filter-btn", { hasText: "Desserts" }).tap();
  const afterFilter = await visibleGroups();
  check("[restaurant] 'Desserts' filter shows only desserts", afterFilter.length === 1 && afterFilter[0] === "desserts", afterFilter.join(","));
  check("[restaurant] active filter is exposed with aria-pressed",
    (await page.locator(".filter-btn", { hasText: "Desserts" }).getAttribute("aria-pressed")) === "true");
  check("[restaurant] filter change is announced to screen readers", /Showing Desserts: 3 items/.test(await page.textContent("[data-menu-status]")));
  const filterBox = await page.locator(".filter-btn").first().boundingBox();
  check("[restaurant] filter buttons are at least 44 px tall", filterBox.height >= 44, `${filterBox.height}px`);
  await page.locator(".filter-btn", { hasText: "All" }).tap();
  check("[restaurant] 'All' filter restores every category", (await visibleGroups()).length === 4);

  const demoBtn = page.locator(".btn--demo", { hasText: "Reserve a table" });
  await demoBtn.scrollIntoViewIfNeeded();
  await demoBtn.tap();
  const explainer = page.locator("[data-demo-explainer]");
  check("[restaurant] demo buttons explain that links are configured per client",
    (await explainer.isVisible()) && /reservation page/.test(await explainer.textContent()));

  const barLinks = await page.locator(".mobile-actions a").evaluateAll((as) => as.map((a) => [a.querySelector("span").textContent.trim(), a.getBoundingClientRect().height]));
  check("[restaurant] phone bar has Menu / Call / Directions, each ≥ 44 px tall",
    barLinks.map((b) => b[0]).join(",") === "Menu,Call,Directions" && barLinks.every((b) => b[1] >= 44), JSON.stringify(barLinks));
  const end = await page.evaluate(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" });
    const last = document.querySelector(".agency") || document.querySelector(".site-footer");
    return { lastBottom: last.getBoundingClientRect().bottom, barTop: document.querySelector(".mobile-actions").getBoundingClientRect().top };
  });
  check("[restaurant] phone bar never covers the end of the page", end.lastBottom <= end.barTop + 1, JSON.stringify(end));
  const panel = await page.evaluate(() => ({
    logo: !!document.querySelector(".agency__brand img"),
    packages: document.querySelectorAll(".agency .package").length,
    inquire: document.querySelector('.agency a[href="../../#inquire"]') !== null,
  }));
  check("[restaurant] studio panel shows the logo, 3 packages and a link to the inquiry form", panel.logo && panel.packages === 3 && panel.inquire, JSON.stringify(panel));
  check("[restaurant] no console errors during interactions", problems.length === 0, problems.join(" | "));
  await page.screenshot({ path: fileURLToPath(new URL("restaurant-phone-end.png", OUT)) });
  await context.close();
}

// Keyboard-only use on desktop
{
  const { page, context } = await openPage(PAGES.restaurant, { width: 1280, height: 800 });
  await page.keyboard.press("Tab");
  check("[restaurant] first Tab reveals the 'Skip to main content' link",
    await page.evaluate(() => document.activeElement.classList.contains("skip-link") && document.activeElement.getBoundingClientRect().top >= 0));
  await page.keyboard.press("Enter");
  check("[restaurant] skip link moves focus to the main content", await page.evaluate(() => document.activeElement.id === "main"));
  await page.focus(".filter-btn[data-filter='drinks']");
  await page.keyboard.press("Enter");
  check("[restaurant] menu filters work with the keyboard", await page.evaluate(() => document.querySelectorAll(".menu-group:not([hidden])").length === 1));
  await context.close();
}

// ---------------------------------------------------------------------------
// 3b. Auto repair demo interactions on a phone
// ---------------------------------------------------------------------------
{
  const { page, context, problems } = await openPage(PAGES.auto, { width: 390, height: 844 }, { mobile: true });
  await page.locator(".hero .btn--primary", { hasText: "See services & prices" }).tap();
  await waitForScrollEnd(page);
  const top = await sectionTop(page, "services");
  check("[auto] 'See services & prices' scrolls to the price list", top >= 40 && top < 140, `section top at ${Math.round(top)}px`);
  const heroCall = await page.locator(".hero .btn--outline").getAttribute("href");
  check("[auto] second hero button calls the shop", heroCall === "tel:+12085550187", heroCall);
  await page.locator(".filter-btn", { hasText: "Brakes" }).tap();
  const shown = await page.$$eval(".menu-group", (gs) => gs.filter((g) => !g.hidden).map((g) => g.dataset.category));
  check("[auto] 'Brakes & Suspension' filter shows only that category", shown.join(",") === "brakes", shown.join(","));
  check("[auto] filter change is announced", /Showing Brakes & Suspension: 4 items/.test(await page.textContent("[data-menu-status]")));
  const sms = await page.locator("#book a", { hasText: "Text the shop" }).getAttribute("href");
  check("[auto] 'Text the shop' opens a text message to the shop", sms === "sms:+12085550187", sms);
  const book = page.locator(".btn--demo", { hasText: "Book an appointment" });
  await book.scrollIntoViewIfNeeded();
  await book.tap();
  check("[auto] demo booking button explains the real link", /booking page/.test(await page.textContent("[data-demo-explainer]")));
  const bar = await page.locator(".mobile-actions a span:first-of-type").allTextContents();
  check("[auto] phone bar shows Services / Call / Directions", bar.join(",") === "Services,Call,Directions", bar.join(","));
  const nav = await page.locator(".site-nav__link").allTextContents();
  check("[auto] navigation lists Services, About, Book, Visit", nav.join(",") === "Services,About,Book,Visit", nav.join(","));
  check("[auto] no console errors during interactions", problems.length === 0, problems.join(" | "));
  await context.close();
}

// ---------------------------------------------------------------------------
// 3c. Bright Site Tech website
// ---------------------------------------------------------------------------
{
  const { page, context, problems } = await openPage(PAGES.studio, { width: 390, height: 844 }, { mobile: true });
  check("[studio] sticky 'Get a quote' button hidden on the first screen", !(await page.locator("[data-sticky-cta]").evaluate((el) => el.classList.contains("is-visible"))));
  const btn = page.locator("[data-menu-btn]");
  await btn.tap();
  check("[studio] menu button opens the navigation", (await btn.getAttribute("aria-expanded")) === "true" && (await page.locator("[data-nav]").isVisible()));
  await page.locator(".nav__list a", { hasText: "Packages" }).tap();
  await waitForScrollEnd(page);
  check("[studio] nav link closes the menu and scrolls to Packages",
    (await btn.getAttribute("aria-expanded")) === "false" && Math.abs(await sectionTop(page, "packages")) < 140);
  const cfg = await page.evaluate(() => ({ prices: window.AGENCY_CONFIG.packages.map((p) => p.price), work: window.AGENCY_CONFIG.portfolio.length }));
  const prices = await page.locator(".pkg__amount").allTextContents();
  check("[studio] packages come from agency.config.js", prices.join(",") === cfg.prices.join(","), prices.join(", "));
  check("[studio] Starter ≤ $149 and Business ≤ $249", Number(prices[0].replace(/\D/g, "")) <= 149 && Number(prices[1].replace(/\D/g, "")) <= 249, prices.join(", "));
  check("[studio] every portfolio entry is shown", (await page.locator(".work-card").count()) === cfg.work);
  await page.evaluate(() => document.getElementById("industries").scrollIntoView());
  await page.waitForTimeout(400);
  check("[studio] sticky 'Get a quote' button appears after scrolling", await page.locator("[data-sticky-cta]").evaluate((el) => el.classList.contains("is-visible")));

  // Pre-fill from buttons
  await page.locator(".pkg a", { hasText: "Business Website" }).tap();
  check("[studio] 'Ask about Business Website' pre-selects that package", await page.locator('input[name="package"][value^="Business Website"]').isChecked());
  await page.locator(".work-card a", { hasText: "Ask about a site like this" }).nth(1).tap();
  check("[studio] 'Ask about a site like this' pre-selects the business type", (await page.locator("#f-type").inputValue()) === "Auto repair or mechanic");

  // Validation
  await page.locator("#f-type").selectOption("");
  await page.locator("[data-submit]").tap();
  const invalid = await page.$$eval('[aria-invalid="true"]', (els) => els.map((e) => e.id));
  check("[studio] empty form shows an error summary and marks fields invalid",
    (await page.locator("[data-error-summary]").isVisible()) && invalid.includes("f-name") && invalid.includes("f-business"), invalid.join(","));
  await page.fill("#f-name", "Jane Doe");
  await page.fill("#f-business", "Jane's Diner");
  await page.selectOption("#f-type", "Restaurant, café or bakery");
  await page.locator('input[value="Text message"]').check();
  await page.fill("#f-phone", "555");
  await page.locator("[data-submit]").tap();
  check("[studio] text-message replies require a valid phone number", (await page.getAttribute("#f-phone", "aria-invalid")) === "true");
  await page.fill("#f-phone", "(208) 555-0101");
  await page.locator("[data-submit]").tap();
  check("[studio] with no endpoint and no email set, the form says it isn't connected",
    /isn't connected/.test(await page.textContent("[data-form-status]")));
  check("[studio] no console errors", problems.length === 0, problems.join(" | "));
  await context.close();
}
{
  // Formspree-style endpoint configured
  let posted = null;
  const { page, context } = await openPage(PAGES.studio, { width: 390, height: 844 }, {
    mobile: true,
    agencyPatch: (src) => src.replace('endpoint: "",', 'endpoint: "https://forms.example.test/f/demo",'),
    routes: {
      "https://forms.example.test/**": async (route) => {
        posted = route.request().postData() || "";
        await route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' });
      },
    },
  });
  await page.fill("#f-name", "Jane Doe");
  await page.fill("#f-business", "Jane's Diner");
  await page.selectOption("#f-type", "Restaurant, café or bakery");
  await page.locator('input[value="Email"]').check();
  await page.fill("#f-email", "jane@example.com");
  await page.locator("[data-submit]").tap();
  await page.locator("[data-form-done]").waitFor({ state: "visible", timeout: 5000 }).catch(() => {});
  check("[studio] form posts to the configured endpoint", !!posted && posted.includes("Jane's Diner") && posted.includes("_subject"));
  check("[studio] success message thanks the visitor by name", /Thanks, Jane/.test(await page.textContent("[data-form-done]")));
  await context.close();
}
{
  // Email fallback configured
  const { page, context, problems } = await openPage(PAGES.studio, { width: 390, height: 844 }, {
    mobile: true,
    agencyPatch: (src) => src.replace('email: "",', 'email: "hello@example.com",'),
  });
  check("[studio] contact options show the configured email", (await page.locator(".contact-option").first().getAttribute("href")) === "mailto:hello@example.com");
  await page.fill("#f-name", "Jane Doe");
  await page.fill("#f-business", "Jane's Diner");
  await page.selectOption("#f-type", "Auto repair or mechanic");
  await page.locator('input[value="Phone call"]').check();
  await page.fill("#f-phone", "(208) 555-0101");
  await page.locator("[data-submit]").tap();
  await page.waitForTimeout(300);
  check("[studio] without an endpoint the form hands off to the email app", /press Send/.test(await page.textContent("[data-form-done]")));
  check("[studio] email hand-off causes no page errors", problems.filter((p) => !/mailto/.test(p)).length === 0, problems.join(" | "));
  await context.close();
}

// ---------------------------------------------------------------------------
// 4. Opening-hours logic (business time zone, wraps, overnight, split shifts)
// ---------------------------------------------------------------------------
{
  const { page, context } = await openPage(PAGES.restaurant, { width: 390, height: 844 }, { mobile: true, timezoneId: "Asia/Manila" });
  const cases = [
    ["2026-10-30T18:30:00-04:00", "Open now · Closes 10 PM"],
    ["2026-10-30T21:30:00-04:00", "Closing soon · Closes 10 PM"],
    ["2026-10-26T12:00:00-04:00", "Closed now · Opens tomorrow 11:30 AM"],
    ["2026-10-25T21:00:00-04:00", "Closed now · Opens Tue 11:30 AM"],
    ["2026-10-27T08:00:00-04:00", "Closed now · Opens 11:30 AM"],
  ];
  for (const [iso, expected] of cases) {
    const got = await page.evaluate((d) => {
      const s = window.RL.hours.status(window.SITE_CONFIG, new Date(d));
      return s.label + (s.detail ? " · " + s.detail : "");
    }, iso);
    check(`[restaurant] hours at ${iso} (viewer in Manila) → "${expected}"`, got === expected, got);
  }
  const special = await page.evaluate(() => {
    const cfg = structuredClone(window.SITE_CONFIG);
    cfg.hours.weekly.friday = [["18:00", "01:00"]];
    cfg.hours.weekly.saturday = [["11:30", "14:30"], ["17:00", "21:30"]];
    const fmt = (s) => s.label + " · " + s.detail;
    return [
      fmt(window.RL.hours.status(cfg, new Date("2026-10-31T00:10:00-04:00"))),
      fmt(window.RL.hours.status(cfg, new Date("2026-10-31T15:00:00-04:00"))),
      window.RL.hours.formatDay(cfg, "saturday"),
    ];
  });
  check("[engine] overnight hours: open at 12:10 AM after a 6 PM–1 AM Friday", special[0] === "Open now · Closes 1 AM", special[0]);
  check("[engine] split shift: closed between lunch and dinner", special[1] === "Closed now · Opens 5 PM", special[1]);
  check("[engine] split shift is displayed as two ranges", special[2] === "11:30 AM – 2:30 PM, 5 PM – 9:30 PM", special[2]);
  await context.close();
}
{
  const { page, context } = await openPage(PAGES.auto, { width: 390, height: 844 }, { mobile: true, timezoneId: "America/New_York" });
  const got = await page.evaluate(() =>
    ["2026-10-30T17:30:00-06:00", "2026-10-31T15:00:00-06:00", "2026-10-30T09:00:00-06:00"].map((d) => {
      const s = window.RL.hours.status(window.SITE_CONFIG, new Date(d));
      return s.label + " · " + s.detail;
    })
  );
  check("[auto] Boise time: 5:30 PM Friday → closing soon", got[0] === "Closing soon · Closes 6 PM", got[0]);
  check("[auto] Saturday after 2 PM → opens Monday", got[1] === "Closed now · Opens Mon 7:30 AM", got[1]);
  check("[auto] 9 AM Friday → open until 6 PM (viewer in New York)", got[2] === "Open now · Closes 6 PM", got[2]);
  await context.close();
}

// ---------------------------------------------------------------------------
// 5. Client mode: demoMode false removes every demo element
// ---------------------------------------------------------------------------
for (const [key, schema] of [["restaurant", "Restaurant"], ["auto", "AutoRepair"]]) {
  const patch = (src) => src.replace("demoMode: true", "demoMode: false");
  const { page, context, problems, requests } = await openPage(PAGES[key], { width: 390, height: 844 }, { mobile: true, configPatch: patch });
  const state = await page.evaluate(() => ({
    demo: document.querySelectorAll(".demo-tag, .demo-note, .demo-bar, .photo-credit, .btn--demo, #packages").length,
    jsonLd: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => JSON.parse(s.textContent)["@type"]),
    deadLinks: [...document.querySelectorAll(".site-nav__list a, .footer__nav a")].filter((a) => !document.getElementById(a.getAttribute("href").slice(1))).length,
  }));
  check(`[${key}] client mode: no demo labels, demo buttons, banner or studio panel`, state.demo === 0, JSON.stringify(state));
  check(`[${key}] client mode: never loads the studio's agency.config.js`, !requests.some((u) => u.includes("agency.config.js")));
  check(`[${key}] client mode: ${schema} structured data is added`, state.jsonLd.join() === schema, state.jsonLd.join());
  check(`[${key}] client mode: no navigation links to hidden sections`, state.deadLinks === 0);
  check(`[${key}] client mode: no console errors`, problems.length === 0, problems.join(" | "));
  await context.close();
}
{
  const patch = (src) =>
    src
      .replace("demoMode: true", "demoMode: false")
      .replace(/label: "Reserve a table",(\s*)url: ""/, 'label: "Reserve a table",$1url: "https://example.com/reserve"')
      .replace('{ label: "Uber Eats", url: ""', '{ label: "Uber Eats", url: "https://example.com/ubereats"')
      .replace('{ name: "Instagram", url: "" }', '{ name: "Instagram", url: "https://example.com/instagram" }');
  const { page, context } = await openPage(PAGES.restaurant, { width: 390, height: 844 }, { mobile: true, configPatch: patch });
  const state = await page.evaluate(() => ({
    reserve: document.querySelector('#order a[href="https://example.com/reserve"]')?.target,
    uber: !!document.querySelector('#order a[href="https://example.com/ubereats"]'),
    doordash: [...document.querySelectorAll("#order a, #order button")].some((b) => b.textContent.includes("DoorDash")),
    insta: !!document.querySelector('.site-footer a[href="https://example.com/instagram"]'),
  }));
  check("[restaurant] client mode: configured links become real buttons; empty ones are hidden",
    state.reserve === "_blank" && state.uber && !state.doordash && state.insta, JSON.stringify(state));
  await context.close();
}

// ---------------------------------------------------------------------------
// 6. Color contrast (WCAG AA needs ≥ 4.5:1 for text)
// ---------------------------------------------------------------------------
function lum(hex) {
  const n = hex.replace("#", "");
  const c = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return Math.round(((x + 0.05) / (y + 0.05)) * 100) / 100;
};
for (const key of ["restaurant", "auto"]) {
  const { page, context } = await openPage(PAGES[key], { width: 390, height: 844 }, { mobile: true });
  const t = await page.evaluate(() => window.SITE_CONFIG.theme);
  await context.close();
  const pairs = [
    ["text on background", t.text, t.background],
    ["muted text on background", t.mutedText, t.background],
    ["muted text on sand/alt sections", t.mutedText, t.surfaceAlt],
    ["primary on background", t.primary, t.background],
    ["accent on background", t.accent, t.background],
    ["accent on surface", t.accent, t.surface],
    ["light text on primary", t.onDark, t.primary],
    ["button text on button", t.onCta || t.onDark, t.cta || t.primary],
  ];
  for (const [name, fg, bg] of pairs) {
    const r = ratio(fg, bg);
    check(`[${key}] contrast: ${name} ≥ 4.5:1`, r >= 4.5, `${r}:1`);
  }
}
for (const [name, fg, bg] of [
  ["body text on white", "#1F2A3C", "#FFFFFF"],
  ["muted text on light grey", "#4A5568", "#F5F7FA"],
  ["navy text on amber buttons", "#0B1B33", "#FFB020"],
  ["amber labels on white", "#8A5200", "#FFFFFF"],
  ["light text on navy", "#C9D3E3", "#0B1B33"],
  ["amber on navy", "#FFB020", "#0B1B33"],
]) {
  const r = ratio(fg, bg);
  check(`[studio] contrast: ${name} ≥ 4.5:1`, r >= 4.5, `${r}:1`);
}

await browser.close();
server.close();

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
process.exitCode = failed.length ? 1 : 0;
