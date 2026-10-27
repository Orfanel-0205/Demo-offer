/* =============================================================================
   BUSINESS CONFIGURATION — auto repair sample
   -----------------------------------------------------------------------------
   This is the ONLY file you normally edit to turn this template into a website
   for a new client. Every section of the page reads its content from here.

   Editing tips (works fine from a phone in GitHub's web editor):
   • Change only the text between quotes "like this". Keep the quotes.
   • Every line inside a { } or [ ] list ends with a comma — keep them.
   • Leave a link as "" (empty) if the business does not have it yet.
     Empty links are hidden on a real client site and shown as clearly
     labelled demo buttons while demoMode is true.
   • After saving, open the website and check the page. If it goes blank,
     you most likely deleted a quote or comma — undo your last change.

   Design direction (from the UI UX Pro Max industry data for home/auto
   services): trust + clear pricing, charcoal with a safety-orange accent,
   bold condensed headings, call and booking buttons always within reach.
   See docs/05-industry-design-playbook.md.
   ========================================================================== */

window.SITE_CONFIG = {
  /* ---------------------------------------------------------------------------
     DEMO MODE — true for the sample, false for a real client website.
     ------------------------------------------------------------------------ */
  demoMode: true,
  demoBanner: "Sample website · fictional auto repair shop",
  demoFooterNote:
    "Copperline Auto Care is a fictional auto repair shop created to demonstrate a website design. " +
    "Services, prices, hours, address and phone number are sample content. " +
    "Photos: CC0 images from Wikimedia Commons, used as placeholders.",
  // Where the "About this sample" panel gets the studio's packages and links.
  // Only used while demoMode is true. Delete this block on client sites.
  demoAgency: {
    configUrl: "../../agency.config.js",
    siteUrl: "../../",
    logo: "../../assets/brand/logo.svg",
  },

  /* ---------------------------------------------------------------------------
     BUSINESS BASICS
     schemaType: "AutoRepair" tells search engines this is a repair shop.
     ------------------------------------------------------------------------ */
  business: {
    schemaType: "AutoRepair",
    name: "Copperline Auto Care",
    shortName: "Copperline Auto",
    tagline: "Honest repairs. Clear prices.",
    description:
      "Independent auto repair for everyday cars, trucks and SUVs. We explain what " +
      "your car needs, put the price in writing, and call before doing anything extra.",
    eyebrow: "Independent repair shop · Boise, ID",
    priceRange: "$$",
  },

  /* ---------------------------------------------------------------------------
     BRAND COLORS & FONTS — keep text dark on light backgrounds.
     cta / onCta: color of the main buttons and their text.
     headingCase: "uppercase" or "normal". italicAccents: false = no italics.
     ------------------------------------------------------------------------ */
  theme: {
    background: "#F3F4F6", // light workshop grey
    surface: "#FFFFFF",
    surfaceAlt: "#E5E7EB",
    text: "#111827",
    mutedText: "#4B5563",
    primary: "#1F2937", // charcoal: headings, footer, phone bar
    accent: "#B3390A", // safety orange: prices, labels
    cta: "#B3390A", // main buttons
    onCta: "#FFFFFF",
    onDark: "#FFFFFF",
    radius: "4px",
    // Fonts: also load them in the Google Fonts <link> in index.html.
    fontDisplay: "Barlow Condensed",
    fontBody: "Barlow",
    headingCase: "uppercase",
    italicAccents: false,
  },

  layout: {
    hero: "fullbleed", // photo behind the text on larger screens
  },

  hero: {
    primary: { label: "See services & prices", href: "#services", icon: "wrench" },
    secondary: "call", // "call", "directions", or { label, href, icon }
  },

  meta: {
    title: "Copperline Auto Care — Sample Auto Repair Website",
    description:
      "A fictional auto repair shop used to demonstrate a mobile-friendly website " +
      "for mechanics: services and prices, booking, hours and directions.",
    siteUrl: "",
    ogImage: "images/og-image.jpg",
  },

  /* ---------------------------------------------------------------------------
     CONTACT & LOCATION
     ------------------------------------------------------------------------ */
  contact: {
    eyebrow: "Find the shop",
    heading: "Visit & contact",
    callLabel: "Call the shop",
    // 555-0100 to 555-0199 numbers are reserved for fictional use in the US.
    phoneDisplay: "(208) 555-0187",
    phoneLink: "+12085550187",
    email: "",
    address: {
      street: "200 Example Avenue",
      city: "Boise",
      state: "ID",
      zip: "83702",
    },
    mapQuery: "Downtown Boise, ID",
    parkingNote: "Drop-off parking right in front of the service bays. Early key drop available.",
  },

  /* ---------------------------------------------------------------------------
     OPENING HOURS — Boise uses Mountain Time ("America/Boise").
     ------------------------------------------------------------------------ */
  hours: {
    timezone: "America/Boise",
    weekly: {
      monday: [["07:30", "18:00"]],
      tuesday: [["07:30", "18:00"]],
      wednesday: [["07:30", "18:00"]],
      thursday: [["07:30", "18:00"]],
      friday: [["07:30", "18:00"]],
      saturday: [["08:00", "14:00"]],
      sunday: [],
    },
    note: "Last drop-off for same-day service is 2 PM on weekdays.",
  },

  /* ---------------------------------------------------------------------------
     ACTION BUTTONS — booking, quotes, messages. Link OUT to the tools the shop
     already uses (online booking, a quote form, text messages).
     url "" → hidden on a client site; a labelled demo button in demoMode.
     ------------------------------------------------------------------------ */
  actions: {
    id: "book",
    eyebrow: "Book or get a quote",
    heading: "Book a service",
    intro: "Pick a time online, ask for a written quote, or send a text — whatever's easiest for you.",
    groups: [
      {
        title: "Schedule & estimates",
        items: [
          {
            label: "Book an appointment",
            url: "", // e.g. the shop's Square Appointments / Calendly / shop-software booking page
            icon: "calendar",
            primary: true,
            explain: "On a real site, this opens the shop's online booking page (for example Square Appointments, Calendly or the shop's own software) once the owner provides the link.",
          },
          {
            label: "Request a quote",
            url: "", // e.g. a Google Form or Formspree form that emails the shop
            icon: "clipboard",
            primary: true,
            explain: "On a real site, this opens a short quote-request form that sends the car's details straight to the shop's email.",
          },
        ],
      },
      {
        title: "Prefer to message?",
        items: [
          {
            label: "Text the shop",
            url: "sms:+12085550187", // opens the phone's messaging app
            icon: "message",
          },
        ],
      },
    ],
    demoNote: "Booking and quote buttons are placeholders. Each client's links are added only after the owner confirms which tools they use.",
  },

  social: [
    { name: "Google", url: "" },
    { name: "Facebook", url: "" },
    { name: "Yelp", url: "" },
    { name: "Instagram", url: "" },
  ],

  navigation: [
    { label: "Services", target: "services" },
    { label: "About", target: "about" },
    { label: "Book", target: "book" },
    { label: "Visit", target: "visit" },
  ],

  mobileBar: {
    first: { label: "Services", href: "#services", icon: "wrench" },
  },

  /* ---------------------------------------------------------------------------
     IMAGES — files live in this folder's images/.
     ------------------------------------------------------------------------ */
  images: {
    hero: {
      src: "images/hero-1600.webp",
      srcSmall: "images/hero-900.webp",
      alt: "Mechanic kneeling beside a car with its door open inside a busy repair workshop",
      position: "62% 50%",
    },
    about: {
      src: "images/about-shop.webp",
      alt: "Bright, clean service area with cars raised on lifts and an open bay door",
      position: "50% 50%",
    },
    gallery: [
      { src: "images/work-diagnostics.webp", alt: "Mechanic's hands working on wiring in a car engine", caption: "Diagnostics & repair" },
      { src: "images/work-maintenance.webp", alt: "Clean, modern engine bay with fluid caps and battery visible", caption: "Scheduled maintenance" },
      { src: "images/work-tires.webp", alt: "Stack of car tires", caption: "Tires & wheels" },
      { src: "images/work-shop.webp", alt: "Workbench with neatly hung tools below a car on a lift", caption: "The workshop" },
    ],
  },

  /* ---------------------------------------------------------------------------
     ABOUT — only facts the owner confirms. No invented certifications,
     awards, years in business or reviews.
     ------------------------------------------------------------------------ */
  about: {
    eyebrow: "About the shop",
    heading: "A neighborhood garage that explains before it repairs",
    paragraphs: [
      "We're an independent shop for everyday cars, trucks and SUVs. Most visits start the " +
        "same way: we listen, we inspect, and we show you what we found before any work begins.",
      "You'll get a written estimate with parts and labor, and we'll call you before doing " +
        "anything that isn't on it.",
      "Drop your car off on the way to work, wait in the lounge for quick jobs, or text us " +
        "when you're on your way.",
    ],
    highlights: [
      { title: "Written estimates first", text: "Know the price before any work starts — no surprise add-ons." },
      { title: "Everyday cars & trucks", text: "Maintenance and repairs for most makes and models." },
      { title: "Easy drop-off", text: "Early key drop, text updates and pickup when it's ready." },
    ],
    galleryHeading: "In the shop",
    demoNote: "Fictional shop story written for this demo. Real websites only use details and credentials the owner provides and can prove.",
  },

  /* ---------------------------------------------------------------------------
     SERVICES & PRICES (uses the menu component)
     price: a number (69 → "$69") or text ("From $69", "Quoted per vehicle").
     ------------------------------------------------------------------------ */
  menu: {
    id: "services",
    eyebrow: "Upfront pricing",
    heading: "Services & prices",
    intro: "Typical starting prices for common jobs. You'll always get a written estimate before work begins.",
    allLabel: "All services",
    currency: "USD",
    tags: {
      SD: "Usually same day",
    },
    footnote:
      "Starting prices for most cars and light trucks. Parts, fluids and taxes are extra unless noted. " +
      "We confirm the final price with you before starting any work.",
    demoNote: "Sample services and prices — a real site lists only the shop's own, owner-approved prices.",
    categories: [
      {
        id: "maintenance",
        name: "Maintenance",
        items: [
          { name: "Synthetic oil change", description: "Up to 5 quarts of full synthetic oil, new filter, fluid top-off and a quick inspection.", price: "From $69", tags: ["SD"] },
          { name: "Tire rotation", description: "Rotate and set tire pressures to the manufacturer's spec.", price: 29, tags: ["SD"] },
          { name: "Multi-point inspection", description: "Brakes, belts, hoses, lights, fluids and tires checked and noted in writing.", price: "Free with any service" },
          { name: "Battery test & replacement", description: "Free battery and charging-system test; replacement priced by battery.", price: "From $39", tags: ["SD"] },
        ],
      },
      {
        id: "brakes",
        name: "Brakes & Suspension",
        items: [
          { name: "Brake pads (per axle)", description: "New pads and hardware with a rotor check. Rotors quoted separately if needed.", price: "From $189", tags: ["SD"] },
          { name: "Brake fluid exchange", description: "Flush and replace old brake fluid.", price: 119 },
          { name: "Wheel alignment", description: "Four-wheel alignment with a before-and-after printout.", price: "From $99" },
          { name: "Shocks & struts", description: "Inspection and replacement for a smoother, safer ride.", price: "Quoted per vehicle" },
        ],
      },
      {
        id: "diagnostics",
        name: "Diagnostics & Repair",
        items: [
          { name: "Check-engine light diagnostic", description: "Computer scan plus hands-on testing to find the actual cause.", price: 89 },
          { name: "A/C check & recharge", description: "Leak check, performance test and refrigerant recharge.", price: "From $149" },
          { name: "Electrical diagnosis", description: "Batteries, alternators, starters, lights and wiring.", price: "From $89" },
        ],
      },
      {
        id: "tires",
        name: "Tires",
        items: [
          { name: "Mount & balance", description: "Mount and computer-balance new tires.", price: "From $25 / tire", tags: ["SD"] },
          { name: "Flat repair", description: "Plug-and-patch repair when the damage is in the tread.", price: 25, tags: ["SD"] },
          { name: "New tires", description: "We'll quote a few options at different price points.", price: "Quoted by size" },
        ],
      },
    ],
  },
};
