/* Sample content — yoga & pilates studio designs. All classes and prices are fictional. */
(window.DESIGN_CONTENT = window.DESIGN_CONTENT || {})["yoga"] = {
  noun: "yoga studio",
  kind: "Yoga & pilates",
  schemaType: "SportsActivityLocation",
  description: "Gentle, flow and pilates classes for every body, plus beginner series. Mats provided; your first class is on us.",
  primary: ["See classes & prices", "calendar"],
  secondary: "directions",
  nav: ["Classes", "About", "Book", "Visit"],
  menu: {
    id: "classes",
    eyebrow: "Classes",
    heading: "Classes & prices",
    intro: "New here? Start with Gentle Flow or the Beginner Series.",
    all: "All",
    footnote: "Mats and props provided. Please arrive 10 minutes early for your first class.",
    groups: [
      ["Classes", [
        ["Gentle flow", "Slow, steady movement and breathing. 60 minutes.", "Drop-in $20"],
        ["Vinyasa", "Flowing, energizing practice. 60 minutes.", "Drop-in $20"],
        ["Mat pilates", "Core strength and posture. 50 minutes.", "Drop-in $22"],
        ["Restorative", "Long, supported stretches. 75 minutes.", "Drop-in $22"],
      ]],
      ["Passes", [
        ["First class", "", "Free"],
        ["10-class pack", "Use within four months.", 170],
        ["Unlimited monthly", "", "$119 / month"],
      ]],
      ["Workshops", [
        ["Beginner series", "Four weeks of foundations.", 80],
        ["Private session", "One-on-one, 60 minutes.", 85],
      ]],
    ],
  },
  about: {
    eyebrow: "About the studio",
    heading: "Classes for every body",
    text: [
      "{short} is a small studio in {city} where everyone is welcome, whether you've practiced for years or never touched a mat.",
      "Our teachers offer options in every class, so you can go gently or challenge yourself.",
    ],
    highlights: [
      ["First class free", "Come try it, no pressure."],
      ["Small classes", "Room to move and a teacher who knows your name."],
      ["Mats provided", "Just bring yourself and some water."],
    ],
    gallery: "The studio",
  },
  actions: {
    id: "book",
    eyebrow: "Book",
    heading: "Book a class",
    intro: "See the weekly schedule and save your spot.",
    groups: [
      ["Classes", [
        ["See the schedule", "calendar", true, "On a real site, this opens the studio's class schedule (for example Mindbody, Momence or Walla)."],
        ["Buy a class pack", "external", false, "On a real site, this opens the studio's online store for passes."],
      ]],
      ["Questions?", [
        ["Text the studio", "message", false, "sms"],
      ]],
    ],
  },
  contact: { eyebrow: "Visit", call: "Call the studio", note: "Street parking nearby. Changing room and cubbies inside." },
  hours: ["mon-fri 06:30-20:30; sat-sun 08:00-13:00", "Hours shown are class times. See the schedule for details."],
  photos: {
    heroes: ["Yoga class holding downward dog in a wooden studio", "Person meditating on a deck by a lake"],
    gallery: [
      ["The studio", "Bright yoga studio with arched windows"],
      ["Mats provided", "Rolled yoga mats in bright colors"],
      ["Outdoor classes", "Outdoor yoga class under trees"],
      ["Sunrise sessions", "Person doing yoga on rocks by the sea at sunset"],
    ],
  },
};
