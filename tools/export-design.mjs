// Turns one gallery design into a complete, editable website folder, just
// like the two original samples: site/demos/<folder>/ with index.html,
// config.js (everything about the business), images/ and engine/.
//
// Usage (from tools/):  node export-design.mjs <design-id> [folder-name] [--force]
//   design-id:   the end of the design's link, e.g. view.html?d=golden-crumb-bakery
//   folder-name: defaults to the design id; use the client's name, e.g. marias-bakery
//   --force:     replace the folder if it already exists
//
// Then edit site/demos/<folder>/config.js with the client's details and swap the
// photos in images/ (see docs/03-customize-for-a-client.md).
import { readFile, writeFile, mkdir, cp, rm, stat } from "node:fs/promises";
import { join, dirname, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = fileURLToPath(new URL("..", import.meta.url));
const site = join(root, "site");
const designsDir = join(site, "designs");

const args = process.argv.slice(2);
const force = args.includes("--force");
const [id, folderArg] = args.filter((a) => !a.startsWith("--"));
if (!id) {
  console.error("Usage: node export-design.mjs <design-id> [folder-name] [--force]");
  process.exit(1);
}
const folder = (folderArg || id).toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "");
const out = join(site, "demos", folder);

// Load the catalog, the industry's content and compose.js exactly as the browser does.
const sandbox = { window: {} };
vm.createContext(sandbox);
const run = async (file) => vm.runInContext(await readFile(join(designsDir, file), "utf8"), sandbox, { filename: file });
await run("catalog.js");
const C = sandbox.window.DESIGN_CATALOG;
const design = C.find(id);
if (!design) {
  console.error(`No design called "${id}". Open it in the gallery and copy the part after "?d=" from the address bar.`);
  process.exit(1);
}
if (design.featured) {
  console.error(`"${id}" is already a full sample in ${design.url.replace("../", "site/")} — copy that folder instead.`);
  process.exit(1);
}
if (await stat(out).then(() => true, () => false)) {
  if (!force) {
    console.error(`site/demos/${folder} already exists. Pick another folder name or add --force to replace it.`);
    process.exit(1);
  }
  await rm(out, { recursive: true });
}
await run(`content/${design.industry}.js`);
await run("compose.js");
const style = C.styles[design.style];
const config = JSON.parse(JSON.stringify(sandbox.window.DESIGN_COMPOSE(design, sandbox.window.DESIGN_CONTENT[design.industry])));

/* ---------- Photos: copy into images/ with plain names ---------------------- */
await mkdir(join(out, "images"), { recursive: true });
const copyImage = async (src, name) => {
  const from = join(designsDir, src);
  const file = name + extname(src);
  await cp(from, join(out, "images", file));
  return "images/" + file;
};
const img = config.images;
img.hero.src = await copyImage(img.hero.src, "hero-1600");
img.hero.srcSmall = await copyImage(img.hero.srcSmall, "hero-900");
img.about.src = await copyImage(img.about.src, "about");
for (const [i, g] of img.gallery.entries()) g.src = await copyImage(g.src, `gallery-${i + 1}`);

/* ---------- Settings that change once the design lives in site/demos/ ------- */
delete config.demoBackLink;
config.demoAgency = {
  configUrl: "../../agency.config.js",
  siteUrl: "../../",
  logo: "../../assets/brand/logo.svg",
};
config.meta.ogImage = img.hero.src;

/* ---------- config.js in the same friendly format as the samples ----------- */
function toJs(value, indent = "") {
  const next = indent + "  ";
  if (Array.isArray(value)) {
    if (!value.length) return "[]";
    if (value.every((v) => typeof v !== "object" || v === null)) return "[" + value.map((v) => toJs(v)).join(", ") + "]";
    return "[\n" + value.map((v) => next + toJs(v, next) + ",").join("\n") + "\n" + indent + "]";
  }
  if (value && typeof value === "object") {
    const keys = Object.keys(value);
    if (!keys.length) return "{}";
    return "{\n" + keys.map((k) => next + (/^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)) + ": " + toJs(value[k], next) + ",").join("\n") + "\n" + indent + "}";
  }
  return JSON.stringify(value);
}

