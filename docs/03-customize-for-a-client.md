# 3 · Customize the template for a paying restaurant

Goal: turn the demo into a real restaurant's website **without touching the component code**. Most of the work happens in `site/config.js`, plus a few lines in `site/index.html` and the photos in `site/images/`.

Have the completed [onboarding checklist](07-client-onboarding-checklist.md) in hand first. Use only information and photos the owner supplied or approved.

---

## Step 0: Make a copy for the client (once per client)

Keep this demo repository untouched and create one repository per client.

1. On GitHub, open **Demo-offer** → **Settings** → tick **Template repository** (only needed once).
2. Back on the repository page, tap **Use this template** → **Create a new repository**.
3. Name it after the client (e.g. `tonys-pizzeria-site`). Choose **Private** unless you have a reason to make it public.
4. In Render, create a **new Static Site** from the new repository (same settings as [guide 1](01-preview-and-deploy-from-your-phone.md), publish directory `site`). Its `onrender.com` link is your **private preview** to send the owner.

## Step 1: Switch off demo mode

In `site/config.js`:

```js
demoMode: false,
```

This removes every "Sample/Demo" label, the top banner, the stock-photo captions and the RestaurantLaunch pricing section, and **hides any button whose link is empty**. You can delete `site/agency.config.js` and its `<script>` line in `index.html`, but leaving them does no harm.

## Step 2: Restaurant basics

```js
restaurant: {
  name: "Tony's Pizzeria",
  shortName: "Tony's",                       // used in the header on small phones
  tagline: "Wood-fired pizza, made by hand.",
  description: "Two or three sentences in the owner's words.",
  eyebrow: "Family pizzeria · Columbus, OH",
  cuisine: "Pizza, Italian-American",
  priceRange: "$$",
},
```

## Step 3: Brand colors

Change the hex codes in `theme`. Tips:

