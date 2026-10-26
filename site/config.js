/* =============================================================================
   RESTAURANT CONFIGURATION
   -----------------------------------------------------------------------------
   This is the ONLY file you normally edit to turn the template into a website
   for a new restaurant. Every section of the page reads its content from here.

   Editing tips (works fine from a phone in GitHub's web editor):
   • Change only the text between quotes "like this". Keep the quotes.
   • Every line inside a { } or [ ] list ends with a comma — keep them.
   • Leave a link as "" (empty) if the restaurant does not have it yet.
     Empty links are hidden on a real client site and shown as clearly
     labelled demo buttons while demoMode is true.
   • After saving, open the website and check the page. If it goes blank,
     you most likely deleted a quote or comma — undo your last change.

   See docs/03-customize-for-a-client.md for a step-by-step walkthrough.
   ========================================================================== */

window.SITE_CONFIG = {
  /* ---------------------------------------------------------------------------
     DEMO MODE
     true  = sample website: shows "fictional demo" labels, the demo banner and
             the RestaurantLaunch packages section (from agency.config.js).
             Unconfigured buttons appear as explained, disabled demo buttons.
     false = real client website: removes ALL demo labels, the banner and the
             packages section, and hides any button whose link is empty.
     ------------------------------------------------------------------------ */
  demoMode: true,
  // Text of the slim banner at the top of the page while demoMode is true.
  demoBanner: "Sample website · fictional restaurant",
  // Small disclaimer printed at the bottom of the footer while demoMode is true.
  demoFooterNote:
    "Harbor & Hearth Kitchen is a fictional restaurant created to demonstrate a website design. " +
    "Menu, prices, hours, address and phone number are sample content. " +
    "Photos: CC0 images from Wikimedia Commons, used as placeholders.",

  /* ---------------------------------------------------------------------------
     RESTAURANT BASICS
     ------------------------------------------------------------------------ */
  restaurant: {
    name: "Harbor & Hearth Kitchen",
    shortName: "Harbor & Hearth", // used where space is tight (mobile header)
    tagline: "Comfort food, cooked with care.",
    description:
      "A relaxed neighborhood kitchen serving roast chicken, a proper burger, " +
      "seasonal plates and pie by the slice. Come as you are and stay a while.",
    eyebrow: "Neighborhood kitchen · Portland, ME", // small line above the name
    cuisine: "American comfort food",
    priceRange: "$$",
  },

  /* ---------------------------------------------------------------------------
     BRAND COLORS (any CSS color: "#1E3B32", "rgb(30 59 50)", …)
     Keep text colors dark on light backgrounds so everything stays readable.
     Run tools/test-site.mjs (or an online contrast checker) after changing.
     ------------------------------------------------------------------------ */
  theme: {
    background: "#F7F1E8", // main page background (warm cream)
    surface: "#FFFBF5", // cards, menu panel, header
    surfaceAlt: "#EFE6D8", // alternate section background (warm sand)
    text: "#24231F", // body text (charcoal)
    mutedText: "#5A554C", // secondary text, descriptions
    primary: "#1E3B32", // headings, primary buttons, footer (forest green)
    accent: "#A3472A", // highlights, prices, small labels (terracotta)
    onDark: "#FBF6EE", // text on primary/accent colored backgrounds
  },

  /* ---------------------------------------------------------------------------
     WEBSITE METADATA (browser tab title, Google snippet, link previews)
     Also update the matching <head> tags in index.html for link previews —
     see the "SEO / SHARING" comment there.
     ------------------------------------------------------------------------ */
  meta: {
    title: "Harbor & Hearth Kitchen — Sample Restaurant Website",
    description:
      "A fictional neighborhood restaurant used to demonstrate a mobile-friendly " +
      "restaurant website: menu, hours, location, ordering and reservations.",
    siteUrl: "", // e.g. "https://www.example-restaurant.com" once live
    ogImage: "images/og-image.jpg", // 1200 × 630 image for link previews
  },

  /* ---------------------------------------------------------------------------
     CONTACT & LOCATION
     phoneLink: digits only with country code, used for click-to-call.
     mapQuery: what the "Get Directions" button searches for in Google Maps.
               For a client, use the full street address or the exact business
               name + city as it appears on their Google Business Profile.
     ------------------------------------------------------------------------ */
  contact: {
    // 555-0100 to 555-0199 numbers are reserved for fictional use in the US.
    phoneDisplay: "(207) 555-0142",
    phoneLink: "+12075550142",
    email: "", // optional, e.g. "hello@restaurant.com"
    address: {
      street: "100 Example Street",
      city: "Portland",
      state: "ME",
      zip: "04101",
    },
    mapQuery: "Old Port, Portland, ME",
    parkingNote: "Street parking and a public garage are a short walk away.",
  },

  /* ---------------------------------------------------------------------------
     OPENING HOURS
     timezone: the restaurant's IANA time zone, used for "Open now".
       Eastern "America/New_York" · Central "America/Chicago"
       Mountain "America/Denver" · Arizona "America/Phoenix"
       Pacific "America/Los_Angeles" · Alaska "America/Anchorage"
       Hawaii "Pacific/Honolulu"
     weekly: 24-hour "HH:MM" times. [] = closed that day.
       Split shifts: [["11:30", "14:30"], ["17:00", "21:30"]]
       Past midnight: ["18:00", "01:00"] (closes 1 AM the next day)
     ------------------------------------------------------------------------ */
  hours: {
    timezone: "America/New_York",
    weekly: {
      monday: [],
      tuesday: [["11:30", "21:00"]],
      wednesday: [["11:30", "21:00"]],
      thursday: [["11:30", "21:00"]],
      friday: [["11:30", "22:00"]],
      saturday: [["10:00", "22:00"]],
      sunday: [["10:00", "20:00"]],
    },
    note: "Kitchen closes 30 minutes before closing time. Holiday hours may vary.",
  },

  /* ---------------------------------------------------------------------------
     ORDERING, RESERVATIONS & DELIVERY
     Only add links the owner has authorized. These link OUT to the services
     the restaurant already uses — the website does not take payments itself.
     ------------------------------------------------------------------------ */
  ordering: {
    orderOnline: {
      label: "Order for pickup",
      url: "", // e.g. the restaurant's Toast / Square / ChowNow ordering page
    },
    reservations: {
      label: "Reserve a table",
      url: "", // e.g. OpenTable / Resy / Tock page
    },
    delivery: [
      { name: "DoorDash", url: "" },
      { name: "Uber Eats", url: "" },
      { name: "Grubhub", url: "" },
    ],
  },

  /* ---------------------------------------------------------------------------
     SOCIAL PROFILES — only real, owner-approved URLs. Empty ones are hidden.
     ------------------------------------------------------------------------ */
  social: [
    { name: "Instagram", url: "" },
    { name: "Facebook", url: "" },
    { name: "Yelp", url: "" },
    { name: "Google", url: "" },
  ],

  /* ---------------------------------------------------------------------------
     NAVIGATION — labels for the links in the header and footer.
     "target" must match a section id: menu, about, order, visit.
     ------------------------------------------------------------------------ */
  navigation: [
    { label: "Menu", target: "menu" },
    { label: "About", target: "about" },
    { label: "Order", target: "order" },
    { label: "Visit", target: "visit" },
  ],

  /* ---------------------------------------------------------------------------
     IMAGES — put files in site/images/. Easiest: upload replacements with the
     SAME file names, then update the alt text here to describe the new photo.
     Recommended: hero 1600px wide (+ 900px "small" copy), others 1200px wide,
     WebP or JPG, under ~250 KB each. See docs/03-customize-for-a-client.md.
     position: which part of the photo to keep when cropped ("50% 50%" = center).
     ------------------------------------------------------------------------ */
  images: {
    hero: {
      src: "images/hero-1600.webp",
      srcSmall: "images/hero-900.webp",
      alt: "Two plated dishes, a wine glass and fresh flowers on a rustic wooden dining table",
      position: "40% 70%",
    },
    about: {
      src: "images/about-dining.webp",
      alt: "Drinks and a folded napkin on a wooden table in a softly lit dining room",
      position: "50% 60%",
    },
    gallery: [
      {
        src: "images/dish-burger.webp",
        alt: "Burger with lettuce and tomato beside a basket of curly fries and a berry drink",
        caption: "The Hearth Burger",
      },
      {
        src: "images/dish-roast.webp",
        alt: "Roast dinner plate with golden potatoes, carrots, parsnips and a Yorkshire pudding",
        caption: "Sunday roast plate",
      },
      {
        src: "images/dish-pie.webp",
        alt: "Slice of pecan pie next to a scoop of vanilla ice cream",
        caption: "Bourbon pecan pie",
      },
      {
        src: "images/drink-berry.webp",
        alt: "Iced berry drink with a lemon slice and a paper straw on a wooden table",
        caption: "Hibiscus berry spritz",
      },
    ],
  },

  /* ---------------------------------------------------------------------------
     ABOUT SECTION — only facts the owner has confirmed. No invented awards,
     founding years, "best in town" claims or reviews.
     ------------------------------------------------------------------------ */
  about: {
    heading: "A neighborhood table, close to the water",
    paragraphs: [
      "Harbor & Hearth is built around a simple idea: honest comfort food, cooked " +
        "from scratch and served somewhere that feels like home.",
      "The menu leans on familiar favorites — roast chicken with pan juices, a " +
        "properly seared burger, chowder on cold evenings and pie by the slice — " +
        "with a few seasonal plates that change as the weather does.",
      "Bring the family, meet a friend after work, or grab a seat at the counter. " +
        "Walk-ins are always welcome.",
    ],
    highlights: [
      { title: "Made in-house", text: "Sauces, dressings, pies and cornbread are prepared in our kitchen." },
      { title: "Family friendly", text: "High chairs, a kids' menu and plenty of room for strollers." },
      { title: "Easy to visit", text: "Walk-ins welcome, plus pickup and delivery through the services we use." },
    ],
    galleryHeading: "From the kitchen",
  },

  /* ---------------------------------------------------------------------------
     MENU
     price: a number (14 → "$14", 3.5 → "$3.50") or text ("Market price").
     tags: short dietary labels defined in menu.tags below. Use only what the
           owner has confirmed — dietary labels carry real-world responsibility.
     ------------------------------------------------------------------------ */
  menu: {
    heading: "Our Menu",
    intro: "Seasonal comfort food, served lunch through dinner. Ask your server about today's specials.",
    currency: "USD",
    tags: {
      V: "Vegetarian",
      GF: "Gluten-free",
    },
    footnote: "Please tell us about any allergies before ordering. Menu items and prices may change.",
    categories: [
      {
        id: "starters",
        name: "Starters",
        items: [
          { name: "Skillet Cornbread", description: "Warm cornbread, whipped honey butter, flaky sea salt.", price: 8, tags: ["V"] },
          { name: "Harbor Chowder", description: "Creamy clam and potato chowder with oyster crackers.", price: 12 },
          { name: "Crispy Brussels Sprouts", description: "Maple-chili glaze, toasted pecans, lemon.", price: 11, tags: ["V", "GF"] },
          { name: "Fried Green Tomatoes", description: "Buttermilk crust, pickled shallots, smoky remoulade.", price: 10, tags: ["V"] },
        ],
      },
      {
        id: "mains",
        name: "Main Courses",
        items: [
          { name: "Hearth-Roasted Half Chicken", description: "Herb pan jus, roasted root vegetables, grilled bread.", price: 24 },
          { name: "The Hearth Burger", description: "Aged cheddar, caramelized onions, house pickles, brioche bun, fries.", price: 18 },
          { name: "Brown Butter Cod", description: "Lemon-caper butter, green beans, crushed fingerling potatoes.", price: 27, tags: ["GF"] },
          { name: "Braised Short Rib", description: "Red wine braise, buttermilk mashed potatoes, glazed carrots.", price: 29, tags: ["GF"] },
          { name: "Wild Mushroom Mac & Cheese", description: "Three cheeses, roasted mushrooms, toasted breadcrumbs.", price: 17, tags: ["V"] },
        ],
      },
      {
        id: "desserts",
        name: "Desserts",
        items: [
          { name: "Bourbon Pecan Pie", description: "Brown-butter crust with a scoop of vanilla bean ice cream.", price: 9 },
          { name: "Skillet Apple Crisp", description: "Oat crumble, cinnamon cream, served warm.", price: 9, tags: ["V"] },
          { name: "Chocolate Pot de Crème", description: "Silky dark chocolate custard, whipped cream, shortbread.", price: 8, tags: ["V"] },
        ],
      },
      {
        id: "drinks",
        name: "Drinks",
        items: [
          { name: "House Lemonade", description: "Classic, or blackberry-basil.", price: 5 },
          { name: "Hibiscus Berry Spritz", description: "Alcohol-free: hibiscus, mixed berries, lime, soda.", price: 7 },
          { name: "Draft Beer", description: "Ask about our rotating taps.", price: 7 },
          { name: "Drip Coffee", description: "Free refills with dessert.", price: 3.5 },
        ],
      },
    ],
  },
};
