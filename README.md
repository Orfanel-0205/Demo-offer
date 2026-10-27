<p align="center"><img src="brand/png/logo-1200.png" alt="Bright Site Tech" width="420"></p>

# Bright Site Tech: studio website, portfolio and client kit

Everything for a one-person web design studio that builds mobile-friendly websites for **US restaurants, auto repair shops and other local businesses**:

- **The Bright Site Tech website** ([`site/`](site/)): portfolio, packages (**$149** Starter, **$249** Business, optional **$39/month** updates), FAQ and an easy inquiry form.
- **Two sample designs** for fictional businesses, each a complete, reusable website template:
  - 🍽️ **Harbor & Hearth Kitchen** (restaurant): warm editorial design, filterable menu, live opening hours, reservation/delivery buttons.
  - 🔧 **Copperline Auto Care** (auto repair): bold high-contrast design, services with starting prices, book/quote/text buttons, one-tap calling.
- **Your logo and brand kit** ([`brand/`](brand/)): SVG and PNG files for the website, social profiles, email signature and documents.
- **Demo videos** ([`videos/`](videos/)) to send to prospects.
- **Guides** ([`docs/`](docs/)) for deploying from your phone, customizing for clients, cold calling, onboarding and your first 30 days.

> The sample businesses are **fictional**. Their menus, prices, hours, addresses and phone numbers are sample content, and the pages say so. Photos are CC0 stock images ([credits](docs/image-credits.md)).

---

## How it fits together

```
site/                              ← published by Render (your website)
├── index.html                     ← Bright Site Tech home page
├── agency.config.js               ★ your packages, prices, contact details, inquiry form, portfolio list
├── assets/                        ← your logo, styles, scripts, portfolio screenshots
└── demos/
    ├── restaurant/                ← Harbor & Hearth Kitchen  (/demos/restaurant/)
    │   ├── index.html
    │   ├── config.js              ★ everything about this business
    │   ├── images/
    │   └── engine/                ← template code (copied from /engine — don't edit here)
    └── auto-repair/               ← Copperline Auto Care     (/demos/auto-repair/)
engine/                            ← master copy of the template code (sections, styles)
brand/                             ← logo files (SVG + PNG) and brand guide
docs/                              ← guides
videos/                            ← demo videos
tools/                             ← optional desktop tools: preview server, tests, screenshots, videos
```

- **One file per business.** Each demo's `config.js` holds the name, colors, fonts, menu or services and prices, hours, address, buttons, photos and text. Change it and the site updates.
- **Each demo folder is a complete website.** For a paying client, copy the closest demo and publish just that folder (see [guide 3](docs/03-customize-for-a-client.md)).
- **Your prices live in one place:** `site/agency.config.js`. The home page, the panel under each demo and the video end cards all read from it.

## Guides

| # | Guide | Read when |
| --- | --- | --- |
| 1 | [Preview, deploy and test from your phone](docs/01-preview-and-deploy-from-your-phone.md) | First: put the site online |
| 2 | [Set up the inquiry form](docs/02-set-up-the-inquiry-form.md) | Right after deploying |
| 3 | [Customize a template for a paying client](docs/03-customize-for-a-client.md) | When someone says yes |
| 4 | [Connect a client-owned domain](docs/04-connect-a-client-domain.md) | At launch |
| 5 | [Industry design playbook](docs/05-industry-design-playbook.md) (from the UI UX Pro Max analysis) | Before designing for a new industry |
| 6 | [Demo walkthrough script](docs/06-demo-walkthrough-script.md) | Showing a sample to an owner |
| 7 | [Cold-call script & objection answers](docs/07-cold-call-script.md) | Before calling |
| 8 | [Follow-up email](docs/08-follow-up-email.md) | After a call |
| 9 | [Client onboarding checklist](docs/09-client-onboarding-checklist.md) | Collecting content |
| 10 | [First paying client in 30 days](docs/10-first-client-30-day-plan.md) | Planning your month |
| 11 | [Test report](docs/11-test-report.md) | What's been checked |
| — | [Brand guide](brand/README.md) · [Image credits](docs/image-credits.md) | Using your logo · photo licenses |

## Quick start (phone only)

1. **Publish:** sign in to [render.com](https://render.com) with GitHub → **New → Static Site** → pick this repository → **Publish directory** `site` → **Create Static Site**.
2. **Add your contact details:** on github.com, edit [`site/agency.config.js`](site/agency.config.js) and fill in `contact.email` (a business address). The inquiry form then works immediately by opening the visitor's email app. Add a free Formspree endpoint later for direct delivery ([guide 2](docs/02-set-up-the-inquiry-form.md)).
3. **Share:** your home page is the Render link (`https://…onrender.com`); the samples are at `/demos/restaurant/` and `/demos/auto-repair/`.

## Packages (edit in `site/agency.config.js`)

| Package | Price | In short |
| --- | --- | --- |
| **Starter Website** | **$149** one-time | One-page mobile site on a proven layout for your industry: menu/services with prices, hours with "Open now", map, call/text buttons, links to booking/ordering/social, basic SEO, 1 revision round. |
| **Business Website** | **$249** one-time | Everything in Starter plus a design tailored to the brand, up to 8 sections, an inquiry/quote form to the owner's email, booking/ordering buttons, structured data and link preview, 2 revision rounds, launch checks and handover guide. |
| **Website Updates** | **$39**/month, optional | A set number of small monthly changes (menu, prices, hours, photos), defined in the written agreement. |

Domain, third-party tools and anything not listed are separate. Scope is confirmed in writing before work begins. No promises of more customers or rankings.

## On a computer (optional)

```bash
node tools/serve.mjs                 # preview at http://localhost:8080
cd tools && npm install
npm test                             # 190 automated checks across all three sites
node sync-engine.mjs                 # copy engine/ changes into every demo
node capture-portfolio.mjs           # refresh portfolio screenshots
node render-brand.mjs                # re-export logo PNGs and the link-preview image
npm run videos                       # re-record the demo videos (needs ffmpeg)
```

## Ground rules

- No fabricated testimonials, client logos, results, certifications or "best in town" claims.
- No promise that a website increases revenue or Google rankings.
- Only owner-approved content, links and photos go on a client's site.
- No API keys, passwords or secrets in the code. Everything in `site/` is public.
