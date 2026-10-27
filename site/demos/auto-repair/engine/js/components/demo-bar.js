/* =============================================================================
   Demo banner — a slim strip at the very top that says this is a sample site.
   Only rendered while config.demoMode is true.
   config.demoBackLink → { href, label }: optional link back to a design gallery.
   ========================================================================== */
(function (RL) {
  "use strict";

  RL.components.demoBar = {
    render: function (config) {
      if (!config.demoMode) return "";
      var agency = window.AGENCY_CONFIG;
      var back = config.demoBackLink || {};
      // A same-site path ("./", "../designs/") or a full web address.
      var backHref = RL.safeUrl(back.href) || (/^\.{0,2}\/[^/]/.test(back.href || "") || back.href === "./" ? back.href : "");
      return RL.html`<aside class="demo-bar" aria-label="About this demo">
        <div class="container demo-bar__inner">
          ${backHref ? RL.html`<a href="${backHref}" class="demo-bar__link demo-bar__back">${back.label || "All designs"}</a>` : ""}
          <p>${config.demoBanner || "Sample website for demonstration only."}</p>
          ${agency ? RL.html`<a href="#packages" class="demo-bar__link">See pricing</a>` : ""}
        </div>
      </aside>`;
    },
  };
})(window.RL);
