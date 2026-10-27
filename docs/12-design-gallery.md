# 12 · The design gallery (100+ sample designs)

Your website has a gallery of **110 sample designs** for **27 types of local business**: restaurants, coffee shops, bakeries, salons, barbers, auto shops, plumbers, roofers, cleaners, dentists, gyms, florists and more.

- **Gallery:** `https://my-services-x4kc.onrender.com/designs/`
- **One type of business:** add `?type=` and the type, e.g. `…/designs/?type=barber`
- **One design:** `…/designs/view.html?d=sharp-line-barbershop`

Every design is a **working website for a fictional business**: menu or price list, live opening hours, call, text and directions buttons, booking/quote buttons, photos and the Bright Site Tech panel at the bottom. Names, prices, hours, addresses and 555 phone numbers are made up, and every page says so.

> **Be honest about what they are.** Call them *sample designs* or *templates*, never past clients or "110 websites we've built". The gallery, the banner on each design and the footer already say they're fictional.

---

## How visitors find the right design

1. **"What business are you in?"** at the top of the gallery. They type anything ("I own a taco truck", "nail salon") or tap a popular type, and the gallery shows **"You might like these"**, the designs for that business.
2. **The bubble on your home page.** A few seconds after someone opens your site, a small bubble next to the **Questions?** button asks *"What business are you in?"* with buttons (Restaurant, Salon, Auto repair, Home services, Something else). Tapping one opens the chat with **"You might like these … designs"** and three previews. It appears once per visit and goes away when used or closed.
3. **The chat assistant.** "Show me designs for my business", or any message that names a business ("do you do websites for dentists?"), gets the same previews. If there's no sample for their business yet, it says so honestly and offers the gallery and the quote form.
4. **"I like this one"** on any design opens your quote form with the design's name in the message and the type of business already chosen.

To switch the bubble off: `site/agency.config.js` → `assistant` → `teaser: false`.

---

## Using it on cold calls and messages

When an owner says *"Send me something to look at"*, send the link for their type of business instead of a single sample:

| Business | Link (add to `https://my-services-x4kc.onrender.com`) |
| --- | --- |
| Restaurant · Coffee shop · Bakery | `/designs/?type=restaurant` · `?type=cafe` · `?type=bakery` |
| Pizzeria · Mexican restaurant | `/designs/?type=pizzeria` · `?type=taqueria` |
| Auto repair · Car detailing | `/designs/?type=auto-repair` · `?type=detailing` |
| Barbershop · Hair salon · Nail salon · Day spa | `?type=barber` · `?type=hair-salon` · `?type=nail-salon` · `?type=spa` |
| Plumbing · Electrician · Heating & air · Roofing | `?type=plumbing` · `?type=electrical` · `?type=hvac` · `?type=roofing` |
| Lawn & landscaping · House cleaning · Painting | `?type=landscaping` · `?type=cleaning` · `?type=painting` |
| Dental · Chiropractic & PT · Gym · Yoga | `?type=dental` · `?type=chiropractic` · `?type=gym` · `?type=yoga` |
| Pet grooming · Florist · Photographer · Real estate · Tax & bookkeeping | `?type=pet-grooming` · `?type=florist` · `?type=photography` · `?type=real-estate` · `?type=tax` |

Then ask: *"Which one feels most like your place?"* Their answer tells you the style to build.

---

## When a client picks a design: build their site

Every design is made from the **same template engine** as your two original samples, so turning one into a client's website is the same work you already know: **one file to edit (`config.js`) plus their photos**. No coding.

**On your computer** (once: install [Node.js](https://nodejs.org), then in the `tools` folder run `npm install`):

```bash
cd tools
node export-design.mjs golden-crumb-bakery marias-bakery
```

- The first word is the design's id: the end of its link (`view.html?d=golden-crumb-bakery`).
- The second is the folder name for the client.

This creates **`site/demos/marias-bakery/`**, a complete website folder exactly like `site/demos/restaurant/`:

| File | What it is |
| --- | --- |
| `config.js` | Everything about the business: name, colors, fonts, menu/services and prices, hours, address, buttons, text. Starts with the design's sample content. |
| `images/` | `hero-1600.webp`, `hero-900.webp`, `about.webp`, `gallery-1…4.webp`: replace with the client's photos, same names. |
| `index.html` | Page title, link-preview tags and the Google Fonts link for this design's fonts. |
| `favicon.svg` | A letter icon in the design's colors. Replace with their logo if they have one. |
| `engine/` | The template code. Don't edit; `node sync-engine.mjs` keeps it up to date. |

Preview it with `node serve.mjs` and open `http://localhost:8080/demos/marias-bakery/`, or commit and push, then open `…onrender.com/demos/marias-bakery/` on your phone and send that link to the client as their **private preview**.

Then follow [guide 3](03-customize-for-a-client.md) from **Step 1**: switch off demo mode, put in the owner's real details and photos, and publish just that folder.

**Typical time per client** once you have their details: about 30–60 minutes for a Starter site (text, prices, hours and photos in `config.js`), longer for Business sites with extra sections.

### Mixing and matching

A client likes the **bakery layout** but wants **barbershop colors**? In their `config.js`, copy the `theme` and `layout` values from any style in `site/designs/catalog.js` (the `styles` list near the top). If the fonts change, update the Google Fonts `<link>` in their `index.html` (the style's `fonts` line shows exactly what to put after `css2?`).

| `layout` setting | Options |
| --- | --- |
| `hero` | `arch` (photo beside text, arched top) · `fullbleed` (photo behind, text on the left) · `center` (photo behind, centered text) · `split` (rounded photo with a color block) · `banner` (big name, wide photo below) |
| `menu` | `list` (dotted price list) · `cards` (each item in a card) |

---

## Adding or changing designs (computer)

- **A new design for an existing type of business:** add a line to that business's `designs` list in `site/designs/catalog.js`:
  `["Name", "Short name", "Tagline.", "city-key", "style-key", 1]` (city keys are in the `places` list, style keys in `styles`; the last number picks hero photo 1 or 2). Then run `node capture-designs.mjs <new-id>` to make its thumbnail.
- **Sample menus, prices and wording** for a type of business: `site/designs/content/<type>.js`.
- **A new type of business:** add an entry to `industries` in `catalog.js`, a content file in `content/`, and photos in `photos/<type>/` (`hero-1-1600.webp`, `hero-1-900.webp`, `hero-2-…`, `g1.webp`…). Use only photos you're allowed to use (CC0 or the client's own) and add them to [image credits](image-credits.md).
- After any change, run `node test-site.mjs`. It opens **every** design and checks for errors, broken photos, sideways scrolling, accessibility problems and color contrast.

Photos in the gallery are CC0 placeholders from Wikimedia Commons ([credits](image-credits.md)). They never show the fictional businesses' "own" work, and a client's site always uses the client's photos.
