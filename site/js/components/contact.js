/* =============================================================================
   Visit / contact — address, click-to-call, directions and opening hours.
   ========================================================================== */
(function (RL) {
  "use strict";

  var html = RL.html;

  RL.components.contact = {
    render: function (config) {
      var c = config.contact;
      var a = c.address || {};
      var tel = RL.telUrl(c.phoneLink);
      var mail = c.email ? "mailto:" + c.email : "";
      var directions = RL.mapsUrl(c.mapQuery || RL.formatAddress(a));

      return html`<section class="section visit-section" id="visit" aria-labelledby="visit-title">
        <div class="container visit__grid">
          <div class="visit__info">
            <p class="eyebrow">Find us</p>
            <h2 id="visit-title">Visit &amp; contact</h2>

            <address class="visit__address">
              <span class="visit__label">${RL.icon("pin")} Address ${RL.demoTag(config, "Sample")}</span>
              <span class="visit__value">${a.street}<br />${a.city}, ${a.state} ${a.zip}</span>
            </address>

            ${tel
              ? html`<p class="visit__phone">
                  <span class="visit__label">${RL.icon("phone")} Phone ${RL.demoTag(config, "Placeholder")}</span>
                  <a class="visit__value" href="${tel}">${c.phoneDisplay}</a>
                </p>`
              : ""}

            ${mail
              ? html`<p class="visit__email">
                  <span class="visit__label">Email</span>
                  <a class="visit__value" href="${mail}">${c.email}</a>
                </p>`
              : ""}

            <div class="visit__actions">
              ${tel ? html`<a href="${tel}" class="btn btn--primary">${RL.icon("phone")}<span>Call the restaurant</span></a>` : ""}
              <a href="${directions}" class="btn btn--outline" target="_blank" rel="noopener">
                ${RL.icon("pin")}<span>Get Directions</span><span class="visually-hidden">(opens Google Maps in a new tab)</span>
              </a>
            </div>

            ${c.parkingNote ? html`<p class="visit__note">${c.parkingNote}</p>` : ""}
            ${RL.demoNote(config, "Sample address and phone number. 555-01xx numbers are reserved for fictional use. Directions open the map area set in config.js; a real site points to the restaurant's exact location.")}
          </div>

          <div class="visit__hours">
            <h3 class="visit__hours-title">${RL.icon("clock")} Opening hours ${RL.demoTag(config, "Sample")}</h3>
            ${RL.components.hoursTable.render(config)}
            ${config.hours && config.hours.note ? html`<p class="visit__note">${config.hours.note}</p>` : ""}
          </div>
        </div>
      </section>`;
    },
  };
})(window.RL);
