/* =============================================================================
   Mobile quick-action bar — Menu, Call and Directions pinned to the bottom of
   the screen on phones, where customers need them most. Hidden on desktop.
   ========================================================================== */
(function (RL) {
  "use strict";

  var html = RL.html;

  RL.components.mobileActions = {
    render: function (config) {
      var tel = RL.telUrl(config.contact.phoneLink);
      var directions = RL.mapsUrl(config.contact.mapQuery || RL.formatAddress(config.contact.address));

      return html`<nav class="mobile-actions" aria-label="Quick actions">
        <a href="#menu" class="mobile-actions__link">${RL.icon("book")}<span>Menu</span></a>
        ${tel ? html`<a href="${tel}" class="mobile-actions__link">${RL.icon("phone")}<span>Call</span></a>` : ""}
        <a href="${directions}" class="mobile-actions__link" target="_blank" rel="noopener">
          ${RL.icon("pin")}<span>Directions</span><span class="visually-hidden">(opens Google Maps in a new tab)</span>
        </a>
      </nav>`;
    },
  };
})(window.RL);
