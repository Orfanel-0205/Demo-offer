// Automated checks for the Bright Site Tech website and every demo (desktop computer only).
// Usage:  cd tools && npm install && node test-site.mjs
// Uses the Google Chrome already installed on the computer (no browser download).
// Screenshots are written to tools/output/ (ignored by git).
import { chromium } from "playwright-core";
import { readFile, readdir, mkdir, rm, stat } from "node:fs/promises";
import { execFile } from "node:child_process";
import vm from "node:vm";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { join, relative } from "node:path";
import { startServer } from "./serve.mjs";

const require = createRequire(import.meta.url);
const AXE_SOURCE = await readFile(require.resolve("axe-core/axe.min.js"), "utf8");
const JSQR_PATH = require.resolve("jsqr/dist/jsQR.js");
const PORT = 8137;
const ORIGIN = `http://localhost:${PORT}`;
const OUT = new URL("./output/", import.meta.url);
const ROOT = fileURLToPath(new URL("..", import.meta.url));
await mkdir(OUT, { recursive: true });

const PAGES = {
  studio: "/",
  restaurant: "/demos/restaurant/",
  auto: "/demos/auto-repair/",
  gallery: "/designs/",
  design: "/designs/view.html?d=ember-and-oak-steakhouse", // a dark design with a full-bleed hero
};

// The design catalog, read the same way the browser does.
const catalogBox = { window: {} };
vm.runInNewContext(await readFile(join(ROOT, "site", "designs", "catalog.js"), "utf8"), catalogBox);
const CATALOG = catalogBox.window.DESIGN_CATALOG;

const results = [];
const check = (name, ok, detail = "") => {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};

const server = await startServer(PORT);
const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || "chrome" });

// The WhatsApp link the pages should use (same rule as site.js: links as-is, numbers become wa.me links).
const whatsappLink = (value = "") =>
  /^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(value.trim()) ? value.trim() : value.replace(/\D/g, "") ? "https://wa.me/" + value.replace(/\D/g, "") : "";
// Config patches that replace a contact detail, whatever it's currently set to.
const setContact = (field, value) => (src) => src.replace(new RegExp(`${field}: "[^"]*"`), `${field}: "${value}"`);

