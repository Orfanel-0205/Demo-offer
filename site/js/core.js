/* =============================================================================
   Core helpers shared by every component.
   You should not need to edit this file when customizing for a client.
   ========================================================================== */
(function () {
  "use strict";

  var RL = (window.RL = window.RL || {});
  RL.components = RL.components || {};

  /* ---------- Safe HTML templating ------------------------------------------
     html`<p>${text}</p>` escapes every inserted value automatically, so text
     from config.js can never break the page. Nested html`` results and arrays
     of them are inserted as-is. */
  function SafeHTML(value) {
    this.value = value;
  }
  SafeHTML.prototype.toString = function () {
    return this.value;
  };

  var ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

  RL.escape = function (value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return ESCAPES[ch];
    });
  };

  function stringify(value) {
    if (value === null || value === undefined || value === false) return "";
    if (Array.isArray(value)) return value.map(stringify).join("");
    if (value instanceof SafeHTML) return value.value;
    return RL.escape(value);
  }

  RL.html = function (strings) {
    var out = strings[0];
    for (var i = 1; i < strings.length; i++) {
      out += stringify(arguments[i]) + strings[i];
    }
    return new SafeHTML(out);
  };

  RL.raw = function (markup) {
    return new SafeHTML(markup);
  };

  /* ---------- Links ----------------------------------------------------------
     Only http(s), tel:, mailto: and same-page links are allowed. Anything else
     (typos, javascript: URLs) is treated as "not configured". */
  RL.safeUrl = function (url) {
    if (typeof url !== "string") return "";
    var trimmed = url.trim();
    if (!trimmed) return "";
    if (/^(https?:\/\/|tel:|mailto:|#)/i.test(trimmed)) return trimmed;
    return "";
  };

  RL.isConfigured = function (url) {
    return RL.safeUrl(url) !== "";
  };

  RL.mapsUrl = function (query) {
    // Official Google Maps URL format: opens the app on phones, the site elsewhere.
    return "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(query);
  };

  RL.telUrl = function (phoneLink) {
    var digits = String(phoneLink || "").replace(/[^\d+]/g, "");
    return digits ? "tel:" + digits : "";
  };

  RL.formatAddress = function (address) {
    if (!address) return "";
    var cityLine = [address.city, [address.state, address.zip].filter(Boolean).join(" ")]
      .filter(Boolean)
      .join(", ");
    return [address.street, cityLine].filter(Boolean).join(", ");
  };

  /* ---------- Prices ---------------------------------------------------------*/
  RL.formatPrice = function (price, currency) {
    if (typeof price === "string") return price;
    if (typeof price !== "number" || isNaN(price)) return "";
    var whole = price % 1 === 0;
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency || "USD",
        minimumFractionDigits: whole ? 0 : 2,
        maximumFractionDigits: 2,
      }).format(price);
    } catch (err) {
      return "$" + (whole ? price : price.toFixed(2));
    }
  };

  /* ---------- Demo labels ----------------------------------------------------
     Small "Sample" notes that only render while demoMode is true. */
  RL.demoTag = function (config, label) {
    if (!config.demoMode) return "";
    return RL.html`<span class="demo-tag">${label || "Sample"}</span>`;
  };

  RL.demoNote = function (config, text) {
    if (!config.demoMode) return "";
    return RL.html`<p class="demo-note"><span class="demo-tag">Demo</span> ${text}</p>`;
  };

  /* ---------- Icons (inline SVG, decorative) ---------------------------------*/
  var ICONS = {
    phone:
      '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z"/><path d="M8 7h8M8 11h6"/>',
    bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18M16 10a4 4 0 0 1-8 0"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    truck: '<path d="M1 3h15v13H1zM16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
    external: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"/>',
    arrow: '<path d="M5 12h14M12 5l7 7-7 7"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
  };

  RL.icon = function (name, className) {
    return RL.raw(
      '<svg class="icon ' + (className || "") + '" viewBox="0 0 24 24" width="20" height="20" ' +
        'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
        'stroke-linejoin="round" aria-hidden="true" focusable="false">' +
        (ICONS[name] || "") +
        "</svg>"
    );
  };

  /* ---------- External link helper -------------------------------------------*/
  RL.externalLink = function (url, label, className, iconName) {
    return RL.html`<a class="${className}" href="${RL.safeUrl(url)}" target="_blank" rel="noopener">
      ${iconName ? RL.icon(iconName) : ""}<span>${label}</span>
      <span class="visually-hidden">(opens in a new tab)</span>
    </a>`;
  };
})();
