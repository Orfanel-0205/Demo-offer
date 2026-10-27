/* Sample content — plumbing designs. All services and prices are fictional. */
(window.DESIGN_CONTENT = window.DESIGN_CONTENT || {})["plumbing"] = {
  noun: "plumbing company",
  kind: "Plumbing",
  schemaType: "Plumber",
  description: "Leaks, clogs, water heaters and fixture installs for homes and small businesses. Upfront prices before any work starts.",
  primary: ["See services & prices", "wrench"],
  secondary: "call",
  nav: ["Services", "About", "Request", "Contact"],
  menu: {
    id: "services",
    eyebrow: "Upfront pricing",
    heading: "Services & prices",
    intro: "Typical starting prices. We give you the exact price in writing before we start.",
    all: "All services",
    tags: { SD: "Often same day" },
    footnote: "Parts are extra unless noted. Service area: {city} and nearby towns within about 25 miles.",
    groups: [
      ["Repairs", [
        ["Service call & diagnosis", "Credited toward the repair if you go ahead.", 79],
        ["Leak repair", "Pipes, valves and fittings.", "From $150", ["SD"]],
        ["Toilet repair", "Running, leaking or loose toilets.", "From $125", ["SD"]],
      ]],
      ["Drains", [
        ["Drain clearing", "Sinks, tubs and showers.", "From $129", ["SD"]],
        ["Main line clearing", "", "From $249"],
        ["Camera inspection", "See what's inside your sewer line.", 199],
      ]],
      ["Installs", [
        ["Water heater replacement", "Tank or tankless; quoted on site.", "Quoted"],
        ["Faucet or fixture install", "Customer-supplied or ours.", "From $150"],
        ["Garbage disposal install", "", "From $225"],
      ]],
    ],
  },
  about: {
    eyebrow: "About us",
    heading: "Plumbing fixed right, priced upfront",
    text: [
      "{short} is a local plumbing company serving {city} and nearby towns. We show up when we say we will, explain the problem, and give you the price before we start.",
      "Our trucks carry common parts, so most repairs are finished in one visit.",
    ],
    highlights: [
      ["Price first", "Written price before any work begins."],
      ["Clean work", "Shoe covers, drop cloths and cleanup after every job."],
      ["Arrival windows", "Two-hour windows and a text when we're on our way."],
    ],
    gallery: "On the job",
  },
  actions: {
    id: "request",
    eyebrow: "Get help",
    heading: "Request service",
    intro: "Book a visit online, ask for a quote, or call us.",
    groups: [
      ["Service", [
        ["Book a visit", "calendar", true, "On a real site, this opens the company's online booking page (for example Housecall Pro or Jobber)."],
        ["Request a quote", "clipboard", true, "On a real site, this opens a short form that sends job details and photos to the company's email."],
      ]],
      ["Talk to us", [
        ["Call now", "phone", false, "tel"],
        ["Text us a photo", "message", false, "sms"],
      ]],
    ],
  },
  contact: { eyebrow: "Contact", heading: "Contact & service area", call: "Call for service", note: "We serve {city} and nearby towns within about 25 miles." },
  hours: ["mon-fri 07:00-18:00; sat 08:00-14:00", "After-hours calls are returned the next morning."],
  photos: {
    heroes: ["Modern bathroom sink with a chrome faucet", "Water running from a kitchen faucet over a hand"],
    gallery: [
      ["Leak repairs", "Outdoor tap with a drop of water"],
      ["Repairs & installs", "Adjustable wrench on a wooden surface"],
      ["Drains & pipes", "Pipes and valves under a sink"],
    ],
  },
};