async function openPage(path, viewport, { mobile = false, timezoneId, configPatch, agencyPatch, routes, teaser = false } = {}) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile, timezoneId });
  // The "What business are you in?" bubble pops up after a few seconds; it has its own tests (3e).
  if (!teaser) await context.addInitScript(() => sessionStorage.setItem("bst-teaser-closed", "1"));
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
  for (const demo of ["restaurant", "auto-repair", "designs"]) {
    const stale = [];
    const base = demo === "designs" ? join(ROOT, "site", "designs") : join(ROOT, "site", "demos", demo);
    for (const f of files) {
      const copy = join(base, "engine", relative(master, f));
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
          if (!el.closest(".gallery, .menu-filters, .g-filters, .g-hero__art, .hp, .skip-link, .sticky-cta, .hero__visual")) offenders.push(`${el.tagName.toLowerCase()}.${el.className}`);
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
  const wa = whatsappLink(await page.evaluate(() => window.AGENCY_CONFIG?.contact?.whatsapp || ""));
  check(`[${key}] no invented external URLs (only Google Maps directions and your WhatsApp link)`,
    external.every((l) => l.href.startsWith("https://www.google.com/maps/dir/?api=1&destination=") || (wa && l.href === wa)),
    external.map((l) => l.href).join(", "));
  if (EXPECTED_TEL[key]) {
    const tel = links.filter((l) => l.href.startsWith("tel:"));
    check(`[${key}] click-to-call links use the configured number`, tel.length >= 3 && tel.every((l) => l.href === EXPECTED_TEL[key]), `${tel.length} tel: links`);
  }
  const internal = [...new Set(links.filter((l) => /^(\.\.\/|\.\/|demos\/|designs\/)/.test(l.href)).map((l) => new URL(l.href.split("#")[0].split("?")[0], ORIGIN + path).href))]; // one check per page, not per ?design= link
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
    whatsapp: [...document.querySelectorAll(".agency a")].find((a) => a.textContent.includes("WhatsApp"))?.getAttribute("href") || "",
  }));
  check("[restaurant] studio panel shows the logo, 3 packages and a link to the inquiry form", panel.logo && panel.packages === 3 && panel.inquire, JSON.stringify(panel));
  const panelWa = whatsappLink(await page.evaluate(() => window.AGENCY_CONFIG.contact.whatsapp || ""));
  check("[restaurant] studio panel's WhatsApp button uses your WhatsApp link (when set)", panel.whatsapp === panelWa, panel.whatsapp || "(none)");
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
  // Email and WhatsApp cleared, so the end of this block can check the "isn't connected" message.
  const unset = (src) => setContact("whatsapp", "")(setContact("email", "")(src));
  const { page, context, problems } = await openPage(PAGES.studio, { width: 390, height: 844 }, { mobile: true, agencyPatch: unset });
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
    agencyPatch: setContact("email", "hello@example.com"),
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
{
  // WhatsApp: contact option, footer link, QR code (computers only) and the form's contact choice
  const { page, context, problems } = await openPage(PAGES.studio, { width: 1280, height: 800 });
  const wa = whatsappLink(await page.evaluate(() => window.AGENCY_CONFIG.contact.whatsapp || ""));
  if (wa) {
    const option = page.locator(".contact-option", { hasText: "WhatsApp" });
    check("[studio] WhatsApp contact option opens your WhatsApp link in a new tab",
      (await option.getAttribute("href")) === wa && (await option.getAttribute("target")) === "_blank");
    check("[studio] footer links to WhatsApp", (await page.locator(".footer__contact a", { hasText: "WhatsApp" }).getAttribute("href")) === wa);
    const qr = page.locator(".qr-card img");
    await qr.scrollIntoViewIfNeeded();
    check("[studio] WhatsApp QR code is shown on a computer", await qr.isVisible());
    await page.addScriptTag({ path: JSQR_PATH });
    const decoded = await qr.evaluate(async (img) => {
      const size = 400;
      const canvas = Object.assign(document.createElement("canvas"), { width: size, height: size });
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, size, size);
      await img.decode();
      ctx.drawImage(img, 0, 0, size, size);
      return window.jsQR(ctx.getImageData(0, 0, size, size).data, size, size)?.data || "";
    });
    check("[studio] QR code scans to your WhatsApp link", decoded === wa, decoded || "not readable");
  } else {
    check("[studio] no WhatsApp link set, so no WhatsApp button or QR code", (await page.locator(".contact-option, .qr-card", { hasText: "WhatsApp" }).count()) === 0);
  }
  check("[studio] no console errors (desktop)", problems.length === 0, problems.join(" | "));
  await context.close();

  const phone = await openPage(PAGES.studio, { width: 390, height: 844 }, { mobile: true });
  check("[studio] QR code is hidden on phones (they tap the WhatsApp button instead)", !(await phone.page.locator(".qr-card").isVisible()));
  await phone.page.fill("#f-name", "Jane Doe");
  await phone.page.fill("#f-business", "Jane's Diner");
  await phone.page.selectOption("#f-type", "Restaurant, café or bakery");
  await phone.page.locator('input[value="WhatsApp"]').check();
  await phone.page.locator("[data-submit]").tap();
  check("[studio] choosing WhatsApp as the reply method requires a phone number",
    (await phone.page.getAttribute("#f-phone", "aria-invalid")) === "true" && /WhatsApp number/.test(await phone.page.textContent("[data-phone-hint]")));
  await phone.context.close();
}

