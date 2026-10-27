/* =============================================================================
   Builds the template engine's config for one sample design:
   catalog entry (catalog.js) + style + industry content (content/<industry>.js).
   Used by view.html in the browser and by tools/export-design.mjs.
   ========================================================================== */
(function () {
  "use strict";

  var DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  var STREETS = ["Street", "Avenue", "Road", "Boulevard", "Lane", "Way"];

  function pad2(n) {
    return (n < 10 ? "0" : "") + n;
  }

  // "mon-fri 07:30-18:00; sat 08:00-14:00" → { monday: [["07:30","18:00"]], … }
  function parseHours(text) {
    var weekly = {};
    DAYS.forEach(function (d) {
      weekly[d] = [];
    });
    String(text || "").split(";").forEach(function (part) {
      var bits = part.trim().split(/\s+/);
      if (bits.length < 2) return;
      var range = bits[0].toLowerCase();
      var periods = bits[1].split(",").map(function (p) {
        return p.split("-");
      });
      var days;
      if (range === "daily") days = DAYS;
      else {
        var short = DAYS.map(function (d) { return d.slice(0, 3); });
        var ends = range.split("-");
        var from = short.indexOf(ends[0]);
        var to = short.indexOf(ends[1] || ends[0]);
        // "sun-thu" wraps around the end of the week.
        days = to >= from ? DAYS.slice(from, to + 1) : DAYS.slice(from).concat(DAYS.slice(0, to + 1));
      }
      days.forEach(function (d) {
        weekly[d] = periods;
      });
    });
    return weekly;
  }

  function compose(design, pack) {
    var C = window.DESIGN_CATALOG;
    var style = C.styles[design.style];
    var index = C.designs.indexOf(design);
    var place = design.place; // [city, state, ZIP, time zone, area code]
    var number = "555-01" + pad2(index % 100);
    var phoneLink = "+1" + place[4] + number.replace("-", "");
    var phoneDisplay = "(" + place[4] + ") " + number;
    var menuId = pack.menu.id || "menu";
    var actionsId = pack.actions.id || "book";

    function fill(value) {
      if (typeof value === "string") {
        return value
          .replace(/\{name\}/g, design.name)
          .replace(/\{short\}/g, design.shortName || design.name)
          .replace(/\{city\}/g, place[0]);
      }
      if (Array.isArray(value)) return value.map(fill);
      if (value && typeof value === "object") {
        var out = {};
        Object.keys(value).forEach(function (k) {
          out[k] = fill(value[k]);
        });
        return out;
      }
      return value;
    }
    pack = fill(pack);

    // Photos: photos/<industry>/hero-N-1600.webp + hero-N-900.webp and gN.webp,
    // unless the content file gives explicit paths.
    var base = "photos/" + design.industry + "/";
    var heroes = pack.photos.heroes.map(function (h, i) {
      if (typeof h === "string") return { src: base + "hero-" + (i + 1) + "-1600.webp", small: base + "hero-" + (i + 1) + "-900.webp", alt: h };
      return h;
    });
    var hero = heroes[(design.photo - 1) % heroes.length];
    var second = heroes[design.photo % heroes.length];
    var gallery = (pack.photos.gallery || []).map(function (g, i) {
      return { src: g[2] || base + "g" + (i + 1) + ".webp", caption: g[0], alt: g[1] };
    });

    var labels = pack.nav; // [menu, about, actions, visit]
    var targets = [menuId, "about", actionsId, "visit"];
    var smsLink = "sms:" + phoneLink;
    var telLink = "tel:" + phoneLink;

    return {
      demoMode: true,
      demoBanner: "Sample design · fictional " + pack.noun,
      demoFooterNote:
        design.name + " is a fictional " + pack.noun + " created to show a website design. " +
        "Services, prices, hours, address and phone number are sample content. " +
        "Photos: CC0 images from Wikimedia Commons, used as placeholders.",
      demoBackLink: { href: "./?type=" + design.industry, label: "More " + C.noun(design.industry) + " designs" },
      demoAgency: {
        configUrl: "../agency.config.js",
        siteUrl: "../",
        logo: "../assets/brand/logo.svg",
        galleryUrl: "./",
        design: { id: design.id, name: design.name },
      },

      business: {
        schemaType: pack.schemaType || "LocalBusiness",
        name: design.name,
        shortName: design.shortName,
        tagline: design.tagline,
        description: pack.description,
        eyebrow: pack.kind + " · " + place[0] + ", " + place[1],
        priceRange: pack.priceRange || "$$",
      },
      theme: style.theme,
      layout: { hero: style.layout.hero, menu: style.layout.menu },
      hero: {
        primary: { label: pack.primary[0], href: "#" + menuId, icon: pack.primary[1] },
        secondary: pack.secondary || "call",
      },
      meta: {
        title: design.name + " — Sample " + C.noun(design.industry) + " design",
        description: design.name + " is a fictional " + pack.noun + " used to show a mobile-friendly website design by Bright Site Tech.",
        siteUrl: "",
      },

      contact: {
        eyebrow: pack.contact.eyebrow,
        heading: pack.contact.heading || "Visit & contact",
        callLabel: pack.contact.call,
        phoneDisplay: phoneDisplay,
        phoneLink: phoneLink,
        email: "",
        address: {
          street: (100 + ((index * 37) % 800)) + " Example " + STREETS[index % STREETS.length],
          city: place[0],
          state: place[1],
          zip: place[2],
        },
        mapQuery: "Downtown " + place[0] + ", " + place[1],
        parkingNote: pack.contact.note,
      },
      hours: { timezone: place[3], weekly: parseHours(pack.hours[0]), note: pack.hours[1] },

      actions: {
        id: actionsId,
        eyebrow: pack.actions.eyebrow,
        heading: pack.actions.heading,
        intro: pack.actions.intro,
        groups: pack.actions.groups.map(function (g) {
          return {
            title: g[0],
            items: g[1].map(function (item) {
              var link = item[3] === "sms" ? smsLink : item[3] === "tel" ? telLink : "";
              return { label: item[0], icon: item[1], primary: !!item[2], url: link, explain: link ? "" : item[3] };
            }),
          };
        }),
        demoNote: "These buttons are placeholders. Each client's links are added only after the owner confirms which tools they use.",
      },
      social: [{ name: "Google", url: "" }, { name: "Facebook", url: "" }, { name: "Instagram", url: "" }],
      navigation: labels.map(function (label, i) {
        return { label: label, target: targets[i] };
      }),
      mobileBar: { first: { label: labels[0], href: "#" + menuId, icon: pack.primary[1] } },

      images: {
        hero: { src: hero.src, srcSmall: hero.small, alt: hero.alt, position: hero.position || "50% 50%" },
        about: { src: second.small, alt: second.alt, position: second.position || "50% 50%" },
        gallery: gallery,
      },
      about: {
        eyebrow: pack.about.eyebrow,
        heading: pack.about.heading,
        paragraphs: pack.about.text,
        highlights: pack.about.highlights.map(function (h) {
          return { title: h[0], text: h[1] };
        }),
        galleryHeading: pack.about.gallery,
        demoNote: "Fictional business written for this sample. Real websites only use details the owner provides and can back up.",
      },
      menu: {
        id: menuId,
        eyebrow: pack.menu.eyebrow,
        heading: pack.menu.heading,
        intro: pack.menu.intro,
        allLabel: pack.menu.all || "All",
        currency: "USD",
        tags: pack.menu.tags,
        footnote: pack.menu.footnote,
        demoNote: pack.menu.note || "Sample prices. A real site lists only the business's own, owner-approved prices.",
        categories: pack.menu.groups.map(function (g) {
          return {
            id: C.slug(g[0]),
            name: g[0],
            items: g[1].map(function (item) {
              return { name: item[0], description: item[1], price: item[2], tags: item[3] };
            }),
          };
        }),
      },
    };
  }

  window.DESIGN_COMPOSE = compose;
})();
