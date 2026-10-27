/* Sample content — chiropractic & physical therapy designs. All services and prices are fictional. */
(window.DESIGN_CONTENT = window.DESIGN_CONTENT || {})["chiropractic"] = {
  noun: "chiropractic and physical therapy clinic",
  kind: "Chiropractic & physical therapy",
  schemaType: "MedicalClinic",
  description: "Hands-on care, exercise plans and sports recovery for back, neck and joint problems. Book an evaluation online.",
  primary: ["See services", "calendar"],
  secondary: "call",
  nav: ["Services", "About", "Book", "Visit"],
  menu: {
    id: "services",
    eyebrow: "Services",
    heading: "Services & self-pay prices",
    intro: "Your first visit includes a conversation about your goals, an exam and a plan you agree to.",
    all: "All services",
    footnote: "With insurance, we'll check your coverage before your first visit.",
    groups: [
      ["First visit", [
        ["Evaluation & first treatment", "60 minutes: history, exam and treatment.", 120],
      ]],
      ["Follow-up care", [
        ["Chiropractic adjustment", "About 20 minutes.", 55],
        ["Physical therapy session", "45 minutes of guided exercise and hands-on care.", 95],
        ["Sports massage", "60 minutes.", 90],
      ]],
      ["Packages", [
        ["Five-visit package", "Use within three months.", 250],
        ["Running gait check", "Video analysis and an exercise plan.", 85],
      ]],
    ],
  },
  about: {
    eyebrow: "About the clinic",
    heading: "Move better, feel better",
    text: [
      "{short} helps people around {city} get back to work, sport and everyday life. We listen first, explain what we find, and agree on a plan with you.",
      "You'll leave each visit with a few simple exercises to do at home.",
    ],
    highlights: [
      ["Plans you agree to", "Clear goals and visit counts from day one."],
      ["Exercises to take home", "Short routines you can do anywhere."],
      ["Early & late hours", "Appointments before and after work."],
    ],
    gallery: "Back to what you love",
  },
  actions: {
    id: "book",
    eyebrow: "Book",
    heading: "Book an evaluation",
    intro: "Choose a time online, or call us with questions.",
    groups: [
      ["Appointments", [
        ["Book online", "calendar", true, "On a real site, this opens the clinic's online scheduling page (for example Jane or ChiroTouch)."],
        ["New patient forms", "clipboard", false, "On a real site, this opens the clinic's secure intake forms."],
      ]],
      ["Talk to us", [
        ["Call the clinic", "phone", false, "tel"],
      ]],
    ],
  },
  contact: { eyebrow: "Visit", call: "Call the clinic", note: "Free parking right outside. Wear comfortable clothes to your visit." },
  hours: ["mon-thu 07:00-19:00; fri 07:00-15:00; sat 08:00-12:00", "Early and late appointments fill quickly, so book ahead."],
  photos: {
    heroes: ["Runner on an open road at sunrise", "Runner on a gravel path under a big sky"],
    gallery: [
      ["Sports injuries", "Sprinter's hands at the starting line on a track"],
      ["Back on your feet", "Running shoe held above tall grass"],
      ["Walking & running", "Man jogging on a country road"],
    ],
  },
};
