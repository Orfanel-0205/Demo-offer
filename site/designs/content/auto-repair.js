/* Sample content — auto repair designs. All services and prices are fictional.
   The second hero and the gallery reuse photos from the auto repair sample (site/demos/auto-repair). */
(window.DESIGN_CONTENT = window.DESIGN_CONTENT || {})["auto-repair"] = {
  noun: "auto repair shop",
  kind: "Independent repair shop",
  schemaType: "AutoRepair",
  description: "Maintenance and repairs for everyday cars, trucks and SUVs. We explain what your car needs and put the price in writing before any work starts.",
  primary: ["See services & prices", "wrench"],
  secondary: "call",
  nav: ["Services", "About", "Book", "Visit"],
  menu: {
    id: "services",
    eyebrow: "Upfront pricing",
    heading: "Services & prices",
    intro: "Starting prices for most cars and light trucks. You'll get a written estimate before any work begins.",
    all: "All services",
    tags: { SD: "Usually same day" },
    footnote: "Parts, fluids and taxes are extra unless noted. We confirm the final price with you before starting.",
    groups: [
      ["Maintenance", [
        ["Synthetic oil change", "Up to 5 quarts, new filter and a quick inspection.", "From $69", ["SD"]],
        ["Tire rotation", "Rotate and set pressures.", 29, ["SD"]],
        ["Battery test & replacement", "Free test; replacement priced by battery.", "From $39", ["SD"]],
      ]],
      ["Brakes", [
        ["Brake pads (per axle)", "Pads and hardware with a rotor check.", "From $189", ["SD"]],
        ["Brake fluid exchange", "", 119],
      ]],
      ["Diagnostics", [
        ["Check-engine light", "Scan plus hands-on testing to find the cause.", 89],
        ["A/C check & recharge", "Leak check and refrigerant recharge.", "From $149"],
        ["Electrical diagnosis", "Starters, alternators, lights and wiring.", "From $89"],
      ]],
    ],
  },
  about: {
    eyebrow: "About the shop",
    heading: "A neighborhood garage that explains before it repairs",
    text: [
      "{short} is an independent shop for everyday cars, trucks and SUVs. We listen, we inspect, and we show you what we found before any work begins.",
      "You'll get a written estimate with parts and labor, and we'll call before doing anything that isn't on it.",
    ],
    highlights: [
      ["Written estimates", "Know the price before the work starts."],
      ["Text updates", "Photos and updates sent to your phone."],
      ["Early drop-off", "Leave your keys before work; pick up after."],
    ],
    gallery: "In the shop",
  },
  actions: {
    id: "book",
    eyebrow: "Book or get a quote",
    heading: "Book a service",
    intro: "Pick a time online, ask for a quote, or send a text.",
    groups: [
      ["Schedule & estimates", [
        ["Book an appointment", "calendar", true, "On a real site, this opens the shop's online booking page."],
        ["Request a quote", "clipboard", true, "On a real site, this opens a quote form that sends the car's details to the shop's email."],
      ]],
      ["Prefer to message?", [
        ["Text the shop", "message", false, "sms"],
      ]],
    ],
  },
  contact: { eyebrow: "Find the shop", call: "Call the shop", note: "Drop-off parking in front of the service bays." },
  hours: ["mon-fri 07:30-18:00; sat 08:00-14:00", "Last drop-off for same-day service is 2 PM."],
  photos: {
    heroes: [
      "Mechanic's hands working on a car engine",
      { src: "../demos/auto-repair/images/hero-1600.webp", small: "../demos/auto-repair/images/hero-900.webp", alt: "Mechanic kneeling beside a car inside a busy repair workshop", position: "62% 50%" },
    ],
    gallery: [
      ["Diagnostics", "Mechanic's hands working on wiring in a car engine", "../demos/auto-repair/images/work-diagnostics.webp"],
      ["Maintenance", "Clean engine bay with fluid caps and battery visible", "../demos/auto-repair/images/work-maintenance.webp"],
      ["Tires & wheels", "Stack of car tires", "../demos/auto-repair/images/work-tires.webp"],
      ["The workshop", "Workbench with neatly hung tools below a car on a lift", "../demos/auto-repair/images/work-shop.webp"],
    ],
  },
};
