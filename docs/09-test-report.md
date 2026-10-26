# 9 · Test report

**Date:** 27 October 2026
**Tool:** [`tools/test-site.mjs`](../tools/test-site.mjs): automated checks with Playwright driving Google Chrome, plus the [axe-core](https://github.com/dequelabs/axe-core) accessibility engine.
**Result:** ✅ **76 / 76 checks passed.**

Re-run any time on a computer with `cd tools && npm install && npm test`. Screenshots are saved to `tools/output/`.

---

## What was checked

### Layout at 7 screen sizes
Phones 320, 360, 390 and 430 px wide, tablet 768 px, laptop 1280 px and desktop 1536 px.

| Check | Result |
| --- | --- |
| No horizontal page overflow (no sideways scrolling) | ✅ all 7 sizes |
| No console errors or warnings, no failed or 4xx/5xx requests | ✅ all 7 sizes |
| Every image loads | ✅ all 7 sizes |

### Structure, links and accessibility

| Check | Result |
| --- | --- |
| Exactly one `<h1>`; heading levels never skip | ✅ |
| Every image has descriptive alt text | ✅ |
| No empty, `#` or `javascript:` links; every in-page link has a target section | ✅ |
| External links open in a new tab with `rel="noopener"` | ✅ |
| Directions use the official Google Maps URL format (`/maps/dir/?api=1&destination=…`) | ✅ |
| Click-to-call links use the configured number | ✅ |
| Demo contains **no invented external URLs** (only Google Maps directions) | ✅ |
| axe-core scan (WCAG 2.0/2.1/2.2 A & AA + best practices), phone layout | ✅ 0 violations |
| axe-core scan, desktop layout | ✅ 0 violations |

### Color contrast of the configured theme (WCAG AA needs ≥ 4.5:1)

| Pair | Ratio |
| --- | --- |
| Body text on background | 14.0 : 1 |
| Muted text on background | 6.6 : 1 |
| Muted text on sand sections | 6.0 : 1 |
| Forest green on background | 10.8 : 1 |
| Terracotta accent on background | 5.4 : 1 |
| Terracotta accent on light surface | 5.8 : 1 |
| Light text on forest green | 11.3 : 1 |

### Interactions on a phone (390 × 844, touch)

| Check | Result |
| --- | --- |
| Menu button opens/closes the navigation; `aria-expanded` updates; button is 48 × 48 px | ✅ |
| Choosing a nav link closes the menu and scrolls the section into view below the sticky header | ✅ |
| Escape closes the menu and returns focus to the button | ✅ |
| "Explore Our Menu" scrolls to the menu | ✅ |
| Category filters show only the chosen category, update `aria-pressed`, announce the change to screen readers, and are 44 px tall | ✅ |
| Demo ordering buttons explain that links are configured per client | ✅ |
| Bottom bar shows Menu / Call / Directions, each ≥ 44 px tall, and never covers the end of the page | ✅ |
| Keyboard: first Tab shows "Skip to main content", Enter moves focus to main; filters work with the keyboard | ✅ |

### Opening-hours logic
Tested with the visitor's device set to **Asia/Manila** to prove the status follows the **restaurant's** time zone (America/New_York):

| Restaurant local time | Shown |
| --- | --- |
| Fri 6:30 PM | Open now · Closes 10 PM |
| Fri 9:30 PM | Closing soon · Closes 10 PM |
| Mon 12:00 PM (closed day) | Closed now · Opens tomorrow 11:30 AM |
| Sun 9:00 PM | Closed now · Opens Tue 11:30 AM |
| Tue 8:00 AM | Closed now · Opens 11:30 AM |
| Sat 10:00 AM | Open now · Closes 10 PM |
| Overnight shift (Fri 6 PM–1 AM) at Sat 12:10 AM | Open now · Closes 1 AM |
| Split shift, between lunch and dinner | Closed now · Opens 5 PM |

### Client mode (`demoMode: false`)

| Check | Result |
| --- | --- |
| No demo labels, banner, stock-photo captions or pricing section | ✅ |
| Unconfigured ordering buttons hidden; empty Order section removed | ✅ |
| Header/footer links to the removed section are hidden automatically | ✅ |
| Configured links become real buttons that open in a new tab | ✅ |
| Only configured social links appear | ✅ |
| Restaurant structured data (JSON-LD) is added for search engines | ✅ |
| No console errors | ✅ |

### Page weight (demo, before Google Fonts)

| Asset | Size |
| --- | --- |
| HTML | 3.9 KB |
| CSS | 28.9 KB (6.6 KB compressed) |
| JavaScript (config + components) | 67 KB (19 KB compressed) |
| Photos loaded on a phone | ~305 KB (WebP, lazy-loaded below the first screen) |

No frameworks or third-party JavaScript libraries are loaded.

---

## Not tested yet (do these yourself)

Automated checks can't replace real devices. Before showing the demo widely, and before every client launch:

- **Real iPhone with Safari.** The tests ran in Chrome's engine with phone emulation. Safari renders some details differently.
- **Real Android phones** (your own, plus a low-end one if you can).
- **Firefox.**
- **A screen reader by hand:** TalkBack on Android or VoiceOver on iPhone. axe-core finds many but not all accessibility problems.
- **Performance on a real mobile network:** run [pagespeed.web.dev](https://pagespeed.web.dev) on the live Render link. Scores vary between runs.
- **Link previews:** paste the live link into WhatsApp/Messenger and check the preview image and text.

Because of these gaps, this kit makes no claim of full accessibility compliance or a particular performance score. It only reports the automated results above.
