/* Sample content — nail salon designs. All services and prices are fictional. */
(window.DESIGN_CONTENT = window.DESIGN_CONTENT || {})["nail-salon"] = {
  noun: "nail salon",
  kind: "Nail salon",
  schemaType: "NailSalon",
  description: "Manicures, pedicures, gel, dip and custom nail art. Book online or walk in, and choose from hundreds of colors.",
  primary: ["See services & prices", "book"],
  secondary: "directions",
  nav: ["Services", "About", "Book", "Visit"],
  menu: {
    id: "services",
    eyebrow: "Nails",
    heading: "Services & prices",
    intro: "Tools are cleaned and sanitized between every client.",
    all: "All services",
    footnote: "Nail art is priced by design. Show us a photo and we'll give you a price first.",
    groups: [
      ["Manicures", [
        ["Classic manicure", "Shape, cuticle care and polish.", 25],
        ["Gel manicure", "Long-lasting shine.", 40],
        ["Dip powder", "", 45],
        ["Acrylic full set", "", "From $50"],
      ]],
      ["Pedicures", [
        ["Classic pedicure", "Soak, scrub, shape and polish.", 35],
        ["Deluxe pedicure", "Adds a mask, hot towels and a longer massage.", 55],
        ["Gel pedicure", "", 50],
      ]],
      ["Extras", [
        ["Nail art", "Per nail or full set.", "From $5"],
        ["Gel removal", "", 10],
        ["Polish change", "", 15],
      ]],
    ],
  },
  about: {
    eyebrow: "About us",
    heading: "Clean, careful nail care",
    text: [
      "{short} is a bright, calm nail studio in {city}. We take our time, keep our tools clean and help you pick the right color.",
      "Bring a photo of the nails you want, or let our team suggest something new.",
    ],
    highlights: [
      ["Sanitized tools", "Cleaned and sanitized between every client."],
      ["Hundreds of colors", "Polish, gel and dip in every shade."],
      ["Groups welcome", "Book side-by-side seats for friends and parties."],
    ],
    gallery: "Recent sets",
  },
  actions: {
    id: "book",
    eyebrow: "Book",
    heading: "Book your nails",
    intro: "Book online, or walk in when we have a free seat.",
    groups: [
      ["Appointments", [
        ["Book online", "calendar", true, "On a real site, this opens the salon's booking page (for example Fresha or Square Appointments)."],
        ["Group bookings", "clipboard", false, "On a real site, this opens a short form for parties and group appointments."],
      ]],
      ["Questions?", [
        ["Text us", "message", false, "sms"],
      ]],
    ],
  },
  contact: { eyebrow: "Visit", call: "Call the salon", note: "Plenty of parking in the shopping center lot." },
  hours: ["mon-sat 09:30-19:30; sun 11:00-17:00", "Walk-ins welcome when seats are free."],
  photos: {
    heroes: ["Hand holding a bottle of pink nail polish while painting nails", "Manicurist painting a client's nails"],
    gallery: [
      ["Colors", "Nail color sample wheel with dozens of shades"],
      ["Nail art", "Long nails decorated with gold nail art"],
      ["Detail work", "Fine nail art brushes"],
      ["Custom designs", "Applying a tiny flower decal to a nail"],
    ],
  },
};
