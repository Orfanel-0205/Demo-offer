/* Sample content — roofing designs. All services and prices are fictional. */
(window.DESIGN_CONTENT = window.DESIGN_CONTENT || {})["roofing"] = {
  noun: "roofing company",
  kind: "Roofing",
  schemaType: "RoofingContractor",
  description: "Roof inspections, repairs, replacements and gutters for homes. Free written estimates with photos of what we found.",
  primary: ["See our services", "shield"],
  secondary: "call",
  nav: ["Services", "About", "Estimate", "Contact"],
  menu: {
    id: "services",
    eyebrow: "Services",
    heading: "Roofing services",
    intro: "Every estimate includes photos from your roof and a written scope of work.",
    all: "All services",
    footnote: "Replacement prices depend on roof size, pitch and materials. Service area: {city} and surrounding counties.",
    groups: [
      ["Inspections & repairs", [
        ["Roof inspection", "Photos and a written report.", "Free"],
        ["Leak repair", "Find and fix the source.", "From $350"],
        ["Shingle replacement", "Missing or damaged shingles.", "From $275"],
      ]],
      ["Replacement", [
        ["Asphalt shingle roof", "Tear-off, underlayment and new shingles.", "Quoted"],
        ["Metal roofing", "Standing seam or exposed fastener.", "Quoted"],
        ["Storm damage help", "We document damage for your insurance claim.", "Free estimate"],
      ]],
      ["Gutters", [
        ["Gutter cleaning", "Single-story homes.", "From $150"],
        ["New seamless gutters", "Per linear foot, installed.", "Quoted"],
      ]],
    ],
  },
  about: {
    eyebrow: "About us",
    heading: "Roofs built to last",
    text: [
      "{short} repairs and replaces roofs around {city}. Before we quote, we climb up, take photos and show you exactly what we see.",
      "On replacement days we protect your yard, use magnets to pick up nails and leave the site clean.",
    ],
    highlights: [
      ["Photo estimates", "See your roof's condition for yourself."],
      ["Clean job sites", "Nail sweeps and cleanup every day."],
      ["Written scope", "What's included, in writing, before work starts."],
    ],
    gallery: "Recent projects",
  },
  actions: {
    id: "estimate",
    eyebrow: "Free estimate",
    heading: "Get a free roof estimate",
    intro: "Tell us about your roof and we'll schedule an inspection.",
    groups: [
      ["Estimates", [
        ["Request an estimate", "clipboard", true, "On a real site, this opens a short form that sends the homeowner's details to the roofer's email."],
        ["Book an inspection", "calendar", false, "On a real site, this opens the company's online scheduling page."],
      ]],
      ["Talk to us", [
        ["Call now", "phone", false, "tel"],
        ["Text us photos", "message", false, "sms"],
      ]],
    ],
  },
  contact: { eyebrow: "Contact", heading: "Contact & service area", call: "Call for an estimate", note: "We serve {city} and surrounding counties." },
  hours: ["mon-fri 07:00-18:00; sat 08:00-12:00", "Estimates scheduled within a few days of your request."],
  photos: {
    heroes: ["Roofer nailing asphalt shingles with a nail gun", "Roofer working on a tiled roof"],
    gallery: [
      ["Shingle roofs", "Aerial view of a house with a shingle roof"],
      ["Metal roofing", "Aerial view of a house with a metal roof"],
      ["Tile installs", "Roofer installing roof tiles on battens"],
      ["Repairs", "Roof with old decking being replaced"],
    ],
  },
};
