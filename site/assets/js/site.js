/* =============================================================================
   Bright Site Tech — studio website behavior
   Reads window.AGENCY_CONFIG (agency.config.js) to fill in the portfolio,
   packages and contact options, and runs the inquiry form.
   ========================================================================== */
(function () {
  "use strict";

  var A = window.AGENCY_CONFIG || {};
  var contact = A.contact || {};
  var inquiry = A.inquiry || {};

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function $(sel, root) {
    return (root || document).querySelector(sel);
  }
  function $$(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }
  function digits(s) {
    return String(s || "").replace(/[^\d+]/g, "");
  }

  var ICON = {
    mail: '<path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><path d="m22 6-10 7L2 6"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
    message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  };
  function icon(name) {
    return '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[name] + "</svg>";
  }

  /* ---------- Small things ------------------------------------------------- */
  $$("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
  if (A.packages && A.packages[0]) {
    $$("[data-from-price]").forEach(function (el) {
      el.textContent = A.packages[0].price;
    });
  }

  /* ---------- Header & menu ------------------------------------------------ */
  var header = $("[data-header]");
  var menuBtn = $("[data-menu-btn]");
  var nav = $("[data-nav]");
  function setMenu(open, focusBack) {
    menuBtn.setAttribute("aria-expanded", String(open));
    header.classList.toggle("is-open", open);
    if (!open && focusBack) menuBtn.focus();
  }
  if (header && menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      setMenu(menuBtn.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && header.classList.contains("is-open")) setMenu(false, true);
    });
    document.addEventListener("click", function (e) {
      if (header.classList.contains("is-open") && !header.contains(e.target)) setMenu(false);
    });
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Portfolio ---------------------------------------------------- */
  var portfolio = $("[data-portfolio]");
  if (portfolio) {
    portfolio.innerHTML = (A.portfolio || [])
      .map(function (w) {
        return (
          '<article class="work-card">' +
          '<a class="work-card__media" href="' + esc(w.url) + '" tabindex="-1" aria-hidden="true">' +
          '<img class="work-card__desktop" src="' + esc(w.desktop) + '" alt="" width="1366" height="820" loading="lazy" decoding="async" />' +
          '<img class="work-card__phone" src="' + esc(w.phone) + '" alt="" width="780" height="1560" loading="lazy" decoding="async" />' +
          "</a>" +
          '<div class="work-card__body">' +
          '<div class="tag-row"><span class="tag">' + esc(w.industry) + '</span><span class="tag tag--muted">Fictional sample</span></div>' +
          "<h3>" + esc(w.title) + "</h3>" +
          '<p class="work-card__summary">' + esc(w.summary) + "</p>" +
          '<ul class="work-card__features">' + (w.features || []).map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("") + "</ul>" +
          '<div class="work-card__actions">' +
          '<a class="btn btn--navy" href="' + esc(w.url) + '">Open the live demo<span class="sr-only">: ' + esc(w.title) + "</span></a>" +
          '<a class="btn btn--outline" href="#inquire" data-industry="' + esc(w.industry) + '">Ask about a site like this</a>' +
          "</div></div></article>"
        );
      })
      .join("");
  }

  /* ---------- Packages ----------------------------------------------------- */
  var packages = $("[data-packages]");
  if (packages) {
    packages.innerHTML = (A.packages || [])
      .map(function (p) {
        return (
          '<article class="pkg' + (p.featured ? " pkg--featured" : "") + '" aria-labelledby="pkg-' + esc(p.id) + '">' +
          (p.badge ? '<p class="pkg__badge">' + esc(p.badge) + "</p>" : "") +
          '<h3 id="pkg-' + esc(p.id) + '">' + esc(p.name) + "</h3>" +
          '<p class="pkg__price"><span class="pkg__amount">' + esc(p.price) + '</span><span class="pkg__cadence">' + esc(p.cadence) + "</span></p>" +
          '<p class="pkg__summary">' + esc(p.summary) + "</p>" +
          '<ul class="pkg__list">' + (p.includes || []).map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + "</ul>" +
          (p.note ? '<p class="pkg__note">' + esc(p.note) + "</p>" : "") +
          '<a class="btn btn--outline" href="#inquire" data-package="' + esc(p.name) + '">Ask about ' + esc(p.name) + "</a>" +
          "</article>"
        );
      })
      .join("");
  }
  var addons = $("[data-addons]");
  if (addons) addons.textContent = A.addOnsNote || "";
  var disclosures = $("[data-disclosures]");
  if (disclosures) {
    disclosures.innerHTML = (A.disclosures || []).map(function (d) { return "<li>" + esc(d) + "</li>"; }).join("");
  }
  var packageChoices = $("[data-package-choices]");
  if (packageChoices) {
    packageChoices.insertAdjacentHTML(
      "afterbegin",
      (A.packages || [])
        .map(function (p) {
          return '<label class="choice"><input type="radio" name="package" value="' + esc(p.name + " (" + p.price + ")") + '" /> <span>' + esc(p.name) + " &middot; " + esc(p.price) + "</span></label>";
        })
        .join("")
    );
  }

  /* ---------- Contact options ---------------------------------------------- */
  var options = [];
  if (contact.email) options.push({ href: "mailto:" + contact.email, icon: "mail", label: "Email", detail: contact.email });
  if (contact.phoneLink) options.push({ href: "tel:" + digits(contact.phoneLink), icon: "phone", label: "Call", detail: contact.phoneDisplay });
  if (contact.phoneLink) options.push({ href: "sms:" + digits(contact.phoneLink), icon: "message", label: "Text", detail: contact.phoneDisplay });
  if (contact.whatsapp) options.push({ href: "https://wa.me/" + digits(contact.whatsapp).replace("+", ""), icon: "message", label: "WhatsApp", detail: "Chat with us", external: true });

  var optionsEl = $("[data-contact-options]");
  if (optionsEl) {
    optionsEl.innerHTML = options
      .map(function (o) {
        return (
          '<a class="contact-option" href="' + esc(o.href) + '"' + (o.external ? ' target="_blank" rel="noopener"' : "") + ">" +
          icon(o.icon) + "<span>" + esc(o.label) + "<small>" + esc(o.detail) + "</small></span>" +
          (o.external ? '<span class="sr-only">(opens in a new tab)</span>' : "") + "</a>"
        );
      })
      .join("") + (options.length && contact.hours ? '<p class="contact-hours">' + esc(contact.hours) + "</p>" : "");
  }
  var footerContact = $("[data-footer-contact]");
  if (footerContact) {
    footerContact.innerHTML =
      (contact.email ? '<p><a href="mailto:' + esc(contact.email) + '">' + esc(contact.email) + "</a></p>" : "") +
      (contact.phoneLink ? '<p><a href="tel:' + esc(digits(contact.phoneLink)) + '">' + esc(contact.phoneDisplay) + "</a></p>" : "") +
      (contact.hours ? "<p>" + esc(contact.hours) + "</p>" : "");
  }
  var replyTime = $("[data-reply-time]");
  if (replyTime) replyTime.textContent = inquiry.replyTime || "";

  /* ---------- Sticky "Get a quote" button on phones ------------------------ */
  var sticky = $("[data-sticky-cta]");
  var hero = $(".hero");
  var inquire = $("#inquire");
  if (sticky && hero && inquire && "IntersectionObserver" in window) {
    var heroVisible = true;
    var formVisible = false;
    var update = function () {
      sticky.classList.toggle("is-visible", !heroVisible && !formVisible);
    };
    new IntersectionObserver(function (entries) {
      heroVisible = entries[0].isIntersecting;
      update();
    }).observe(hero);
    new IntersectionObserver(function (entries) {
      formVisible = entries[0].isIntersecting;
      update();
    }).observe(inquire);
  }

  /* ---------- Inquiry form ------------------------------------------------- */
  var form = $("[data-inquiry-form]");
  if (!form) return;
  var done = $("[data-form-done]");
  var statusEl = $("[data-form-status]");
  var summary = $("[data-error-summary]");
  var submit = $("[data-submit]");

  // Buttons elsewhere on the page can pre-select a package or business type.
  document.addEventListener("click", function (e) {
    var pkgBtn = e.target.closest("[data-package]");
    if (pkgBtn) {
      $$('input[name="package"]', form).forEach(function (r) {
        if (r.value.indexOf(pkgBtn.getAttribute("data-package")) === 0) r.checked = true;
      });
    }
    var indBtn = e.target.closest("[data-industry]");
    if (indBtn) {
      var want = indBtn.getAttribute("data-industry").toLowerCase().split(" ")[0];
      var select = form.elements.business_type;
      Array.prototype.forEach.call(select.options, function (opt) {
        if (opt.value && opt.value.toLowerCase().indexOf(want) !== -1) select.value = opt.value;
      });
    }
  });

  function method() {
    var checked = $('input[name="contact_method"]:checked', form);
    return checked ? checked.value : "";
  }

  function setError(field, errorId, show) {
    var err = document.getElementById(errorId);
    if (err) err.hidden = !show;
    if (field && field.setAttribute) field.setAttribute("aria-invalid", show ? "true" : "false");
    return show;
  }

  function validate() {
    var f = form.elements;
    var bad = [];
    var m = method();
    var phoneDigits = digits(f.phone.value).replace(/^\+?1/, "");
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim());
    if (setError(f.name, "f-name-err", !f.name.value.trim())) bad.push(f.name);
    if (setError(f.business, "f-business-err", !f.business.value.trim())) bad.push(f.business);
    if (setError(f.business_type, "f-type-err", !f.business_type.value)) bad.push(f.business_type);
    if (setError(null, "f-method-err", !m)) bad.push($('input[name="contact_method"]', form));
    var needPhone = m === "Phone call" || m === "Text message";
    var phoneBad = (needPhone && phoneDigits.length < 10) || (f.phone.value.trim() && phoneDigits.length < 10);
    if (setError(f.phone, "f-phone-err", phoneBad)) bad.push(f.phone);
    var emailBad = (m === "Email" && !emailOk) || (f.email.value.trim() && !emailOk);
    if (setError(f.email, "f-email-err", emailBad)) bad.push(f.email);
    summary.hidden = bad.length === 0;
    if (bad.length) bad[0].focus();
    return bad.length === 0;
  }

  function summaryText(data) {
    var lines = [
      "Name: " + data.get("name"),
      "Business: " + data.get("business"),
      "Type of business: " + data.get("business_type"),
      "Best way to reach me: " + data.get("contact_method"),
      "Phone: " + (data.get("phone") || "-"),
      "Email: " + (data.get("email") || "-"),
      "City & state: " + (data.get("city_state") || "-"),
      "Current website/page: " + (data.get("current_link") || "-"),
      "Package: " + (data.get("package") || "-"),
      "",
      data.get("message") || "",
    ];
    return lines.join("\n");
  }

  function showDone(title, text) {
    form.hidden = true;
    done.hidden = false;
    $("[data-done-title]", done).textContent = title;
    $("[data-done-text]", done).textContent = text;
    done.focus();
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    statusEl.textContent = "";
    if (!validate()) {
      summary.focus();
      return;
    }
    var data = new FormData(form);
    if (data.get("_gotcha")) return; // spam bot
    var subject = "Website inquiry — " + data.get("business");
    var firstName = String(data.get("name")).trim().split(/\s+/)[0];

    if (inquiry.endpoint) {
      data.append("_subject", subject);
      if (data.get("email")) data.append("_replyto", data.get("email"));
      submit.disabled = true;
      submit.textContent = "Sending…";
      fetch(inquiry.endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } })
        .then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          showDone("Thanks, " + firstName + " — your inquiry is on its way.", (inquiry.replyTime || "We'll get back to you soon.") + " We'll reach you by " + String(data.get("contact_method")).toLowerCase() + ".");
        })
        .catch(function () {
          statusEl.textContent = contact.email
            ? "Sorry, the message couldn't be sent. Please email us at " + contact.email + "."
            : "Sorry, the message couldn't be sent. Please try again in a moment.";
        })
        .then(function () {
          submit.disabled = false;
          submit.textContent = "Send inquiry";
        });
      return;
    }

    if (contact.email) {
      var mailto = "mailto:" + contact.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(summaryText(data));
      window.location.href = mailto;
      showDone(
        "Almost done, " + firstName + " — press Send in your email app.",
        "Your email app should have opened with your details filled in. If it didn't, email us at " + contact.email + " and we'll take it from there."
      );
      return;
    }

    statusEl.textContent = "This form isn't connected yet. Please use another way to contact us.";
  });

  // Clear a field's error as soon as it's fixed.
  form.addEventListener("input", function (e) {
    if (e.target.getAttribute("aria-invalid") === "true") validateQuietly();
  });
  form.addEventListener("change", function (e) {
    if (e.target.name === "contact_method") {
      var m = method();
      $("[data-phone-hint]").textContent = m === "Email" ? "(optional)" : "(required for calls or texts)";
      $("[data-email-hint]").textContent = m === "Email" ? "(required)" : "(optional)";
    }
  });
  function validateQuietly() {
    var active = document.activeElement;
    validate();
    if (active && active.focus) active.focus();
  }
})();