// ---------------------------------------------------------------------------
// 3d. Chat assistant on the Bright Site Tech website
// ---------------------------------------------------------------------------
{
  const { page, context, problems } = await openPage(PAGES.studio, { width: 390, height: 844 }, { mobile: true });
  const cfg = await page.evaluate(() => window.AGENCY_CONFIG);
  const wa = whatsappLink(cfg.contact.whatsapp);
  const launcher = page.locator("[data-assistant-launcher]");
  const panel = page.locator("#assistant");
  const lastBot = () => page.locator(".msg--bot:not(.msg--typing)").last();
  const botSays = (text) => page.locator(".msg--bot .msg__bubble", { hasText: text }).last().waitFor({ timeout: 3000 }).then(() => true, () => false);
  const askTyped = async (q) => {
    await page.fill("#assistant-input", q);
    await page.press("#assistant-input", "Enter");
  };

  const lb = await launcher.boundingBox();
  check("[assistant] 'Questions?' button is on screen and at least 44×44 px", (await launcher.isVisible()) && lb.width >= 44 && lb.height >= 44, `${lb.width}×${lb.height}`);
  await page.evaluate(() => document.getElementById("industries").scrollIntoView());
  await page.waitForTimeout(500);
  const overlap = await page.evaluate(() => {
    const a = document.querySelector("[data-assistant-launcher]").getBoundingClientRect();
    const b = document.querySelector("[data-sticky-cta]").getBoundingClientRect();
    return !(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top);
  });
  check("[assistant] button sits beside the sticky 'Get a quote' bar without overlapping it", !overlap);

  await launcher.tap();
  const box = await panel.boundingBox();
  check("[assistant] opens full-screen on phones", (await panel.isVisible()) && box.width === 390 && box.height >= 800, JSON.stringify(box));
  check("[assistant] focus moves into the chat and the page behind becomes inert",
    await page.evaluate(() => document.getElementById("assistant").contains(document.activeElement) && document.querySelector("main").inert === true));
  check("[assistant] greets the visitor and says it's automated",
    (await page.locator(".msg--bot .msg__bubble").first().textContent()) === cfg.assistant.greeting && /automated/i.test(await page.textContent(".assistant__note")));
  const chips = await page.locator(".assistant__chip").allTextContents();
  const chipBox = await page.locator(".assistant__chip").first().boundingBox();
  check("[assistant] suggests questions as buttons at least 44 px tall", chips.length >= 4 && chipBox.height >= 44, chips.join(" | "));

  await page.locator(".assistant__chip", { hasText: "What does a website cost?" }).tap();
  const prices = cfg.packages.map((p) => p.price);
  await botSays(prices[0]);
  const priceText = await lastBot().textContent();
  check("[assistant] price answer lists every package from agency.config.js", prices.every((p) => priceText.includes(p)), prices.join(", "));

  const starter = cfg.packages[0];
  for (const [question, expected] of [
    ["How long does it take?", "5 business days"],
    ["can customers book appointments online", "DoorDash"],
    ["do you work with plumbers", "You might like these plumbing designs"],
    ["what kinds of businesses do you work with", "We design websites for"],
    ["Is my site going to work on phones?", "built for phones first"],
    [`what's included in the ${starter.name.split(" ")[0].toLowerCase()} package`, starter.includes[0]],
    ["Where are you located?", "Philippines"],
    ["Will I rank first on google", "No one can honestly promise that"],
  ]) {
    await askTyped(question);
    check(`[assistant] "${question}" → answer mentions "${expected}"`, await botSays(expected));
  }

  await askTyped("Can you fix my printer?");
  const fell = await botSays("a person can help");
  const waBtn = lastBot().locator("a", { hasText: "WhatsApp" });
  const waHref = (await waBtn.count()) ? await waBtn.getAttribute("href") : "";
  check("[assistant] questions it can't answer go to a person (your WhatsApp link)", fell && waHref === wa, waHref || "(no WhatsApp button)");
  check("[assistant] …or by email, with the question filled in",
    !cfg.contact.email || /subject=.*body=Can%20you%20fix/.test((await lastBot().locator('a[href^="mailto:"]').getAttribute("href")) || ""));
  await lastBot().locator("[data-to-form]").tap();
  await waitForScrollEnd(page);
  const formState = await page.evaluate(() => ({
    open: !document.getElementById("assistant").hidden,
    message: document.getElementById("f-message").value,
    inert: document.querySelector("main").inert,
  }));
  check("[assistant] 'Add my question to the quote form' copies it into the form and closes the chat",
    !formState.open && formState.message.includes("fix my printer") && !formState.inert, JSON.stringify(formState));

  await launcher.tap();
  check("[assistant] reopening keeps the conversation", (await page.locator(".msg--user").count()) >= 8);
  await page.keyboard.press("Escape");
  check("[assistant] Escape closes the chat and returns focus to the button",
    !(await panel.isVisible()) && (await page.evaluate(() => document.activeElement.hasAttribute("data-assistant-launcher"))));

  const featured = cfg.packages.find((p) => p.featured) || cfg.packages[1];
  await launcher.tap();
  await askTyped(`What's in the ${featured.name}?`);
  await botSays(featured.includes[0]);
  await lastBot().locator("a", { hasText: `Ask about ${featured.name}` }).tap();
  await waitForScrollEnd(page);
  check(`[assistant] 'Ask about ${featured.name}' closes the chat and pre-selects it in the form`,
    !(await panel.isVisible()) && (await page.locator(`input[name="package"][value^="${featured.name}"]`).isChecked()));

  await launcher.tap();
  await page.locator(".assistant__chip").first().tap();
  await page.waitForTimeout(600);
  const axe = await runAxe(page);
  check("[assistant] axe-core accessibility scan with the chat open: 0 violations (phone)", axe.length === 0, axe.join(" | "));
  check("[assistant] no console errors", problems.length === 0, problems.join(" | "));
  await page.screenshot({ path: fileURLToPath(new URL("assistant-phone.png", OUT)) });
  await context.close();
}
{
  const { page, context } = await openPage(PAGES.studio, { width: 320, height: 640 }, { mobile: true });
  await page.locator("[data-assistant-launcher]").tap();
  await page.locator(".assistant__chip", { hasText: "Talk to a person" }).tap();
  await page.waitForTimeout(700);
  const cut = await page.evaluate(() => {
    const w = document.documentElement.clientWidth;
    return [...document.querySelectorAll("#assistant *")]
      .filter((el) => { const r = el.getBoundingClientRect(); return r.width && (r.right > w + 1 || r.left < -1); })
      .map((el) => `${el.tagName.toLowerCase()}.${el.className}`).slice(0, 5);
  });
  check("[assistant] nothing in the chat is cut off on a 320 px phone", cut.length === 0, cut.join(", "));
  await page.screenshot({ path: fileURLToPath(new URL("assistant-phone-320.png", OUT)) });
  await context.close();
}
{
  const { page, context, problems } = await openPage(PAGES.studio, { width: 1280, height: 800 });
  check("[assistant] desktop button shows the 'Questions?' label", await page.locator(".assistant-launcher__label").isVisible());
  await page.locator("[data-assistant-launcher]").click();
  const box = await page.locator("#assistant").boundingBox();
  check("[assistant] desktop chat opens as a side panel and the page stays usable",
    box.width <= 420 && box.x > 600 && !(await page.evaluate(() => document.querySelector("main").inert)), JSON.stringify(box));
  await page.locator(".assistant__chip", { hasText: "Show me designs for my business" }).click();
  await page.locator(".msg--bot .msg__bubble", { hasText: "What business are you in?" }).waitFor({ timeout: 3000 }).catch(() => {});
  check("[assistant] 'Show me designs' asks what business the visitor is in, with type-of-business buttons",
    (await page.locator(".msg--bot .msg__bubble", { hasText: "What business are you in?" }).count()) === 1 &&
      (await page.locator(".assistant__chip", { hasText: "Restaurant" }).count()) === 1);
  await page.fill("#assistant-input", "we're a small bakery");
  await page.press("#assistant-input", "Enter");
  await page.locator(".msg--bot .assistant__design").first().waitFor({ timeout: 3000 }).catch(() => {});
  const picks = await page.locator(".msg--bot").last().locator(".assistant__design").evaluateAll((a) => a.map((x) => x.getAttribute("href")));
  const bakeryIds = CATALOG.forIndustry("bakery").map((d) => "designs/" + d.url);
  check("[assistant] \"we're a small bakery\" → 3 bakery designs with previews", picks.length === 3 && picks.every((h) => bakeryIds.includes(h)), picks.join(", "));
  const statuses = await page.evaluate((hrefs) => Promise.all(hrefs.map((h) => fetch(h).then((r) => r.status))),
    [...picks, ...(await page.locator(".msg--bot").last().locator("img").evaluateAll((i) => i.map((x) => x.getAttribute("src"))))]);
  check("[assistant] design links and preview images all load", statuses.every((st) => st === 200), statuses.join(","));
  check("[assistant] 'See all' links to the bakery designs in the gallery",
    (await page.locator(".msg--bot").last().locator("a", { hasText: "See all" }).getAttribute("href")) === "designs/?type=bakery");
  await page.locator(".assistant__chip", { hasText: "What does a website cost?" }).click().catch(() => {});
  await page.locator("[data-assistant-launcher]").click();
  await page.locator("[data-assistant-launcher]").click();
  await page.locator(".msg--bot").last().waitFor();
  await page.fill("#assistant-input", "show me your designs");
  await page.press("#assistant-input", "Enter");
  await page.waitForTimeout(700);
  await page.fill("#assistant-input", "bowling alley");
  await page.press("#assistant-input", "Enter");
  check("[assistant] a business with no sample gets an honest answer and the gallery link",
    await page.locator(".msg--bot .msg__bubble", { hasText: "We don't have a sample for that business yet" }).last().waitFor({ timeout: 3000 }).then(() => true, () => false));
  const axe = await runAxe(page);
  check("[assistant] axe-core accessibility scan with the chat open: 0 violations (desktop)", axe.length === 0, axe.join(" | "));
  check("[assistant] no console errors (desktop)", problems.length === 0, problems.join(" | "));
  await page.screenshot({ path: fileURLToPath(new URL("assistant-desktop.png", OUT)) });
  await context.close();
}
{
  const { page, context } = await openPage(PAGES.studio, { width: 390, height: 844 }, { mobile: true, agencyPatch: (src) => src.replace("enabled: true", "enabled: false") });
  check("[assistant] enabled: false hides it completely", (await page.locator("[data-assistant-launcher], #assistant").count()) === 0);
  await context.close();
}

