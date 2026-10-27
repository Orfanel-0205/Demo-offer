/* Sample content — heating & air designs. All services and prices are fictional. */
(window.DESIGN_CONTENT = window.DESIGN_CONTENT || {})["hvac"] = {
  noun: "heating and air company",
  kind: "Heating & air conditioning",
  schemaType: "HVACBusiness",
  description: "AC and furnace repair, seasonal tune-ups and new heat pumps for homes. Honest advice on whether to repair or replace.",
  primary: ["See services & prices", "wrench"],
  secondary: "call",
  nav: ["Services", "About", "Request", "Contact"],
  menu: {
    id: "services",
    eyebrow: "Services",
    heading: "Services & prices",
    intro: "Starting prices. New systems are quoted in writing after a free in-home visit.",
    all: "All services",
    footnote: "Parts and refrigerant are extra unless noted. Service area: {city} and nearby towns.",
    groups: [
      ["Repairs", [
        ["Diagnostic visit", "Credited toward the repair if you go ahead.", 89],
        ["AC repair", "Capacitors, fans, leaks and more.", "From $150"],
        ["Furnace repair", "Igniters, sensors and blowers.", "From $150"],
      ]],
      ["Maintenance", [
        ["AC tune-up", "Clean, test and check refrigerant.", 99],
        ["Furnace tune-up", "Clean, test and safety check.", 99],
        ["Comfort plan", "Two tune-ups a year plus priority booking.", "$15 / month"],
      ]],
      ["New systems", [
        ["Heat pump install", "Quoted after an in-home visit.", "Quoted"],
        ["Ductless mini-split", "Single or multi-room.", "Quoted"],
        ["Smart thermostat install", "Customer-supplied or ours.", "From $150"],
      ]],
    ],
  },
  about: {
    eyebrow: "About us",
    heading: "Comfortable all year",
    text: [
      "{short} keeps homes around {city} cool in summer and warm in winter. We fix what can be fixed, and we tell you honestly when replacement makes more sense.",
      "Every visit ends with a short written summary of what we found and what we did.",
    ],
    highlights: [
      ["Repair or replace?", "Straight answers, with the numbers."],
      ["Written summaries", "Know exactly what was done."],
      ["Comfort plan", "Tune-ups twice a year and priority booking."],
    ],
    gallery: "Our work",
  },
  actions: {
    id: "request",
    eyebrow: "Get help",
    heading: "Request service",
    intro: "Book a repair or tune-up online, or call us.",
    groups: [
      ["Service", [
        ["Book a visit", "calendar", true, "On a real site, this opens the company's online booking page (for example ServiceTitan or Housecall Pro)."],
        ["Free replacement quote", "clipboard", true, "On a real site, this opens a short form to request an in-home estimate."],
      ]],
      ["Talk to us", [
        ["Call now", "phone", false, "tel"],
      ]],
    ],
  },
  contact: { eyebrow: "Contact", heading: "Contact & service area", call: "Call for service", note: "We serve {city} and nearby towns within about 30 miles." },
  hours: ["mon-fri 07:00-18:00; sat 08:00-13:00", "Busy season: book tune-ups early in spring and fall."],
  photos: {
    heroes: ["Two outdoor air conditioning units beside a flower bed", "Wall-mounted ductless mini-split air conditioner"],
    gallery: [
      ["AC installs", "Outdoor AC condenser against a brick wall"],
      ["Ductless systems", "Mini-split unit high on a living room wall"],
      ["Tune-ups", "Remote control for an air conditioner"],
      ["Heat pumps", "Heat pump outdoor unit on gravel"],
    ],
  },
};
