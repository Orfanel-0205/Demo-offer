/* =============================================================================
   Design gallery (designs/index.html) — "What business are you in?" finder,
   filters by group and the grid of design cards. Reads catalog.js.
   Links: ./?type=<industry> shows one industry, ./?group=<group> one group.
   ========================================================================== */
(function () {
  "use strict";

  var C = window.DESIGN_CATALOG;
  if (!C) return;

  var POPULAR = ["restaurant", "cafe", "hair-salon", "barber", "auto-repair", "plumbing", "cleaning", "dental"];

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function $(sel) {
    return document.querySelector(sel);
  }

  var grid = $("[data-grid]");
  var filters = $("[data-filters]");
  var quick = $("[data-finder-quick]");
  var finder = $("[data-finder]");
  var input = document.getElementById("finder-input");
  var title = $("[data-results-title]");
  var sub = $("[data-results-sub]");
  var empty = $("[data-empty]");

  Array.prototype.forEach.call(document.querySelectorAll("[data-design-count]"), function (el) {
    el.textContent = C.designs.length;
  });

  // A few previews beside the heading on larger screens (decorative).
  var art = $("[data-hero-art]");
  if (art) {
    art.innerHTML = ["ember-and-oak-steakhouse", "rose-and-thistle-hair-studio", "ironline-auto-repair", "greenway-lawn-care"]
      .map(C.find)
      .filter(Boolean)
      .map(function (d) { return '<img src="' + esc(d.thumb) + '" alt="" width="640" height="400" />'; })
      .join("");
  }

  /* ---------- Cards ---------------------------------------------------------- */
  function swatches(d) {
    var s = C.styles[d.style];
    if (!s) return "";
    var t = s.theme;
    return '<span class="g-card__swatches" aria-hidden="true">' +
      [t.background, t.primary, t.accent].map(function (c) { return '<i style="background:' + esc(c) + '"></i>'; }).join("") +
      "</span>";
  }

  function card(d) {
    var ind = C.industry(d.industry);
    var ask = "../?design=" + encodeURIComponent(d.id) + "#inquire";
    return (
      '<li class="g-card" data-industry="' + esc(d.industry) + '">' +
      '<a class="g-card__media" href="' + esc(d.url) + '" tabindex="-1" aria-hidden="true">' +
      '<img src="' + esc(d.thumb) + '" alt="" width="640" height="400" loading="lazy" decoding="async" />' +
      (d.featured ? '<span class="g-card__badge">Full sample</span>' : "") +
      "</a>" +
      '<div class="g-card__body">' +
      '<p class="g-card__meta">' + swatches(d) + esc(ind.label) + " &middot; " + esc(d.styleLabel) + "</p>" +
      '<h3 class="g-card__title"><a href="' + esc(d.url) + '">' + esc(d.name) + "</a></h3>" +
      '<p class="g-card__tagline">' + esc(d.tagline) + "</p>" +
      '<div class="g-card__actions">' +
      '<a class="btn btn--navy btn--sm" href="' + esc(d.url) + '">View design<span class="sr-only">: ' + esc(d.name) + "</span></a>" +
      '<a class="btn btn--outline btn--sm" href="' + esc(ask) + '">I like this one<span class="sr-only">: ' + esc(d.name) + "</span></a>" +
      "</div></div></li>"
    );
  }

  /* ---------- Filters -------------------------------------------------------- */
  var state = { group: "", industries: null, label: "" };

  filters.innerHTML = [""].concat(C.groups).map(function (g) {
    return '<button type="button" class="g-chip" data-group="' + esc(g) + '" aria-pressed="false">' + esc(g || "All designs") + "</button>";
  }).join("");

  quick.innerHTML = POPULAR.map(function (id) {
    var ind = C.industry(id);
    return ind ? '<button type="button" class="finder__chip" data-type="' + esc(id) + '">' + esc(ind.label) + "</button>" : "";
  }).join("");

  function render(focus) {
    var list = C.designs.filter(function (d) {
      if (state.industries) return state.industries.indexOf(d.industry) !== -1;
      if (state.group) return C.industry(d.industry).group === state.group;
      return true;
    });
    if (state.industries) {
      // Keep the visitor's best match first.
      list.sort(function (a, b) { return state.industries.indexOf(a.industry) - state.industries.indexOf(b.industry); });
    }
    grid.innerHTML = list.map(card).join("");
    empty.hidden = list.length > 0;

    Array.prototype.forEach.call(filters.querySelectorAll("[data-group]"), function (b) {
      b.setAttribute("aria-pressed", String(!state.industries && b.getAttribute("data-group") === state.group));
    });

    if (state.industries && list.length) {
      var best = C.industry(state.industries[0]);
      title.textContent = "You might like these";
      sub.innerHTML =
        esc(list.length + (list.length === 1 ? " design" : " designs") + " for " + (state.label || C.noun(best.id)) + ". ") +
        '<button type="button" class="link-btn" data-clear>Show all designs</button>';
    } else if (state.industries) {
      title.textContent = "No sample for that yet";
      sub.innerHTML = '<button type="button" class="link-btn" data-clear>Show all designs</button>';
    } else {
      title.textContent = state.group ? state.group : "All designs";
      sub.textContent = list.length + " designs" + (state.group ? "" : " for " + C.industries.length + " types of local business") + ".";
    }

    var params = state.industries && state.industries.length === 1 ? "?type=" + state.industries[0] : state.group ? "?group=" + encodeURIComponent(state.group) : "";
    try {
      history.replaceState(null, "", window.location.pathname + params);
    } catch (err) {}

    if (focus) {
      title.focus({ preventScroll: true });
      title.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    }
  }

  function showIndustry(id, focus) {
    var ind = C.industry(id);
    if (!ind) return;
    state = { group: "", industries: [id], label: C.noun(id) };
    render(focus);
  }

  finder.addEventListener("submit", function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text) {
      state = { group: "", industries: null, label: "" };
      return render(true);
    }
    var found = C.match(text).map(function (i) { return i.id; });
    state = { group: "", industries: found, label: found.length > 1 ? "“" + text + "”" : "" };
    render(true);
  });

  quick.addEventListener("click", function (e) {
    var b = e.target.closest("[data-type]");
    if (!b) return;
    input.value = b.textContent;
    showIndustry(b.getAttribute("data-type"), true);
  });

  filters.addEventListener("click", function (e) {
    var b = e.target.closest("[data-group]");
    if (!b) return;
    state = { group: b.getAttribute("data-group"), industries: null, label: "" };
    input.value = "";
    render(false);
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest("[data-clear]")) return;
    state = { group: "", industries: null, label: "" };
    input.value = "";
    render(true);
  });

  /* ---------- Start from the link (?type= / ?group=) ------------------------- */
  var params;
  try {
    params = new URLSearchParams(window.location.search);
  } catch (err) {
    params = { get: function () { return null; } };
  }
  var type = params.get("type");
  var group = params.get("group");
  if (type && C.industry(type)) {
    input.value = C.industry(type).label;
    showIndustry(type, false);
  } else {
    if (group && C.groups.indexOf(group) !== -1) state.group = group;
    render(false);
  }
})();
