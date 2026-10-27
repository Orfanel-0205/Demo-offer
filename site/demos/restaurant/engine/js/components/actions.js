/* =============================================================================
   Actions — groups of buttons that link OUT to services the business already
   uses: online ordering, reservations, delivery apps, appointment booking,
   quote forms, text messaging… No payments or orders are handled here.

   Configured in config.js → actions: { heading, intro, groups: [ … ] }

   Link states:
   • url set in config.js          → working button (opens in a new tab)
   • url empty + demoMode true     → dashed "Demo" button that explains, when
                                     tapped, where the real link will go
   • url empty + demoMode false    → button is hidden (and an empty section
                                     disappears completely)
   ========================================================================== */
(function (RL) {
  "use strict";

  var html = RL.html;

  function actionButton(config, item) {
    var label = item.label || "Open";
    var icon = item.icon || "external";
    var style = item.primary ? "btn--primary" : "btn--outline";
    if (RL.isConfigured(item.url)) {
      // Phone and text links stay in the same tab; web links open a new one.
      if (/^(tel|sms|mailto):/i.test(item.url)) {
        return html`<a class="btn ${style}" href="${RL.safeUrl(item.url)}">${RL.icon(icon)}<span>${label}</span></a>`;
      }
      return RL.externalLink(item.url, label, "btn " + style, icon);
    }
    if (!config.demoMode) return "";
    var explain = item.explain || "On a real site, this opens the business's own “" + label + "” page once the owner provides the link.";
    return html`<button type="button" class="btn btn--demo" data-demo-link="${explain}">
      ${RL.icon(icon)}<span>${label}</span><span class="demo-tag">Demo</span>
    </button>`;
  }

  RL.components.actions = {
    render: function (config) {
      var a = config.actions;
      if (!a || !a.groups) return "";

      var cards = a.groups
        .map(function (group) {
          var buttons = (group.items || []).map(function (item) {
            return actionButton(config, item);
          });
          if (!buttons.join("")) return "";
          return html`<div class="order-card">
            <h3>${group.title}</h3>
            <div class="order-card__actions${group.wrap ? " order-card__actions--wrap" : ""}">${buttons}</div>
          </div>`;
        })
        .filter(function (card) {
          return String(card).trim() !== "";
        });

      // Real client site with nothing configured: leave the section out entirely.
      if (!cards.length) return "";

      var id = a.id || "order";
      return html`<section class="section order-section" id="${id}" aria-labelledby="${id}-title">
        <div class="container">
          <header class="section-head section-head--center">
            ${a.eyebrow ? html`<p class="eyebrow">${a.eyebrow}</p>` : ""}
            <h2 id="${id}-title">${a.heading || "Get in touch"}</h2>
            ${a.intro ? html`<p class="section-head__intro">${a.intro}</p>` : ""}
          </header>

          <div class="order-grid${cards.length === 1 ? " order-grid--single" : ""}">${cards}</div>

          <p class="demo-explainer" data-demo-explainer aria-live="polite" hidden></p>
          ${RL.demoNote(config, a.demoNote || "These buttons are placeholders. Each client's links are added only after the owner confirms which services they use.")}
        </div>
      </section>`;
    },

    init: function (root) {
      var section = root.querySelector(".order-section");
      if (!section) return;
      var explainer = section.querySelector("[data-demo-explainer]");
      section.addEventListener("click", function (event) {
        var btn = event.target.closest("[data-demo-link]");
        if (!btn || !explainer) return;
        explainer.textContent = btn.getAttribute("data-demo-link");
        explainer.hidden = false;
      });
    },
  };
})(window.RL);
