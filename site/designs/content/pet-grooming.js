/* Sample content — pet grooming designs. All services and prices are fictional. */
(window.DESIGN_CONTENT = window.DESIGN_CONTENT || {})["pet-grooming"] = {
  noun: "pet grooming salon",
  kind: "Pet grooming",
  schemaType: "LocalBusiness",
  description: "Baths, haircuts, nail trims and teeth brushing for dogs and cats of every size. Gentle handling and no rushing.",
  primary: ["See services & prices", "scissors"],
  secondary: "directions",
  nav: ["Services", "About", "Book", "Visit"],
  menu: {
    id: "services",
    eyebrow: "Grooming",
    heading: "Services & prices",
    intro: "Prices by size. Matted coats or anxious pets may need extra time; we'll always ask first.",
    all: "All services",
    footnote: "Proof of rabies vaccination required for all pets.",
    groups: [
      ["Full groom", [
        ["Small dog (up to 20 lb)", "Bath, haircut, nails, ears and a bandana.", "From $60"],
        ["Medium dog (21–50 lb)", "", "From $75"],
        ["Large dog (51 lb+)", "", "From $95"],
        ["Cat groom", "Bath, brush-out and nails.", "From $80"],
      ]],
      ["Bath & tidy", [
        ["Bath & brush", "Shampoo, blow-dry, brush-out and nails.", "From $40"],
        ["Puppy's first groom", "A short, gentle intro visit.", 35],
      ]],
      ["Add-ons", [
        ["Nail trim (walk-in)", "", 15],
        ["Teeth brushing", "", 10],
        ["De-shedding treatment", "", "From $20"],
      ]],
    ],
  },
  about: {
    eyebrow: "About us",
    heading: "Clean, happy, fluffy",
    text: [
      "{short} grooms dogs and cats in {city} with patience and a gentle touch. We take breaks when pets need them and never rush a nervous pup.",
      "We'll text you when your pet is ready, usually with a photo.",
    ],
    highlights: [
      ["Gentle handling", "Breaks and treats for nervous pets."],
      ["Text updates", "A message and photo when it's pickup time."],
      ["Puppy intros", "Short first visits to build confidence."],
    ],
    gallery: "Fresh from the tub",
  },
  actions: {
    id: "book",
    eyebrow: "Book",
    heading: "Book a groom",
    intro: "Book online or text us your pet's breed and size.",
    groups: [
      ["Appointments", [
        ["Book online", "calendar", true, "On a real site, this opens the groomer's booking page (for example MoeGo or Gingr)."],
      ]],
      ["Questions?", [
        ["Text us", "message", false, "sms"],
      ]],
    ],
  },
  contact: { eyebrow: "Visit", call: "Call the salon", note: "Drop-off from 8 AM. Please keep pets on a leash or in a carrier." },
  hours: ["tue-sat 08:00-17:00", "Closed Sundays and Mondays."],
  photos: {
    heroes: ["Golden dog mid-yawn in warm light", "White dog resting its head on a rug"],
    gallery: [
      ["Full grooms", "Freshly groomed white dog with bows in its hair"],
      ["Puppy trims", "Small white terrier sitting in autumn leaves"],
      ["Pick-up & drop-off", "Happy dog with its head out of a car window"],
      ["Happy pups", "Small dog running on a beach"],
    ],
  },
};
