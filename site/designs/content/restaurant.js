/* Sample content — restaurant designs. All dishes and prices are fictional. */
(window.DESIGN_CONTENT = window.DESIGN_CONTENT || {})["restaurant"] = {
  noun: "restaurant",
  kind: "Neighborhood restaurant",
  schemaType: "Restaurant",
  description: "Lunch and dinner from a seasonal menu, a full bar and a dining room made for long conversations. Walk in or book a table online.",
  primary: ["See the menu", "book"],
  secondary: "directions",
  nav: ["Menu", "About", "Reserve", "Visit"],
  menu: {
    id: "menu",
    eyebrow: "Lunch & dinner",
    heading: "Menu",
    intro: "A short menu that changes with the seasons. Ask your server about today's specials.",
    all: "All",
    tags: { V: "Vegetarian", GF: "Gluten-free" },
    footnote: "Please tell your server about any allergies. An automatic gratuity may apply to parties of 8 or more.",
    groups: [
      ["Starters", [
        ["Crispy Brussels sprouts", "Honey, chili and lemon.", 11, ["V", "GF"]],
        ["Smoked fish dip", "Pickled onions and grilled bread.", 13],
        ["House salad", "Little gems, radish, herbs and buttermilk dressing.", 10, ["V", "GF"]],
      ]],
      ["Mains", [
        ["Grilled ribeye", "12 oz with garlic butter and hand-cut fries.", 38, ["GF"]],
        ["Pan-seared salmon", "Lemon butter, seasonal greens and rice.", 27, ["GF"]],
        ["Roast half chicken", "Herb jus and mashed potatoes.", 24],
        ["House burger", "Two patties, cheddar, pickles and special sauce.", 17],
        ["Mushroom risotto", "Parmesan, thyme and crispy shallots.", 21, ["V"]],
      ]],
      ["Sides", [
        ["Hand-cut fries", "", 6, ["V"]],
        ["Mac & cheese", "Three cheeses and breadcrumbs.", 8, ["V"]],
        ["Grilled vegetables", "", 7, ["V", "GF"]],
      ]],
      ["Desserts", [
        ["Chocolate pudding", "Whipped cream and sea salt.", 9, ["V"]],
        ["Seasonal fruit crisp", "With vanilla ice cream.", 10, ["V"]],
      ]],
    ],
  },
  about: {
    eyebrow: "Our story",
    heading: "A neighborhood table in {city}",
    text: [
      "{short} started with a simple idea: cook the food we like to eat, buy from people we know, and make every table feel like a regular's table.",
      "Most of our menu is made from scratch each morning. When something runs out, it's gone until tomorrow.",
    ],
    highlights: [
      ["Made from scratch", "Sauces, dressings and desserts made in our kitchen."],
      ["Local where we can", "Produce and meat from nearby farms when they're in season."],
      ["Room for groups", "Tables for two up to parties of twelve. Book ahead for big groups."],
    ],
    gallery: "From our kitchen",
  },
  actions: {
    id: "reserve",
    eyebrow: "Reserve or order",
    heading: "Book a table or order pickup",
    intro: "Book online, order ahead for pickup, or give us a call.",
    groups: [
      ["Dine in", [
        ["Reserve a table", "calendar", true, "On a real site, this opens the restaurant's reservation page (for example OpenTable, Resy or Tock)."],
        ["Private events", "clipboard", false, "On a real site, this opens a short form that sends event requests to the restaurant's email."],
      ]],
      ["Take it home", [
        ["Order pickup", "bag", true, "On a real site, this opens the restaurant's online ordering page (for example Toast or Square Online)."],
        ["Delivery", "truck", false, "On a real site, this links to the delivery apps the restaurant uses."],
      ]],
    ],
  },
  contact: { eyebrow: "Find us", call: "Call the restaurant", note: "Street parking and a public lot one block away." },
  hours: ["tue-thu 11:30-21:30; fri-sat 11:30-22:30; sun 10:00-20:00", "Kitchen closes 30 minutes before closing time. Closed Mondays."],
  photos: {
    heroes: ["Busy restaurant dining room with pendant lights and large windows", "Restaurant dining room opening onto a beach view"],
    gallery: [
      ["Weekend brunch", "Waffles with berries and cream next to a cup of coffee"],
      ["House drinks", "Cocktails and a lemonade on a restaurant table"],
      ["Flatbreads", "Flatbread topped with arugula and fresh cheese"],
      ["The bar", "Bar shelves lined with bottles"],
    ],
  },
};
