# 3 · Customize a template for a paying client

Goal: turn a sample design into a real business's website **without touching the template code**. Almost everything happens in one file, the demo's `config.js`, plus the photos and a few lines in `index.html`.

Have the completed [onboarding checklist](09-client-onboarding-checklist.md) in hand first. Use only information and photos the owner supplied or approved.

---

## Step 0: Pick the closest demo and copy the project

| Client | Start from |
| --- | --- |
| Restaurant, café, bakery, food truck | `site/demos/restaurant` |
| Auto repair, mechanic, tires, trades, home services, salon or barber with a price list | `site/demos/auto-repair` |

See the [industry design playbook](05-industry-design-playbook.md) for colors, fonts and must-have sections per industry.

1. On GitHub, open **Demo-offer** → **Settings** → tick **Template repository** (once).
2. On the repository page, tap **Use this template** → **Create a new repository**. Name it after the client (e.g. `tonys-pizzeria-site`) and choose **Private**.
3. In Render: **New + → Static Site** → the new repository →
   - **Publish Directory:** `site/demos/restaurant` (or `site/demos/auto-repair`)
   - **Build Command:** empty (or `echo "no build needed"` if required)
4. Render gives you an `onrender.com` link. That's the client's **private preview**, showing only their website, not your studio site.

> Each demo folder is a complete website: `index.html`, `config.js`, `images/` and its own copy of the template code in `engine/`. That's why you can publish just that folder.

From here on, all paths are inside that demo folder (e.g. `site/demos/restaurant/`).

## Step 1: Switch off demo mode

In `config.js`:

```js
demoMode: false,
```

…and **delete the whole `demoAgency: { … },` block** (the client's site shouldn't load anything from your studio).

This removes every "Sample/Demo" label, the banner, the stock-photo captions and the Bright Site Tech panel. It also **hides any button whose link is empty** and any section left empty. Navigation links to hidden sections disappear automatically.

## Step 2: Business basics

```js
business: {
  schemaType: "Restaurant",        // or "AutoRepair", "HairSalon", "Plumber", "LocalBusiness"…
  name: "Tony's Pizzeria",
  shortName: "Tony's",             // used in the header on small phones
  tagline: "Wood-fired pizza, made by hand.",
  description: "Two or three sentences in the owner's words.",
  eyebrow: "Family pizzeria · Columbus, OH",
  cuisine: "Pizza, Italian-American",   // restaurants only
  priceRange: "$$",
},
```

## Step 3: Brand colors, fonts and layout

- `theme`: the hex colors. Take them from the client's logo or sign, or use a set from the [playbook](05-industry-design-playbook.md). Keep text colors dark on light backgrounds and check pairs at [webaim.org/resources/contrastchecker](https://webaim.org/resources/contrastchecker/) (aim for 4.5:1).
  - `cta` / `onCta`: main button color and its text color.
  - `radius`: `"4px"` for a crisp look, `"6px"` softer.
  - `headingCase: "uppercase"` for bold industrial headings; `italicAccents: false` for no italics.
- **Fonts:** set `fontDisplay` and `fontBody` **and** edit the Google Fonts `<link>` in `index.html` so the same fonts are loaded.
- `layout.hero`: `"arch"` (photo beside the text) or `"fullbleed"` (photo behind the text).

## Step 4: Hero buttons and phone bar

```js
hero: {
  primary: { label: "Explore Our Menu", href: "#menu", icon: "book" },
  secondary: "directions",           // or "call"
},
mobileBar: {
  first: { label: "Menu", href: "#menu", icon: "book" },
},
```

Icons available: `book, phone, pin, clock, calendar, bag, truck, wrench, clipboard, message, scissors, car, shield, check, arrow, external`.

## Step 5: Contact and location

```js
contact: {
  eyebrow: "Find us",
  heading: "Visit & contact",
  callLabel: "Call the restaurant",
  phoneDisplay: "(614) 555-0123",
  phoneLink: "+16145550123",          // digits with +1 for click-to-call
  email: "",                          // only if the owner wants it public
  address: { street: "123 Main St", city: "Columbus", state: "OH", zip: "43215" },
  mapQuery: "Tony's Pizzeria, 123 Main St, Columbus, OH 43215",
  parkingNote: "Free parking behind the building.",
},
```

`mapQuery` is what **Get Directions** searches for in Google Maps. Use the business name + full address exactly as on their Google Business Profile, then test the button on your phone.

## Step 6: Opening hours

- `timezone`: the business's zone (list in the config comments). "Open now" depends on it.
- 24-hour times: `[["11:00", "22:00"]]`. Closed: `[]`. Split shifts: `[["11:30", "14:30"], ["17:00", "21:30"]]`. Past midnight: `[["17:00", "02:00"]]`.
- `note` for holiday or seasonal messages.

## Step 7: Action buttons (ordering, booking, quotes, delivery)