// ---------------------------------------------------------------------------
// 3e. "What business are you in?" bubble on the home page
// ---------------------------------------------------------------------------
{
  const fast = (src) => src.replace("teaser: true,", "teaser: true, teaserDelay: 300,");
  const { page, context, problems } = await openPage(PAGES.studio, { width: 390, height: 844 }, { mobile: true, teaser: true, agencyPatch: fast });
  const teaser = page.locator("[data-assistant-teaser]");
  const shown = await teaser.waitFor({ state: "visible", timeout: 3000 }).then(() => true, () => false);
  check("[bubble] 'What business are you in?' appears beside the chat button", shown && /What business are you in\?/.test(await teaser.textContent()));
  const chipBoxes = await teaser.locator("button").evaluateAll((b) => b.map((x) => x.getBoundingClientRect()).map((r) => Math.min(r.width, r.height)));
  check("[bubble] every button is at least 44 px", chipBoxes.every((h) => h >= 44), chipBoxes.join(","));
  const fits = await page.evaluate(() => {
    const t = document.querySelector("[data-assistant-teaser]").getBoundingClientRect();
    const l = document.querySelector("[data-assistant-launcher]").getBoundingClientRect();
    return t.left >= 0 && t.right <= innerWidth && t.bottom <= l.top;
  });
  check("[bubble] fits on a phone screen, above the chat button", fits);
  const axe = await runAxe(page);
  check("[bubble] axe-core accessibility scan with the bubble showing: 0 violations", axe.length === 0, axe.join(" | "));
  await page.screenshot({ path: fileURLToPath(new URL("bubble-phone.png", OUT)) });
  await teaser.locator("button", { hasText: "Restaurant" }).tap();
  await page.locator(".msg--bot .assistant__design").first().waitFor({ timeout: 3000 }).catch(() => {});
  check("[bubble] tapping 'Restaurant' opens the chat with 'You might like these' restaurant designs",
    (await page.locator("#assistant").isVisible()) && (await page.locator(".msg--bot .msg__bubble", { hasText: "You might like these restaurant designs" }).count()) === 1 &&
      (await page.locator(".msg--bot .assistant__design").count()) === 3 && !(await teaser.isVisible()));
  await page.screenshot({ path: fileURLToPath(new URL("bubble-chat-phone.png", OUT)) });
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  check("[bubble] doesn't come back after it was used (same visit)", !(await teaser.isVisible()));
  check("[bubble] no console errors", problems.length === 0, problems.join(" | "));
  await context.close();
}
{
  const fast = (src) => src.replace("teaser: true,", "teaser: true, teaserDelay: 300,");
  const { page, context } = await openPage(PAGES.studio, { width: 1280, height: 800 }, { teaser: true, agencyPatch: fast });
  const teaser = page.locator("[data-assistant-teaser]");
  await teaser.waitFor({ state: "visible", timeout: 3000 }).catch(() => {});
  await teaser.locator("[data-teaser-close]").click();
  check("[bubble] the × button dismisses it and focus goes to the chat button",
    !(await teaser.isVisible()) && (await page.evaluate(() => document.activeElement.hasAttribute("data-assistant-launcher"))));
  await context.close();
  const off = await openPage(PAGES.studio, { width: 1280, height: 800 }, { teaser: true, agencyPatch: (src) => src.replace("teaser: true,", "teaser: false, teaserDelay: 300,") });
  await off.page.waitForTimeout(900);
  check("[bubble] teaser: false turns it off", (await off.page.locator("[data-assistant-teaser]").count()) === 0);
  await off.context.close();
}

