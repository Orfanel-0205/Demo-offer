// Automated checks for the restaurant website (desktop computer only).
// Usage:  cd tools && npm install && node test-site.mjs
// Uses the Google Chrome already installed on the computer (no browser download).
// Screenshots are written to tools/output/ (ignored by git).
import { chromium } from "playwright-core";
import { readFile, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { startServer } from "./serve.mjs";

const require = createRequire(import.meta.url);
const AXE_SOURCE = await readFile(require.resolve("axe-core/axe.min.js"), "utf8");
const PORT = 8137;
const BASE = `http://localhost:${PORT}/`;
const OUT = new URL("./output/", import.meta.url);
await mkdir(OUT, { recursive: true });

const results = [];
const check = (name, ok, detail = "") => {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};

const server = await startServer(PORT);
const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || "chrome" });

async function openPage(viewport, { mobile = false, timezoneId, configPatch } = {}) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: mobile ? 2 : 1,
    isMobile: mobile,
    hasTouch: mobile,
    timezoneId,
  });
  const page = await context.newPage();
  const problems = [];
  page.on("console", (msg) => {
    if (["error", "warning"].includes(msg.type())) problems.push(`console.${msg.type()}: ${msg.text()}`);
  });
  page.on("pageerror", (err) => problems.push(`pageerror: ${err.message}`));
  page.on("requestfailed", (req) => problems.push(`request failed: ${req.url()}`));
  page.on("response", (res) => {
    if (res.status() >= 400) problems.push(`HTTP ${res.status()}: ${res.url()}`);
  });
  if (configPatch) {
    await page.route("**/config.js", async (route) => {
      const original = await (await route.fetch()).text();
      await route.fulfill({ contentType: "text/javascript", body: configPatch(original) });
    });
  }
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  return { page, context, problems };
}

async function scrollThrough(page) {
  // Trigger lazy images and scroll-reveal before screenshots/assertions.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 80));
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

for (const vp of VIEWPORTS) {
  const { page, context, problems } = await openPage({ width: vp.width, height: vp.height }, { mobile: vp.mobile });
  await scrollThrough(page);
  const overflow = await page.evaluate(() => {
    const docW = document.documentElement.clientWidth;
    const offenders = [];
    document.querySelectorAll("body *").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width && (r.right > docW + 1 || r.left < -1)) {
        // Elements inside an intentional horizontal scroller are fine.
        if (!el.closest(".gallery, .menu-filters")) offenders.push(`${el.tagName.toLowerCase()}.${el.className}`);
      }
    });
    return { scrollW: document.documentElement.scrollWidth, docW, offenders: offenders.slice(0, 5) };
  });
  check(`[${vp.name}] no horizontal page overflow`, overflow.scrollW <= overflow.docW && !overflow.offenders.length,
    `scrollWidth ${overflow.scrollW} / viewport ${overflow.docW}${overflow.offenders.length ? " — " + overflow.offenders.join(", ") : ""}`);
  check(`[${vp.name}] no console errors, warnings or broken requests`, problems.length === 0, problems.join(" | "));

  const imgs = await page.evaluate(() =>
    [...document.images].map((img) => ({ src: img.getAttribute("src"), ok: img.complete && img.naturalWidth > 0, alt: img.getAttribute("alt") }))
  );
  check(`[${vp.name}] all images loaded`, imgs.every((i) => i.ok), imgs.filter((i) => !i.ok).map((i) => i.src).join(", "));
  await page.screenshot({ path: fileURLToPath(new URL(`${vp.name}.png`, OUT)), fullPage: true });
  await context.close();
}

