/* =============================================================================
   Menu — categories, dishes, descriptions, prices and touch-friendly filters.
   All content comes from config.menu.
   ========================================================================== */
(function (RL) {
  "use strict";

  var html = RL.html;

  function itemTags(menu, tags) {
    if (!tags || !tags.length) return "";
    return html`<span class="menu-item__tags">${tags.map(function (tag) {
      var full = (menu.tags && menu.tags[tag]) || tag;
      return html`<span class="diet-tag" aria-hidden="true">${tag}</span><span class="visually-hidden">${full}. </span>`;
    })}</span>`;
  }

  function renderItem(menu, item) {
    return html`<li class="menu-item">
      <div class="menu-item__head">
        <h4 class="menu-item__name">${item.name}</h4>
        ${itemTags(menu, item.tags)}
        <span class="menu-item__leader" aria-hidden="true"></span>
        <span class="menu-item__price">${RL.formatPrice(item.price, menu.currency)}</span>
      </div>
      ${item.description ? html`<p class="menu-item__desc">${item.description}</p>` : ""}
    </li>`;
  }

  RL.components.menu = {
    render: function (config) {
      var menu = config.menu;
      if (!menu || !menu.categories || !menu.categories.length) return "";

      var filters = [{ id: "all", name: "All" }].concat(menu.categories).map(function (cat, i) {
        return html`<button type="button" class="filter-btn" data-filter="${cat.id}" aria-pressed="${i === 0 ? "true" : "false"}" aria-controls="menu-list">${cat.name}</button>`;
      });

      var groups = menu.categories.map(function (cat) {
        return html`<section class="menu-group" data-category="${cat.id}" aria-labelledby="menu-cat-${cat.id}">
          <h3 class="menu-group__title" id="menu-cat-${cat.id}">${cat.name}</h3>
          <ul class="menu-group__items">${cat.items.map(function (item) {
            return renderItem(menu, item);
          })}</ul>
        </section>`;
      });

      var legend = menu.tags
        ? Object.keys(menu.tags).map(function (key) {
            return html`<span><span class="diet-tag" aria-hidden="true">${key}</span> ${menu.tags[key]}</span>`;
          })
        : [];

      return html`<section class="section menu-section" id="menu" aria-labelledby="menu-title">
        <div class="container">
          <header class="section-head">
            <p class="eyebrow">Lunch &amp; dinner</p>
            <h2 id="menu-title">${menu.heading || "Menu"}</h2>
            ${menu.intro ? html`<p class="section-head__intro">${menu.intro}</p>` : ""}
            ${RL.demoNote(config, "Sample menu — dishes, descriptions and prices are demo content until a restaurant owner approves their own.")}
          </header>

          <div class="menu-filters" role="group" aria-label="Filter menu by category">${filters}</div>
          <p class="visually-hidden" aria-live="polite" data-menu-status></p>

          <div class="menu-list" id="menu-list">${groups}</div>

          <footer class="menu-footer">
            ${legend.length ? html`<p class="menu-legend">${legend}</p>` : ""}
            ${menu.footnote ? html`<p class="menu-footnote">${menu.footnote}</p>` : ""}
          </footer>
        </div>
      </section>`;
    },

    init: function (root) {
      var section = root.querySelector("#menu");
      if (!section) return;
      var buttons = Array.prototype.slice.call(section.querySelectorAll("[data-filter]"));
      var groups = Array.prototype.slice.call(section.querySelectorAll("[data-category]"));
      var status = section.querySelector("[data-menu-status]");

      function apply(filter) {
        var shown = 0;
        groups.forEach(function (group) {
          var match = filter === "all" || group.getAttribute("data-category") === filter;
          group.hidden = !match;
          if (match) shown += group.querySelectorAll(".menu-item").length;
        });
        buttons.forEach(function (btn) {
          btn.setAttribute("aria-pressed", String(btn.getAttribute("data-filter") === filter));
        });
        var active = buttons.filter(function (b) {
          return b.getAttribute("data-filter") === filter;
        })[0];
        if (status && active) status.textContent = "Showing " + active.textContent + ": " + shown + " items";
      }

      buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          apply(btn.getAttribute("data-filter"));
        });
      });
    },
  };
})(window.RL);
