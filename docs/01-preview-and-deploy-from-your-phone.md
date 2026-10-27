# 1 · Preview, deploy and test, all from your phone

Everything here works from an Android phone with Chrome. You don't need a computer, a terminal or any paid service.

**You'll use:**

- **GitHub** (free): stores the code. You already have the repository.
- **Render** (free static sites): publishes the `site/` folder to a public `https://….onrender.com` link and republishes automatically every time you save a change on GitHub.

> Render's free terms and limits can change. Check [render.com/pricing](https://render.com/pricing) before relying on them for clients.

---

## A. Publish your website on Render (first time, about 5 minutes)

1. In Chrome, go to **[render.com](https://render.com)** → **Get Started** → **Sign up with GitHub**. Approve the request.
2. In the Render dashboard, tap **New +** → **Static Site**.
3. Under *Connect a repository*, tap **Configure account / Connect GitHub** if asked. Allow access to the **Demo-offer** repository (you can choose "Only select repositories").
4. Select **Demo-offer** and fill in:

   | Field | Value |
   | --- | --- |
   | **Name** | `bright-site-tech` (this becomes part of your link if available) |
   | **Branch** | `main` |
   | **Root Directory** | *leave empty* |
   | **Build Command** | leave empty. If Render insists on a value, type `echo "no build needed"` |
   | **Publish Directory** | `site` |

5. Tap **Create Static Site**. Wait for the log to show **Your site is live 🎉** (usually under 2 minutes).
6. Tap the link at the top (something like `https://bright-site-tech.onrender.com`). That's your Bright Site Tech website. The sample designs live at:
   - `…onrender.com/demos/restaurant/` (Harbor & Hearth Kitchen)
   - `…onrender.com/demos/auto-repair/` (Copperline Auto Care)

   Bookmark them and add them to your home screen (Chrome menu ⋮ → **Add to Home screen**) so they open like apps during calls.
7. Next, set up how inquiries reach you: [guide 2](02-set-up-the-inquiry-form.md).

**Alternative (Blueprint):** Render can read [`render.yaml`](../render.yaml) instead: **New +** → **Blueprint** → choose this repository → **Apply**. It creates the same static site with the settings already filled in.

> **Important:** the publish directory must be `site`. If you publish the whole repository by mistake, the sales scripts in `docs/` would become public web pages.

### Publishing on Vercel instead

The repository also includes [`vercel.json`](../vercel.json), which tells Vercel to publish only the `site/` folder, with no build step, and to send the same security headers as on Render.

> **Check the plan first.** Vercel's free **Hobby** plan is for *personal, non-commercial use only*. Its fair-use rules (checked October 2026) count "advertising the sale of a product or service" and "receiving payment to create, update, or host the site" as commercial use. Your Bright Site Tech website advertises your services, and client websites are paid work. On Vercel, both need the **Pro** plan ($20 a month). Render's free static sites have no such rule, which is why this kit uses Render by default.

If you choose Vercel Pro:

1. In Chrome, go to **[vercel.com](https://vercel.com)** → **Sign Up** → **Continue with GitHub**.
2. **Add New…** → **Project** → **Import** next to **Demo-offer**.
3. Leave the settings as they are. `vercel.json` already sets *Framework: Other*, no build command and output directory `site`. Tap **Deploy**.
4. Your site appears at `https://<project-name>.vercel.app`, with the samples at `/demos/restaurant/` and `/demos/auto-repair/`. Every change you commit on GitHub republishes it, and pull requests get preview links.

Use **one** host for your live site. If you try both, delete the one you don't keep, so two copies of your site aren't online.

---

## B. Edit the site from your phone

1. Open **github.com/Orfanel-0205/Demo-offer** in Chrome and sign in.
2. Tip: for the full editor, open the Chrome menu ⋮ and tick **Desktop site**. Zoom in as needed.
3. Open the file you want to change and tap the ✏️ **pencil icon** (Edit this file):
   - **Your prices, contact details, portfolio:** `site/agency.config.js`
   - **A sample business's content:** `site/demos/restaurant/config.js` or `site/demos/auto-repair/config.js`
4. Change the text between quotes, for example:

   ```js
   price: "$149",
   ```

5. Tap **Commit changes…**. Write a short message (e.g. "Update tagline") → **Commit changes**.
6. Render notices the commit and republishes automatically. Wait 1–2 minutes, then reload the page. If you still see the old version, close and reopen the tab.

**Golden rules for the config files:**

- Keep the quotes `"…"` around text, and the comma at the end of each line.
- To write a quote mark inside text, use a curly one (“ ”) or an apostrophe (').
- If the page goes blank after a change, you most likely broke a quote or comma. Open the file's **History** on GitHub to see exactly what changed, fix it, and commit again.

---

## C. Preview changes *before* they go live

Pick one option:

### Option 1: Render pull-request previews (recommended, free for free static sites)

One-time setup: in Render, open your static site → **Previews** tab → under **Pull Request Previews** choose **Automatic** → save.

Then, every time:

1. On GitHub, edit the file as usual, but when committing choose **Create a new branch for this commit and start a pull request** → **Propose changes** → **Create pull request**.
2. Render builds a separate preview copy with its own `onrender.com` link. Find it in the pull request under **Deployments → View deployment** (it can take a minute to appear).
3. Check the preview on your phone. If it looks right, tap **Merge pull request** → the live site updates. If not, close the pull request and nothing changes.

### Option 2: a code-editor app with live preview

Free Android editors such as **Acode** or **Spck Editor** can open the project and preview `index.html` on the phone before you commit. Their Git features vary, so use them for previewing and keep committing through GitHub if that's easier.

### Option 3: a separate "staging" site

Create a `staging` branch on GitHub, then a second Render static site that publishes that branch. Edit `staging`, check its link, and merge into `main` when happy.

---

## D. Test the site on your phone (do this before every demo and every launch)

**Your Bright Site Tech page:**

- [ ] Logo, sample designs, packages and prices look right; "Open the live demo" opens each sample.
- [ ] ☰ menu opens, closes and jumps to each section; the yellow **Get a quote** button appears after you scroll.
- [ ] Send yourself a test inquiry and check it arrives ([guide 2](02-set-up-the-inquiry-form.md)).

**Each sample (and every client site):**

Open the live link in Chrome on your phone and go through this list:

- [ ] Page loads quickly and the photos appear.
- [ ] No sideways scrolling: drag left/right on every section, and nothing should move.
- [ ] Text is readable without zooming.
- [ ] The main hero button (**Explore Our Menu** / **See services & prices**) jumps to the right section.
- [ ] Menu category buttons (All / Starters / …) each show the right dishes.
- [ ] ☰ button opens and closes the navigation, and each link jumps to its section.
- [ ] **Get Directions** opens Google Maps at the right place.
- [ ] **Call** opens the phone dialer with the right number. (On the demo it's a fictional 555 number, so don't press dial.)
- [ ] Opening-hours badge says "Open now" or "Closed now" correctly for the business's local time.
- [ ] Ordering / booking / quote / delivery buttons open the right pages (client sites) or show the demo explanation (samples).
- [ ] Bottom bar (Menu or Services · Call · Directions) works and doesn't cover the last lines of the page.
- [ ] Rotate the phone to landscape and check again.
- [ ] If you can, borrow an **iPhone** and check in Safari. It's the most common browser among US customers.

**Free automated check from your phone:** open **[pagespeed.web.dev](https://pagespeed.web.dev)**, paste your link, tap **Analyze**. It reports performance, accessibility, best practices and SEO for mobile. Treat it as a guide; scores vary between runs.

---

## E. Troubleshooting

| Problem | Fix |
| --- | --- |
| Page is blank or shows "could not load its settings" | Syntax error in the config file you edited (missing quote or comma). Check the file's History on GitHub. |
| A photo doesn't show | File names are **case-sensitive** online: `Hero.webp` ≠ `hero.webp`. Check the spelling in `config.js` matches the uploaded file exactly. |
| My change isn't visible | Wait 2 minutes, check Render's **Events** tab says "Deploy live", then close and reopen the tab. |
| Render deploy failed | Open the deploy log in Render. The most common cause is a wrong **Publish Directory** (must be `site`). |
| Link previews (WhatsApp/Facebook) show old text | Update the tags in the `<head>` of the page's `index.html`. Social apps cache previews for a while. |

---

## F. If you do have a computer

```bash
git clone https://github.com/Orfanel-0205/Demo-offer.git
cd Demo-offer
node tools/serve.mjs        # open http://localhost:8080
```

The sample designs also work when opened directly as files (double-click `site/demos/restaurant/index.html`).
