/* =============================================================================
   DESIGN CATALOG — every sample design in the gallery (site/designs/).
   -----------------------------------------------------------------------------
   A design = an industry (its content lives in content/<industry>.js)
            + a style (colors, fonts and layout, below)
            + a fictional business name, tagline and city.
   Used by the gallery, the design viewer (view.html), the "What business are
   you in?" bubble and the chat assistant on the home page.

   To add a design: add a line to an industry's "designs" list:
     [name, short name, tagline, place, style, hero photo (1 or 2)]
   then make its thumbnail with:  node tools/capture-designs.mjs <design-id>
   (the id is the name in lowercase with dashes, e.g. "golden-crumb-bakery").

   Every business here is fictional. Addresses use "Example" street names and
   555-01xx phone numbers, which are reserved for fiction in the US.
   ========================================================================== */
window.DESIGN_CATALOG = (function () {
  "use strict";

  /* ---------------------------------------------------------------------------
     STYLES — theme + layout + Google Fonts. All color pairs pass WCAG AA
     (checked by tools/test-site.mjs). layout.hero: arch | fullbleed | split |
     center | banner. layout.menu: list | cards. layout.order: "menu" puts the
     price list before the story, "about" puts the story first.
     ------------------------------------------------------------------------ */
  var styles = {
    editorial: {
      label: "Warm Editorial",
      fonts: "family=Figtree:wght@400..800&family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..600",
      theme: { background: "#F7F1E8", surface: "#FFFBF5", surfaceAlt: "#EFE6D8", text: "#24231F", mutedText: "#5A554C", primary: "#1E3B32", accent: "#A3472A", cta: "#1E3B32", onCta: "#FBF6EE", onDark: "#FBF6EE", radius: "6px", fontDisplay: "Fraunces", fontBody: "Figtree" },
      layout: { hero: "arch", menu: "list", order: "menu" },
    },
    workshop: {
      label: "Bold Workshop",
      fonts: "family=Barlow+Condensed:wght@600;700&family=Barlow:wght@400;500;600;700",
      theme: { background: "#F3F4F6", surface: "#FFFFFF", surfaceAlt: "#E5E7EB", text: "#111827", mutedText: "#4B5563", primary: "#1F2937", accent: "#B3390A", cta: "#B3390A", onCta: "#FFFFFF", onDark: "#FFFFFF", radius: "4px", fontDisplay: "Barlow Condensed", fontBody: "Barlow", headingCase: "uppercase", italicAccents: false },
      layout: { hero: "fullbleed", menu: "list", order: "menu" },
    },
    trust: {
      label: "Trust Blue",
      fonts: "family=Lexend:wght@500;600;700&family=Source+Sans+3:wght@400;500;600;700",
      theme: { background: "#F8FAFC", surface: "#FFFFFF", surfaceAlt: "#E8EEF7", text: "#0F172A", mutedText: "#475569", primary: "#1E3A8A", accent: "#B3390A", cta: "#B3390A", onCta: "#FFFFFF", onDark: "#FFFFFF", radius: "8px", fontDisplay: "Lexend", fontBody: "Source Sans 3", italicAccents: false },
      layout: { hero: "split", menu: "cards", order: "menu" },
    },
    fresh: {
      label: "Fresh Green",
      fonts: "family=Outfit:wght@500;600;700&family=Inter:wght@400;500;600;700",
      theme: { background: "#F5FAF6", surface: "#FFFFFF", surfaceAlt: "#E1EFE5", text: "#13261A", mutedText: "#4A5D50", primary: "#1F5135", accent: "#9A4A12", cta: "#1F5135", onCta: "#FFFFFF", onDark: "#FFFFFF", radius: "12px", fontDisplay: "Outfit", fontBody: "Inter", italicAccents: false },
      layout: { hero: "center", menu: "cards", order: "about" },
    },
    luxe: {
      label: "Soft Luxe",
      fonts: "family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Montserrat:wght@400;500;600;700",
      theme: { background: "#FBF7F4", surface: "#FFFFFF", surfaceAlt: "#F1E7E2", text: "#2B2523", mutedText: "#5E534F", primary: "#5B3A45", accent: "#8A5A3B", cta: "#5B3A45", onCta: "#FFFFFF", onDark: "#FFFFFF", radius: "2px", fontDisplay: "Cormorant Garamond", fontBody: "Montserrat" },
      layout: { hero: "arch", menu: "list", order: "about" },
    },
    midnight: {
      label: "Midnight",
      fonts: "family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Lato:wght@400;700",
      theme: { background: "#121110", surface: "#1B1A18", surfaceAlt: "#25231F", text: "#F3EEE6", mutedText: "#BDB5A8", primary: "#E9D6AE", accent: "#D9AE62", cta: "#D9AE62", onCta: "#17130B", onDark: "#121110", onPhoto: "#FFFFFF", footer: "#25231F", onFooter: "#F3EEE6", colorScheme: "dark", radius: "2px", fontDisplay: "Playfair Display", fontBody: "Lato" },
      layout: { hero: "fullbleed", menu: "list", order: "menu" },
    },
    clinic: {
      label: "Clinic Clean",
      fonts: "family=Nunito:wght@600;700;800&family=Nunito+Sans:wght@400;600;700",
      theme: { background: "#F6FAFB", surface: "#FFFFFF", surfaceAlt: "#E2F0F3", text: "#0E2A33", mutedText: "#46616A", primary: "#0F5F6E", accent: "#B4442F", cta: "#0F5F6E", onCta: "#FFFFFF", onDark: "#FFFFFF", radius: "14px", fontDisplay: "Nunito", fontBody: "Nunito Sans", italicAccents: false },
      layout: { hero: "split", menu: "cards", order: "about" },
    },
    sunny: {
      label: "Sunny Bold",
      fonts: "family=Bricolage+Grotesque:wght@500;600;700;800&family=DM+Sans:wght@400;500;600;700",
      theme: { background: "#FFF8EE", surface: "#FFFFFF", surfaceAlt: "#FDE9CC", text: "#2A1A12", mutedText: "#6A4F3F", primary: "#A3261B", accent: "#8F4A06", cta: "#A3261B", onCta: "#FFFFFF", onDark: "#FFFFFF", radius: "10px", fontDisplay: "Bricolage Grotesque", fontBody: "DM Sans", italicAccents: false },
      layout: { hero: "banner", menu: "cards", order: "menu" },
    },
    mono: {
      label: "Modern Mono",
      fonts: "family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700",
      theme: { background: "#FFFFFF", surface: "#F6F6F4", surfaceAlt: "#ECECE8", text: "#111111", mutedText: "#555555", primary: "#111111", accent: "#2747D6", cta: "#2747D6", onCta: "#FFFFFF", onDark: "#FFFFFF", radius: "0px", fontDisplay: "Space Grotesk", fontBody: "Inter", italicAccents: false },
      layout: { hero: "banner", menu: "list", order: "about" },
    },
    rustic: {
      label: "Rustic Craft",
      fonts: "family=Zilla+Slab:wght@500;600;700&family=Karla:wght@400;500;600;700",
      theme: { background: "#F4ECE1", surface: "#FBF6EF", surfaceAlt: "#E8DCCB", text: "#2B2118", mutedText: "#5C4D3F", primary: "#4A2C1A", accent: "#9A3F12", cta: "#4A2C1A", onCta: "#FFFFFF", onDark: "#FBF6EF", radius: "4px", fontDisplay: "Zilla Slab", fontBody: "Karla", italicAccents: false },
      layout: { hero: "split", menu: "list", order: "menu" },
    },
    coastal: {
      label: "Coastal",
      fonts: "family=Josefin+Sans:wght@500;600;700&family=Mulish:wght@400;500;600;700",
      theme: { background: "#F3F8FA", surface: "#FFFFFF", surfaceAlt: "#DCEDF2", text: "#10303B", mutedText: "#47616B", primary: "#0E4C5C", accent: "#B0442E", cta: "#0E4C5C", onCta: "#FFFFFF", onDark: "#FFFFFF", radius: "16px", fontDisplay: "Josefin Sans", fontBody: "Mulish", italicAccents: false },
      layout: { hero: "center", menu: "cards", order: "menu" },
    },
    sage: {
      label: "Sage Calm",
      fonts: "family=Lora:ital,wght@0,500;0,600;0,700;1,500&family=Work+Sans:wght@400;500;600;700",
      theme: { background: "#F3F5EF", surface: "#FBFCF8", surfaceAlt: "#E2E8D9", text: "#1F2A1E", mutedText: "#515D4F", primary: "#2F4A33", accent: "#8C5A2E", cta: "#2F4A33", onCta: "#FFFFFF", onDark: "#FFFFFF", radius: "20px", fontDisplay: "Lora", fontBody: "Work Sans" },
      layout: { hero: "arch", menu: "list", order: "about" },
    },
    steel: {
      label: "Steel Dark",
      fonts: "family=Oswald:wght@500;600;700&family=Source+Sans+3:wght@400;500;600;700",
      theme: { background: "#14161A", surface: "#1C1F24", surfaceAlt: "#252930", text: "#F2F4F7", mutedText: "#AAB2BE", primary: "#F2F4F7", accent: "#F5B800", cta: "#F5B800", onCta: "#14161A", onDark: "#14161A", onPhoto: "#FFFFFF", footer: "#22262D", onFooter: "#F2F4F7", colorScheme: "dark", radius: "4px", fontDisplay: "Oswald", fontBody: "Source Sans 3", headingCase: "uppercase", italicAccents: false },
      layout: { hero: "fullbleed", menu: "cards", order: "menu" },
    },
    navy: {
      label: "Navy & Brass",
      fonts: "family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Source+Sans+3:wght@400;500;600;700",
      theme: { background: "#FBFAF6", surface: "#FFFFFF", surfaceAlt: "#EFEBE0", text: "#1A2233", mutedText: "#505A6B", primary: "#1B2A4A", accent: "#8A6420", cta: "#1B2A4A", onCta: "#FFFFFF", onDark: "#FFFFFF", radius: "3px", fontDisplay: "Libre Baskerville", fontBody: "Source Sans 3" },
      layout: { hero: "split", menu: "list", order: "about" },
    },
    playful: {
      label: "Playful Pastel",
      fonts: "family=Fredoka:wght@500;600;700&family=Nunito:wght@400;500;600;700",
      theme: { background: "#FFF7FB", surface: "#FFFFFF", surfaceAlt: "#FBE4EF", text: "#2A1B27", mutedText: "#65505F", primary: "#6B2D5C", accent: "#2F6B8A", cta: "#6B2D5C", onCta: "#FFFFFF", onDark: "#FFFFFF", radius: "18px", fontDisplay: "Fredoka", fontBody: "Nunito", italicAccents: false },
      layout: { hero: "split", menu: "cards", order: "menu" },
    },
  };

  /* ---------------------------------------------------------------------------
     PLACES — [city, state, ZIP, time zone, area code]
     ------------------------------------------------------------------------ */
  var places = {
    albany: ["Albany", "NY", "12207", "America/New_York", "518"],
    albuquerque: ["Albuquerque", "NM", "87102", "America/Denver", "505"],
    asheville: ["Asheville", "NC", "28801", "America/New_York", "828"],
    atlanta: ["Atlanta", "GA", "30303", "America/New_York", "404"],
    austin: ["Austin", "TX", "78701", "America/Chicago", "512"],
    baltimore: ["Baltimore", "MD", "21201", "America/New_York", "410"],
    billings: ["Billings", "MT", "59101", "America/Denver", "406"],
    birmingham: ["Birmingham", "AL", "35203", "America/Chicago", "205"],
    boise: ["Boise", "ID", "83702", "America/Boise", "208"],
    boulder: ["Boulder", "CO", "80302", "America/Denver", "303"],
    burlington: ["Burlington", "VT", "05401", "America/New_York", "802"],
    charleston: ["Charleston", "SC", "29401", "America/New_York", "843"],
    chattanooga: ["Chattanooga", "TN", "37402", "America/New_York", "423"],
    chicago: ["Chicago", "IL", "60602", "America/Chicago", "312"],
    columbus: ["Columbus", "OH", "43215", "America/New_York", "614"],
    coloradosprings: ["Colorado Springs", "CO", "80903", "America/Denver", "719"],
    denver: ["Denver", "CO", "80202", "America/Denver", "303"],
    desmoines: ["Des Moines", "IA", "50309", "America/Chicago", "515"],
    detroit: ["Detroit", "MI", "48226", "America/Detroit", "313"],
    eugene: ["Eugene", "OR", "97401", "America/Los_Angeles", "541"],
    fortworth: ["Fort Worth", "TX", "76102", "America/Chicago", "817"],
    fresno: ["Fresno", "CA", "93721", "America/Los_Angeles", "559"],
    greenville: ["Greenville", "SC", "29601", "America/New_York", "864"],
    hartford: ["Hartford", "CT", "06103", "America/New_York", "860"],
    honolulu: ["Honolulu", "HI", "96813", "Pacific/Honolulu", "808"],
    houston: ["Houston", "TX", "77002", "America/Chicago", "713"],
    indianapolis: ["Indianapolis", "IN", "46204", "America/Indiana/Indianapolis", "317"],
    jacksonville: ["Jacksonville", "FL", "32202", "America/New_York", "904"],
    kansascity: ["Kansas City", "MO", "64105", "America/Chicago", "816"],
    knoxville: ["Knoxville", "TN", "37902", "America/New_York", "865"],
    lasvegas: ["Las Vegas", "NV", "89101", "America/Los_Angeles", "702"],
    lexington: ["Lexington", "KY", "40507", "America/New_York", "859"],
    littlerock: ["Little Rock", "AR", "72201", "America/Chicago", "501"],
    longbeach: ["Long Beach", "CA", "90802", "America/Los_Angeles", "562"],
    louisville: ["Louisville", "KY", "40202", "America/New_York", "502"],
    madison: ["Madison", "WI", "53703", "America/Chicago", "608"],
    memphis: ["Memphis", "TN", "38103", "America/Chicago", "901"],
    milwaukee: ["Milwaukee", "WI", "53202", "America/Chicago", "414"],
    minneapolis: ["Minneapolis", "MN", "55401", "America/Chicago", "612"],
    nashville: ["Nashville", "TN", "37203", "America/Chicago", "615"],
    neworleans: ["New Orleans", "LA", "70112", "America/Chicago", "504"],
    norfolk: ["Norfolk", "VA", "23510", "America/New_York", "757"],
    oklahomacity: ["Oklahoma City", "OK", "73102", "America/Chicago", "405"],
    omaha: ["Omaha", "NE", "68102", "America/Chicago", "402"],
    orlando: ["Orlando", "FL", "32801", "America/New_York", "407"],
    phoenix: ["Phoenix", "AZ", "85004", "America/Phoenix", "602"],
    pittsburgh: ["Pittsburgh", "PA", "15222", "America/New_York", "412"],
    portland: ["Portland", "OR", "97205", "America/Los_Angeles", "503"],
    portlandme: ["Portland", "ME", "04101", "America/New_York", "207"],
    providence: ["Providence", "RI", "02903", "America/New_York", "401"],
    raleigh: ["Raleigh", "NC", "27601", "America/New_York", "919"],
    reno: ["Reno", "NV", "89501", "America/Los_Angeles", "775"],
    richmond: ["Richmond", "VA", "23219", "America/New_York", "804"],
    sacramento: ["Sacramento", "CA", "95814", "America/Los_Angeles", "916"],
    saltlake: ["Salt Lake City", "UT", "84101", "America/Denver", "801"],
    sanantonio: ["San Antonio", "TX", "78205", "America/Chicago", "210"],
    sandiego: ["San Diego", "CA", "92101", "America/Los_Angeles", "619"],
    santafe: ["Santa Fe", "NM", "87501", "America/Denver", "505"],
    savannah: ["Savannah", "GA", "31401", "America/New_York", "912"],
    scottsdale: ["Scottsdale", "AZ", "85251", "America/Phoenix", "480"],
    seattle: ["Seattle", "WA", "98101", "America/Los_Angeles", "206"],
    spokane: ["Spokane", "WA", "99201", "America/Los_Angeles", "509"],
    stpete: ["St. Petersburg", "FL", "33701", "America/New_York", "727"],
    tampa: ["Tampa", "FL", "33602", "America/New_York", "813"],
    tucson: ["Tucson", "AZ", "85701", "America/Phoenix", "520"],
    tulsa: ["Tulsa", "OK", "74103", "America/Chicago", "918"],
    wichita: ["Wichita", "KS", "67202", "America/Chicago", "316"],
  };

  /* ---------------------------------------------------------------------------
     INDUSTRIES — form: the matching "Type of business" choice in the quote form.
     noun: how to say it mid-sentence, when lowercasing the label is wrong.
     keywords: words a visitor might type ("What business are you in?"). Avoid
       everyday words ("mobile", "home", "photos") that the chat assistant
       would mistake for a business type.
     designs: [name, short name, tagline, place, style, hero photo]
     ------------------------------------------------------------------------ */
  var FOOD = "Restaurant, café or bakery";
  var HOME = "Home services (plumbing, HVAC, electrical…)";
  var industries = [
    { id: "restaurant", label: "Restaurant", group: "Food & drink", form: FOOD,
      keywords: "restaurant restaurants diner diners dining grill bistro eatery steakhouse steak seafood fish brunch supper",
      designs: [
        ["Ember & Oak Steakhouse", "Ember & Oak", "Steaks, chops and a long wine list.", "denver", "midnight", 3],
        ["Saltgrass Fish House", "Saltgrass", "Fresh catch, ocean air.", "sandiego", "coastal", 2],
        ["Hollow Creek Diner", "Hollow Creek", "Breakfast all day, pie every day.", "tulsa", "rustic", 1],
        ["Greenleaf Table", "Greenleaf", "Seasonal plates from local farms.", "portland", "sage", 1],
      ] },
    { id: "cafe", label: "Coffee shop", group: "Food & drink", form: FOOD,
      keywords: "cafe café cafes coffee coffeeshop coffeehouse espresso latte tea roaster roastery barista",
      designs: [
        ["Morning Ritual Coffee", "Morning Ritual", "Small-batch coffee, big windows.", "madison", "editorial", 1],
        ["Tidewater Coffee Co.", "Tidewater", "Coffee by the harbor.", "charleston", "coastal", 2],
        ["Fernwood Café", "Fernwood", "Slow mornings start here.", "asheville", "sage", 2],
        ["Static Coffee Bar", "Static", "Espresso, done precisely.", "minneapolis", "mono", 1],
      ] },
    { id: "bakery", label: "Bakery", group: "Food & drink", form: FOOD,
      keywords: "bakery bakeries bakeshop baker bread breads pastry pastries cake cakes cupcake cupcakes donut donuts doughnut patisserie cookie cookies croissant",
      designs: [
        ["Golden Crumb Bakery", "Golden Crumb", "Baked before sunrise.", "louisville", "rustic", 1],
        ["Sugar & Spoon Bakeshop", "Sugar & Spoon", "Cakes and treats for every occasion.", "omaha", "playful", 2],
        ["Hearthstone Bread Co.", "Hearthstone", "Slow-fermented bread, every day.", "burlington", "editorial", 1],
        ["Maison Belle Pâtisserie", "Maison Belle", "French pastry, made by hand.", "neworleans", "luxe", 2],
      ] },
    { id: "pizzeria", label: "Pizzeria", group: "Food & drink", form: FOOD,
      keywords: "pizza pizzas pizzeria pizzerias slice slices calzone italian wings",
      designs: [
        ["Brick Oven Pizza Co.", "Brick Oven", "Wood-fired, start to finish.", "hartford", "rustic", 2],
        ["Slice Shop Pizza", "Slice Shop", "Big slices, fast.", "columbus", "sunny", 1],
        ["Nonna Lucia's Pizzeria", "Nonna Lucia's", "Family recipes, wood-fired.", "providence", "midnight", 2],
        ["Neon Slice", "Neon Slice", "Late-night pizza by the slice.", "austin", "mono", 1],
      ] },
    { id: "taqueria", label: "Mexican restaurant", noun: "Mexican restaurant", group: "Food & drink", form: FOOD,
      keywords: "taco tacos taqueria mexican burrito burritos tex-mex texmex quesadilla tortilla tortillas truck trucks cantina",
      designs: [
        ["La Esquina Taqueria", "La Esquina", "Street tacos, made to order.", "sanantonio", "sunny", 1],
        ["Casa Verde Cocina", "Casa Verde", "Fresh Mexican kitchen.", "tucson", "fresh", 2],
        ["El Fuego Tacos", "El Fuego", "Grilled over an open flame.", "phoenix", "midnight", 1],
        ["Mesa Rústica", "Mesa Rústica", "Family-style Mexican plates.", "albuquerque", "rustic", 2],
      ] },
    { id: "auto-repair", label: "Auto repair", group: "Auto", form: "Auto repair or mechanic",
      keywords: "auto car cars mechanic mechanics repair garage brake brakes tire tires transmission automotive muffler alignment",
      designs: [
        ["Ironline Auto Repair", "Ironline", "Straight answers, solid repairs.", "kansascity", "steel", 1],
        ["Bluebird Auto Service", "Bluebird Auto", "Your neighborhood mechanic.", "richmond", "trust", 2],
        ["Northgate Garage", "Northgate", "Repairs explained in plain English.", "spokane", "mono", 2],
        ["Redline Tire & Brake", "Redline", "Tires, brakes and alignments.", "fortworth", "sunny", 1],
      ] },
    { id: "detailing", label: "Car detailing", group: "Auto", form: "Auto repair or mechanic",
      keywords: "detail detailing detailer car carwash wash washes wax polish polishing ceramic coating tint",
      designs: [
        ["Gloss Garage Detailing", "Gloss Garage", "Showroom shine, inside and out.", "scottsdale", "midnight", 1],
        ["Clearcoat Mobile Detailing", "Clearcoat", "We come to your driveway.", "tampa", "coastal", 2],
        ["Prime Shine Car Care", "Prime Shine", "Hand washes and full details.", "oklahomacity", "fresh", 1],
        ["Apex Auto Spa", "Apex", "Paint correction and ceramic coatings.", "saltlake", "mono", 2],
      ] },
    { id: "barber", label: "Barbershop", group: "Beauty & wellness", form: "Salon, barber or spa",
      keywords: "barber barbers barbershop barbershops haircut haircuts fade fades shave shaves beard beards mens grooming",
      designs: [
        ["Sharp Line Barbershop", "Sharp Line", "Clean fades and hot towel shaves.", "memphis", "midnight", 1],
        ["Old Town Barber Co.", "Old Town Barber", "Classic cuts, no rush.", "savannah", "rustic", 2],
        ["Steel & Comb", "Steel & Comb", "Precision cuts for busy people.", "detroit", "steel", 1],
        ["Gentry Barber Lounge", "Gentry", "Cuts, shaves and a good chair.", "baltimore", "navy", 2],
      ] },
    { id: "hair-salon", label: "Hair salon", group: "Beauty & wellness", form: "Salon, barber or spa",
      keywords: "hair salon salons hairdresser hairdressers hairstylist stylist stylists highlights balayage blowout blowouts beauty extensions",
      designs: [
        ["Rose & Thistle Hair Studio", "Rose & Thistle", "Color, cuts and care.", "nashville", "luxe", 1],
        ["Studio Nine Salon", "Studio Nine", "Modern hair, honest advice.", "seattle", "mono", 2],
        ["Willow Hair Co.", "Willow", "Healthy hair, gentle products.", "eugene", "sage", 2],
        ["Bloom Hair Bar", "Bloom", "Blowouts, braids and color.", "atlanta", "playful", 1],
      ] },
    { id: "nail-salon", label: "Nail salon", group: "Beauty & wellness", form: "Salon, barber or spa",
      keywords: "nail nails manicure manicures pedicure pedicures mani pedi gel acrylic acrylics lashes",
      designs: [
        ["Polished Nail Lounge", "Polished", "Manicures, pedicures and nail art.", "houston", "playful", 1],
        ["Lacquer & Co.", "Lacquer & Co.", "Clean, careful nail care.", "lexington", "luxe", 2],
        ["Nail Studio Twelve", "Studio Twelve", "Minimal nails, maximum care.", "denver", "mono", 1],
        ["Seaside Nails & Spa", "Seaside", "Relax, then show them off.", "stpete", "coastal", 2],
      ] },
    { id: "spa", label: "Day spa & massage", group: "Beauty & wellness", form: "Salon, barber or spa",
      keywords: "spa spas massage massages facial facials wellness relaxation therapist skincare esthetician aromatherapy",
      designs: [
        ["Stillwater Day Spa", "Stillwater", "Breathe out. We'll take it from here.", "boise", "sage", 1],
        ["Lumière Skin & Spa", "Lumière", "Facials and skin care, unhurried.", "scottsdale", "luxe", 2],
        ["Driftwood Massage Studio", "Driftwood", "Therapeutic massage by appointment.", "honolulu", "coastal", 1],
        ["Haven Wellness Spa", "Haven", "Massage, facials and quiet time.", "chattanooga", "editorial", 2],
      ] },
    { id: "plumbing", label: "Plumbing", group: "Home services", form: HOME,
      keywords: "plumber plumbers plumbing pipe pipes drain drains leak leaks heater heaters sewer toilet toilets faucet faucets clog clogs",
      designs: [
        ["Clearflow Plumbing", "Clearflow", "Fixed right, priced upfront.", "raleigh", "trust", 1],
        ["Hammerstone Plumbing & Drain", "Hammerstone", "Drains, pipes and water heaters.", "pittsburgh", "workshop", 2],
        ["Brightwater Plumbing", "Brightwater", "Friendly plumbers, tidy work.", "sacramento", "fresh", 1],
        ["Harbor Plumbing Co.", "Harbor Plumbing", "Leaks fixed, questions answered.", "norfolk", "coastal", 2],
      ] },
    { id: "electrical", label: "Electrician", group: "Home services", form: HOME,
      keywords: "electrician electricians electrical electric wiring rewiring lighting outlet outlets generator generators breaker breakers",
      designs: [
        ["Brightline Electric", "Brightline", "Safe wiring, clear quotes.", "phoenix", "steel", 1],
        ["Voltwise Electrical", "Voltwise", "Electrical work done by the book.", "columbus", "trust", 2],
        ["Spark & Wire Electric", "Spark & Wire", "Panels, lighting and repairs.", "milwaukee", "workshop", 1],
        ["Current Electric Co.", "Current", "Modern electrical for older homes.", "portlandme", "mono", 2],
      ] },
    { id: "hvac", label: "Heating & air", group: "Home services", form: HOME,
      keywords: "hvac heating cooling conditioning conditioner ac furnace furnaces heat pump pumps duct ducts ductwork thermostat",
      designs: [
        ["Coolbreeze Heating & Air", "Coolbreeze", "Comfortable all year.", "jacksonville", "trust", 1],
        ["Northwind HVAC", "Northwind", "Heating and cooling, explained.", "desmoines", "coastal", 2],
        ["ComfortPro Heating & Cooling", "ComfortPro", "Tune-ups, repairs and installs.", "wichita", "workshop", 1],
        ["Evergreen Air", "Evergreen Air", "Efficient heat pumps and AC.", "reno", "fresh", 2],
      ] },
    { id: "roofing", label: "Roofing", group: "Home services", form: HOME,
      keywords: "roof roofs roofer roofers roofing shingle shingles gutter gutters storm hail",
      designs: [
        ["Summit Roofing Co.", "Summit Roofing", "Roofs built to last.", "coloradosprings", "workshop", 1],
        ["Ridgeline Roofing", "Ridgeline", "Inspections, repairs and new roofs.", "oklahomacity", "steel", 2],
        ["Shelter Roofing & Gutters", "Shelter", "Keep the weather outside.", "greenville", "trust", 1],
        ["Keystone Roofing", "Keystone", "Careful crews, clean job sites.", "hartford", "navy", 2],
      ] },
    { id: "landscaping", label: "Lawn & landscaping", group: "Home services", form: "Cleaning or landscaping",
      keywords: "lawn lawns landscaping landscaper landscapers landscape mowing mow yard yards garden gardening gardener tree trees hedge hedges sod irrigation",
      designs: [
        ["Greenway Lawn Care", "Greenway", "Weekly mowing, done right.", "knoxville", "fresh", 1],
        ["Fieldstone Landscapes", "Fieldstone", "Gardens, patios and plantings.", "santafe", "sage", 2],
        ["Cutline Lawn & Yard", "Cutline", "Sharp edges, every visit.", "indianapolis", "workshop", 2],
        ["Timber & Turf", "Timber & Turf", "Yard care from spring to snow.", "billings", "rustic", 1],
      ] },
    { id: "cleaning", label: "House cleaning", group: "Home services", form: "Cleaning or landscaping",
      keywords: "cleaning cleaner cleaners maid maids housekeeping housekeeper janitorial carpet moveout",
      designs: [
        ["Sparkle & Co. Cleaning", "Sparkle & Co.", "Come home to clean.", "orlando", "fresh", 1],
        ["Tidy Nest Home Cleaning", "Tidy Nest", "Weekly, biweekly or just once.", "raleigh", "playful", 2],
        ["Clearview Cleaning Services", "Clearview", "Homes and small offices.", "longbeach", "coastal", 1],
        ["Pristine Clean Co.", "Pristine", "Checklists, not guesswork.", "minneapolis", "clinic", 2],
      ] },
    { id: "painting", label: "Painting contractor", group: "Home services", form: HOME,
      keywords: "painter painters painting paint paints drywall cabinet cabinets deck decks staining stain handyman",
      designs: [
        ["Fresh Coat Painting", "Fresh Coat", "Interior and exterior painting.", "houston", "sunny", 1],
        ["Truecolor Painters", "Truecolor", "Clean lines, careful prep.", "chattanooga", "mono", 2],
        ["Brushline Painting Co.", "Brushline", "Homes, cabinets and decks.", "lexington", "trust", 1],
        ["Canvas & Co. Painting", "Canvas & Co.", "Color advice included.", "savannah", "playful", 2],
      ] },
    { id: "dental", label: "Dental office", group: "Health & fitness", form: "Other",
      keywords: "dentist dentists dental teeth tooth orthodontist orthodontics braces whitening dentistry implants",
      designs: [
        ["Bright Smile Family Dental", "Bright Smile", "Gentle care for the whole family.", "fresno", "clinic", 1],
        ["Harborview Dental", "Harborview", "Checkups, cleanings and smiles.", "seattle", "coastal", 2],
        ["Modern Dental Studio", "Modern Dental", "Dentistry, clearly explained.", "austin", "mono", 1],
        ["Oakwood Family Dentistry", "Oakwood", "Calm visits, careful dentistry.", "greenville", "sage", 2],
      ] },
    { id: "chiropractic", label: "Chiropractic & physical therapy", group: "Health & fitness", form: "Other",
      keywords: "chiropractor chiropractors chiropractic chiro physical therapy therapist physiotherapy physio pt pain neck spine adjustment rehab injury",
      designs: [
        ["Align Chiropractic", "Align", "Move better, feel better.", "boise", "clinic", 1],
        ["Peak Motion Physical Therapy", "Peak Motion", "Get back to what you love.", "denver", "trust", 2],
        ["Restore Spine & Wellness", "Restore", "Care that fits your life.", "asheville", "sage", 1],
        ["Balance Point Chiropractic", "Balance Point", "Hands-on care, clear plans.", "richmond", "navy", 2],
      ] },
    { id: "gym", label: "Gym & fitness", group: "Health & fitness", form: "Other",
      keywords: "gym gyms fitness workout workouts trainer trainers training crossfit strength boxing bootcamp weights lifting",
      designs: [
        ["Iron Forge Fitness", "Iron Forge", "Strength for everyone.", "pittsburgh", "steel", 1],
        ["Pulse Fitness Studio", "Pulse", "Classes that keep you coming back.", "tampa", "sunny", 2],
        ["Northside Strength Club", "Northside", "Coached strength training.", "milwaukee", "mono", 1],
        ["Black Iron Gym", "Black Iron", "Open early, open late.", "lasvegas", "midnight", 2],
      ] },
    { id: "yoga", label: "Yoga & pilates studio", group: "Health & fitness", form: "Other",
      keywords: "yoga pilates meditation stretch stretching barre mindfulness",
      designs: [
        ["Lotus Room Yoga", "Lotus Room", "Find your breath.", "boulder", "sage", 1],
        ["Saltwater Yoga", "Saltwater", "Yoga by the sea.", "honolulu", "coastal", 2],
        ["Studio Prana", "Prana", "Slow flow and pilates.", "nashville", "luxe", 1],
        ["Morning Flow Yoga", "Morning Flow", "Classes for every body.", "madison", "editorial", 2],
      ] },
    { id: "pet-grooming", label: "Pet grooming", group: "Shops & services", form: "Other",
      keywords: "pet pets dog dogs cat cats grooming groomer groomers groom daycare boarding puppy puppies kennel",
      designs: [
        ["Happy Tails Grooming", "Happy Tails", "Clean, happy, fluffy.", "charleston", "playful", 1],
        ["Fetch & Fluff Pet Spa", "Fetch & Fluff", "Baths, trims and nail care.", "portland", "fresh", 2],
        ["Sunny Paws Grooming", "Sunny Paws", "Gentle grooming for every breed.", "sanantonio", "sunny", 1],
        ["Coastal Canine Grooming", "Coastal Canine", "Grooming by the beach.", "sandiego", "coastal", 2],
      ] },
    { id: "florist", label: "Florist", group: "Shops & services", form: "Shop or retail",
      keywords: "florist florists flower flowers floral bouquet bouquets wedding weddings arrangement arrangements roses",
      designs: [
        ["Petal & Stem Florist", "Petal & Stem", "Flowers for every day and every occasion.", "providence", "editorial", 1],
        ["Wildflower Studio", "Wildflower", "Seasonal, garden-style flowers.", "eugene", "sage", 2],
        ["Bloomhouse Flowers", "Bloomhouse", "Bright bouquets, same-day pickup.", "orlando", "playful", 1],
        ["Rosewood Florals", "Rosewood", "Wedding and event flowers.", "charleston", "luxe", 2],
      ] },
    { id: "photography", label: "Photographer", group: "Shops & services", form: "Other",
      keywords: "photographer photographers photography portrait portraits wedding weddings headshot headshots videographer",
      designs: [
        ["Golden Hour Photography", "Golden Hour", "Portraits in beautiful light.", "santafe", "editorial", 1],
        ["Frame & Field Studio", "Frame & Field", "Headshots and brand photos.", "chicago", "mono", 2],
        ["Silverline Photo Co.", "Silverline", "Weddings, events and stories.", "neworleans", "midnight", 1],
        ["Little Moments Photography", "Little Moments", "Family and newborn sessions.", "boise", "luxe", 2],
      ] },
    { id: "real-estate", label: "Real estate agent", group: "Shops & services", form: "Other",
      keywords: "realtor realtors estate realty agent agents broker brokers property properties",
      designs: [
        ["Hearthside Realty", "Hearthside", "Helping neighbors move home.", "hartford", "navy", 1],
        ["Northstar Realty Group", "Northstar", "Buy and sell with a plan.", "minneapolis", "mono", 2],
        ["Open Door Realty", "Open Door", "First homes and next homes.", "jacksonville", "trust", 1],
        ["Cedar & Main Realty", "Cedar & Main", "Local agents, local knowledge.", "spokane", "sage", 2],
      ] },
    { id: "tax", label: "Tax & bookkeeping", group: "Shops & services", form: "Other",
      keywords: "tax taxes accountant accountants accounting bookkeeping bookkeeper payroll irs cpa",
      designs: [
        ["Ledgerline Tax & Bookkeeping", "Ledgerline", "Taxes and books, handled.", "baltimore", "navy", 1],
        ["Clearbook Accounting", "Clearbook", "Bookkeeping for small businesses.", "nashville", "trust", 2],
        ["Fairway Tax Services", "Fairway", "Tax returns without the stress.", "littlerock", "clinic", 1],
        ["Bottom Line Bookkeeping", "Bottom Line", "Monthly books, clear reports.", "atlanta", "mono", 2],
      ] },
  ];

  /* The two full sample websites (site/demos/) open from the gallery too. */
  var featured = [
    { id: "harbor-hearth-kitchen", name: "Harbor & Hearth Kitchen", industry: "restaurant", style: "Warm Editorial", url: "../demos/restaurant/", thumb: "../assets/img/work-restaurant-desktop.jpg", tagline: "Coastal comfort food." },
    { id: "copperline-auto-care", name: "Copperline Auto Care", industry: "auto-repair", style: "Bold Workshop", url: "../demos/auto-repair/", thumb: "../assets/img/work-auto-repair-desktop.jpg", tagline: "Honest repairs. Clear prices." },
  ];

  var groups = ["Food & drink", "Auto", "Beauty & wellness", "Home services", "Health & fitness", "Shops & services"];

  /* ---------------------------------------------------------------------------
     Helpers (no need to edit below)
     ------------------------------------------------------------------------ */
  function slug(s) {
    return String(s)
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  var byIndustry = {};
  var designs = [];
  industries.forEach(function (ind) {
    byIndustry[ind.id] = ind;
    featured.forEach(function (f) {
      if (f.industry === ind.id) designs.push({ id: f.id, name: f.name, tagline: f.tagline, industry: ind.id, style: f.style, styleLabel: f.style, url: f.url, thumb: f.thumb, featured: true });
    });
    ind.designs.forEach(function (d) {
      var id = slug(d[0]);
      designs.push({
        id: id, name: d[0], shortName: d[1], tagline: d[2], place: places[d[3]] || places.denver,
        style: d[4], styleLabel: (styles[d[4]] || {}).label, photo: d[5] || 1, industry: ind.id,
        url: "view.html?d=" + id, thumb: "thumbs/" + id + ".webp",
      });
    });
  });

  // Everyday words that say nothing about the type of business ("work" would
  // otherwise match "workout", "shop" would match "Coffee shop").
  var STOP = ("and the for with what kind kinds type types work works working business businesses small local family " +
    "owned own owner run have need want shop shops store stores company place real service services website websites site design designs").split(" ");

  function words(text) {
    return (String(text || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").match(/[a-z0-9/]+/g) || []).filter(function (w) {
      return STOP.indexOf(w) === -1;
    });
  }

  /* Ranks industries for free text such as "I own a small taco truck". */
  function match(text) {
    var asked = words(text);
    if (!asked.length) return [];
    return industries
      .map(function (ind) {
        var keys = words(ind.keywords + " " + ind.label);
        var score = 0;
        asked.forEach(function (w) {
          if (keys.indexOf(w) !== -1) score += 3;
          else if (w.length >= 4 && keys.some(function (k) { return k.length >= 4 && (k.indexOf(w) === 0 || w.indexOf(k) === 0); })) score += 2;
        });
        return { industry: ind, score: score };
      })
      .filter(function (r) { return r.score > 0; })
      .sort(function (a, b) { return b.score - a.score; })
      .map(function (r) { return r.industry; });
  }

  return {
    styles: styles,
    places: places,
    industries: industries,
    groups: groups,
    designs: designs,
    industry: function (id) { return byIndustry[id] || null; },
    find: function (id) {
      for (var i = 0; i < designs.length; i++) if (designs[i].id === id) return designs[i];
      return null;
    },
    noun: function (id) {
      var ind = byIndustry[id];
      return ind ? ind.noun || ind.label.toLowerCase() : "";
    },
    forIndustry: function (id) {
      return designs.filter(function (d) { return d.industry === id; });
    },
    match: match,
    slug: slug,
    // Catalog paths are relative to site/designs/. From the home page use
    // C.path(design.thumb, "designs/").
    path: function (p, prefix) {
      if (!prefix) return p;
      return p.indexOf("../") === 0 ? p.slice(3) : prefix + p;
    },
  };
})();
