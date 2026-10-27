/* Sample content — gym & fitness designs. All memberships and prices are fictional. */
(window.DESIGN_CONTENT = window.DESIGN_CONTENT || {})["gym"] = {
  noun: "gym",
  kind: "Gym & fitness",
  schemaType: "ExerciseGym",
  description: "Open gym, coached classes and personal training for every level. Try your first class free.",
  primary: ["See memberships", "calendar"],
  secondary: "directions",
  nav: ["Memberships", "About", "Join", "Visit"],
  menu: {
    id: "memberships",
    eyebrow: "Memberships",
    heading: "Memberships & classes",
    intro: "No long contracts. Cancel with 30 days' notice.",
    all: "All",
    footnote: "Prices per month unless noted. Ask about student and family rates.",
    groups: [
      ["Memberships", [
        ["Open gym", "Full access during staffed hours.", "$39 / month"],
        ["Unlimited classes", "All group classes plus open gym.", "$99 / month"],
        ["10-class pass", "Use within three months.", 150],
      ]],
      ["Classes", [
        ["Strength fundamentals", "Learn the main lifts with a coach.", "Included"],
        ["HIIT", "45 minutes of intervals.", "Included"],
        ["Kettlebell class", "", "Included"],
      ]],
      ["Personal training", [
        ["Single session", "60 minutes one-on-one.", 70],
        ["Four-session pack", "", 260],
      ]],
    ],
  },
  about: {
    eyebrow: "About us",
    heading: "Strength for everyone",
    text: [
      "{short} is a friendly gym in {city} for people who want to get stronger, move better and have a little fun doing it.",
      "New to training? Every member gets a free intro session to learn the equipment and set goals.",
    ],
    highlights: [
      ["First class free", "Try a class before you join."],
      ["Coached classes", "Small groups with a coach watching your form."],
      ["No long contracts", "Month to month, 30 days' notice to cancel."],
    ],
    gallery: "Inside the gym",
  },
  actions: {
    id: "join",
    eyebrow: "Get started",
    heading: "Try a free class",
    intro: "Book your free class or sign up online.",
    groups: [
      ["Start here", [
        ["Book a free class", "calendar", true, "On a real site, this opens the gym's class schedule (for example Mindbody, Wodify or Glofox)."],
        ["Join online", "external", true, "On a real site, this opens the gym's membership sign-up page."],
      ]],
      ["Questions?", [
        ["Text the front desk", "message", false, "sms"],
      ]],
    ],
  },
  contact: { eyebrow: "Visit", call: "Call the gym", note: "Free parking and lockers. Bring a water bottle and a towel." },
  hours: ["mon-fri 05:00-21:00; sat-sun 07:00-14:00", "Staffed hours. See the class schedule for times."],
  photos: {
    heroes: ["Rows of dumbbells on a rack in a gym", "Two people training with dumbbells in a gym"],
    gallery: [
      ["Kettlebell classes", "Row of kettlebells along a wall"],
      ["Free weights", "Dumbbells and weight plates on the floor, black and white"],
      ["Locker rooms", "Rows of metal lockers"],
      ["Small-group classes", "Colorful dumbbells on a rack"],
    ],
  },
};
