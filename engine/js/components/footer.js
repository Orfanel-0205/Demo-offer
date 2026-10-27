/* =============================================================================
   Footer — restaurant name, navigation, contact details, condensed hours,
   social links (only when configured), copyright and the demo disclaimer.
   ========================================================================== */
(function (RL) {
  "use strict";

  var html = RL.html;

  RL.components.footer = {
    render: function (config) {
      var r = config.business;
      var c = config.contact;
      var tel = RL.telUrl(c.phoneLink);
      var social = (config.social || []).filter(function (s) {
        return RL.isConfigured(s.url);
      });
      var hours = RL.hours.hasHours(config) ? RL.hours.grouped(config) : [];
      var year = new Date().getFullYear();

      return html`<footer class="site-footer">
        <div class="container footer__grid">
          <div class="footer__brand">
            <p class="footer__name">${r.name}</p>
            <p class="footer__tagline">${r.tagline}</p>
          </div>

          <nav class="footer__nav" aria-label="Footer">
            <h2 class="footer__heading">Explore</h2>
            <ul>
              ${(config.navigation || []).map(function (item) {
                return html`<li><a href="#${item.target}">${item.label}</a></li>`;
              })}
            </ul>
          </nav>

          <div class="footer__contact">
            <h2 class="footer__heading">Contact</h2>
            <p>${RL.formatAddress(c.address)}</p>
            ${tel ? html`<p><a href="${tel}">${c.phoneDisplay}</a></p>` : ""}
            ${c.email ? html`<p><a href="mailto:${c.email}">${c.email}</a></p>` : ""}
            ${config.demoMode ? html`<p class="footer__muted">Sample contact details for demonstration.</p>` : ""}
          </div>

          ${hours.length
            ? html`<div class="footer__hours">
                <h2 class="footer__heading">Hours</h2>
                <dl>${hours.map(function (h) {
                  return html`<div><dt>${h.label}</dt><dd>${h.text}</dd></div>`;
                })}</dl>
              </div>`
            : ""}

          ${social.length
            ? html`<div class="footer__social">
                <h2 class="footer__heading">Follow</h2>
                <ul>${social.map(function (s) {
                  return html`<li>${RL.externalLink(s.url, s.name, "footer__social-link")}</li>`;
                })}</ul>
              </div>`
            : config.demoMode
              ? html`<div class="footer__social">
                  <h2 class="footer__heading">Follow</h2>
                  <p class="footer__muted">Social links appear here once the owner provides their real, approved profile URLs.</p>
                </div>`
              : ""}
        </div>

        <div class="container footer__bottom">
          <p>© ${year} ${r.name}. All rights reserved.</p>
          ${config.demoMode
            ? html`<p class="footer__disclaimer">${config.demoFooterNote || "This is a sample website for demonstration only."}</p>`
            : ""}
        </div>
      </footer>`;
    },
  };
})(window.RL);
