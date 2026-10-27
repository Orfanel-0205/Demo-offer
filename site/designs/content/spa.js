/* Sample content — day spa designs. All services and prices are fictional. */
(window.DESIGN_CONTENT = window.DESIGN_CONTENT || {})["spa"] = {
  noun: "day spa",
  kind: "Day spa",
  schemaType: "DaySpa",
  description: "Massage, facials and quiet time in a calm, private space. Book online and arrive a few minutes early to settle in.",
  primary: ["See treatments", "book"],
  secondary: "directions",
  nav: ["Treatments", "About", "Book", "Visit"],
  menu: {
    id: "treatments",
    eyebrow: "Treatments",
    heading: "Treatments & prices",
    intro: "Tell us about any injuries, allergies or pregnancy when you book so we can adjust your treatment.",
    all: "All treatments",
    footnote: "Please give 24 hours' notice to cancel or reschedule. Gratuity is not included.",
    groups: [
      ["Massage", [
        ["Relaxation massage", "60 minutes, light to medium pressure.", 95],
        ["Deep tissue massage", "60 minutes, firm pressure for tight muscles.", 110],
        ["Hot stone massage", "75 minutes.", 130],
        ["Couples massage", "60 minutes, side by side.", 200],
      ]],
      ["Facials", [
        ["Signature facial", "60 minutes, matched to your skin.", 105],
        ["Express facial", "30 minutes.", 60],
        ["Hydrating facial", "75 minutes for dry or dull skin.", 125],
      ]],
      ["Add-ons", [
        ["Aromatherapy", "", 15],
        ["Scalp massage", "", 20],
      ]],
    ],
  },
  about: {
    eyebrow: "About the spa",
    heading: "Breathe out",
    text: [
      "{short} is a small day spa in {city} with a few quiet treatment rooms, soft lighting and no rush.",
      "Our therapists ask before they begin and check in during your treatment, so it's exactly what you need.",
    ],
    highlights: [
      ["Private rooms", "Every treatment in a quiet, private room."],
      ["Gift cards", "Give a massage or facial to someone you love."],
      ["Easy booking", "Book online and get a reminder before your visit."],
    ],
    gallery: "The spa",
  },
  actions: {
    id: "book",
    eyebrow: "Book",
    heading: "Book a treatment",
    intro: "Choose a treatment and time online, or call us for help choosing.",
    groups: [
      ["Appointments", [
        ["Book online", "calendar", true, "On a real site, this opens the spa's booking page (for example Vagaro, Mindbody or Square Appointments)."],
        ["Buy a gift card", "external", false, "On a real site, this opens the spa's gift card page."],
      ]],
      ["Questions?", [
        ["Call the spa", "phone", false, "tel"],
      ]],
    ],
  },
  contact: { eyebrow: "Visit", call: "Call the spa", note: "Please arrive 10 minutes early to relax before your treatment." },
  hours: ["tue-fri 10:00-20:00; sat 09:00-18:00; sun 10:00-16:00", "Closed Mondays."],
  photos: {
    heroes: ["Aromatherapy oil burner glowing in a dim room", "Amber glass jars of skin care products"],
    gallery: [
      ["Candlelit rooms", "Candle in a glass jar on a wooden table"],
      ["Aromatherapy", "Hands holding a lit candle in a jar"],
      ["Quiet time", "Single candle in a brass holder"],
    ],
  },
};
