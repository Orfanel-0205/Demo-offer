/* =============================================================================
   BRIGHT SITE TECH — STUDIO SETTINGS
   -----------------------------------------------------------------------------
   Your own business details: packages and prices, how inquiries reach you, and
   the sample designs in your portfolio. Used by:
     • your website (site/index.html)
     • the "About this sample" panel at the bottom of every demo
     • the end card of the demo videos
   Edit it from your phone in GitHub's web editor, like any config file.

   Keep every claim honest: no guaranteed results, no unlimited support,
   no testimonials or client logos you don't actually have.
   ========================================================================== */

window.AGENCY_CONFIG = {
  name: "Bright Site Tech",
  tagline: "Websites for local businesses",
  intro:
    "Bright Site Tech builds simple, mobile-friendly websites for restaurants, auto repair " +
    "shops and other local businesses: your services, prices, hours and contact details in " +
    "one place you own, linked to the tools you already use.",

  /* ---------------------------------------------------------------------------
     HOW PEOPLE REACH YOU — fill in at least the email. Leave "" to hide a line.
     Use a business email, not a personal one (it is shown publicly).
     whatsapp: digits only with country code, e.g. "639171234567".
     ------------------------------------------------------------------------ */
  contact: {
    email: "",
    phoneDisplay: "",
    phoneLink: "",
    whatsapp: "",
    hours: "Calls and messages during US business hours, Monday to Friday.",
  },

  /* ---------------------------------------------------------------------------
     INQUIRY FORM
     endpoint: paste your free Formspree form address here, e.g.
       "https://formspree.io/f/abcdwxyz"  (see docs/02-set-up-the-inquiry-form.md)
     If endpoint is "", the form opens the visitor's email app with the
     message ready to send to contact.email instead.
     ------------------------------------------------------------------------ */
  inquiry: {
    endpoint: "",
    replyTime: "We reply personally, usually within one business day.",
  },

  /* ---------------------------------------------------------------------------
     PACKAGES — shown on your site, in every demo and in the videos.
     ------------------------------------------------------------------------ */
  packages: [
    {
      id: "starter",
      name: "Starter Website",
      price: "$149",
      cadence: "one-time",
      badge: "Get online fast",
      summary: "A clean one-page website built on a proven layout for your type of business.",
      includes: [
        "One-page, mobile-first website",
        "Layout made for your industry: restaurant, auto shop, salon, home services and more",
        "Your logo, colors, photos and wording",
        "Menu or services list with prices you approve",
        "Opening hours with a live “Open now” badge, map and directions",
        "Tap-to-call and tap-to-text buttons",
        "Links to your social, booking, ordering or delivery pages",
        "Page title and description set up for search engines",
        "1 round of revisions",
        "Free hosting setup where the host’s terms allow",
      ],
      note: "Domain name paid separately by you and registered in your name.",
    },
    {
      id: "business",
      name: "Business Website",
      price: "$249",
      cadence: "one-time",
      badge: "Most complete",
      featured: true,
      summary: "A more tailored design with extra sections to show your work and make inquiries easy.",
      includes: [
        "Everything in Starter",
        "Design tailored to your brand: layout, fonts and colors",
        "Up to 8 sections, e.g. story, featured dishes or services, gallery, FAQ, service area",
        "Inquiry or quote-request form delivered to your email",
        "Booking, reservation or ordering buttons linked to services you already use",
        "Search-engine business details and a link-preview image",
        "2 rounds of revisions",
        "Launch checks on phone and desktop, plus a handover guide",
      ],
      note: "Final scope is confirmed in writing before work begins.",
    },
    {
      id: "updates",
      name: "Website Updates",
      price: "$39",
      cadence: "per month · optional",
      badge: "After launch",
      summary: "Small, ongoing changes handled for you once your site is live.",
      includes: [
        "A set number of small update requests each month",
        "Menu, price and opening-hour changes you send us",
        "Minor text or photo replacements",
        "A monthly check that your pages and links still work",
      ],
      note: "Included requests, response times and how to cancel are written into your agreement. No unlimited requests.",
    },
  ],

  addOnsNote: "Extra pages, logo design and photo editing can be quoted separately.",

  disclosures: [
    "Introductory prices while we build our portfolio — not an industry-standard rate.",
    "Domain registration and paid third-party services (booking, ordering, email) are separate unless included in a written quote.",
    "Not included: online ordering or payment systems, delivery integrations, paid advertising or custom backend development.",
    "All content — prices, hours, photos and business details — is supplied or approved by you.",
    "A website makes your information easier to find; it does not guarantee more customers, orders or search rankings.",
  ],

  // Text for the panel at the bottom of each sample design.
  demoPanel: {
    heading: "Want a website like this for your business?",
    intro:
      "This sample was designed by Bright Site Tech. We build sites like it for restaurants, " +
      "auto shops and other local businesses — with your own content, approved by you.",
  },

  /* ---------------------------------------------------------------------------
     PORTFOLIO — sample designs shown on your site. Images are screenshots made
     with tools/capture-portfolio.mjs (or upload your own).
     ------------------------------------------------------------------------ */
  portfolio: [
    {
      title: "Harbor & Hearth Kitchen",
      industry: "Restaurant",
      url: "demos/restaurant/",
      desktop: "assets/img/work-restaurant-desktop.jpg",
      phone: "assets/img/work-restaurant-phone.jpg",
      summary: "Warm, editorial design with a filterable menu, live opening hours and buttons for reservations and delivery apps.",
      features: ["Menu with category filters", "Live “Open now” hours", "Order & reserve links"],
    },
    {
      title: "Copperline Auto Care",
      industry: "Auto repair",
      url: "demos/auto-repair/",
      desktop: "assets/img/work-auto-repair-desktop.jpg",
      phone: "assets/img/work-auto-repair-phone.jpg",
      summary: "Bold, high-contrast design with upfront service prices, booking and quote buttons, and one-tap calling.",
      features: ["Services & starting prices", "Book / quote / text buttons", "Call button always visible"],
    },
  ],
};
