/* Sample content — photographer designs. All packages and prices are fictional. */
(window.DESIGN_CONTENT = window.DESIGN_CONTENT || {})["photography"] = {
  noun: "photography studio",
  kind: "Photographer",
  schemaType: "ProfessionalService",
  description: "Portraits, headshots, families and events, in the studio or on location. Book a session or ask about your date.",
  primary: ["See sessions & prices", "calendar"],
  secondary: "call",
  nav: ["Sessions", "About", "Book", "Contact"],
  menu: {
    id: "sessions",
    eyebrow: "Sessions",
    heading: "Sessions & prices",
    intro: "Every session includes planning, editing and an online gallery to download and share.",
    all: "All sessions",
    footnote: "Travel within {city} is included. Prints and albums available separately.",
    groups: [
      ["Portraits", [
        ["Headshots", "30 minutes, 3 edited images.", 175],
        ["Family session", "60 minutes on location, 40+ edited images.", 350],
        ["Senior portraits", "90 minutes, two locations.", 395],
      ]],
      ["Events", [
        ["Event coverage", "Per hour, two-hour minimum.", "$200 / hour"],
        ["Wedding coverage", "Packages from six hours.", "From $2,400"],
      ]],
      ["Business", [
        ["Team headshots", "On-site, per person.", "From $75"],
        ["Brand & product photos", "", "Quoted"],
      ]],
    ],
  },
  about: {
    eyebrow: "About",
    heading: "Photos that feel like you",
    text: [
      "{short} photographs people and events around {city}. Sessions are relaxed, with plenty of direction so you never feel awkward in front of the camera.",
      "Your edited gallery arrives online within two weeks, ready to download, share and print.",
    ],
    highlights: [
      ["Relaxed sessions", "Gentle direction, no stiff poses."],
      ["Online gallery", "Download, share and order prints."],
      ["Fast turnaround", "Edited images within two weeks."],
    ],
    gallery: "Behind the camera",
  },
  actions: {
    id: "book",
    eyebrow: "Book",
    heading: "Book a session",
    intro: "Check availability, or tell us about your event.",
    groups: [
      ["Sessions", [
        ["Book a session", "calendar", true, "On a real site, this opens the photographer's booking page (for example HoneyBook or Pixieset)."],
        ["Ask about your date", "clipboard", false, "On a real site, this opens a short inquiry form for weddings and events."],
      ]],
      ["Questions?", [
        ["Text me", "message", false, "sms"],
      ]],
    ],
  },
  contact: { eyebrow: "Contact", heading: "Studio & contact", call: "Call the studio", note: "Studio visits by appointment only." },
  hours: ["mon-fri 10:00-18:00; sat 09:00-17:00", "Studio by appointment. Weekend sessions book up early."],
  photos: {
    heroes: ["Camera with a lens on a wooden table", "Instant photos and a camera spread on a table in warm light"],
    gallery: [
      ["Film & digital", "Photographer holding a twin-lens camera, black and white"],
      ["Portraits", "Vintage folding camera on a wooden shelf"],
      ["Events", "Small camera held in an open hand"],
      ["Prints", "Medium-format camera, black and white"],
    ],
  },
};
