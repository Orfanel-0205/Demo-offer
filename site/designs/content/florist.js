/* Sample content — florist designs. All items and prices are fictional. */
(window.DESIGN_CONTENT = window.DESIGN_CONTENT || {})["florist"] = {
  noun: "florist",
  kind: "Florist",
  schemaType: "Florist",
  description: "Bouquets, vases and event flowers designed fresh to order. Same-day pickup and local delivery.",
  primary: ["See flowers & prices", "bag"],
  secondary: "directions",
  nav: ["Flowers", "About", "Order", "Visit"],
  menu: {
    id: "flowers",
    eyebrow: "Fresh flowers",
    heading: "Flowers & prices",
    intro: "Designed with the best flowers of the day. Tell us colors you love, and we'll do the rest.",
    all: "All",
    footnote: "Local delivery in {city} from $15. Order by noon for same-day delivery.",
    groups: [
      ["Bouquets", [
        ["Seasonal wrapped bouquet", "Designer's choice of fresh flowers.", "From $45"],
        ["Dozen roses", "Wrapped or in a vase.", "From $75"],
        ["Garden-style vase", "Loose, natural arrangement.", "From $65"],
      ]],
      ["Occasions", [
        ["Birthday flowers", "", "From $50"],
        ["Sympathy arrangement", "Delivered to homes or services.", "From $85"],
        ["New baby", "", "From $55"],
      ]],
      ["Weddings & events", [
        ["Bridal bouquet", "", "From $175"],
        ["Centerpieces", "", "From $60 each"],
        ["Consultation", "Talk through colors, flowers and budget.", "Free"],
      ]],
    ],
  },
  about: {
    eyebrow: "About the shop",
    heading: "Flowers for every day and every occasion",
    text: [
      "{short} is a small flower shop in {city}. We buy fresh flowers several times a week and design every arrangement by hand.",
      "Planning a wedding or event? Book a free consultation and bring your ideas.",
    ],
    highlights: [
      ["Designed fresh", "Every arrangement made to order."],
      ["Same-day delivery", "Order by noon for delivery today."],
      ["Event flowers", "Weddings, showers and corporate events."],
    ],
    gallery: "Recent arrangements",
  },
  actions: {
    id: "order",
    eyebrow: "Order",
    heading: "Order flowers",
    intro: "Order online for pickup or delivery, or plan your event with us.",
    groups: [
      ["Order", [
        ["Order online", "bag", true, "On a real site, this opens the florist's online shop."],
        ["Delivery", "truck", false, "On a real site, this explains delivery areas and links to ordering."],
      ]],
      ["Weddings & events", [
        ["Book a consultation", "calendar", true, "On a real site, this opens the florist's consultation booking page."],
        ["Text us", "message", false, "sms"],
      ]],
    ],
  },
  contact: { eyebrow: "Visit the shop", call: "Call the shop", note: "Two-hour parking right in front." },
  hours: ["mon-fri 09:00-18:00; sat 09:00-16:00", "Closed Sundays, except Mother's Day weekend."],
  photos: {
    heroes: ["Bouquet of pink and white flowers in a metal jug", "Purple and pink stock flowers in a white pitcher"],
    gallery: [
      ["Roses", "Pale pink roses against dark leaves"],
      ["Weddings", "Bride holding a pastel bouquet"],
      ["Everyday vases", "Pink hydrangea in a glass vase on a table"],
      ["Sympathy flowers", "White chrysanthemums laid out on a dark table"],
    ],
  },
};
