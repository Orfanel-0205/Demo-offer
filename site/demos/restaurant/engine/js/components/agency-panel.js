/* =============================================================================
   Studio panel — shown under a SAMPLE website only (demoMode: true).
   Tells the visitor who made the sample, summarizes the packages and links to
   the studio site for full details and the inquiry form.

   Reads window.AGENCY_CONFIG, which main.js loads from config.demoAgency.configUrl.
   Never rendered on a client's live website.
   ========================================================================== */
(function (RL) {
  "use strict";

  var html = RL.html;

  RL.components.agencyPanel = {
    render: function (config) {
      var agency = window.AGENCY_CONFIG;
      var link = config.demoAgency || {};
      if (!config.demoMode || !agency) return "";
      var base = link.siteUrl || "../../";

      var cards = (agency.packages || []).map(function (p) {
        return html`<article class="package${p.featured ? " package--featured" : ""}" aria-labelledby="pkg-${p.id}">
          ${p.badge ? html`<p class="package__badge">${p.badge}</p>` : ""}
          <h3 class="package__name" id="pkg-${p.id}">${p.name}</h3>
          <p class="package__price"><span class="package__amount">${p.price}</span> <span class="package__cadence">${p.cadence}</span></p>
          <p class="package__summary">${p.summary}</p>
        </article>`;
      });

      return html`<section class="agency" id="packages" aria-labelledby="packages-title">
        <div class="agency__seam" aria-hidden="true"><span>End of sample website</span></div>
        <div class="container">
          <header class="agency__head">
            <p class="agency__brand">${link.logo
              ? html`<img src="${link.logo}" alt="${agency.name}" width="271" height="72" />`
              : agency.name}</p>
            <p class="agency__eyebrow">About this sample</p>
            <h2 id="packages-title">${agency.demoPanel && agency.demoPanel.heading ? agency.demoPanel.heading : "Want a website like this for your business?"}</h2>
            <p class="agency__intro">${agency.demoPanel && agency.demoPanel.intro ? agency.demoPanel.intro : agency.intro}</p>
          </header>

          <div class="packages">${cards}</div>

          <div class="agency__cta">
            <a class="agency__btn agency__btn--primary" href="${base}#inquire">Ask about your business</a>
            <a class="agency__btn" href="${base}#packages">See what each package includes</a>
            <a class="agency__btn" href="${base}#work">More sample designs</a>
          </div>

          <p class="agency__fine">${(agency.disclosures || []).slice(0, 2).join(" ")}</p>
        </div>
      </section>`;
    },
  };
})(window.RL);
