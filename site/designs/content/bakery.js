/* Sample content — bakery designs. All items and prices are fictional. */
(window.DESIGN_CONTENT = window.DESIGN_CONTENT || {})["bakery"] = {
  noun: "bakery",
  kind: "Neighborhood bakery",
  schemaType: "Bakery",
  priceRange: "$",
  description: "Bread, pastries and celebration cakes baked from scratch every morning. Come early for the best selection, or order a cake ahead.",
  primary: ["See today's bakes", "book"],
  secondary: "directions",
  nav: ["Menu", "About", "Order", "Visit"],
  menu: {
    id: "menu",
    eyebrow: "Baked daily",
    heading: "Breads, pastries & cakes",
    intro: "What's in the case changes daily. Call ahead to save a loaf.",
    all: "Everything",
    tags: { V: "Vegan", GF: "Gluten-free" },
    footnote: "Our kitchen uses wheat, eggs, dairy and nuts. Ask us about ingredients.",
    groups: [
      ["Bread", [
        ["Country sourdough", "Slow-fermented for 24 hours.", 9, ["V"]],
        ["Baguette", "Crisp crust, open crumb.", 4, ["V"]],
        ["Seeded rye", "Sunflower, flax and caraway.", 10, ["V"]],
        ["Brioche loaf", "Rich and buttery, great for French toast.", 9],
      ]],
      ["Pastries", [
        ["Butter croissant", "", 4],
        ["Pain au chocolat", "", 4.5],
        ["Morning bun", "Orange zest and cinnamon sugar.", 4.5],
        ["Almond croissant", "", 5],
      ]],
      ["Cakes", [
        ["6-inch celebration cake", "Serves 8–10. Order 48 hours ahead.", "From $48"],
        ["Cupcakes (dozen)", "Vanilla, chocolate or red velvet.", 36],
        ["Flourless chocolate cake", "Rich, dense and naturally gluten-free.", "From $40", ["GF"]],
      ]],
    ],
  },
  about: {
    eyebrow: "About the bakery",
    heading: "Baked before sunrise",
    text: [
      "Every loaf at {short} starts the night before. We mix, shape and bake by hand, in small batches, so everything in the case is fresh that day.",
      "We bake celebration cakes to order. Tell us the flavor, the size and the message, and we'll have it ready.",
    ],
    highlights: [
      ["From scratch", "Real butter, simple ingredients and long fermentation."],
      ["Cakes to order", "Birthdays, showers and office parties with 48 hours' notice."],
      ["Day-old discounts", "Yesterday's bread at half price every morning."],
    ],
    gallery: "From the ovens",
  },
  actions: {
    id: "order",
    eyebrow: "Order ahead",
    heading: "Order a cake or save a loaf",
    intro: "Pre-order online or send us a text. We'll confirm the pickup time.",
    groups: [
      ["Pre-order", [
        ["Order a cake", "calendar", true, "On a real site, this opens the bakery's cake order form or online shop."],
        ["Order for pickup", "bag", false, "On a real site, this opens the bakery's online ordering page."],
      ]],
      ["Quick question?", [
        ["Text the bakery", "message", false, "sms"],
      ]],
    ],
  },
  contact: { eyebrow: "Visit the bakery", call: "Call the bakery", note: "Free parking in front. Popular breads sell out by noon." },
  hours: ["tue-fri 07:00-15:00; sat-sun 07:00-13:00", "Closed Mondays so the bakers can rest."],
  photos: {
    heroes: ["Sourdough loaves and baguettes on wooden bakery shelves", "A pile of golden, flaky croissants"],
    gallery: [
      ["Sourdough", "Round sourdough loaf with a scored crust"],
      ["Sweet buns", "Soft sugar-dusted buns in a basket"],
      ["Breakfast pastries", "Croissant on a plate next to a latte"],
      ["Baked every morning", "Bakery racks full of fresh bread and pastries"],
    ],
  },
};