- Take colors from the restaurant's logo, sign or menu.
- Keep `text`, `mutedText`, `primary` and `accent` **dark** enough to read on the light `background`. Check pairs at [webaim.org/resources/contrastchecker](https://webaim.org/resources/contrastchecker/) (aim for 4.5:1 or higher).
- `onDark` is the text color on `primary` (buttons, footer). It should be very light.

To change fonts, edit the Google Fonts `<link>` in `index.html` and the two `--font-…` lines at the top of `css/styles.css`.

## Step 4: Contact and location

```js
contact: {
  phoneDisplay: "(614) 555-0123",     // how it looks on the page (example number)
  phoneLink: "+16145550123",          // digits with +1 for click-to-call
  email: "",                          // only if the owner wants it public
  address: { street: "123 Main St", city: "Columbus", state: "OH", zip: "43215" },
  mapQuery: "Tony's Pizzeria, 123 Main St, Columbus, OH 43215",
  parkingNote: "Free parking behind the building.",
},
```

`mapQuery` is what **Get Directions** searches for in Google Maps. Use the business name + full address exactly as it appears on their Google Business Profile, then tap the button on your phone to confirm it finds the right place.

## Step 5: Opening hours

- Set `timezone` to the restaurant's zone (the list is in the config comments). "Open now" depends on it.
- 24-hour times: `[["11:00", "22:00"]]`. Closed day: `[]`.
- Lunch and dinner shifts: `[["11:30", "14:30"], ["17:00", "21:30"]]`.
- Closes after midnight: `[["17:00", "02:00"]]`.
- Use `note` for holiday or seasonal messages.

## Step 6: Ordering, reservations, delivery

Paste only links the owner gave you, such as their Toast/Square/ChowNow ordering page, OpenTable/Resy/Tock page, or their own DoorDash/Uber Eats/Grubhub store page:

```js
ordering: {
  orderOnline:  { label: "Order for pickup", url: "https://…" },
  reservations: { label: "Reserve a table",  url: "" },        // empty → hidden
  delivery: [
    { name: "DoorDash", url: "https://…" },
    { name: "Uber Eats", url: "" },                             // empty → hidden
  ],
},
```

If the restaurant has **no** ordering or reservation links, the whole "Order & reserve" section disappears, and the "Order" links in the header and footer are hidden automatically.

## Step 7: Social links

Fill in the real profile URLs. Empty ones are hidden.

## Step 8: Photos

1. Get photos **from the owner** (or ones they've licensed). Don't copy photos from Google, Yelp or delivery apps.
2. Resize and compress them for free in your phone browser at **[squoosh.app](https://squoosh.app)**:
   - Hero: two copies, **1600 px** and **900 px** wide → `hero-1600.webp`, `hero-900.webp`
   - About photo: **1200 px** wide → `about-dining.webp`
   - Gallery: square crops, **800 × 800** → `dish-burger.webp` etc. (any names you like)
   - Format **WebP**, quality around **70–75**, so each file is ideally under ~150 KB.
3. On GitHub: open `site/images` → **Add file → Upload files** → upload → **Commit**.
4. Easiest path: **upload with the same file names** as the demo images (replacing them), then just update the `alt` text in `config.js` to describe the new photos. If you use new names, update `src` too. Names are case-sensitive.
5. `position` controls the crop focus: `"50% 50%"` is the center, `"50% 80%"` keeps the lower part.
6. Replace `og-image.jpg` (1200 × 630) with a restaurant photo. It's the picture shown when the link is shared.
7. Delete leftover demo photos you no longer use.

## Step 9: About section

Write the story **with the owner** using facts they confirm: who runs it, what they cook, what the place feels like. No invented awards, founding dates, "best in town" claims or reviews. Keep 2–3 short paragraphs and 3 highlights.

## Step 10: Menu

Each dish is one line:

```js
{ name: "Margherita", description: "San Marzano tomato, fresh mozzarella, basil.", price: 16, tags: ["V"] },
```

- `price`: a number (`16` → $16, `3.5` → $3.50) or text (`"Market price"`).
- `tags`: only dietary labels the **owner confirms in writing**. They carry real-world responsibility.
- Add or remove categories in `categories`. Each needs a unique `id` (lowercase, no spaces) and a `name`.
- Copy the menu from the owner's **current** menu and have them approve every price.

## Step 11: Page title, description and link previews

In `config.js` → `meta`: write a title like `"Tony's Pizzeria — Wood-Fired Pizza in Columbus, OH"`, a one-sentence description, and set `siteUrl` once you know the domain.

In `site/index.html` (inside `<head>`):

- [ ] Update `<title>`, `description`, `og:title`, `og:description` to match `config.js`.
- [ ] Change `og:image` to the full URL once the domain is live.
- [ ] **Delete** the `<meta name="robots" content="noindex, nofollow">` line. Otherwise Google is told not to list the site.
- [ ] Optional: change the two colors in `favicon.svg` to the restaurant's brand colors.

## Step 12: Review, approve, launch

1. Run the phone test checklist in [guide 1](01-preview-and-deploy-from-your-phone.md#d-test-the-site-on-your-phone-do-this-before-every-demo-and-every-launch).
2. Send the owner the private `onrender.com` preview link. Ask them to check **every** price, hour, phone number and link.
3. Get **written approval** (an email reply such as "Approved, please launch" is fine) and the agreed payment.
4. Connect their domain: [guide 2](02-connect-a-client-domain.md).

---

## Quick reference: common edits

| I want to… | Do this in `config.js` |
| --- | --- |
| Change a price | Edit the `price:` number of that dish. |
| Remove a dish | Delete its whole `{ … },` line. |
| Close on Tuesdays | `tuesday: [],` |
| Add a holiday notice | Edit `hours.note`. |
| Hide the photo gallery | `gallery: [],` |
| Hide the About section | Delete `<div data-component="about"></div>` in `index.html`. |
| Reorder sections | Move the `<div data-component="…">` lines in `index.html`. |
| Rename a nav link | Edit `label` in `navigation`. |

## Never do this on a client site

- Publish a site using a restaurant's name, logo, menu or photos **before** they agree in writing.
- Add reviews, star ratings or testimonials you can't source, or awards they didn't win.
- Add payment forms or collect card details. Link to the restaurant's existing ordering provider instead.
- Put API keys, passwords or private notes in any file in `site/`. Everything in that folder is public.
