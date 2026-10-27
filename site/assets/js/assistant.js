/* =============================================================================
   Bright Site Tech — chat assistant ("Questions?" button)
   A guided chat with preset answers. It answers from agency.config.js
   (packages, samples, contact details), from the design gallery
   (designs/catalog.js) and from the FAQ, "Who we help" and "How it works"
   sections of this page, so editing those updates its answers.
   A small "What business are you in?" bubble next to the button leads
   visitors to designs for their type of business.
   Questions it can't match go to a person: WhatsApp, email or the quote form.
   Runs entirely in the browser: no AI service, nothing typed is sent or saved.
   ========================================================================== */
(function () {
  "use strict";

  var A = window.AGENCY_CONFIG || {};
  var settings = A.assistant || {};
  var host = document.querySelector("[data-quick-contact]");
  if (settings.enabled === false || !host) return;

  var contact = A.contact || {};
  var packages = A.packages || [];
  var title = settings.name || (A.name || "Our") + " assistant";
  var greeting = settings.greeting || "Hi! How can I help?";
  var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function $$(sel) {
    return Array.prototype.slice.call(document.querySelectorAll(sel));
  }
  function text(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function para(s) {
    return "<p>" + esc(s) + "</p>";
  }
  function list(items, tag) {
    return "<" + (tag || "ul") + ">" + items.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</" + (tag || "ul") + ">";
  }
  // Same rule as site.js: a WhatsApp link is used as-is, a bare number becomes one.
  function whatsappUrl(value) {
    var v = String(value || "").trim();
    if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(v)) return v;
    var n = v.replace(/\D/g, "");
    return n ? "https://wa.me/" + n : "";
  }
  var whatsapp = whatsappUrl(contact.whatsapp);

  // The design gallery, when designs/catalog.js is loaded on this page.
  var C = window.DESIGN_CATALOG;
  var GALLERY = "designs/";
  var waitingForType = false;

  /* ---------- Matching questions to topics ---------------------------------- */
  var STOP = (
    "a an and are be can could do does for from get got have how i if im in is it its me my of on or our so the this " +
    "to us we what whats which will with would you your yours website websites site sites web page bright tech please about"
  ).split(" ");

  function words(s) {
    return (String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").match(/[a-z0-9]+/g) || []).filter(function (w) {
      return w.length > 1 && STOP.indexOf(w) === -1;
    });
  }
  // "book" ~ "booking", "price" ~ "pricing": a shared start of 4+ letters covering most of the shorter word.
  function alike(a, b) {
    var n = 0;
    while (n < a.length && n < b.length && a[n] === b[n]) n++;
    return n >= 4 && n >= Math.min(a.length, b.length) - 1;
  }
  function score(topic, query) {
    return query.reduce(function (total, q) {
      var best = 0;
      topic.strong.forEach(function (w) {
        if (q === w) best = 3;
        else if (best < 2 && alike(q, w)) best = 2;
      });
      if (!best && topic.weak.some(function (w) { return alike(q, w) || q === w; })) best = 1;
      return total + best;
    }, 0);
  }

  /* ---------- What the assistant knows -------------------------------------- */
  var topics = {};
  var order = [];
  function add(id, topic) {
    topic.id = id;
    topic.strong = words(topic.keywords);
    topic.weak = words(topic.chip + " " + topic.extra);
    topics[id] = topic;
    order.push(id);
  }

  var simple = packages[0];
  var complete = packages.filter(function (p) { return p.featured; })[0] || packages[1];
  function pkgLine(p) {
    return "<strong>" + esc(p.name) + " · " + esc(p.price) + "</strong> " + esc(p.cadence) + "<br />" + esc(p.summary);
  }
  var quoteAction = { label: "Get a quote", href: "#inquire" };

  function contactActions(question) {
    var actions = [];
    if (whatsapp) {
      // Number links can carry the question; QR links (wa.me/qr/…) can't.
      var wa = question && /^https:\/\/wa\.me\/\d+$/.test(whatsapp) ? whatsapp + "?text=" + encodeURIComponent(question) : whatsapp;
      actions.push({ label: "Chat on WhatsApp", href: wa, external: true });
    }
    if (contact.email) {
      actions.push({
        label: "Email us",
        href: "mailto:" + contact.email + "?subject=" + encodeURIComponent("Question from your website") + (question ? "&body=" + encodeURIComponent(question) : ""),
      });
    }
    if (contact.phoneLink) actions.push({ label: "Call " + contact.phoneDisplay, href: "tel:" + String(contact.phoneLink).replace(/[^\d+]/g, "") });
    actions.push(question ? { label: "Add my question to the quote form", toForm: question } : quoteAction);
    return actions;
  }

  if (packages.length) {
    add("prices", {
      chip: "What does a website cost?",
      keywords: "price pricing cost costs much cheap cheapest expensive fee fees rate rates budget package packages plans dollar dollars usd afford " +
        "include included includes difference compare comparison versus vs between " +
        packages.map(function (p) { return p.price; }).join(" "),
      answer: function () {
        return {
          html: para("Our fixed prices, in US dollars:") + list(packages.map(pkgLine)) + (simple.note ? para(simple.note) : ""),
          actions: [{ label: "See what each package includes", href: "#packages" }],
          next: ["fit", "faq:payments", "faq:hosting", "start"],
        };
      },
    });
  }
  if (simple && complete && simple !== complete) {
    add("fit", {
      chip: "Which package is right for me?",
      keywords: "which right best choose choice recommend recommendation suit better tailored custom",
      answer: function () {
        return {
          html: para("Happy to help you choose. What matters most to you?"),
          next: [
            { label: "Simple and quick", ask: "pkg:" + simple.id },
            { label: "A tailored design with more sections", ask: "pkg:" + complete.id },
            { label: "Not sure yet — ask a person", ask: "contact" },
          ],
        };
      },
    });
  }

  var industries = $$("#industries h3");
  if (industries.length) {
    add("industries", {
      chip: "Do you work with my type of business?",
      keywords:
        "type kind industry industries niche restaurant restaurants cafe coffee bakery diner pizza food bar grill taco auto car cars repair " +
        "mechanic mechanics garage tire tires body detailing salon barber barbershop spa nails hair beauty plumber plumbing hvac " +
        "electrician electrical contractor roofing cleaning cleaner landscaping lawn shop shops retail store boutique",
      extra: industries.map(function (h) { return text(h) + " " + text(h.nextElementSibling); }).join(" "),
      answer: function () {
        var named = industries.filter(function (h) { return !/\?$/.test(text(h)); });
        var other = industries.filter(function (h) { return /\?$/.test(text(h)); })[0];
        return {
          html: para("Yes. We design websites for:") + list(named.map(function (h) { return esc(text(h)); })) + (other ? para(text(other.nextElementSibling)) : ""),
          actions: [C ? { label: "Find designs for your business", href: GALLERY } : { label: "See the sample designs", href: "#work" }],
          next: ["samples", "prices", "start"],
        };
      },
    });
  }

  if (C) {
    add("samples", {
      chip: "Show me designs for my business",
      keywords: "example examples sample samples portfolio demo demos previous past show see look looks template templates design designs gallery style styles",
      answer: function () {
        return {
          html:
            para("We have " + C.designs.length + " sample designs for " + C.industries.length + " types of local business. " +
              "They're fictional businesses we made to show our work, so you can try each one like a real website.") +
            "<p><strong>What business are you in?</strong> Tap one below or type it.</p>",
          actions: [{ label: "Browse all " + C.designs.length + " designs", href: GALLERY }],
          next: ["ind:restaurant", "ind:hair-salon", "ind:barber", "ind:auto-repair", "ind:plumbing", "ind:cleaning"],
          awaitType: true,
        };
      },
    });
  } else if ((A.portfolio || []).length) {
    add("samples", {
      chip: "Can I see examples?",
      keywords: "example examples sample samples portfolio demo demos previous past show see look looks template templates design designs",
      answer: function () {
        return {
          html:
            para("Here are our sample designs. They're fictional businesses we made to show our work, so you can try them like a real site:") +
            list(A.portfolio.map(function (w) { return '<a href="' + esc(w.url) + '">' + esc(w.title) + "</a> · " + esc(w.industry); })),
          actions: [{ label: "See all samples", href: "#work" }],
          next: ["industries", "prices", "start"],
        };
      },
    });
  }

  packages.forEach(function (p) {
    add("pkg:" + p.id, {
      chip: "What's in " + p.name + "?",
      keywords: p.id + " " + p.name + " package include included includes",
      extra: p.summary + " " + (p.includes || []).join(" "),
      answer: function () {
        return {
          html:
            "<p><strong>" + esc(p.name) + " · " + esc(p.price) + "</strong> " + esc(p.cadence) + "</p>" + para(p.summary) +
            list((p.includes || []).map(esc)) + (p.note ? para(p.note) : ""),
          actions: [{ label: "Ask about " + p.name, href: "#inquire", pkg: p.name }],
          next: packages
            .filter(function (o) { return o !== p; })
            .map(function (o) { return "pkg:" + o.id; })
            .concat(["faq:payments"]),
        };
      },
    });
  });

  // FAQ answers come before the general topics below, so they win a tie.
  $$("#faq details").forEach(function (d, i) {
    var q = d.querySelector("summary");
    var a = d.querySelector("p");
    if (!q || !a) return;
    add("faq:" + (d.getAttribute("data-topic") || i), {
      chip: text(q),
      keywords: d.getAttribute("data-keywords") || "",
      extra: text(a),
      answer: function () {
        return {
          html: para(text(a)),
          actions: [{ label: "More answers in our FAQ", href: "#faq" }],
          next: ["prices", "start", "contact"],
        };
      },
    });
  });

  // One topic per type of business in the gallery: "I own a bakery" → bakery designs.
  // They come after the FAQ, so a question about photos or payments still gets the FAQ answer.
  function designsFor(ind, yes) {
    var all = C.forIndustry(ind.id);
    return {
      html:
        para((yes ? "Yes! " : "") + "You might like these " + C.noun(ind.id) + " designs:") +
        '<ul class="assistant__designs">' +
        all.slice(0, 3).map(function (d) {
          return '<li><a class="assistant__design" href="' + esc(C.path(d.url, GALLERY)) + '">' +
            '<img src="' + esc(C.path(d.thumb, GALLERY)) + '" alt="" width="640" height="400" loading="lazy" decoding="async" />' +
            "<span><strong>" + esc(d.name) + "</strong><small>" + esc(d.styleLabel) + " style</small></span></a></li>";
        }).join("") +
        "</ul>" +
        para("Each one is a sample. Yours would use your own name, prices, hours and photos."),
      actions: [
        { label: "See all " + all.length + " " + C.noun(ind.id) + " designs", href: GALLERY + "?type=" + ind.id },
        { label: "Ask about a site like these", href: "#inquire", industry: ind.form },
      ],
      next: ["prices", "faq:timeline", "start"],
    };
  }
  if (C) {
    C.industries.forEach(function (ind) {
      add("ind:" + ind.id, {
        chip: ind.label,
        keywords: ind.keywords,
        answer: function () { return designsFor(ind); },
      });
    });
  }

  function noSample(question) {
    return {
      html:
        para("We don't have a sample for that business yet, but the same layouts work for most local businesses that customers call, visit or book.") +
        para("Browse the gallery for a style you like, or tell us about your business and we'll suggest the closest designs."),
      actions: [
        { label: "Browse all " + C.designs.length + " designs", href: GALLERY },
        { label: "Add my business to the quote form", toForm: "My business: " + question },
      ],
      next: ["prices", "contact"],
    };
  }

  var steps = $$("#process h3");
  add("start", {
    chip: "How do I get started?",
    keywords: "start started starting begin sign hire next step steps process works work quote interested proceed buy purchase",
    extra: steps.map(text).join(" "),
    answer: function () {
      return {
        html:
          (steps.length ? para("Here's how it works:") + list(steps.map(function (h) { return esc(text(h)); }), "ol") : "") +
          para("Start with the quote form. It takes about two minutes, with no payment and no commitment."),
        actions: [quoteAction],
        next: ["faq:needs", "faq:timeline", "faq:payments", "contact"],
      };
    },
  });

  add("contact", {
    chip: "Talk to a person",
    keywords: "person human real talk call phone number whatsapp email mail contact reach message text someone somebody agent representative",
    answer: function () {
      return {
        html: para("Here's how to reach a real person:") + (contact.hours ? para(contact.hours) : "") + ((A.inquiry || {}).replyTime ? para(A.inquiry.replyTime) : ""),
        actions: contactActions(""),
        next: ["prices", "start"],
      };
    },
  });

  if (A.addOnsNote) {
    add("extras", {
      chip: "Extra pages or a logo?",
      keywords: "extra extras logo add addon addons additional pages multiple editing",
      answer: function () {
        return {
          html: para(A.addOnsNote) + para("Tell us what you need in the quote form and we'll include it in a written quote."),
          actions: [quoteAction],
          next: ["prices", "faq:integrations", "contact"],
        };
      },
    });
  }

  var MAIN = ["prices", "fit", "samples", "faq:timeline", "start", "contact"];

  function fallback(question) {
    return {
      html: para("I don't have a ready answer for that one, but a person can help. Send us your question and we'll reply personally."),
      actions: contactActions(question),
      next: ["prices", "samples", "start"],
    };
  }

  function answer(question) {
    var plain = question.toLowerCase().trim();
    if (/^(hi|hello|hey|good (morning|afternoon|evening))\b[\s!.,]*$/.test(plain)) return { html: para(greeting), next: MAIN };
    var query = words(question);
    var ranked = order
      .map(function (id) { return { id: id, score: score(topics[id], query) }; })
      .filter(function (r) { return r.score >= 2; })
      .sort(function (a, b) { return b.score - a.score; });
    var expectingType = waitingForType;
    waitingForType = false;
    // Right after "What business are you in?", look harder for a business type.
    if (expectingType && C && !(ranked[0] && /^ind:/.test(ranked[0].id))) {
      var found = C.match(question)[0];
      if (found) return designsFor(found);
      if (!ranked.length || ranked[0].score < 3) return noSample(question);
    }
    // "Do you work with plumbers?" → yes, with plumbing designs rather than the general list.
    if (C && ranked[0] && ranked[0].id === "industries") {
      var named = C.match(question)[0];
      if (named) return designsFor(named, true);
    }
    if (ranked.length) {
      var reply = topics[ranked[0].id].answer();
      // Offer the runner-up too, in case it was the better match.
      if (ranked[1]) reply.next = [ranked[1].id].concat((reply.next || []).filter(function (n) { return n !== ranked[1].id; }));
      return reply;
    }
    if (/^(thanks|thank you|thx|ty|ok|okay|great|cool|perfect|awesome)\b/.test(plain)) {
      return { html: para("You're welcome! Anything else I can help with?"), next: MAIN };
    }
    return fallback(question);
  }

  /* ---------- Interface ----------------------------------------------------- */
  function svg(paths, size) {
    return '<svg viewBox="0 0 24 24" width="' + (size || 22) + '" height="' + (size || 22) + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + paths + "</svg>";
  }
  var ICON_CHAT = svg('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 9h8M8 13h5"/>', 24);
  var ICON_CLOSE = svg('<path d="M18 6 6 18M6 6l12 12"/>');
  var ICON_SEND = svg('<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>', 20);

  var TEASER = [["ind:restaurant", "Restaurant"], ["ind:hair-salon", "Salon"], ["ind:auto-repair", "Auto repair"], ["ind:plumbing", "Home services"], ["samples", "Something else"]];
  var teaserHtml = C && settings.teaser !== false
    ? '<aside class="assistant-teaser" aria-label="Find designs for your business" data-assistant-teaser hidden>' +
      '<p class="assistant-teaser__q">What business are you in?</p>' +
      '<p class="assistant-teaser__sub">See website designs made for it.</p>' +
      '<div class="assistant-teaser__chips">' +
      TEASER.map(function (t) { return '<button type="button" class="assistant-teaser__chip" data-teaser="' + t[0] + '">' + esc(t[1]) + "</button>"; }).join("") +
      "</div>" +
      '<button type="button" class="assistant-teaser__close" data-teaser-close>' + ICON_CLOSE + '<span class="sr-only">Dismiss</span></button>' +
      "</aside>"
    : "";

  document.documentElement.classList.add("has-assistant");
  host.insertAdjacentHTML(
    "beforeend",
    teaserHtml +
    '<button type="button" class="assistant-launcher" aria-expanded="false" aria-controls="assistant" data-assistant-launcher>' + ICON_CHAT +
      '<span class="assistant-launcher__label">Questions?</span><span class="sr-only"> Chat with our assistant</span></button>' +
      '<div class="assistant" id="assistant" role="dialog" aria-labelledby="assistant-title" aria-describedby="assistant-note" tabindex="-1" hidden>' +
      '<div class="assistant__head">' +
      '<img src="assets/brand/mark.svg" alt="" aria-hidden="true" width="36" height="36" />' +
      '<div class="assistant__heading"><h2 id="assistant-title">' + esc(title) + '</h2><p>Automated answers &middot; instant replies</p></div>' +
      '<button type="button" class="assistant__close" data-assistant-close>' + ICON_CLOSE + '<span class="sr-only">Close chat</span></button>' +
      "</div>" +
      '<div class="assistant__log" role="log" aria-live="polite" data-assistant-log>' +
      '<p class="assistant__note" id="assistant-note">An automated assistant with answers from this website. Nothing you type here is sent or saved.</p>' +
      "</div>" +
      '<div class="assistant__chips" role="group" aria-label="Suggested questions" data-assistant-chips></div>' +
      '<form class="assistant__form" data-assistant-form>' +
      '<label class="sr-only" for="assistant-input">Type your question</label>' +
      '<input id="assistant-input" type="text" autocomplete="off" maxlength="300" enterkeyhint="send" placeholder="Type a question…" />' +
      '<button type="submit" class="assistant__send">' + ICON_SEND + '<span class="sr-only">Send</span></button>' +
      "</form>" +
      "</div>"
  );

  var launcher = host.querySelector("[data-assistant-launcher]");
  var panel = document.getElementById("assistant");
  var log = panel.querySelector("[data-assistant-log]");
  var chips = panel.querySelector("[data-assistant-chips]");
  var form = panel.querySelector("[data-assistant-form]");
  var input = document.getElementById("assistant-input");
  var phoneSheet = window.matchMedia("(max-width: 599px)");
  var started = false;
  var teaser = host.querySelector("[data-assistant-teaser]");
  var TEASER_KEY = "bst-teaser-closed";

  // On phones the chat covers the whole screen, so the page behind it is made inert.
  function setPageInert(on) {
    Array.prototype.forEach.call(document.body.children, function (el) {
      if (el !== host && el.tagName !== "SCRIPT") el.inert = on;
    });
    Array.prototype.forEach.call(host.children, function (el) {
      if (el !== panel) el.inert = on;
    });
  }

  /* The bubble appears once per visit, a few seconds after the page opens,
     and stays away for the rest of the visit once used or dismissed. */
  function hideTeaser() {
    if (!teaser || teaser.hidden) return;
    teaser.hidden = true;
    try {
      sessionStorage.setItem(TEASER_KEY, "1");
    } catch (err) {}
  }
  if (teaser) {
    var seen = false;
    try {
      seen = sessionStorage.getItem(TEASER_KEY) === "1";
    } catch (err) {}
    if (!seen) {
      setTimeout(function () {
        if (panel.hidden && !started) teaser.hidden = false;
      }, settings.teaserDelay || 5000);
    }
    teaser.addEventListener("click", function (e) {
      var chip = e.target.closest("[data-teaser]");
      if (e.target.closest("[data-teaser-close]")) {
        hideTeaser();
        launcher.focus();
      } else if (chip) {
        var id = chip.getAttribute("data-teaser");
        hideTeaser();
        open();
        ask(chip.textContent, topics[id].answer());
        if (id === "samples") input.focus();
      }
    });
  }

  function open() {
    hideTeaser();
    panel.hidden = false;
    launcher.setAttribute("aria-expanded", "true");
    document.documentElement.classList.add("assistant-open");
    var modal = phoneSheet.matches;
    panel.setAttribute("aria-modal", String(modal));
    setPageInert(modal);
    if (!started) {
      started = true;
      respond({ html: para(greeting), next: MAIN });
    }
    panel.focus();
  }

  function close(returnFocus) {
    panel.hidden = true;
    launcher.setAttribute("aria-expanded", "false");
    document.documentElement.classList.remove("assistant-open");
    setPageInert(false);
    if (returnFocus) launcher.focus();
  }

  function addMessage(who, html) {
    var msg = document.createElement("div");
    msg.className = "msg msg--" + who;
    msg.innerHTML = '<span class="sr-only">' + (who === "bot" ? "Assistant:" : "You:") + '</span><div class="msg__bubble">' + html + "</div>";
    log.appendChild(msg);
    return msg;
  }

  function actionHtml(a, i) {
    var cls = "assistant__action" + (i === 0 ? " assistant__action--primary" : "");
    if (a.toForm) return '<button type="button" class="' + cls + '" data-to-form="' + esc(a.toForm) + '">' + esc(a.label) + "</button>";
    return (
      '<a class="' + cls + '" href="' + esc(a.href) + '"' + (a.pkg ? ' data-package="' + esc(a.pkg) + '"' : "") +
      (a.industry ? ' data-industry="' + esc(a.industry) + '"' : "") +
      (a.external ? ' target="_blank" rel="noopener"' : "") + ">" + esc(a.label) +
      (a.external ? '<span class="sr-only"> (opens in a new tab)</span>' : "") + "</a>"
    );
  }

  function setChips(next) {
    var hadFocus = chips.contains(document.activeElement);
    var shown = [];
    (next || MAIN).forEach(function (n) {
      var chip = typeof n === "string" ? { ask: n } : n;
      if (topics[chip.ask] && shown.length < 6) shown.push(chip);
    });
    chips.innerHTML = shown
      .map(function (c) { return '<button type="button" class="assistant__chip" data-ask="' + esc(c.ask) + '">' + esc(c.label || topics[c.ask].chip) + "</button>"; })
      .join("");
    if (hadFocus) (chips.firstElementChild || input).focus();
  }

  function respond(reply) {
    var msg = addMessage("bot", reply.html);
    if (reply.actions && reply.actions.length) {
      var row = document.createElement("div");
      row.className = "msg__actions";
      row.innerHTML = reply.actions.map(actionHtml).join("");
      msg.appendChild(row);
    }
    setChips(reply.next);
    waitingForType = !!reply.awaitType;
    log.scrollTop = Math.max(0, msg.offsetTop - 56);
  }

  function ask(label, reply) {
    var mine = addMessage("user", esc(label));
    log.scrollTop = mine.offsetTop;
    if (reducedMotion) return respond(reply);
    var typing = addMessage("bot", '<span class="assistant__dots"><i></i><i></i><i></i></span>');
    typing.setAttribute("aria-hidden", "true");
    typing.classList.add("msg--typing");
    setTimeout(function () {
      log.removeChild(typing);
      respond(reply);
    }, 450);
  }

  launcher.addEventListener("click", function () {
    if (panel.hidden) open();
    else close(true);
  });
  panel.querySelector("[data-assistant-close]").addEventListener("click", function () {
    close(true);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (!panel.hidden) close(true);
    else if (teaser && !teaser.hidden && teaser.contains(document.activeElement)) {
      hideTeaser();
      launcher.focus();
    }
  });
  phoneSheet.addEventListener("change", function () {
    if (!panel.hidden) open();
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var question = input.value.trim();
    if (!question) return;
    input.value = "";
    ask(question, answer(question));
  });

  panel.addEventListener("click", function (e) {
    var chip = e.target.closest("[data-ask]");
    if (chip) {
      ask(chip.textContent, topics[chip.getAttribute("data-ask")].answer());
      return;
    }
    var toForm = e.target.closest("[data-to-form]");
    if (toForm) {
      var message = document.getElementById("f-message");
      if (message) message.value = (message.value ? message.value + "\n\n" : "") + toForm.getAttribute("data-to-form");
      close(false);
      var target = document.getElementById("inquire");
      if (target) target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
      var first = document.getElementById("f-name");
      if (first) first.focus({ preventScroll: true });
      return;
    }
    // Links to sections of this page close the chat so the section is visible.
    if (e.target.closest('a[href^="#"]')) close(false);
  });
})();
