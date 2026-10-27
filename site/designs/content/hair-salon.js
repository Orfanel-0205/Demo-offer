/* Sample content — hair salon designs. All services and prices are fictional. */
(window.DESIGN_CONTENT = window.DESIGN_CONTENT || {})["hair-salon"] = {
  noun: "hair salon",
  kind: "Hair salon",
  schemaType: "HairSalon",
  description: "Cuts, color, blowouts and treatments in a relaxed studio. Book online and tell us what you have in mind.",
  primary: ["See services & prices", "scissors"],
  secondary: "directions",
  nav: ["Services", "About", "Book", "Visit"],
  menu: {
    id: "services",
    eyebrow: "Services",
    heading: "Services & prices",
    intro: "Starting prices. Your stylist confirms the price at your consultation, before anything starts.",
    all: "All services",
    footnote: "Longer or thicker hair may take more time and product. Please give 24 hours' notice to cancel.",
    groups: [
      ["Cuts & styling", [
        ["Women's cut & style", "Consultation, wash, cut and blow-dry.", "From $65"],
        ["Men's cut", "", "From $40"],
        ["Blowout", "Wash and a smooth or bouncy blow-dry.", "From $45"],
        ["Updo / event styling", "", "From $85"],
      ]],
      ["Color", [
        ["Single-process color", "Root touch-up or all-over color.", "From $95"],
        ["Partial highlights", "", "From $120"],
        ["Balayage", "Hand-painted, soft and blended.", "From $180"],
        ["Gloss / toner", "", "From $45"],
      ]],
      ["Treatments", [
        ["Deep conditioning", "", 30],
        ["Keratin smoothing", "Reduces frizz for weeks.", "From $250"],
      ]],
    ],
  },
  about: {
    eyebrow: "About the salon",
    heading: "Healthy hair, honest advice",
    text: [
      "At {short}, every appointment starts with a conversation: what you like, what you don't, and how much time you want to spend on your hair each morning.",
      "We'll tell you honestly what's possible in one visit, and what it will cost, before we begin.",
    ],
    highlights: [
      ["Consultations first", "We agree on the plan and price before starting."],
      ["Gentle products", "Color and care products chosen for healthy hair."],
      ["Easy booking", "Book online any time of day."],
    ],
    gallery: "At the salon",
  },
  actions: {
    id: "book",
    eyebrow: "Book",
    heading: "Book an appointment",
    intro: "Pick a service and stylist online, or send us a text with questions.",
    groups: [
      ["Appointments", [
        ["Book online", "calendar", true, "On a real site, this opens the salon's booking page (for example Vagaro, Fresha or Square Appointments)."],
        ["Free color consultation", "clipboard", false, "On a real site, this opens a short form that sends consultation requests to the salon."],
      ]],
      ["Questions?", [
        ["Text the salon", "message", false, "sms"],
      ]],
    ],
  },
  contact: { eyebrow: "Visit the salon", call: "Call the salon", note: "Free parking in the lot behind the building." },
  hours: ["tue-thu 10:00-19:00; fri 09:00-18:00; sat 09:00-16:00", "Evening appointments by request."],
  photos: {
    heroes: ["Hair salon with mirrors, styling chairs and a chandelier", "Close-up of a loose braid"],
    gallery: [
      ["Wash & treatment", "Salon room with a wash basin and an ornate mirror"],
      ["Updos", "Hair styled in a low bun, seen from behind"],
      ["Color", "Long hair with warm ombré color, seen from behind"],
      ["Waves & blowouts", "Long wavy hair seen from behind"],
    ],
  },
};
