/* =============================================================================
   Ordering & reservations — buttons that link OUT to the services the
   restaurant already uses (its own ordering page, a reservation platform,
   delivery apps). No payments or orders are handled by this website.

   Link states:
   • URL set in config.js           → working button (opens in a new tab)
   • URL empty + demoMode true      → dashed "Demo" button that explains, when
                                      tapped, where the real link will go
   • URL empty + demoMode false     → button is hidden
   ========================================================================== */
(function (RL) {
  "use strict";

  var html = RL.html;

  function actionButton(config, opts) {
    if (RL.isConfigured(opts.url)) {
      return RL.externalLink(opts.url, opts.label, "btn " + (opts.primary ? "btn--primary" : "btn--outline"), opts.icon);
    }
    if (!config.demoMode) return "";
    return html`<button type="button" class="btn btn--demo" data-demo-link="${opts.explain}">
      ${RL.icon(opts.icon)}<span>${opts.label}</span><span class="demo-tag">Demo</span>
    </button>`;
  }

  RL.components.order = {
    render: function (config) {
      var o = config.ordering || {};
      var order = o.orderOnline || {};
      var reserve = o.reservations || {};
      var delivery = (o.delivery || []).filter(function (d) {
        return config.demoMode || RL.isConfigured(d.url);
      });

      var orderBtn = actionButton(config, {
        url: order.url, label: order.label || "Order online", icon: "bag", primary: true,
        explain: "On a real site, this opens the restaurant's own online ordering page (for example Toast, Square or ChowNow) once the owner provides the link.",
      });
      var reserveBtn = actionButton(config, {
        url: reserve.url, label: reserve.label || "Reserve a table", icon: "calendar", primary: true,
        explain: "On a real site, this opens the restaurant's reservation page (for example OpenTable, Resy or Tock) once the owner provides the link.",
      });
      var deliveryBtns = delivery.map(function (d) {
        return actionButton(config, {
          url: d.url, label: d.name, icon: "truck",
          explain: "On a real site, this opens the restaurant's " + d.name + " store page, if the owner uses " + d.name + " and approves the link.",
        });
      });

      // Real client site with nothing configured: leave the section out entirely.
      if (!orderBtn && !reserveBtn && !deliveryBtns.join("")) return "";

      return html`<section class="section order-section" id="order" aria-labelledby="order-title">
        <div class="container">
          <header class="section-head section-head--center">
            <p class="eyebrow">Eat in or take out</p>
            <h2 id="order-title">Order &amp; reserve</h2>
            <p class="section-head__intro">Book a table, order ahead for pickup, or get delivery through the services we already use.</p>
          </header>

          <div class="order-grid">
            ${orderBtn || reserveBtn
              ? html`<div class="order-card">
                  <h3>Direct from the restaurant</h3>
                  <div class="order-card__actions">${reserveBtn}${orderBtn}</div>
                </div>`
              : ""}
            ${deliveryBtns.length
              ? html`<div class="order-card">
                  <h3>Delivery partners</h3>
                  <div class="order-card__actions order-card__actions--wrap">${deliveryBtns}</div>
                </div>`
              : ""}
          </div>

          <p class="demo-explainer" data-demo-explainer aria-live="polite" hidden></p>
          ${RL.demoNote(config, "These buttons are placeholders. Each client's links are added only after the owner confirms which services they use.")}
        </div>
      </section>`;
    },

    init: function (root) {
      var section = root.querySelector("#order");
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