// ---------------------------------------------------------------------------
// 2. Content structure, links and accessibility (phone size)
// ---------------------------------------------------------------------------
{
  const { page, context } = await openPage({ width: 390, height: 844 }, { mobile: true });
  await scrollThrough(page);

  const headings = await page.evaluate(() => [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => Number(h.tagName[1])));
  const h1Count = headings.filter((l) => l === 1).length;
  let skipped = false;
  headings.reduce((prev, level) => {
    if (level > prev + 1) skipped = true;
    return level;
  }, 0);
  check("exactly one <h1>", h1Count === 1, `found ${h1Count}`);
  check("heading levels never skip (h2→h4 etc.)", !skipped, headings.join(" "));

  const imgs = await page.evaluate(() => [...document.images].map((i) => i.getAttribute("alt")));
  check("every image has descriptive alt text", imgs.every((a) => a && a.trim().length > 10), imgs.join(" | "));

  const links = await page.evaluate(() =>
    [...document.querySelectorAll("a")].map((a) => ({ href: a.getAttribute("href"), target: a.target, rel: a.rel, text: a.textContent.trim() }))
  );
  const badLinks = links.filter((l) => !l.href || l.href === "#" || /^javascript:/i.test(l.href));
  check("no empty, '#' or javascript: links", badLinks.length === 0, badLinks.map((l) => l.text).join(", "));
  const anchors = links.filter((l) => l.href.startsWith("#")).map((l) => l.href.slice(1));
  const missing = await page.evaluate((ids) => ids.filter((id) => !document.getElementById(id)), [...new Set(anchors)]);
  check("all in-page links point to existing sections", missing.length === 0, missing.join(", "));
  const external = links.filter((l) => /^https?:/.test(l.href));
  check("external links open safely in a new tab (rel=noopener)", external.every((l) => l.target === "_blank" && l.rel.includes("noopener")));
  const mapLinks = external.filter((l) => l.href.startsWith("https://www.google.com/maps/dir/?api=1&destination="));
  check("Directions buttons use the official Google Maps URL format", mapLinks.length >= 3, `${mapLinks.length} map links → ${mapLinks[0]?.href}`);
  const telLinks = links.filter((l) => l.href.startsWith("tel:"));
  check("click-to-call links use the configured number", telLinks.length >= 3 && telLinks.every((l) => l.href === "tel:+12075550142"), `${telLinks.length} tel: links`);
  const onlyKnownExternal = external.every((l) => l.href.startsWith("https://www.google.com/maps/"));
  check("demo contains no invented external URLs (only Google Maps directions)", onlyKnownExternal, external.map((l) => l.href).join(", "));

  await page.addScriptTag({ content: AXE_SOURCE });
  const axe = await page.evaluate(async () => {
    const r = await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] } });
    return r.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.length} node(s) — ${v.nodes.slice(0, 2).map((n) => n.target.join(" ")).join("; ")}`);
  });
  check("axe-core accessibility scan: 0 violations (phone)", axe.length === 0, axe.join(" | "));
  await context.close();
}

{
  const { page, context } = await openPage({ width: 1280, height: 800 });
  await scrollThrough(page);
  await page.addScriptTag({ content: AXE_SOURCE });
  const axe = await page.evaluate(async () => {
    const r = await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] } });
    return r.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.length} node(s) — ${v.nodes.slice(0, 2).map((n) => n.target.join(" ")).join("; ")}`);
  });
  check("axe-core accessibility scan: 0 violations (desktop)", axe.length === 0, axe.join(" | "));
  await context.close();
}