The `actions` section is a list of button groups. Paste **only links the owner gave you**:

```js
actions: {
  id: "order",
  eyebrow: "Eat in or take out",
  heading: "Order & reserve",
  intro: "Book a table or order ahead.",
  groups: [
    {
      title: "Direct from the restaurant",
      items: [
        { label: "Reserve a table", url: "https://…", icon: "calendar", primary: true },
        { label: "Order for pickup", url: "", icon: "bag", primary: true },   // empty → hidden
      ],
    },
    {
      title: "Delivery partners",
      wrap: true,
      items: [{ label: "DoorDash", url: "https://…", icon: "truck" }],
    },
  ],
},
```

- `sms:+1…` links open a text message; `tel:+1…` links call.
- For a quote form, link a Google Form or Formspree form ([guide 2](02-set-up-the-inquiry-form.md#quote-forms-on-client-websites-business-package)).
- With no links at all, the whole section disappears.

## Step 8: Menu or services with prices

The `menu` section works for a food menu **or** a service list:

```js
menu: {
  id: "menu",                         // "services" for service businesses
  eyebrow: "Lunch & dinner",
  heading: "Our Menu",                // "Services & prices"
  allLabel: "All",
  tags: { V: "Vegetarian", GF: "Gluten-free" },
  categories: [
    { id: "pizza", name: "Pizza", items: [
      { name: "Margherita", description: "Tomato, mozzarella, basil.", price: 16, tags: ["V"] },
    ]},
  ],
},
```

- `price`: a number (`16` → $16, `3.5` → $3.50) or text (`"From $69"`, `"Quoted per vehicle"`).
- `tags`: short labels explained in `menu.tags`. Dietary labels only if the owner confirms them in writing.
- Copy from the owner's **current** menu or price list and have them approve every price.

## Step 9: Photos

1. Use photos **the owner provides** or is licensed to use. Never copy from Google, Yelp or delivery apps.
2. Resize and compress for free in your phone browser at **[squoosh.app](https://squoosh.app)**:
   - Hero: **1600 px** and **900 px** wide copies → `hero-1600.webp`, `hero-900.webp`
   - About photo: **1200 px** wide
   - Gallery: square, **800 × 800**
   - WebP, quality about **70**, ideally under 150 KB each
3. On GitHub: open the demo's `images` folder → **Add file → Upload files**. Easiest: upload with the **same file names** as the demo, then update the `alt` text in `config.js` to describe the new photos. Names are case-sensitive.
4. `position` sets the crop focus (`"50% 50%"` = center).
5. Replace `images/og-image.jpg` (1200 × 630). It's the picture shown when the link is shared.
6. Delete demo photos you no longer use.

## Step 10: About section

Write 2–3 short paragraphs **with the owner**, using facts they confirm. Add 3 highlights. No invented awards, founding years, certifications, "best in town" claims or reviews.

## Step 11: Page head (in `index.html`)

- [ ] Update `<title>`, `description`, `og:title`, `og:description` to match `config.js` → `meta`.
- [ ] **Delete** `<meta name="robots" content="noindex, nofollow">`, or Google will be told not to list the site.
- [ ] After the domain is connected, set `meta.siteUrl` in `config.js` and change `og:image` to the full URL.
- [ ] Update the two colors in `favicon.svg`, or replace it with the client's own icon.

## Step 12: Review, approve, launch

1. Run the phone checklist in [guide 1](01-preview-and-deploy-from-your-phone.md#d-test-the-site-on-your-phone-do-this-before-every-demo-and-every-launch).
2. Send the owner the private preview link. Ask them to check **every** price, hour, phone number and link.
3. Get **written approval** (an email "Approved, please launch" is fine) and the agreed final payment.
4. Connect their domain: [guide 4](04-connect-a-client-domain.md).

---

## Quick reference

| I want to… | In `config.js` |
| --- | --- |
| Change a price | Edit the item's `price`. |
| Remove an item | Delete its `{ … },` line. |
| Close on Mondays | `monday: [],` |
| Holiday notice | `hours.note` |
| Hide the gallery | `gallery: [],` |
| Hide a whole section | Delete its `<div data-component="…">` line in `index.html`. |
| Reorder sections | Move the `<div data-component="…">` lines in `index.html`. |
| Rename a nav link | `navigation` → `label` |

## Never do this on a client site

- Publish a site with a business's name, logo, menu or photos **before** they agree in writing.
- Add reviews, ratings, testimonials, certifications or awards you can't source.
- Add payment forms or collect card details. Link to their existing ordering or booking provider instead.
- Put passwords, API keys or private notes in the website folder. Everything in it is public.

## For whoever maintains the template (computer)

The template code lives in `engine/` at the repository root. After changing it, run `node tools/sync-engine.mjs` to copy it into every demo, then `npm test` in `tools/`. Never edit `site/demos/*/engine/` directly.
