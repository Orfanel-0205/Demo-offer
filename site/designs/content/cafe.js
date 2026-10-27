/* Sample content — coffee shop designs. All drinks and prices are fictional. */
(window.DESIGN_CONTENT = window.DESIGN_CONTENT || {})["cafe"] = {
  noun: "coffee shop",
  kind: "Coffee shop",
  schemaType: "CafeOrCoffeeShop",
  priceRange: "$",
  description: "Espresso drinks, pour-overs, fresh pastries and a quiet table to work or catch up. Order ahead and skip the line.",
  primary: ["See the menu", "book"],
  secondary: "directions",
  nav: ["Menu", "About", "Order", "Visit"],
  menu: {
    id: "menu",
    eyebrow: "Coffee & more",
    heading: "Menu",
    intro: "Oat, almond and whole milk at no extra charge. Decaf available all day.",
    all: "All",
    tags: { V: "Vegan option", GF: "Gluten-free" },
    footnote: "Prices for a 12 oz cup. Add 75¢ for 16 oz.",
    groups: [
      ["Espresso", [
        ["Espresso", "Double shot of our house blend.", 3.5],
        ["Cappuccino", "Equal parts espresso, milk and foam.", 4.75, ["V"]],
        ["Latte", "Add vanilla, caramel or honey for 50¢.", 5, ["V"]],
        ["Cortado", "Espresso cut with warm milk.", 4.25, ["V"]],
      ]],
      ["Brewed", [
        ["Drip coffee", "Free refills while you stay.", 3],
        ["Pour-over", "Single-origin, brewed to order.", 5.5],
        ["Cold brew", "Steeped for 18 hours.", 4.75],
        ["Chai latte", "House-made chai concentrate.", 5, ["V"]],
      ]],
      ["Bakery", [
        ["Butter croissant", "Baked every morning.", 4],
        ["Blueberry muffin", "", 3.75],
        ["Avocado toast", "Sourdough, chili flakes and lemon.", 9, ["V"]],
        ["Breakfast sandwich", "Egg, cheddar and bacon on a brioche bun.", 8.5],
      ]],
    ],
  },
  about: {
    eyebrow: "About us",
    heading: "Good coffee, no fuss",
    text: [
      "{short} is a small coffee shop in {city} with big windows, plenty of outlets and a team that remembers your order.",
      "We work with a small roaster, dial in our espresso every morning and bake pastries in small batches so they're fresh.",
    ],
    highlights: [
      ["Freshly roasted", "Beans roasted in small batches and used within weeks."],
      ["Room to stay", "Free Wi-Fi, outlets at most tables and no time limits."],
      ["Order ahead", "Skip the line with online ordering for pickup."],
    ],
    gallery: "At the café",
  },
  actions: {
    id: "order",
    eyebrow: "Order ahead",
    heading: "Skip the line",
    intro: "Order on your phone and pick up at the counter.",
    groups: [
      ["Pickup", [
        ["Order ahead", "bag", true, "On a real site, this opens the café's online ordering page (for example Square or Toast)."],
        ["Buy beans", "external", false, "On a real site, this links to the café's online shop for whole beans."],
      ]],
      ["Events & catering", [
        ["Coffee for your office", "clipboard", false, "On a real site, this opens a short catering request form."],
      ]],
    ],
  },
  contact: { eyebrow: "Visit", call: "Call the café", note: "Bike racks out front and free street parking after 6 PM." },
  hours: ["mon-fri 06:30-17:00; sat-sun 07:30-16:00", "Pastries are baked fresh each morning and sell out by early afternoon."],
  photos: {
    heroes: ["Cozy café corner with an exposed brick wall, wooden tables and warm pendant lights", "Café seating under tall arched windows with dark green booths"],
    gallery: [
      ["Fresh-ground coffee", "Espresso grinder filled with coffee beans"],
      ["Espresso drinks", "Latte with leaf-shaped latte art on a wooden table"],
      ["Beans by the pound", "Shelves of coffee in glass jars behind a café counter"],
      ["Coffee to go", "Takeaway coffee cup beside a small succulent"],
    ],
  },
};