// ---------------------------------------------------------------------------
// 3f. Design gallery and the 100+ sample designs
// ---------------------------------------------------------------------------
{
  const designs = CATALOG.designs;
  const ids = designs.map((d) => d.id);
  check(`[designs] the catalog has over 100 designs`, designs.length > 100, `${designs.length} designs, ${CATALOG.industries.length} types of business`);
  check("[designs] every design has a unique id", new Set(ids).size === ids.length);
  const broken = designs.filter((d) => !d.featured && (!CATALOG.styles[d.style] || !d.place || !d.tagline)).map((d) => d.id);
  check("[designs] every design has a style, a city and a tagline", broken.length === 0, broken.join(", "));
  const missingContent = [];
  for (const ind of CATALOG.industries) {
    const ok = await stat(join(ROOT, "site", "designs", "content", ind.id + ".js")).then(() => true, () => false);
    if (!ok) missingContent.push(ind.id);
  }
  check("[designs] every type of business has a content file", missingContent.length === 0, missingContent.join(", "));
  const thumbs = [];
  for (const d of designs.filter((x) => !x.featured)) {
    if (!(await stat(join(ROOT, "site", "designs", d.thumb)).then(() => true, () => false))) thumbs.push(d.id);
  }
  check("[designs] every design has a gallery thumbnail (tools/capture-designs.mjs)", thumbs.length === 0, thumbs.join(", "));

  // Every design renders on a phone: no errors, all photos load, nothing wider than the screen, 0 axe violations.
  const failures = { errors: [], images: [], overflow: [], links: [], axe: [] };
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  let current = "";
  page.on("pageerror", (e) => failures.errors.push(`${current}: ${e.message}`));
  page.on("console", (m) => { if (["error", "warning"].includes(m.type())) failures.errors.push(`${current}: ${m.text()}`); });
  page.on("response", (r) => { if (r.status() >= 400) failures.errors.push(`${current}: HTTP ${r.status()} ${r.url()}`); });
  await page.addInitScript({ content: AXE_SOURCE });
  for (const d of designs.filter((x) => !x.featured)) {
    current = d.id;
    await page.goto(`${ORIGIN}/designs/${d.url}`, { waitUntil: "networkidle" });
    await page.waitForSelector(".site-footer", { timeout: 10000 }).catch(() => failures.errors.push(`${d.id}: page did not finish rendering`));
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); }
    });
    await page.waitForLoadState("networkidle");
    const r = await page.evaluate(async () => {
      // Lazy photos further down may still be on their way; load them all, then check.
      await Promise.all([...document.images].map((i) => { i.loading = "eager"; return i.decode().catch(() => {}); }));
      const badImgs = [...document.images].filter((i) => !(i.complete && i.naturalWidth > 0)).map((i) => i.getAttribute("src"));
      const docW = document.documentElement.clientWidth;
      const wide = [...document.querySelectorAll("body *")].filter((el) => {
        const b = el.getBoundingClientRect();
        return b.width && (b.right > docW + 1 || b.left < -1) && !el.closest(".gallery, .menu-filters, .skip-link");
      }).length;
      const missing = [...document.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute("href").slice(1)).filter((id) => id && !document.getElementById(id));
      const axeRun = await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] } });
      return { badImgs, wide, missing, axe: axeRun.violations.map((v) => `${v.id} (${v.nodes.length})`) };
    });
    if (r.badImgs.length) failures.images.push(`${d.id}: ${r.badImgs.join(", ")}`);
    if (r.wide) failures.overflow.push(`${d.id}: ${r.wide} element(s)`);
    if (r.missing.length) failures.links.push(`${d.id}: #${r.missing.join(", #")}`);
    if (r.axe.length) failures.axe.push(`${d.id}: ${r.axe.join(", ")}`);
  }
  const n = designs.filter((x) => !x.featured).length;
  check(`[designs] all ${n} designs render with no console errors or broken requests`, failures.errors.length === 0, failures.errors.slice(0, 5).join(" | "));
  check(`[designs] all ${n} designs load every photo`, failures.images.length === 0, failures.images.slice(0, 5).join(" | "));
  check(`[designs] no design is wider than a 390 px phone`, failures.overflow.length === 0, failures.overflow.slice(0, 5).join(" | "));
  check(`[designs] every in-page link in every design points to a section`, failures.links.length === 0, failures.links.slice(0, 5).join(" | "));
  check(`[designs] axe-core accessibility scan: 0 violations in all ${n} designs`, failures.axe.length === 0, failures.axe.slice(0, 8).join(" | "));
  await context.close();
}
{
  const { page, context, problems } = await openPage(PAGES.gallery, { width: 390, height: 844 }, { mobile: true });
  const total = CATALOG.designs.length;
  check("[gallery] shows every design, and the heading says how many", (await page.locator(".g-card").count()) === total && (await page.textContent("h1")).includes(String(total)));
  await page.fill("#finder-input", "I own a taco truck");
  await page.press("#finder-input", "Enter");
  await page.waitForTimeout(400);
  const tacoCards = await page.locator(".g-card").evaluateAll((c) => c.map((x) => x.getAttribute("data-industry")));
  check("[gallery] 'What business are you in?' → \"I own a taco truck\" shows only Mexican restaurant designs",
    tacoCards.length === CATALOG.forIndustry("taqueria").length && tacoCards.every((i) => i === "taqueria") && (await page.textContent("[data-results-title]")) === "You might like these",
    tacoCards.join(","));
  check("[gallery] the address bar remembers the choice (?type=)", page.url().endsWith("/designs/?type=taqueria"));
  await page.locator(".link-btn[data-clear]").tap();
  await page.locator(".g-chip", { hasText: "Home services" }).tap();
  const home = await page.locator(".g-card").evaluateAll((c) => c.map((x) => x.getAttribute("data-industry")));
  check("[gallery] 'Home services' filter shows only home-service designs",
    home.length > 0 && home.every((i) => CATALOG.industry(i).group === "Home services"), `${home.length} cards`);
  await page.fill("#finder-input", "bowling alley");
  await page.press("#finder-input", "Enter");
  await page.waitForTimeout(300);
  check("[gallery] a business with no sample shows a helpful message and the quote link",
    (await page.locator(".g-card").count()) === 0 && (await page.locator("[data-empty]").isVisible()));
  check("[gallery] no console errors", problems.length === 0, problems.join(" | "));
  await page.screenshot({ path: fileURLToPath(new URL("gallery-phone.png", OUT)) });
  await context.close();

  const typed = await openPage("/designs/?type=bakery", { width: 1280, height: 800 });
  const bakery = await typed.page.locator(".g-card").evaluateAll((c) => c.map((x) => x.getAttribute("data-industry")));
  check("[gallery] a ?type= link (from a design's 'More … designs') opens that business type",
    bakery.length === CATALOG.forIndustry("bakery").length && bakery.every((i) => i === "bakery") && (await typed.page.inputValue("#finder-input")) === "Bakery");
  await typed.page.screenshot({ path: fileURLToPath(new URL("gallery-desktop.png", OUT)) });
  const first = typed.page.locator(".g-card").first();
  const like = await first.locator("a", { hasText: "I like this one" }).getAttribute("href");
  const id = new URLSearchParams(like.split("?")[1].split("#")[0]).get("design");
  await typed.page.goto(new URL(like, typed.page.url()).href, { waitUntil: "networkidle" });
  const chosen = CATALOG.find(id);
  check("[gallery] 'I like this one' opens the quote form with the design and business type filled in",
    (await typed.page.inputValue("#f-message")).includes(chosen.name) && (await typed.page.inputValue("#f-type")) === CATALOG.industry(chosen.industry).form,
    await typed.page.inputValue("#f-message"));
  await typed.context.close();
}
{
  const d = CATALOG.find("ember-and-oak-steakhouse");
  const { page, context, problems } = await openPage(PAGES.design, { width: 390, height: 844 }, { mobile: true });
  check("[design] page title and heading use the design's fictional business",
    (await page.title()).startsWith(d.name) && (await page.textContent("h1")) === d.name);
  check("[design] demo banner says it's a fictional sample", /fictional/i.test(await page.textContent(".demo-bar")));
  check("[design] banner links back to more designs of the same type", (await page.getAttribute(".demo-bar__back", "href")) === "./?type=restaurant");
  check("[design] studio panel asks about this exact design",
    (await page.getAttribute(".agency__btn--primary", "href")) === "../?design=ember-and-oak-steakhouse#inquire" &&
      (await page.getAttribute(".agency__btn >> text=More sample designs", "href")) === "./");
  check("[design] phone numbers are 555-01xx fictional numbers", (await page.locator('a[href^="tel:"]').evaluateAll((a) => a.every((x) => /55501\d\d$/.test(x.getAttribute("href"))))));
  check("[design] no console errors", problems.length === 0, problems.join(" | "));
  await context.close();

  const missing = await openPage("/designs/view.html?d=no-such-design", { width: 390, height: 844 }, { mobile: true });
  check("[design] an unknown design shows a friendly message with a link to the gallery",
    /couldn’t find that design/.test(await missing.page.textContent("main")) && (await missing.page.locator('main a[href="./"]').count()) === 1);
  await missing.context.close();
  const featured = await openPage("/designs/view.html?d=harbor-hearth-kitchen", { width: 390, height: 844 }, { mobile: true });
  check("[design] the two full samples open their own pages", featured.page.url().endsWith("/demos/restaurant/"));
  await featured.context.close();
}
{
  // tools/export-design.mjs turns a gallery design into an editable website folder.
  const folder = "zz-test-export";
  const target = join(ROOT, "site", "demos", folder);
  await rm(target, { recursive: true, force: true });
  const run = (args) => new Promise((resolve) => execFile(process.execPath, [fileURLToPath(new URL("./export-design.mjs", import.meta.url)), ...args], (err, stdout, stderr) => resolve({ code: err ? err.code : 0, out: stdout + stderr })));
  const made = await run(["sugar-and-spoon-bakeshop", folder]);
  const files = await readdir(target).catch(() => []);
  check("[export] export-design.mjs creates index.html, config.js, images/ and engine/",
    made.code === 0 && ["index.html", "config.js", "images", "engine", "favicon.svg"].every((f) => files.includes(f)), made.out.trim().split("\n")[0]);
  const again = await run(["sugar-and-spoon-bakeshop", folder]);
  check("[export] it won't overwrite an existing folder without --force", again.code !== 0 && /already exists/.test(again.out));
  const { page, context, problems } = await openPage(`/demos/${folder}/`, { width: 390, height: 844 }, { mobile: true });
  await scrollThrough(page);
  const imgsOk = await page.evaluate(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0));
  check("[export] the exported site works on its own: same business, photos load, no errors",
    (await page.textContent("h1")) === "Sugar & Spoon Bakeshop" && imgsOk && problems.length === 0, problems.join(" | "));
  const cfgText = await readFile(join(target, "config.js"), "utf8");
  check("[export] config.js is plain and editable (no gallery paths left)", !/photos\/|\.\.\/demos\//.test(cfgText) && /demoMode: true/.test(cfgText));
  await context.close();
  await rm(target, { recursive: true, force: true });
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
for (const [id, style] of Object.entries(CATALOG.styles)) {
  const t = style.theme;
  const low = [
    ["text", t.text, t.background], ["text on cards", t.text, t.surface],
    ["muted", t.mutedText, t.background], ["muted on cards", t.mutedText, t.surface], ["muted on alt sections", t.mutedText, t.surfaceAlt],
    ["headings", t.primary, t.background], ["headings on cards", t.primary, t.surface],
    ["prices/labels", t.accent, t.background], ["prices on cards", t.accent, t.surface],
    ["buttons", t.onCta, t.cta], ["on primary", t.onDark, t.primary], ["footer", t.onFooter || t.onDark, t.footer || t.primary],
  ].map(([name, fg, bg]) => [name, ratio(fg, bg)]).filter(([, r]) => r < 4.5);
  check(`[designs] contrast: '${style.label}' style colors all ≥ 4.5:1`, low.length === 0, low.map(([n, r]) => `${n} ${r}:1`).join(", "));
}

await browser.close();
server.close();

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
process.exitCode = failed.length ? 1 : 0;
