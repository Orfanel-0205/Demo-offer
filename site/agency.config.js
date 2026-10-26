/* =============================================================================
   RESTAURANTLAUNCH — PACKAGES SHOWN ON THE DEMO
   -----------------------------------------------------------------------------
   This file is about YOUR web design service, not about the restaurant.
   It is only displayed while demoMode is true in config.js.
   For a paying client's website you can leave this file in place (it will be
   ignored once demoMode is false) or delete it together with its <script> tag.

   Prices are introductory offers being tested with first clients. Keep every
   claim here honest: no guaranteed results, no unlimited support.
   ========================================================================== */

window.AGENCY_CONFIG = {
  name: "RestaurantLaunch",
  eyebrow: "About this sample",
  heading: "Want a website like this for your restaurant?",
  intro:
    "RestaurantLaunch builds simple, mobile-friendly websites for independent " +
    "restaurants: your menu, hours, location and contact details in one place, " +
    "linked to the ordering and reservation services you already use.",

  // How prospects reach you. Leave "" to hide a line.
  // Tip: use a business email, not a personal one.
  contact: {
    email: "",
    phoneDisplay: "",
    phoneLink: "",
    fallback: "Reply to the message or email where you received this link — I'll answer personally.",
  },

  packages: [
    {
      id: "pilot",
      name: "First-Client Pilot",
      price: "$149",
      cadence: "one-time",
      badge: "Introductory · first 2 clients",
      summary: "A clean one-page website to get your restaurant online quickly.",
      includes: [
        "One-page responsive website",
        "Restaurant introduction and food highlights",
        "Menu section with owner-approved information",
        "Business hours and location",
        "Click-to-call and directions links",
        "Links to your existing social media and delivery services",
        "One revision round",
        "Free hosting option where appropriate and permitted by the host",
      ],
      note: "Domain registration is paid separately by the restaurant.",
    },
    {
      id: "standard",
      name: "Standard Website Launch",
      price: "$249",
      cadence: "one-time",
      badge: "Main offer",
      featured: true,
      summary: "A more tailored design with room for your story and signature dishes.",
      includes: [
        "Everything in the Pilot package",
        "More customized visual design",
        "Restaurant story and featured dishes sections",
        "Basic page titles and metadata",
        "Mobile responsiveness and launch checks",
        "One revision round",
        "Handover instructions",
      ],
      note: "Final scope is confirmed in writing before work begins.",
    },
    {
      id: "updates",
      name: "Website Updates",
      price: "$39",
      cadence: "per month · optional",
      badge: "After launch",
      summary: "Small, ongoing changes handled for you once the site is live.",
      includes: [
        "A set number of small update requests each month",
        "Menu and opening-hour changes you supply",
        "Minor text or image replacements",
        "Basic website maintenance within the agreed scope",
      ],
      note: "The number of included requests and response times are defined in your written agreement.",
    },
  ],

  disclosures: [
    "Prices are introductory offers currently being tested — not an industry-standard rate.",
    "Domain registration and paid third-party services are separate unless included in a written quote.",
    "Not included: online ordering systems, payment processing, delivery integrations, paid advertising or custom backend development.",
    "All restaurant content — prices, hours, images and business details — is supplied or approved by the owner.",
    "A website makes your information easier to find; it does not guarantee more customers, orders or search rankings.",
  ],
};
