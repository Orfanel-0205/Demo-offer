/* =============================================================================
   Demo banner — a slim strip at the very top that says this is a sample site.
   Only rendered while config.demoMode is true.
   ========================================================================== */
(function (RL) {
  "use strict";

  RL.components.demoBar = {
    render: function (config) {
      if (!config.demoMode) return "";
      var agency = window.AGENCY_CONFIG;
      return RL.html`<aside class="demo-bar" aria-label="About this demo">
        <div class="container demo-bar__inner">
          <p>${config.demoBanner || "Sample website for demonstration only."}</p>
          ${agency ? RL.html`<a href="#packages" class="demo-bar__link">See pricing</a>` : ""}
        </div>
      </aside>`;
    },
  };
})(window.RL);
