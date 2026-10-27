/* Sample content — tax & bookkeeping designs. All services and prices are fictional. */
(window.DESIGN_CONTENT = window.DESIGN_CONTENT || {})["tax"] = {
  noun: "tax and bookkeeping office",
  kind: "Tax & bookkeeping",
  schemaType: "AccountingService",
  description: "Tax returns, monthly bookkeeping and payroll for individuals and small businesses. Flat fees, quoted upfront.",
  primary: ["See services & fees", "clipboard"],
  secondary: "call",
  nav: ["Services", "About", "Appointments", "Office"],
  menu: {
    id: "services",
    eyebrow: "Flat fees",
    heading: "Services & fees",
    intro: "Starting fees. We confirm your fee before we begin, so there are no surprises.",
    all: "All services",
    footnote: "We'll tell you what documents to bring when you book.",
    groups: [
      ["Tax returns", [
        ["Individual return", "Federal and one state, W-2 income.", "From $150"],
        ["Self-employed return", "Includes Schedule C.", "From $295"],
        ["Small business return", "Partnerships and S corporations.", "From $750"],
      ]],
      ["Bookkeeping", [
        ["Monthly bookkeeping", "Reconciled accounts and monthly reports.", "From $250 / month"],
        ["Catch-up bookkeeping", "Get months or years back on track.", "Quoted"],
      ]],
      ["Payroll", [
        ["Payroll setup", "", "From $150"],
        ["Payroll processing", "Up to 10 employees.", "From $60 / month"],
      ]],
    ],
  },
  about: {
    eyebrow: "About us",
    heading: "Taxes and books, handled",
    text: [
      "{short} helps individuals and small businesses in {city} file on time and keep clean books all year.",
      "We explain your numbers in plain English and answer questions year-round, not just in tax season.",
    ],
    highlights: [
      ["Flat fees", "Quoted before we start."],
      ["Secure uploads", "Send documents from your phone."],
      ["Year-round help", "Questions answered after April too."],
    ],
    gallery: "Our office",
  },
  actions: {
    id: "appointments",
    eyebrow: "Appointments",
    heading: "Book an appointment",
    intro: "Meet in the office or by video, or drop off your documents.",
    groups: [
      ["Appointments", [
        ["Book an appointment", "calendar", true, "On a real site, this opens the office's scheduling page."],
        ["Upload documents", "clipboard", false, "On a real site, this opens the office's secure document portal."],
      ]],
      ["Talk to us", [
        ["Call the office", "phone", false, "tel"],
      ]],
    ],
  },
  contact: { eyebrow: "Our office", heading: "Office & contact", call: "Call the office", note: "Free parking. Document drop box by the front door." },
  hours: ["mon-fri 09:00-17:00", "Extended hours from February to April, including Saturdays."],
  photos: {
    heroes: ["Minimal office desk with a computer, a plant and a wall calendar", "Calculator, pen and printed figures on a desk"],
    gallery: [
      ["Bookkeeping", "Laptop and notebook on a wooden desk"],
      ["Tax returns", "Laptop and glasses on a wooden table"],
      ["Payroll", "Calculator and laptop on a desk in daylight"],
      ["Our office", "Bright workspace with a desktop computer"],
    ],
  },
};
