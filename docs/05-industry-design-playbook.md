# 5 · Industry design playbook

How to give each type of business a design that fits it, using the template engine and recommendations from the **UI UX Pro Max** skill.

---

## What UI UX Pro Max is (analysis of `nextlevelbuilder/ui-ux-pro-max-skill`)

| | |
| --- | --- |
| **What it is** | An open-source "design intelligence" skill for AI coding assistants (Claude Code, Cursor, Copilot and others) by Next Level Builder. **MIT license**, free to use commercially. |
| **What's inside** | Searchable CSV data: **192 product/industry types**, each with a reasoning rule (recommended page pattern, style, color mood, typography mood, key effects, anti-patterns); **192 color palettes**; **74 Google Font pairings**; **119 UX guidelines**; 79 UI styles; landing-page patterns. A Python search script (standard library only, no network access) turns a short description like *"auto repair mechanic shop"* into a full design system. The repo also includes extra skills for brand, logo, banners and slides. |
| **How it's used** | Installed into an AI assistant, it activates when you ask for UI work and recommends colors, fonts, layout and things to avoid for that industry. |
| **What we did with it** | Read its data for our target industries (below) and applied it to the **auto repair demo**, the **Bright Site Tech website** and the **logo**. We did not run its script here: the safety settings blocked running downloaded code, so we read the data files directly instead. |
| **Limits** | It's guidance, not a designer. Some recommendations conflict with our honesty rules, e.g. it suggests "results metrics" for agencies and "testimonials" for salons. We only add those when they're **real and sourced**. Its default palettes also need a contrast check: its restaurant red is bright, and we chose warm cream and terracotta for a more premium look within the same "warm colors" rule. |

### Want to use it yourself?

In **Claude Code** (desktop, web or IDE), install it from its plugin marketplace:

```
/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
/plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```

Then ask, for example: *"Use ui-ux-pro-max to suggest a design system for a family barbershop website, then apply it to a copy of site/demos/auto-repair."* It needs Python on the computer that runs Claude Code. You'll be asked to approve running its search script. Treat its output as recommendations and keep the contrast checks.

---

## Industry recipes

Each recipe maps to settings in a demo's `config.js` (see [guide 3](03-customize-for-a-client.md)). Start from the closest demo:

- **Restaurant demo** (`site/demos/restaurant`): food and hospitality.
- **Auto repair demo** (`site/demos/auto-repair`): any service business (repair, trades, salons with price lists).

All color sets below pass WCAG AA contrast (4.5:1) for text and buttons.

### 🍽️ Restaurants, cafés, bakeries
*Skill data: "Restaurant/Food Service": hero-centric + conversion · warm colors · appetizing, clear type · must have high-quality images · avoid low-quality photos and outdated hours.*

- **Must-have sections:** hero with a real food photo · menu with prices and category filters · hours with "Open now" · directions and call · reservation/ordering/delivery links.
- **Start from:** restaurant demo (`layout.hero: "arch"`).
- **Colors:** warm cream `#F7F1E8` · forest `#1E3B32` · terracotta `#A3472A` (as in the demo), or the restaurant's own brand colors.
- **Fonts:** Fraunces + Figtree (demo), or **Playfair Display SC + Karla** (the skill's "Restaurant Menu" pairing).
- **Avoid:** blurry phone photos of the paper menu, prices that don't match the counter, hours that are out of date.

### 🔧 Auto repair, mechanics, tire & oil shops
*Skill data: "Home Services" + "Automotive": conversion-optimized + trust · flat, accessible style · trust blue / dark slate + safety orange · bold, confident type · must have prominent contact and trust signals · avoid hidden contact info.*

- **Must-have sections:** call button on the first screen · services with **starting prices** · book / request a quote / text · hours and directions · how the shop works (written estimates, warranty terms *if the owner offers them in writing*).
- **Start from:** auto repair demo (`layout.hero: "fullbleed"`, `headingCase: "uppercase"`, `hero.secondary: "call"`).
- **Colors:** workshop grey `#F3F4F6` · charcoal `#1F2937` · safety orange `#B3390A` (as in the demo).
- **Fonts:** Barlow Condensed + Barlow (demo).
- **Avoid:** certification badges or "years in business" the owner can't prove · hiding prices completely (use "From $…" or "Quoted per vehicle").

### 🚿 Home services: plumbing, HVAC, electrical, handyman, cleaning, landscaping
*Skill data: "Home Services (Plumber/Electrician)": conversion + trust · trust blue + safety orange + grey · professional, clear type · must have emergency contact and (real) certifications.*

- **Must-have sections:** big "Call now" (and "Emergency service" only if the owner offers it) · services list · service area (towns/ZIP codes) · request a quote · hours.
- **Start from:** auto repair demo; change `menu.heading` to "Services", add the service area to `about` or `contact.parkingNote`.
- **Colors:** `background #F8FAFC` · `surfaceAlt #E8EEF7` · `text #0F172A` · `mutedText #475569` · `primary #1E3A8A` (trust blue) · `accent` and `cta #B3390A` (safety orange).
- **Fonts:** Lexend + Source Sans 3 (the skill's "Corporate Trust" pairing) or Barlow Condensed + Barlow.
- **Avoid:** "licensed & insured" unless the owner gives you the license details · hiding the phone number below the fold.

### ✂️ Salons, spas, barbers
*Skill data: "Beauty/Spa/Wellness": hero-centric + social proof · soft pastels with cream and gold · elegant, calming type · must have booking and a before/after gallery · avoid neon colors, harsh animations and dark mode.*

- **Must-have sections:** "Book now" linked to their booking tool (Square, Vagaro, Booksy, Fresha…) · service menu with prices and durations · gallery of their own work · stylists/barbers (with permission) · hours and directions.
- **Start from:** auto repair demo for the price list and booking buttons, with `layout.hero: "arch"` and italic accents for a softer look.
- **Colors (salon/spa):** `background #FBF7F4` · `surfaceAlt #F1E7E2` · `text #2B2523` · `mutedText #5E534F` · `primary` and `cta #5B3A45` (plum) · `accent #8A5A3B` (bronze).
- **Colors (barbershop):** `background #F4F1EC` · `surfaceAlt #E7E1D7` · `text #1C1C1C` · `mutedText #4F4A44` · `primary #1C1C1C` · `accent` and `cta #8B1E1E` (barber red).
- **Fonts:** Cormorant Garamond + Montserrat (salon/spa) · Oswald or Barlow Condensed + Barlow (barbers).
- **Avoid:** testimonials or before/after photos the business didn't provide.

### 🛍️ Shops and local retail
- **Must-have sections:** what they sell (use the menu component for categories) · hours · location · call · links to their online shop or social pages.
- **Colors (example):** `background #FFFFFF` · `surfaceAlt #F1F5F4` · `text #14211F` · `mutedText #4B5B58` · `primary` and `cta #0F4C45` · `accent #B4462C`, or simply their own brand colors after a contrast check.

---

## Rules that apply to every industry

From the skill's pre-delivery checklist, already built into the engine and checked by `tools/test-site.mjs`:

- Text contrast at least **4.5:1**. Check new colors at [webaim.org/resources/contrastchecker](https://webaim.org/resources/contrastchecker/).
- Tap targets at least **44 × 44 px**; visible keyboard focus; no emoji used as icons.
- Works at **320 px** wide with no sideways scrolling; respects "reduce motion".
- Real photos, compressed (WebP, about 150 KB or less).
- Contact info never hidden: call, directions and the main action are always one tap away (the phone bottom bar).