// ---------------------------------------------------------------------------
// 3. Interactions on a phone
// ---------------------------------------------------------------------------
{
  const { page, context, problems } = await openPage({ width: 390, height: 844 }, { mobile: true });
  const toggle = page.locator("[data-nav-toggle]");
  const nav = page.locator("#site-nav");

  check("mobile nav starts closed", (await toggle.getAttribute("aria-expanded")) === "false" && !(await nav.isVisible()));
  await toggle.tap();
  check("tapping the menu button opens the nav", (await toggle.getAttribute("aria-expanded")) === "true" && (await nav.isVisible()));
  const box = await toggle.boundingBox();
  check("menu button is at least 44×44 px", box.width >= 44 && box.height >= 44, `${box.width}×${box.height}`);
  await page.locator(".site-nav__link", { hasText: "Visit" }).tap();
  await waitForScrollEnd(page);
  check("choosing a nav link closes the nav", (await toggle.getAttribute("aria-expanded")) === "false");
  const visitTop = await page.evaluate(() => document.getElementById("visit").getBoundingClientRect().top);
  check("nav link scrolls to its section below the sticky header", visitTop >= 40 && visitTop < 140, `section top at ${Math.round(visitTop)}px`);

  await toggle.tap();
  await page.keyboard.press("Escape");
  check("Escape closes the nav and returns focus to the button",
    (await toggle.getAttribute("aria-expanded")) === "false" && (await page.evaluate(() => document.activeElement.hasAttribute("data-nav-toggle"))));

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.locator(".hero .btn", { hasText: "Explore Our Menu" }).tap();
  await waitForScrollEnd(page);
  const menuTop = await page.evaluate(() => document.getElementById("menu").getBoundingClientRect().top);
  check("'Explore Our Menu' scrolls to the menu", menuTop >= 40 && menuTop < 140, `menu top at ${Math.round(menuTop)}px`);

  const visibleGroups = () => page.$$eval(".menu-group", (gs) => gs.filter((g) => !g.hidden).map((g) => g.dataset.category));
  check("menu shows all 4 categories by default", (await visibleGroups()).length === 4);
  await page.locator(".filter-btn", { hasText: "Desserts" }).tap();
  const afterFilter = await visibleGroups();
  check("'Desserts' filter shows only desserts", afterFilter.length === 1 && afterFilter[0] === "desserts", afterFilter.join(","));
  check("active filter is announced via aria-pressed",
    (await page.locator(".filter-btn", { hasText: "Desserts" }).getAttribute("aria-pressed")) === "true" &&
    (await page.locator(".filter-btn", { hasText: "All" }).getAttribute("aria-pressed")) === "false");
  check("filter change is announced to screen readers", /Showing Desserts: 3 items/.test(await page.textContent("[data-menu-status]")));
  const filterBox = await page.locator(".filter-btn").first().boundingBox();
  check("filter buttons are at least 44 px tall", filterBox.height >= 44, `${filterBox.height}px`);
  await page.locator(".filter-btn", { hasText: "All" }).tap();
  check("'All' filter restores every category", (await visibleGroups()).length === 4);

  await page.locator(".btn--demo", { hasText: "Reserve a table" }).scrollIntoViewIfNeeded();
  await page.locator(".btn--demo", { hasText: "Reserve a table" }).tap();
  const explainer = page.locator("[data-demo-explainer]");
  check("demo ordering buttons explain that links are configured per client",
    (await explainer.isVisible()) && /reservation page/.test(await explainer.textContent()));

  const bar = page.locator(".mobile-actions");
  check("mobile quick-action bar is visible on phones", await bar.isVisible());
  const barLinks = await bar.locator("a").evaluateAll((as) => as.map((a) => [a.querySelector("span").textContent.trim(), a.getBoundingClientRect().height]));
  check("quick-action bar has Menu / Call / Directions, each ≥ 44 px tall",
    barLinks.map((b) => b[0]).join(",") === "Menu,Call,Directions" && barLinks.every((b) => b[1] >= 44), JSON.stringify(barLinks));

  const lastContent = await page.evaluate(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" });
    const footer = document.querySelector(".agency") || document.querySelector(".site-footer");
    const bar = document.querySelector(".mobile-actions").getBoundingClientRect();
    return { footerBottom: footer.getBoundingClientRect().bottom, barTop: bar.top };
  });
  check("quick-action bar never covers the end of the page", lastContent.footerBottom <= lastContent.barTop + 1, JSON.stringify(lastContent));
  check("no console errors during interactions", problems.length === 0, problems.join(" | "));
  await page.screenshot({ path: fileURLToPath(new URL("phone-nav-open.png", OUT)) });
  await context.close();
}

// Keyboard-only use on desktop
{
  const { page, context } = await openPage({ width: 1280, height: 800 });
  await page.keyboard.press("Tab");
  check("first Tab reveals the 'Skip to main content' link",
    await page.evaluate(() => document.activeElement.classList.contains("skip-link") && document.activeElement.getBoundingClientRect().top >= 0));
  await page.keyboard.press("Enter");
  check("skip link moves focus to the main content", await page.evaluate(() => document.activeElement.id === "main"));
  await page.focus(".filter-btn[data-filter='drinks']");
  await page.keyboard.press("Enter");
  check("menu filters work with the keyboard", await page.evaluate(() => document.querySelectorAll(".menu-group:not([hidden])").length === 1));
  await context.close();
}

