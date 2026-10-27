/* =============================================================================
   Hero — business name, tagline, description, the two main actions and the
   live opening-hours indicator, next to (or behind) the main photo.

   config.hero.primary   → { label, href, icon }   (default: menu link)
   config.hero.secondary → "directions" | "call" | { label, href, icon }
   config.layout.hero    → "arch" (photo beside text) | "fullbleed" (photo behind)
   ========================================================================== */
(function (RL) {
  "use strict";

  var html = RL.html;

  function heroButton(config, spec, style) {
    if (spec === "call") {
      var tel = RL.telUrl(config.contact.phoneLink);
      if (!tel) return "";
      return html`<a href="${tel}" class="btn ${style}">${RL.icon("phone")}<span>Call ${config.contact.phoneDisplay}</span></a>`;
    }
    if (spec === "directions" || !spec) {
      var directions = RL.mapsUrl(config.contact.mapQuery || RL.formatAddress(config.contact.address));
      return html`<a href="${directions}" class="btn ${style}" target="_blank" rel="noopener">
        ${RL.icon("pin")}<span>Get Directions</span>
        <span class="visually-hidden">(opens Google Maps in a new tab)</span>
      </a>`;
    }
    return html`<a href="${RL.safeUrl(spec.href) || "#top"}" class="btn ${style}">${RL.icon(spec.icon || "arrow")}<span>${spec.label}</span></a>`;
  }

  RL.components.hero = {
    render: function (config) {
      var b = config.business;
      var hero = config.hero || {};
      var img = config.images.hero;
      var srcset = img.srcSmall ? img.srcSmall + " 900w, " + img.src + " 1600w" : "";
      var primary = hero.primary || { label: "Explore Our Menu", href: "#menu", icon: "book" };

      return html`<section class="hero" id="top" aria-labelledby="hero-title">
        <div class="container hero__inner">
          <div class="hero__content">
            ${b.eyebrow ? html`<p class="eyebrow">${b.eyebrow}</p>` : ""}
            <h1 class="hero__title" id="hero-title">${b.name}</h1>
            <p class="hero__tagline">${b.tagline}</p>
            <p class="hero__description">${b.description}</p>

            <div class="hero__actions">
              ${heroButton(config, primary, "btn--primary")}
              ${heroButton(config, hero.secondary || "directions", "btn--outline")}
            </div>

            ${RL.components.hoursIndicator.render(config)}
          </div>

          <figure class="hero__media">
            <img
              src="${img.srcSmall || img.src}"
              ${srcset ? RL.raw('srcset="' + RL.escape(srcset) + '" sizes="(min-width: 900px) 58vw, 100vw"') : ""}
              alt="${img.alt}"
              width="1600" height="1066"
              fetchpriority="high"
              decoding="async"
              style="object-position: ${img.position || "50% 50%"}"
            />
            ${config.demoMode ? html`<figcaption class="photo-credit">Stock photo (CC0) used as a placeholder</figcaption>` : ""}
          </figure>
        </div>
      </section>`;
    },
    // The hours indicator inside the hero is initialized by its own component.
  };
})(window.RL);
