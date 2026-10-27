/* =============================================================================
   Design viewer — view.html?d=<design-id>
   Loads the design's industry content, builds the engine config with
   compose.js, then loads the template engine (engine/, a synced copy).
   ========================================================================== */
(function () {
  "use strict";

  var C = window.DESIGN_CATALOG;
  var ENGINE = [
    "core", "components/opening-hours", "components/demo-bar", "components/navigation",
    "components/hero", "components/menu", "components/about", "components/actions",
    "components/contact", "components/footer", "components/agency-panel",
    "components/mobile-actions", "main",
  ];

  var id = "";
  try {
    id = new URLSearchParams(window.location.search).get("d") || "";
  } catch (err) {}
  var design = C && C.find(id);

  if (design && design.featured) {
    window.location.replace(design.url);
    return;
  }
  if (!design) {
    notFound();
    return;
  }

  var style = C.styles[design.style];
  document.title = design.name + " — Sample " + C.noun(design.industry) + " design";

  var fonts = document.createElement("link");
  fonts.rel = "stylesheet";
  fonts.href = "https://fonts.googleapis.com/css2?" + style.fonts + "&display=swap";
  document.head.appendChild(fonts);

  // Some styles tell the story before the price list.
  if (style.layout.order === "about") {
    var menuSlot = document.querySelector('[data-component="menu"]');
    var aboutSlot = document.querySelector('[data-component="about"]');
    if (menuSlot && aboutSlot) menuSlot.parentNode.insertBefore(aboutSlot, menuSlot);
  }

  load("content/" + design.industry + ".js", function () {
    var pack = window.DESIGN_CONTENT && window.DESIGN_CONTENT[design.industry];
    if (!pack) return notFound();
    window.SITE_CONFIG = window.DESIGN_COMPOSE(design, pack);
    ENGINE.forEach(function (name) {
      load("engine/js/" + name + ".js");
    });
  });

  /* ---------------------------------------------------------------------- */

  function load(src, onload) {
    var script = document.createElement("script");
    script.src = src;
    script.async = false; // keeps the engine files in order
    if (onload) script.onload = onload;
    document.body.appendChild(script);
  }

  function notFound() {
    document.title = "Design not found — Bright Site Tech";
    var main = document.getElementById("main");
    if (!main) return;
    main.innerHTML =
      '<section class="section"><div class="container">' +
      "<h1>We couldn’t find that design.</h1>" +
      '<p>It may have been renamed. <a href="./">See all sample designs</a> or <a href="../#inquire">ask about your business</a>.</p>' +
      "</div></section>";
  }
})();
