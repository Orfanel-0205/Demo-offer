/* =============================================================================
   App start-up
   1. Applies brand colors and page metadata from config.js
   2. Renders every <div data-component="…"> placeholder in index.html
   3. Wires up interactive behavior (menu filters, mobile nav, hours, …)
   To reorder or remove a section, move or delete its placeholder in index.html.
   ========================================================================== */
(function (RL) {
  "use strict";

  var config = window.SITE_CONFIG;

  function applyTheme(theme) {
    if (!theme) return;
    var map = {
      background: "--color-bg",
      surface: "--color-surface",
      surfaceAlt: "--color-surface-alt",
      text: "--color-text",
      mutedText: "--color-muted",
      primary: "--color-primary",
      accent: "--color-accent",
      onDark: "--color-on-dark",
    };
    Object.keys(map).forEach(function (key) {
      if (theme[key]) document.documentElement.style.setProperty(map[key], theme[key]);
    });
  }

  function setMeta(selector, attr, value) {
    if (!value) return;
    var el = document.head.querySelector(selector);
    if (el) el.setAttribute(attr, value);
  }

  function applyMeta(config) {
    var meta = config.meta || {};
    if (meta.title) document.title = meta.title;
    setMeta('meta[name="description"]', "content", meta.description);
    setMeta('meta[property="og:title"]', "content", meta.title);
    setMeta('meta[property="og:description"]', "content", meta.description);
    setMeta('meta[name="theme-color"]', "content", config.theme && config.theme.background);
    if (meta.siteUrl) {
      setMeta('link[rel="canonical"]', "href", meta.siteUrl);
      setMeta('meta[property="og:url"]', "content", meta.siteUrl);
    }
  }

  /* Structured data helps search engines read hours, address and phone.
     Only added for real client sites — never for the fictional demo. */
  function addStructuredData(config) {
    if (config.demoMode) return;
    var c = config.contact;
    var dayNames = { monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday", thursday: "Thursday", friday: "Friday", saturday: "Saturday", sunday: "Sunday" };
    var hours = [];
    Object.keys(dayNames).forEach(function (day) {
      ((config.hours && config.hours.weekly && config.hours.weekly[day]) || []).forEach(function (p) {
        hours.push({ "@type": "OpeningHoursSpecification", dayOfWeek: dayNames[day], opens: p[0], closes: p[1] });
      });
    });
    var data = {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      name: config.restaurant.name,
      description: config.restaurant.description,
      servesCuisine: config.restaurant.cuisine,
      priceRange: config.restaurant.priceRange,
      telephone: c.phoneLink,
      address: {
        "@type": "PostalAddress",
        streetAddress: c.address.street,
        addressLocality: c.address.city,
        addressRegion: c.address.state,
        postalCode: c.address.zip,
        addressCountry: "US",
      },
      openingHoursSpecification: hours,
    };
    if (config.meta && config.meta.siteUrl) {
      data.url = config.meta.siteUrl;
      data.menu = config.meta.siteUrl.replace(/\/$/, "") + "/#menu";
    }
    var reservations = config.ordering && config.ordering.reservations;
    if (reservations && RL.isConfigured(reservations.url)) {
      data.acceptsReservations = true;
    }
    var script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  function mountComponents(config) {
    var slots = document.querySelectorAll("[data-component]");
    Array.prototype.forEach.call(slots, function (slot) {
      var name = slot.getAttribute("data-component");
      var component = RL.components[name];
      if (!component) {
        slot.remove();
        return;
      }
      var markup = String(component.render(config) || "");
      if (!markup.trim()) {
        slot.remove();
        return;
      }
      var tpl = document.createElement("template");
      tpl.innerHTML = markup.trim();
      slot.replaceWith(tpl.content);
    });

    Object.keys(RL.components).forEach(function (name) {
      var component = RL.components[name];
      if (typeof component.init === "function") component.init(document, config);
    });

    removeDeadNavLinks();
  }

  /* A section can disappear (e.g. "Order" when no ordering links are set).
     Hide header/footer links that would point to it. */
  function removeDeadNavLinks() {
    var links = document.querySelectorAll(".site-nav__list a[href^='#'], .footer__nav a[href^='#']");
    Array.prototype.forEach.call(links, function (link) {
      if (!document.getElementById(link.getAttribute("href").slice(1))) {
        var item = link.closest("li") || link;
        item.remove();
      }
    });
  }

  /* Gentle fade-in as sections scroll into view (skipped for reduced motion). */
  function revealOnScroll() {
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) return;
    var targets = document.querySelectorAll(".section-head, .menu-group, .about__media, .highlight, .gallery__item, .order-card, .visit__hours, .package");
    document.documentElement.classList.add("has-reveal");
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    Array.prototype.forEach.call(targets, function (el) {
      el.classList.add("reveal");
      observer.observe(el);
    });
  }

  function start() {
    if (!config) {
      document.body.insertAdjacentHTML(
        "afterbegin",
        '<p class="config-error">The website could not load its settings. Check config.js for a missing quote or comma.</p>'
      );
      return;
    }
    applyTheme(config.theme);
    applyMeta(config);
    addStructuredData(config);
    mountComponents(config);
    document.documentElement.classList.toggle("is-demo", !!config.demoMode);
    revealOnScroll();
  }

  start();
})(window.RL);
