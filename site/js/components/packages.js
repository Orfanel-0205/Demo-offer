/* =============================================================================
   RestaurantLaunch packages — the service pricing shown under the sample
   website. Reads window.AGENCY_CONFIG (agency.config.js) and only renders
   while config.demoMode is true. Never shown on a client's live website.
   ========================================================================== */
(function (RL) {
  "use strict";

  var html = RL.html;

  RL.components.packages = {
    render: function (config) {
      var agency = window.AGENCY_CONFIG;
      if (!config.demoMode || !agency) return "";
      var contact = agency.contact || {};
      var tel = RL.telUrl(contact.phoneLink);

      var cards = (agency.packages || []).map(function (p) {
        return html`<article class="package${p.featured ? " package--featured" : ""}" aria-labelledby="pkg-${p.id}">
          ${p.badge ? html`<p class="package__badge">${p.badge}</p>` : ""}
          <h3 class="package__name" id="pkg-${p.id}">${p.name}</h3>
          <p class="package__price"><span class="package__amount">${p.price}</span> <span class="package__cadence">${p.cadence}</span></p>
          <p class="package__summary">${p.summary}</p>
          <ul class="package__list">
            ${(p.includes || []).map(function (line) {
              return html`<li>${RL.icon("check")}<span>${line}</span></li>`;
            })}
          </ul>
          ${p.note ? html`<p class="package__note">${p.note}</p>` : ""}
        </article>`;
      });

      return html`<section class="agency" id="packages" aria-labelledby="packages-title">
        <div class="agency__seam" aria-hidden="true"><span>End of sample restaurant website</span></div>
        <div class="container">
          <header class="agency__head">
            <p class="agency__brand">${agency.name}</p>
            <p class="agency__eyebrow">${agency.eyebrow}</p>
            <h2 id="packages-title">${agency.heading}</h2>
            <p class="agency__intro">${agency.intro}</p>
          </header>

          <div class="packages">${cards}</div>

          <ul class="agency__disclosures">
            ${(agency.disclosures || []).map(function (d) {
              return html`<li>${d}</li>`;
            })}
          </ul>

          <div class="agency__contact">
            <h3>Next step</h3>
            <p>A short call to confirm what your restaurant needs. Scope and price are agreed in writing before any work begins.</p>
            ${contact.email ? html`<p><a href="mailto:${contact.email}">${contact.email}</a></p>` : ""}
            ${tel ? html`<p><a href="${tel}">${contact.phoneDisplay}</a></p>` : ""}
            ${!contact.email && !tel ? html`<p class="agency__fallback">${contact.fallback}</p>` : ""}
          </div>
        </div>
      </section>`;
    },
  };
})(window.RL);
