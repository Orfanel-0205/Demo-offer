/* =============================================================================
   Navigation — sticky header with the restaurant name, section links and an
   accessible menu toggle on small screens.
   ========================================================================== */
(function (RL) {
  "use strict";

  var html = RL.html;

  RL.components.navigation = {
    render: function (config) {
      var r = config.restaurant;
      var tel = RL.telUrl(config.contact.phoneLink);
      var links = (config.navigation || []).map(function (item) {
        return html`<li><a href="#${item.target}" class="site-nav__link">${item.label}</a></li>`;
      });

      return html`<header class="site-header" data-site-header>
        <div class="container site-header__inner">
          <a href="#top" class="brand">
            <span class="brand__mark" aria-hidden="true">${r.name.charAt(0)}</span>
            <span class="brand__name brand__name--full">${r.name}</span>
            <span class="brand__name brand__name--short">${r.shortName || r.name}</span>
          </a>

          <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-nav-toggle>
            <span class="nav-toggle__icon nav-toggle__icon--open">${RL.icon("menu")}</span>
            <span class="nav-toggle__icon nav-toggle__icon--close">${RL.icon("close")}</span>
            <span class="visually-hidden">Site navigation</span>
          </button>

          <nav class="site-nav" id="site-nav" aria-label="Main" data-site-nav>
            <ul class="site-nav__list">${links}</ul>
            ${tel
              ? html`<a href="${tel}" class="btn btn--primary btn--small site-nav__call">
                  ${RL.icon("phone")}<span>${config.contact.phoneDisplay}</span>
                </a>`
              : ""}
          </nav>
        </div>
      </header>`;
    },

    init: function (root) {
      var header = root.querySelector("[data-site-header]");
      var toggle = root.querySelector("[data-nav-toggle]");
      var nav = root.querySelector("[data-site-nav]");
      if (!header || !toggle || !nav) return;

      function setOpen(open, returnFocus) {
        toggle.setAttribute("aria-expanded", String(open));
        header.classList.toggle("is-open", open);
        if (!open && returnFocus) toggle.focus();
      }

      toggle.addEventListener("click", function () {
        setOpen(toggle.getAttribute("aria-expanded") !== "true");
      });

      // Close after choosing a link (mobile).
      nav.addEventListener("click", function (event) {
        if (event.target.closest("a")) setOpen(false);
      });

      // Close with Escape, or when tapping outside the header.
      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && header.classList.contains("is-open")) setOpen(false, true);
      });
      document.addEventListener("click", function (event) {
        if (header.classList.contains("is-open") && !header.contains(event.target)) setOpen(false);
      });

      // Reset when resizing up to the desktop layout.
      var desktop = window.matchMedia("(min-width: 900px)");
      var onChange = function () {
        if (desktop.matches) setOpen(false);
      };
      if (desktop.addEventListener) desktop.addEventListener("change", onChange);

      // Subtle shadow once the page is scrolled.
      var onScroll = function () {
        header.classList.toggle("is-scrolled", window.scrollY > 8);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    },
  };
})(window.RL);