// ---------------------------------------------------------------------------
// 4. Opening-hours logic (restaurant time zone, wraps, overnight, split shifts)
// ---------------------------------------------------------------------------
{
  const { page, context } = await openPage({ width: 390, height: 844 }, { mobile: true, timezoneId: "Asia/Manila" });
  const cases = [
    ["2026-10-30T18:30:00-04:00", "Open now · Closes 10 PM"],
    ["2026-10-30T21:30:00-04:00", "Closing soon · Closes 10 PM"],
    ["2026-10-26T12:00:00-04:00", "Closed now · Opens tomorrow 11:30 AM"],
    ["2026-10-25T21:00:00-04:00", "Closed now · Opens Tue 11:30 AM"],
    ["2026-10-27T08:00:00-04:00", "Closed now · Opens 11:30 AM"],
    ["2026-10-31T10:00:00-04:00", "Open now · Closes 10 PM"],
  ];
  for (const [iso, expected] of cases) {
    const got = await page.evaluate((d) => {
      const s = window.RL.hours.status(window.SITE_CONFIG, new Date(d));
      return s.label + (s.detail ? " · " + s.detail : "");
    }, iso);
    check(`hours status at ${iso} (viewer in Manila) → "${expected}"`, got === expected, got);
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
  check("overnight hours: Friday 6 PM–1 AM is open at 12:10 AM Saturday", special[0] === "Open now · Closes 1 AM", special[0]);
  check("split shift: closed between lunch and dinner", special[1] === "Closed now · Opens 5 PM", special[1]);
  check("split shift is displayed as two ranges", special[2] === "11:30 AM – 2:30 PM, 5 PM – 9:30 PM", special[2]);
  await context.close();
}

// ---------------------------------------------------------------------------
// 5. Client mode: demoMode false removes every demo element
// ---------------------------------------------------------------------------
{
  const patch = (src) => src.replace("demoMode: true", "demoMode: false");
  const { page, context, problems } = await openPage({ width: 390, height: 844 }, { mobile: true, configPatch: patch });
  const counts = await page.evaluate(() => ({
    demoTags: document.querySelectorAll(".demo-tag, .demo-note, .demo-bar, .photo-credit").length,
    packages: document.querySelectorAll("#packages").length,
    demoButtons: document.querySelectorAll(".btn--demo").length,
    orderSection: document.querySelectorAll("#order").length,
    jsonLd: document.querySelectorAll('script[type="application/ld+json"]').length,
    navOrder: [...document.querySelectorAll('a[href="#order"]')].length,
  }));
  check("client mode: no demo labels, banner or packages", counts.demoTags === 0 && counts.packages === 0, JSON.stringify(counts));
  check("client mode: unconfigured ordering buttons are hidden", counts.demoButtons === 0 && counts.orderSection === 0);
  check("client mode: Restaurant structured data (JSON-LD) is added", counts.jsonLd === 1);
  check("client mode: no console errors", problems.length === 0, problems.join(" | "));
  check("client mode: nav links to the hidden Order section are removed automatically", counts.navOrder === 0, `${counts.navOrder} link(s) left`);
  await context.close();
}
{
  const patch = (src) =>
    src
      .replace("demoMode: true", "demoMode: false")
      .replace(/label: "Reserve a table",(\s*)url: ""/, 'label: "Reserve a table",$1url: "https://example.com/reserve"')
      .replace('{ name: "Uber Eats", url: "" }', '{ name: "Uber Eats", url: "https://example.com/ubereats" }')
      .replace('{ name: "Instagram", url: "" }', '{ name: "Instagram", url: "https://example.com/instagram" }');
  const { page, context } = await openPage({ width: 390, height: 844 }, { mobile: true, configPatch: patch });
  const state = await page.evaluate(() => ({
    reserve: document.querySelector('#order a[href="https://example.com/reserve"]')?.target,
    uber: !!document.querySelector('#order a[href="https://example.com/ubereats"]'),
    doordash: [...document.querySelectorAll("#order a, #order button")].some((b) => b.textContent.includes("DoorDash")),
    order: [...document.querySelectorAll("#order a, #order button")].some((b) => b.textContent.includes("pickup")),
    insta: !!document.querySelector('.site-footer a[href="https://example.com/instagram"]'),
    facebook: !!document.querySelector('.site-footer a[href=""]'),
  }));
  check("client mode: configured links become real buttons; empty ones are hidden",
    state.reserve === "_blank" && state.uber && !state.doordash && !state.order, JSON.stringify(state));
  check("client mode: only configured social links appear", state.insta && !state.facebook);
  await context.close();
}

// ---------------------------------------------------------------------------
// 6. Theme contrast for the configured brand colors (WCAG AA)
// ---------------------------------------------------------------------------
{
  const { page, context } = await openPage({ width: 390, height: 844 }, { mobile: true });
  const pairs = await page.evaluate(() => {
    const t = window.SITE_CONFIG.theme;
    const lum = (hex) => {
      const n = hex.replace("#", "");
      const c = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
      return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
    };
    const ratio = (a, b) => {
      const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
      return (x + 0.05) / (y + 0.05);
    };
    return [
      ["text on background", ratio(t.text, t.background)],
      ["muted text on background", ratio(t.mutedText, t.background)],
      ["muted text on surface-alt", ratio(t.mutedText, t.surfaceAlt)],
      ["primary on background", ratio(t.primary, t.background)],
      ["accent on background", ratio(t.accent, t.background)],
      ["accent on surface", ratio(t.accent, t.surface)],
      ["on-dark text on primary", ratio(t.onDark, t.primary)],
    ].map(([n, r]) => [n, Math.round(r * 100) / 100]);
  });
  for (const [name, r] of pairs) check(`contrast: ${name} ≥ 4.5:1`, r >= 4.5, `${r}:1`);
  await context.close();
}

await browser.close();
server.close();

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
process.exitCode = failed.length ? 1 : 0;
