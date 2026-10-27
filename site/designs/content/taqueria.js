/* Sample content — Mexican restaurant designs. All items and prices are fictional. */
(window.DESIGN_CONTENT = window.DESIGN_CONTENT || {})["taqueria"] = {
  noun: "Mexican restaurant",
  kind: "Mexican kitchen",
  schemaType: "Restaurant",
  priceRange: "$",
  description: "Street tacos, burritos and plates made to order with fresh tortillas and house salsas. Eat in, take out or cater your next party.",
  primary: ["See the menu", "book"],
  secondary: "directions",
  nav: ["Menu", "About", "Order", "Visit"],
  menu: {
    id: "menu",
    eyebrow: "Made to order",
    heading: "Menu",
    intro: "Tacos come on corn tortillas with onion, cilantro and lime. Flour tortillas on request.",
    all: "All",
    tags: { V: "Vegetarian", S: "Spicy" },
    footnote: "Salsa bar included with every order.",
    groups: [
      ["Tacos", [
        ["Al pastor", "Marinated pork with pineapple.", 3.75],
        ["Carne asada", "Grilled steak.", 4.25],
        ["Pollo asado", "Citrus-marinated chicken.", 3.5],
        ["Baja fish", "Battered fish, cabbage and crema.", 4.5],
        ["Rajas con queso", "Roasted poblano and cheese.", 3.5, ["V"]],
      ]],
      ["Burritos & plates", [
        ["Burrito", "Your choice of meat, rice, beans and salsa.", 12],
        ["Enchiladas verdes", "Three chicken enchiladas with rice and beans.", 15],
        ["Quesabirria (3)", "With consommé for dipping.", 15, ["S"]],
      ]],
      ["Sides & drinks", [
        ["Chips & guacamole", "", 7, ["V"]],
        ["Elote", "Grilled corn, mayo, cotija and chili.", 5, ["V", "S"]],
        ["Agua fresca", "Horchata, jamaica or tamarindo.", 4, ["V"]],
      ]],
    ],
  },
  about: {
    eyebrow: "Our kitchen",
    heading: "Family recipes, made fresh",
    text: [
      "{short} cooks the food we grew up eating: slow-marinated meats, salsas made every morning and tortillas warmed on the griddle.",
      "We cater birthdays, office lunches and backyard parties with taco bars for 20 to 200 people.",
    ],
    highlights: [
      ["Fresh every day", "Salsas, guacamole and marinades made each morning."],
      ["Taco bar catering", "Everything set up and ready to serve."],
      ["Quick lunch", "Most orders ready in about 10 minutes."],
    ],
    gallery: "From the kitchen",
  },
  actions: {
    id: "order",
    eyebrow: "Order & catering",
    heading: "Order ahead or book catering",
    intro: "Order online for pickup, or tell us about your event.",
    groups: [
      ["Order", [
        ["Order pickup", "bag", true, "On a real site, this opens the restaurant's online ordering page."],
        ["Delivery", "truck", false, "On a real site, this links to the delivery apps the restaurant uses."],
      ]],
      ["Catering", [
        ["Request catering", "clipboard", true, "On a real site, this opens a short form that sends catering requests to the restaurant's email."],
        ["Text us", "message", false, "sms"],
      ]],
    ],
  },
  contact: { eyebrow: "Find us", call: "Call the restaurant", note: "Parking lot shared with the shops next door." },
  hours: ["mon-thu 10:00-21:00; fri-sat 10:00-22:00; sun 10:00-20:00", "Breakfast tacos until 11 AM on weekends."],
  photos: {
    heroes: ["Street tacos with cilantro, onion and lime on a black tray", "Tacos with different fillings lined up on a metal tray"],
    gallery: [
      ["Street tacos", "Tacos with red salsa and lime wedges"],
      ["Tostadas", "Tostada topped with diced tuna"],
      ["Combo plates", "Tacos served with tortilla chips and sides"],
      ["Shrimp & guacamole", "Folded tortillas with guacamole and grilled shrimp"],
    ],
  },
};
