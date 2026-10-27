/* Sample content — electrician designs. All services and prices are fictional. */
(window.DESIGN_CONTENT = window.DESIGN_CONTENT || {})["electrical"] = {
  noun: "electrical contractor",
  kind: "Electrical contractor",
  schemaType: "Electrician",
  description: "Repairs, panel upgrades, lighting and EV chargers for homes and small businesses. Clear quotes and tidy work.",
  primary: ["See services & prices", "wrench"],
  secondary: "call",
  nav: ["Services", "About", "Request", "Contact"],
  menu: {
    id: "services",
    eyebrow: "Services",
    heading: "Services & prices",
    intro: "Starting prices for common jobs. Larger projects are quoted in writing after a visit.",
    all: "All services",
    footnote: "Permits are pulled when the job requires one. Service area: {city} and nearby towns.",
    groups: [
      ["Repairs", [
        ["Service call & troubleshooting", "Finding the cause of tripping breakers, dead outlets and flickering lights.", 95],
        ["Outlet or switch replacement", "Per device, standard parts included.", "From $85"],
        ["GFCI outlet install", "For kitchens, baths and outdoors.", "From $125"],
      ]],
      ["Lighting & fans", [
        ["Light fixture install", "Customer-supplied fixture.", "From $110"],
        ["Ceiling fan install", "Existing wiring.", "From $165"],
        ["Recessed lighting", "Per light, new install.", "From $150"],
      ]],
      ["Upgrades", [
        ["Panel upgrade", "Quoted after an on-site visit.", "Quoted"],
        ["EV charger install", "Level 2 charger, existing panel capacity.", "From $650"],
        ["Whole-home surge protector", "", "From $295"],
      ]],
    ],
  },
  about: {
    eyebrow: "About us",
    heading: "Safe wiring, clear quotes",
    text: [
      "{short} handles electrical work for homes and small businesses around {city}. We explain what we find, show you the options and put the price in writing.",
      "We protect your floors, label your panel and clean up before we leave.",
    ],
    highlights: [
      ["Written quotes", "Know the price before work starts."],
      ["Labeled panels", "We label circuits so you know what's what."],
      ["On-time arrivals", "Text alerts when we're on the way."],
    ],
    gallery: "Our work",
  },
  actions: {
    id: "request",
    eyebrow: "Get help",
    heading: "Request service",
    intro: "Book a visit, ask for a quote, or give us a call.",
    groups: [
      ["Service", [
        ["Book a visit", "calendar", true, "On a real site, this opens the electrician's online booking page."],
        ["Request a quote", "clipboard", true, "On a real site, this opens a short quote form that sends job details to the company's email."],
      ]],
      ["Talk to us", [
        ["Call now", "phone", false, "tel"],
        ["Text us", "message", false, "sms"],
      ]],
    ],
  },
  contact: { eyebrow: "Contact", heading: "Contact & service area", call: "Call an electrician", note: "We serve {city} and nearby towns within about 30 miles." },
  hours: ["mon-fri 07:30-17:30", "Weekend appointments by arrangement."],
  photos: {
    heroes: ["Cluster of glowing Edison bulb pendant lights", "Electrician working on electric meters on a brick wall"],
    gallery: [
      ["Panel upgrades", "Open breaker panel with neat wiring"],
      ["Lighting installs", "Cage pendant light hanging by a window"],
      ["Fixtures & fans", "Simple white ceiling light fixture"],
      ["Garage & shop lights", "Wall-mounted light fixture glowing at night"],
    ],
  },
};
