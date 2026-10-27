/* Sample content — real estate agent designs. All services and prices are fictional. */
(window.DESIGN_CONTENT = window.DESIGN_CONTENT || {})["real-estate"] = {
  noun: "real estate team",
  kind: "Real estate",
  schemaType: "RealEstateAgent",
  description: "Helping buyers and sellers in {city} with clear advice, local knowledge and a plan for every step.",
  primary: ["How we help", "check"],
  secondary: "call",
  nav: ["Services", "About", "Contact us", "Office"],
  menu: {
    id: "services",
    eyebrow: "How we help",
    heading: "Buying & selling",
    intro: "Start with a free conversation about your plans, timing and budget.",
    all: "All",
    footnote: "Commission and fees are agreed in writing before we start working together.",
    groups: [
      ["Selling", [
        ["Home value estimate", "A pricing report based on recent local sales.", "Free"],
        ["Listing & marketing", "Photos, online listing, showings and open houses.", "Agreed in writing"],
        ["Pre-sale advice", "What to fix, what to leave and how to stage.", "Included"],
      ]],
      ["Buying", [
        ["Buyer consultation", "Your budget, wish list and timeline.", "Free"],
        ["Home search & tours", "", "Included"],
        ["Offer & negotiation", "", "Included"],
      ]],
      ["Other", [
        ["First-time buyer guide", "Step-by-step checklist.", "Free"],
        ["Rental advice", "For owners thinking about renting out a home.", "Free"],
      ]],
    ],
  },
  about: {
    eyebrow: "About us",
    heading: "Local agents, local knowledge",
    text: [
      "{short} is a small real estate team in {city}. We help first-time buyers, growing families and longtime owners make their next move with confidence.",
      "We explain every step and every fee, answer the phone, and tell you the truth about the market.",
    ],
    highlights: [
      ["Clear advice", "Honest pricing and real numbers."],
      ["Easy to reach", "Call, text or email; we reply the same day."],
      ["Every step explained", "From first visit to closing day."],
    ],
    gallery: "Homes around town",
  },
  actions: {
    id: "contact-us",
    eyebrow: "Let's talk",
    heading: "Start with a free consultation",
    intro: "Thinking about buying or selling? Tell us a little about your plans.",
    groups: [
      ["Get started", [
        ["What's my home worth?", "clipboard", true, "On a real site, this opens a short form to request a free home value report."],
        ["Book a consultation", "calendar", true, "On a real site, this opens the agent's scheduling page (for example Calendly)."],
      ]],
      ["Talk to us", [
        ["Call", "phone", false, "tel"],
        ["Text", "message", false, "sms"],
      ]],
    ],
  },
  contact: { eyebrow: "Our office", heading: "Office & contact", call: "Call the office", note: "Meetings at our office, your home or over video." },
  hours: ["mon-fri 09:00-18:00; sat 10:00-16:00", "Evening and Sunday showings by appointment."],
  photos: {
    heroes: ["Craftsman-style house with a lawn and a walkway", "White two-story colonial house with a green lawn"],
    gallery: [
      ["Starter homes", "Bungalow with a white picket fence"],
      ["Ranch homes", "Single-story home at sunset"],
      ["Classic brick", "Brick house with a straight path across the lawn"],
      ["New construction", "Row of newly built houses"],
    ],
  },
};