const configJs = `/* =============================================================================
   BUSINESS CONFIGURATION — made from the gallery design "${design.name}"
   (${C.industry(design.industry).label}, ${style.label} style) with tools/export-design.mjs.
   -----------------------------------------------------------------------------
   This is the ONLY file you normally edit to turn this design into a client's
   website. Everything below is fictional sample content until you replace it.

   • Change only the text between quotes "like this". Keep the quotes and the
     comma at the end of each line.
   • Leave a link as "" if the business doesn't have it yet.
   • Replace the photos in images/ with the client's own (same file names).
   • When the content is real: demoMode: false and delete the demoAgency block
     (docs/03-customize-for-a-client.md).
   ========================================================================== */

window.SITE_CONFIG = ${toJs(config)};
`;
await writeFile(join(out, "config.js"), configJs);

/* ---------- index.html ------------------------------------------------------ */
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const sections = style.layout.order === "about" ? ["hero", "about", "menu", "actions", "contact"] : ["hero", "menu", "about", "actions", "contact"];
const scripts = ["core", "components/opening-hours", "components/demo-bar", "components/navigation", "components/hero", "components/menu",
  "components/about", "components/actions", "components/contact", "components/footer", "components/agency-panel", "components/mobile-actions", "main"];
const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />

    <!-- SEO / SHARING: config.js updates the title and description when the page
         loads, but link previews (Facebook, iMessage, WhatsApp) read these tags,
         so edit them to match the client's business too. -->
    <title>${esc(config.meta.title)}</title>
    <meta name="description" content="${esc(config.meta.description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${esc(config.meta.title)}" />
    <meta property="og:description" content="${esc(config.meta.description)}" />
    <!-- Use the full address once the site is live, e.g. https://www.yourshop.com/images/hero-1600.webp -->
    <meta property="og:image" content="${esc(img.hero.src)}" />
    <meta name="twitter:card" content="summary_large_image" />

    <!-- DEMO ONLY: keeps the sample out of search results.
         DELETE this line when you launch the client's real website. -->
    <meta name="robots" content="noindex, nofollow" />

    <meta name="theme-color" content="${esc(style.theme.background)}" />
    <link rel="icon" href="favicon.svg" type="image/svg+xml" />

    <!-- Fonts: ${esc(style.theme.fontDisplay)} (headings) + ${esc(style.theme.fontBody)} (text), free from Google Fonts.
         If you change fontDisplay/fontBody in config.js, change this link too. -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?${esc(style.fonts)}&amp;display=swap" />
    <link rel="stylesheet" href="engine/css/styles.css" />
  </head>

  <body>
    <a class="skip-link" href="#main">Skip to main content</a>

    <!-- Each placeholder is filled in by a component in engine/js/components/.
         Reorder or delete placeholders to change which sections appear. -->
    <div data-component="demoBar"></div>
    <div data-component="navigation"></div>

    <main id="main" tabindex="-1">
${sections.map((s) => `      <div data-component="${s}"></div>`).join("\n")}
    </main>

    <div data-component="footer"></div>
    <div data-component="agencyPanel"></div>
    <div data-component="mobileActions"></div>

    <noscript>
      <p class="config-error">This website needs JavaScript turned on to show services, opening hours and contact details.</p>
    </noscript>

    <!-- 1. Content: edit config.js -->
    <script src="config.js"></script>
    <!-- 2. Template engine (shared by every site; no need to edit) -->
${scripts.map((s) => `    <script src="engine/js/${s}.js"></script>`).join("\n")}
  </body>
</html>
`;
await writeFile(join(out, "index.html"), html);

// A simple letter icon in the design's colors.
const letter = esc(design.name.charAt(0).toUpperCase());
await writeFile(
  join(out, "favicon.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <!-- Letter mark. Replace with the client's logo, or change the colors and letter. -->
  <rect width="64" height="64" rx="12" fill="${esc(style.theme.cta || style.theme.primary)}"/>
  <text x="32" y="44" text-anchor="middle" font-family="Georgia, serif" font-size="36" font-weight="700" fill="${esc(style.theme.onCta || "#FFFFFF")}">${letter}</text>
</svg>
`
);

// The template engine (the same copy every demo carries; refresh with sync-engine.mjs).
await cp(join(root, "engine"), join(out, "engine"), { recursive: true });

console.log(`✓ ${design.name} → site/demos/${folder}/`);
console.log(`  Preview: node serve.mjs, then open http://localhost:8080/demos/${folder}/`);
console.log(`  Next: edit site/demos/${folder}/config.js and replace the photos in images/.`);
