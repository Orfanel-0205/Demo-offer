/* Sample content — car detailing designs. All services and prices are fictional. */
(window.DESIGN_CONTENT = window.DESIGN_CONTENT || {})["detailing"] = {
  noun: "car detailing business",
  kind: "Car detailing",
  schemaType: "AutoWash",
  description: "Hand washes, interior details, paint correction and ceramic coatings. Book a time at the shop, or ask about mobile service at your home.",
  primary: ["See packages & prices", "car"],
  secondary: "call",
  nav: ["Packages", "About", "Book", "Visit"],
  menu: {
    id: "packages",
    eyebrow: "Packages",
    heading: "Detailing packages",
    intro: "Prices for sedans. SUVs and trucks are $20–$60 more depending on size and condition.",
    all: "All packages",
    footnote: "Heavy pet hair, stains or odors may add time. We'll quote it before we start.",
    groups: [
      ["Wash & interior", [
        ["Exterior hand wash", "Foam wash, wheels, tires and a hand dry.", 45],
        ["Interior detail", "Vacuum, shampoo, wipe-down and windows.", 150],
        ["Full detail", "Inside and out, plus a spray sealant.", 230],
      ]],
      ["Paint", [
        ["Clay bar & wax", "Removes grit and adds shine.", 120],
        ["One-step paint correction", "Polish out light swirls and haze.", "From $350"],
        ["Ceramic coating", "Long-lasting protection and gloss.", "From $800"],
      ]],
      ["Mobile service", [
        ["Mobile wash", "At your home or office, within our service area.", "From $65"],
        ["Mobile full detail", "", "From $260"],
      ]],
    ],
  },
  about: {
    eyebrow: "About us",
    heading: "Showroom shine, inside and out",
    text: [
      "{short} details cars by hand, one at a time. We check your car with you before we start and walk you around it when we're done.",
      "Short on time? Our mobile van can come to your driveway or office parking lot.",
    ],
    highlights: [
      ["By hand", "No automatic brushes, ever."],
      ["Mobile service", "We come to you within our service area."],
      ["Clear pricing", "Price confirmed before we start."],
    ],
    gallery: "Recent details",
  },
  actions: {
    id: "book",
    eyebrow: "Book",
    heading: "Book a detail",
    intro: "Pick a package and a time, or send photos for a quote.",
    groups: [
      ["Appointments", [
        ["Book online", "calendar", true, "On a real site, this opens the detailer's booking page (for example Square Appointments or Urable)."],
        ["Get a quote", "clipboard", true, "On a real site, this opens a short form where customers can describe their car and add photos."],
      ]],
      ["Questions?", [
        ["Text us photos", "message", false, "sms"],
      ]],
    ],
  },
  contact: { eyebrow: "Find us", call: "Call to book", note: "Drop your car off on the way to work and pick it up in the evening." },
  hours: ["mon-fri 08:00-18:00; sat 08:00-16:00", "Mobile appointments available on weekdays."],
  photos: {
    heroes: ["Glossy black sports car parked under trees at sunset", "White sports car in a dark garage"],
    gallery: [
      ["Hand wash & dry", "Water beading on a freshly washed headlight"],
      ["Interior detailing", "Clean leather seats and dashboard"],
      ["Paint correction", "Polished car hood with a glossy finish"],
      ["Wheels & tires", "Close-up of a clean alloy wheel at sunset"],
    ],
  },
};
