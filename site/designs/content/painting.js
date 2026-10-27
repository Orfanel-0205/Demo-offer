/* Sample content — painting contractor designs. All services and prices are fictional. */
(window.DESIGN_CONTENT = window.DESIGN_CONTENT || {})["painting"] = {
  noun: "painting company",
  kind: "Painting contractor",
  schemaType: "HousePainter",
  description: "Interior and exterior painting, cabinets and decks for homes and small businesses. Careful prep, clean lines and written estimates.",
  primary: ["See services", "check"],
  secondary: "call",
  nav: ["Services", "About", "Estimate", "Contact"],
  menu: {
    id: "services",
    eyebrow: "Services",
    heading: "Painting services",
    intro: "Every project starts with a free walk-through and a written estimate.",
    all: "All services",
    footnote: "Prices include paint unless noted. Service area: {city} and nearby towns.",
    groups: [
      ["Interior", [
        ["Single room", "Walls, two coats, standard-height ceilings.", "From $450"],
        ["Ceilings", "", "From $250 / room"],
        ["Trim & doors", "", "Quoted"],
      ]],
      ["Exterior", [
        ["Full exterior", "Wash, scrape, prime and two coats.", "Quoted"],
        ["Front door refresh", "", "From $225"],
        ["Deck staining", "Wash, sand and stain.", "From $600"],
      ]],
      ["Specialty", [
        ["Kitchen cabinets", "Clean, sand, prime and spray-finish.", "From $3,200"],
        ["Drywall patching", "Before painting.", "From $150"],
      ]],
    ],
  },
  about: {
    eyebrow: "About us",
    heading: "Careful prep, clean lines",
    text: [
      "{short} paints homes and small businesses around {city}. Most of a good paint job is prep: patching, sanding, caulking and protecting everything that isn't being painted.",
      "We help you choose colors, keep you updated each day, and walk through the finished job with you.",
    ],
    highlights: [
      ["Free color advice", "Samples on your walls before you decide."],
      ["Protected floors", "Drop cloths and plastic on everything."],
      ["Daily cleanup", "Your home stays livable during the job."],
    ],
    gallery: "Recent projects",
  },
  actions: {
    id: "estimate",
    eyebrow: "Free estimate",
    heading: "Get a free estimate",
    intro: "Tell us about your project and we'll schedule a walk-through.",
    groups: [
      ["Estimates", [
        ["Request an estimate", "clipboard", true, "On a real site, this opens a short form that sends project details and photos to the painter's email."],
        ["Book a walk-through", "calendar", false, "On a real site, this opens the company's online scheduling page."],
      ]],
      ["Talk to us", [
        ["Call us", "phone", false, "tel"],
        ["Text us photos", "message", false, "sms"],
      ]],
    ],
  },
  contact: { eyebrow: "Contact", heading: "Contact & service area", call: "Call for an estimate", note: "We serve {city} and nearby towns." },
  hours: ["mon-fri 07:30-17:30; sat 09:00-13:00", "Estimates usually scheduled within the week."],
  photos: {
    heroes: ["Brick wall painted a deep blue", "Hand painting white trim with a brush"],
    gallery: [
      ["Brushes & rollers", "Two paint brushes with blue and red paint"],
      ["Exterior paint", "Red painted wooden wall"],
      ["Interior rooms", "Clean white room with small plants on a table"],
      ["Prep & priming", "Painter priming the base of a wall"],
    ],
  },
};
