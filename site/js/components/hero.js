/* =============================================================================
   Hero — restaurant name, tagline, description, the two main actions and the
   live opening-hours indicator, next to the main photo.
   ========================================================================== */
(function (RL) {
  "use strict";

  var html = RL.html;

  RL.components.hero = {
    render: function (config) {
      var r = config.restaurant;
      var img = config.images.hero;
      var directions = RL.mapsUrl(config.contact.mapQuery || RL.formatAddress(config.contact.address));
      var srcset = img.srcSmall ? img.srcSmall + " 900w, " + img.src + " 1600w" : "";

      return html`<section class="hero" id="top" aria-labelledby="hero-title">
        <div class="container hero__inner">
          <div class="hero__content">
            ${r.eyebrow ? html`<p class="eyebrow">${r.eyebrow}</p>` : ""}
            <h1 class="hero__title" id="hero-title">${r.name}</h1>
            <p class="hero__tagline">${r.tagline}</p>
            <p class="hero__description">${r.description}</p>

            <div class="hero__actions">
              <a href="#menu" class="btn btn--primary">${RL.icon("book")}<span>Explore Our Menu</span></a>
              <a href="${directions}" class="btn btn--outline" target="_blank" rel="noopener">
                ${RL.icon("pin")}<span>Get Directions</span>
                <span class="visually-hidden">(opens Google Maps in a new tab)</span>
              </a>
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
