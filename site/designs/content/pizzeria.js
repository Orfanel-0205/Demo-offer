/* Sample content — pizzeria designs. All items and prices are fictional. */
(window.DESIGN_CONTENT = window.DESIGN_CONTENT || {})["pizzeria"] = {
  noun: "pizzeria",
  kind: "Pizzeria",
  schemaType: "Restaurant",
  priceRange: "$",
  description: "Hand-stretched pizza, wings and salads for dine-in, pickup or delivery. Whole pies and slices every day.",
  primary: ["See the menu", "book"],
  secondary: "call",
  nav: ["Menu", "About", "Order", "Visit"],
  menu: {
    id: "menu",
    eyebrow: "Pizza & more",
    heading: "Menu",
    intro: "All pizzas are 16 inches. Gluten-free 12-inch crust available for $3 more.",
    all: "All",
    tags: { V: "Vegetarian", S: "Spicy" },
    footnote: "Slices available from 11 AM until we run out.",
    groups: [
      ["Pizza", [
        ["Margherita", "Tomato, fresh mozzarella and basil.", 18, ["V"]],
        ["Pepperoni", "Cup-and-char pepperoni and mozzarella.", 20],
        ["Supreme", "Sausage, pepperoni, peppers, onions and olives.", 24],
        ["White pie", "Ricotta, garlic, mozzarella and oregano.", 21, ["V"]],
        ["Hot honey", "Soppressata, chili honey and pecorino.", 23, ["S"]],
      ]],
      ["Slices", [
        ["Cheese slice", "", 4, ["V"]],
        ["Pepperoni slice", "", 4.5],
        ["Slice of the day", "Ask what's on the counter.", 5],
      ]],
      ["Sides & salads", [
        ["Wings (10)", "Buffalo, BBQ or garlic parmesan.", 15, ["S"]],
        ["Garlic knots (6)", "With marinara.", 7, ["V"]],
        ["Caesar salad", "Romaine, croutons and parmesan.", 10],
      ]],
    ],
  },
  about: {
    eyebrow: "About us",
    heading: "Dough made fresh every day",
    text: [
      "At {short}, the dough rests for 48 hours before it's stretched by hand. The sauce is simple: tomatoes, salt and olive oil.",
      "Grab a slice at the counter, sit down with friends, or take a few pies home for game night.",
    ],
    highlights: [
      ["48-hour dough", "Mixed daily and rested for a light, crisp crust."],
      ["Slices all day", "Fresh slices on the counter from lunch on."],
      ["Party orders", "Ten or more pies? Call a day ahead."],
    ],
    gallery: "Out of the oven",
  },
  actions: {
    id: "order",
    eyebrow: "Order now",
    heading: "Pickup or delivery",
    intro: "Order online, or call and we'll have it ready.",
    groups: [
      ["Order", [
        ["Order pickup", "bag", true, "On a real site, this opens the pizzeria's online ordering page."],
        ["Delivery", "truck", true, "On a real site, this links to the delivery apps the pizzeria uses (for example DoorDash or Uber Eats)."],
      ]],
      ["Prefer to call?", [
        ["Call to order", "phone", false, "tel"],
      ]],
    ],
  },
  contact: { eyebrow: "Find us", call: "Call to order", note: "Pickup parking right by the door." },
  hours: ["sun-thu 11:00-21:00; fri-sat 11:00-23:00", "Last orders 15 minutes before closing."],
  photos: {
    heroes: ["Pizza cut into slices on a dark table, topped with olives and peppers", "Flames glowing inside a brick wood-fired oven"],
    gallery: [
      ["Wood-fired pies", "Wood-fired pizza with a blistered crust"],
      ["Specialty pizzas", "Pizza topped with thin slices of prosciutto"],
      ["By the slice", "Two slices of pepperoni pizza on a plate"],
      ["Square pan pizza", "Square pan pizza on checkered paper"],
    ],
  },
};
