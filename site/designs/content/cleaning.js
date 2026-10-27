/* Sample content — house cleaning designs. All services and prices are fictional. */
(window.DESIGN_CONTENT = window.DESIGN_CONTENT || {})["cleaning"] = {
  noun: "cleaning company",
  kind: "Home cleaning",
  schemaType: "HomeAndConstructionBusiness",
  description: "Weekly, every-other-week and one-time cleaning for homes and small offices. Supplies included, checklist every visit.",
  primary: ["See prices", "check"],
  secondary: "call",
  nav: ["Prices", "About", "Book", "Contact"],
  menu: {
    id: "prices",
    eyebrow: "Pricing",
    heading: "Cleaning prices",
    intro: "Prices for a 2-bedroom, 2-bathroom home. We confirm your price after a quick call or walk-through.",
    all: "All",
    footnote: "Supplies and equipment included. Service area: {city} and nearby suburbs.",
    groups: [
      ["Regular cleaning", [
        ["Weekly", "Kitchen, bathrooms, dusting, floors and trash.", "From $120"],
        ["Every other week", "", "From $140"],
        ["Monthly", "", "From $160"],
      ]],
      ["One-time", [
        ["Deep clean", "Baseboards, inside the microwave, blinds and more.", "From $250"],
        ["Move-in / move-out", "Empty home, inside cabinets and appliances.", "From $300"],
      ]],
      ["Add-ons", [
        ["Inside the oven", "", 35],
        ["Inside the fridge", "", 35],
        ["Interior windows", "", "From $40"],
      ]],
    ],
  },
  about: {
    eyebrow: "About us",
    heading: "Come home to clean",
    text: [
      "{short} cleans homes and small offices around {city}. Every visit follows the same checklist, so nothing gets missed.",
      "Tell us what matters most to you, and we'll note it for every cleaner who visits.",
    ],
    highlights: [
      ["Checklist every visit", "The same thorough clean, every time."],
      ["Supplies included", "Or we'll use yours if you prefer."],
      ["Easy rescheduling", "Change your date with a quick text."],
    ],
    gallery: "Fresh and tidy",
  },
  actions: {
    id: "book",
    eyebrow: "Book",
    heading: "Book a cleaning",
    intro: "Get an instant estimate, book online, or text us.",
    groups: [
      ["Booking", [
        ["Book a cleaning", "calendar", true, "On a real site, this opens the company's online booking page (for example Launch27 or Jobber)."],
        ["Get a quote", "clipboard", false, "On a real site, this opens a short quote form for homes and offices."],
      ]],
      ["Questions?", [
        ["Text us", "message", false, "sms"],
      ]],
    ],
  },
  contact: { eyebrow: "Contact", heading: "Contact & service area", call: "Call us", note: "We serve {city} and nearby suburbs." },
  hours: ["mon-fri 08:00-18:00; sat 09:00-15:00", "Office calls answered during business hours."],
  photos: {
    heroes: ["Bright, tidy living room with a blue sofa and white cabinets", "Clean bathroom with a double vanity"],
    gallery: [
      ["Living rooms", "Tidy living room with a light gray sofa"],
      ["Home offices", "Clean white desk with a laptop"],
      ["Supplies included", "Green and yellow cleaning sponge"],
      ["Move-in ready", "Bright room with a plant and simple furniture"],
    ],
  },
};
