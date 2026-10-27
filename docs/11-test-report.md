# 11 · Test report

**Date:** 28 October 2026
**Tool:** [`tools/test-site.mjs`](../tools/test-site.mjs): automated checks with Playwright driving Google Chrome, plus the [axe-core](https://github.com/dequelabs/axe-core) accessibility engine.
**Scope:** the Bright Site Tech website (`/`), the restaurant sample (`/demos/restaurant/`), the auto repair sample (`/demos/auto-repair/`), the design gallery (`/designs/`) and **all 108 gallery designs** (`/designs/view.html?d=…`).
**Result:** ✅ **356 / 356 checks passed.**

Re-run on a computer with `cd tools && npm install && npm test`. First-screen screenshots of every page at every size are saved to `tools/output/`.

---

## What was checked

### Template integrity
| Check | Result |
| --- | --- |
| Each demo's `engine/` copy is byte-for-byte identical to the master `engine/` | ✅ both demos and the gallery |

### Layout: 5 pages × 7 screen sizes
Phones 320, 360, 390 and 430 px wide, tablet 768 px, laptop 1280 px, desktop 1536 px.
Pages: your site, both samples, the gallery and one gallery design (the dark *Ember & Oak Steakhouse*).

| Check | Result |
| --- | --- |
| No horizontal page overflow (no sideways scrolling) | ✅ all 35 combinations |
| No console errors or warnings, no failed or 4xx/5xx requests | ✅ all 35 |
| Every image loads | ✅ all 35 |

### Structure, links and accessibility (each site)
| Check | Result |
| --- | --- |
| Exactly one `<h1>`; heading levels never skip | ✅ |
| Every meaningful image has descriptive alt text | ✅ |
| No empty, `#` or `javascript:` links; every in-page link has a target | ✅ |
| Links between your site and the samples work (HTTP 200) | ✅ |
| External links open in a new tab with `rel="noopener"`; no invented external URLs (only official Google Maps directions and your configured WhatsApp link) | ✅ |
| Click-to-call uses the configured (fictional 555-01xx) number | ✅ both samples |
| axe-core scan (WCAG 2.0/2.1/2.2 A & AA + best practices), phone and desktop | ✅ 0 violations on all 5 pages |

### Interactions
| Area | Checks | Result |
| --- | --- | --- |
| **Restaurant sample** | Menu button opens/closes (48 × 48 px), Escape closes and returns focus, nav scrolls below the sticky header, "Explore Our Menu", category filters (aria-pressed, screen-reader announcement, 44 px tall), demo buttons explain themselves, phone bar Menu/Call/Directions ≥ 44 px and never covers content, studio panel shows logo + 3 packages + inquiry link, skip link, keyboard filters | ✅ |
| **Auto repair sample** | "See services & prices" scrolls to the price list, second hero button calls the shop, "Brakes & Suspension" filter + announcement, "Text the shop" opens an SMS, demo booking button explains, phone bar Services/Call/Directions, navigation labels | ✅ |
| **Bright Site Tech site** | Menu opens and closes, packages come from `agency.config.js` (Starter ≤ $149, Business ≤ $249), every portfolio entry shown, sticky "Get a quote" appears only after scrolling, package and industry buttons pre-fill the form, validation (error summary, invalid fields, phone required for calls/texts), "not connected" message when unconfigured, **posts to a Formspree-style endpoint** and thanks the visitor by name, **email fallback** hands off to the email app | ✅ |
| **WhatsApp** | Contact button, footer link and the WhatsApp button in each demo's studio panel use your configured link; the QR code is shown on computers, hidden on phones, and **scans to the same link** (decoded with jsQR); choosing WhatsApp as the reply method requires a phone number | ✅ |

### Chat assistant (Bright Site Tech site)
| Check | Result |
| --- | --- |
| "Questions?" button ≥ 44 × 44 px, beside the sticky "Get a quote" bar without overlapping it; labelled on desktop | ✅ |
| Phones: opens full-screen, focus moves into the chat, the page behind becomes inert; desktop: side panel below the header, page stays usable | ✅ |
| Greets with the configured text and says it's automated; suggestion buttons ≥ 44 px | ✅ |
| Price answer lists every package from `agency.config.js` | ✅ |
| Typed questions find the right answer: timeline, online booking, "do you work with plumbers" (→ plumbing designs), types of business served, phones, Starter contents, location, Google rankings ("No one can honestly promise that") | ✅ |
| Unknown questions go to a person: your WhatsApp link, email with the question filled in, or "Add my question to the quote form" (copies it into the form and closes the chat) | ✅ |
| "Ask about Business Website" closes the chat and pre-selects that package | ✅ |
| "Show me designs for my business" asks *What business are you in?*; "we're a small bakery" → three bakery designs with previews, all links and images load, "See all" opens the bakery designs; a business with no sample ("bowling alley") gets an honest answer and the gallery link | ✅ |
| Escape closes and returns focus; reopening keeps the conversation; `enabled: false` removes it | ✅ |
| Nothing cut off on a 320 px phone; axe-core: 0 violations with the chat open (phone and desktop); no console errors | ✅ |

### "What business are you in?" bubble (home page)
| Check | Result |
| --- | --- |
| Appears beside the chat button; fits a phone screen above the button; every button ≥ 44 px | ✅ |
| Tapping "Restaurant" opens the chat with *You might like these restaurant designs* and three previews | ✅ |
| Doesn't come back in the same visit once used; the × closes it and returns focus to the chat button; `teaser: false` turns it off | ✅ |
| axe-core: 0 violations with the bubble showing; no console errors | ✅ |

### Design gallery and the 108 generated designs
| Check | Result |
| --- | --- |
| Over 100 designs (110 incl. the two full samples), unique ids, every design has a style, city, tagline, content file and thumbnail | ✅ |
| **Every one of the 108 designs** on a 390 px phone: no console errors or broken requests, every photo loads, nothing wider than the screen, every in-page link has a target, **axe-core 0 violations** | ✅ all 108 |
| All 15 style palettes: text, muted text, headings, prices, buttons and footer ≥ 4.5 : 1 | ✅ all 15 |
| Gallery: shows every design and the count; "I own a taco truck" → only Mexican restaurant designs and *You might like these*; `?type=` links; group filters; a business with no sample shows a helpful message | ✅ |
| "I like this one" opens your quote form with the design's name and the type of business filled in | ✅ |
| A design page: fictional-sample banner, "More … designs" back link, studio panel asks about that exact design, 555-01xx numbers only; unknown ids show a friendly message; the two full samples open their own pages | ✅ |
| `tools/export-design.mjs`: creates a complete folder (index.html, config.js, images, engine), refuses to overwrite without `--force`, the exported site works on its own with no gallery paths left | ✅ |

### Opening hours in the business's own time zone
| Case | Shown |
| --- | --- |
| Restaurant, viewer in Manila: Fri 6:30 PM ET / Fri 9:30 PM / Mon noon (closed day) / Sun 9 PM / Tue 8 AM | Open now · Closes 10 PM / Closing soon · Closes 10 PM / Closed now · Opens tomorrow 11:30 AM / Closed now · Opens Tue 11:30 AM / Closed now · Opens 11:30 AM ✅ |
| Overnight shift (6 PM–1 AM) at 12:10 AM; split lunch/dinner shift | Open now · Closes 1 AM; Closed now · Opens 5 PM ✅ |
| Auto shop (Boise, Mountain time), viewer in New York: Fri 5:30 PM / Sat 3 PM / Fri 9 AM | Closing soon · Closes 6 PM / Closed now · Opens Mon 7:30 AM / Open now · Closes 6 PM ✅ |

### Client mode (`demoMode: false`), both samples
| Check | Result |
| --- | --- |
| No demo labels, demo buttons, banner or studio panel | ✅ |
| Never loads your studio's `agency.config.js` | ✅ |
| Correct structured data type added (`Restaurant` / `AutoRepair`) | ✅ |
| No navigation links to hidden sections; configured links become real buttons, empty ones disappear | ✅ |

### Color contrast (WCAG AA ≥ 4.5:1)
| Theme | Lowest pair | Ratio |
| --- | --- | --- |
| Restaurant | terracotta on cream | 5.4 : 1 |
| Auto repair | safety orange on light grey sections | 4.8 : 1 |
| Bright Site Tech | amber-ink labels on white | 6.4 : 1 (navy text on amber buttons 9.4 : 1) |
| 15 gallery styles | every pair checked automatically | ✅ all ≥ 4.5 : 1 |

---

## Not tested yet (do these yourself)

- **Real iPhone (Safari)** and **real Android phones**. The checks ran in Chrome's engine with phone emulation.
- **Firefox.**
- **A screen reader by hand** (TalkBack / VoiceOver). axe-core finds many but not all problems.
- **Live delivery through your real Formspree form.** Send yourself a test inquiry after setting it up ([guide 2](02-set-up-the-inquiry-form.md)).
- **Your WhatsApp link on a real phone.** Scan the QR code on a computer screen and tap the WhatsApp button on a phone, and check that both open a chat with you.
- **Deployment on Vercel.** `vercel.json` follows Vercel's documented settings but hasn't been deployed from this kit yet. Open every page once after your first deploy.
- **Performance on a real mobile network:** run [pagespeed.web.dev](https://pagespeed.web.dev) on your live link, including the gallery (`/designs/`) and a few designs.
- **Every design at every screen size.** Each of the 108 designs was checked on a phone; only one (and the gallery) was checked at all seven sizes. They share the same layouts, so problems would show up there first, but open a few on a computer too.

This kit makes no claim of full accessibility compliance or a particular performance score beyond the automated results above.
