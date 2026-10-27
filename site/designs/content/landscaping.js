/* Sample content — lawn & landscaping designs. All services and prices are fictional. */
(window.DESIGN_CONTENT = window.DESIGN_CONTENT || {})["landscaping"] = {
  noun: "lawn and landscaping company",
  kind: "Lawn & landscaping",
  schemaType: "HomeAndConstructionBusiness",
  description: "Weekly mowing, cleanups, mulch, planting and small landscape projects for homes and businesses. Free quotes.",
  primary: ["See services & prices", "check"],
  secondary: "call",
  nav: ["Services", "About", "Quote", "Contact"],
  menu: {
    id: "services",
    eyebrow: "Services",
    heading: "Services & prices",
    intro: "Prices for a typical quarter-acre yard. We'll quote your property exactly.",
    all: "All services",
    footnote: "Service area: {city} and nearby neighborhoods. Weekly and every-other-week plans available.",
    groups: [
      ["Lawn care", [
        ["Weekly mowing", "Mow, edge, trim and blow.", "From $45 / visit"],
        ["Every-other-week mowing", "", "From $55 / visit"],
        ["Aeration & overseeding", "", "From $175"],
      ]],
      ["Cleanups", [
        ["Spring cleanup", "Beds cleared, edges cut and debris hauled away.", "From $225"],
        ["Fall leaf cleanup", "", "From $250"],
        ["Hedge & shrub trimming", "", "From $95"],
      ]],
      ["Landscaping", [
        ["Mulch installation", "Per cubic yard, installed.", "From $85"],
        ["Planting", "Shrubs, perennials and seasonal color.", "Quoted"],
        ["Small patios & walkways", "", "Quoted"],
      ]],
    ],
  },
  about: {
    eyebrow: "About us",
    heading: "Sharp edges, every visit",
    text: [
      "{short} takes care of yards around {city}, from weekly mowing to new garden beds. Same crew, same day each week, so your yard always looks right.",
      "Not sure what you need? We'll walk the property with you and give you a written quote.",
    ],
    highlights: [
      ["Same crew", "The same people care for your yard each week."],
      ["Free quotes", "Walk-through and a written quote."],
      ["Simple billing", "Pay monthly by card or online invoice."],
    ],
    gallery: "Recent work",
  },
  actions: {
    id: "quote",
    eyebrow: "Free quote",
    heading: "Get a free quote",
    intro: "Tell us about your yard and what you'd like done.",
    groups: [
      ["Quotes", [
        ["Request a quote", "clipboard", true, "On a real site, this opens a short form that sends the property details to the company's email."],
        ["Start weekly mowing", "calendar", false, "On a real site, this opens the company's sign-up or booking page (for example Jobber)."],
      ]],
      ["Talk to us", [
        ["Call us", "phone", false, "tel"],
        ["Text us", "message", false, "sms"],
      ]],
    ],
  },
  contact: { eyebrow: "Contact", heading: "Contact & service area", call: "Call for a quote", note: "We serve {city} and nearby neighborhoods." },
  hours: ["mon-fri 07:00-18:00; sat 08:00-14:00", "Rain days are rescheduled to the next dry day."],
  photos: {
    heroes: ["Wide, freshly mowed lawn bordered by shrubs and trees", "Crew member mowing a large lawn on a riding mower"],
    gallery: [
      ["Weekly mowing", "Lawn mower cutting tall grass, seen from a low angle"],
      ["Garden beds", "Garden with flowering shrubs"],
      ["Lawn care", "Close-up of fresh green grass"],
      ["Commercial lots", "Riding mower on a sunny lawn"],
    ],
  },
};
