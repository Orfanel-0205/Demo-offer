/* Sample content — barbershop designs. All services and prices are fictional. */
(window.DESIGN_CONTENT = window.DESIGN_CONTENT || {})["barber"] = {
  noun: "barbershop",
  kind: "Barbershop",
  schemaType: "HairSalon",
  description: "Haircuts, fades, beard trims and hot towel shaves. Book online in a minute or walk in when a chair is free.",
  primary: ["See services & prices", "scissors"],
  secondary: "call",
  nav: ["Services", "About", "Book", "Visit"],
  menu: {
    id: "services",
    eyebrow: "Cuts & shaves",
    heading: "Services & prices",
    intro: "Every cut includes a hot towel and a neck shave.",
    all: "All services",
    footnote: "Prices may vary with hair length and style. Cash and cards accepted.",
    groups: [
      ["Haircuts", [
        ["Classic cut", "Scissor or clipper cut, styled.", 30],
        ["Skin fade", "Fade from skin, finished with a razor line-up.", 35],
        ["Kids' cut (12 and under)", "", 22],
        ["Buzz cut", "One length all over.", 20],
      ]],
      ["Beard & shave", [
        ["Beard trim & shape-up", "Clipper and razor detail.", 18],
        ["Hot towel shave", "Straight-razor shave with hot towels.", 35],
        ["Cut & beard combo", "", 48],
      ]],
      ["Extras", [
        ["Eyebrow cleanup", "", 8],
        ["Gray blending", "Natural-looking color for gray hair.", "From $25"],
      ]],
    ],
  },
  about: {
    eyebrow: "About the shop",
    heading: "A good cut, no rush",
    text: [
      "{short} is a neighborhood barbershop in {city} with a few chairs, good music and barbers who take their time.",
      "Book a time online so you don't wait, or walk in and grab a seat. We'll tell you how long the wait is.",
    ],
    highlights: [
      ["Book in a minute", "Pick your barber and time online."],
      ["Walk-ins welcome", "When a chair is free, it's yours."],
      ["Kids welcome", "Patient barbers for first haircuts."],
    ],
    gallery: "In the chair",
  },
  actions: {
    id: "book",
    eyebrow: "Book a chair",
    heading: "Book your cut",
    intro: "Choose a barber and a time that works for you.",
    groups: [
      ["Appointments", [
        ["Book online", "calendar", true, "On a real site, this opens the shop's booking page (for example Booksy, Square Appointments or Squire)."],
        ["Gift cards", "external", false, "On a real site, this opens the shop's gift card page."],
      ]],
      ["Questions?", [
        ["Text the shop", "message", false, "sms"],
      ]],
    ],
  },
  contact: { eyebrow: "Find the shop", call: "Call the shop", note: "Free parking behind the building." },
  hours: ["tue-fri 09:00-19:00; sat 08:00-16:00; sun 10:00-14:00", "Last walk-in 30 minutes before closing."],
  photos: {
    heroes: ["Barber trimming the back of a client's hair with clippers", "Barbershop interior with chairs, mirrors and plants"],
    gallery: [
      ["Beard trims", "Barber shaping a beard with a trimmer"],
      ["Walk-ins welcome", "Red, white and blue barber pole"],
      ["Hot towel shaves", "Barber giving a straight-razor shave"],
      ["The lounge", "Barbershop waiting lounge with a sofa and warm lights"],
    ],
  },
};
