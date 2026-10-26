# 1 · Preview, deploy and test, all from your phone

Everything here works from an Android phone with Chrome. You don't need a computer, a terminal or any paid service.

**You'll use:**

- **GitHub** (free): stores the code. You already have the repository.
- **Render** (free static sites): publishes the `site/` folder to a public `https://….onrender.com` link and republishes automatically every time you save a change on GitHub.

> Render's free terms and limits can change. Check [render.com/pricing](https://render.com/pricing) before relying on them for clients.

---

## A. Publish the demo on Render (first time, about 5 minutes)

1. In Chrome, go to **[render.com](https://render.com)** → **Get Started** → **Sign up with GitHub**. Approve the request.
2. In the Render dashboard, tap **New +** → **Static Site**.
3. Under *Connect a repository*, tap **Configure account / Connect GitHub** if asked. Allow access to the **Demo-offer** repository (you can choose "Only select repositories").
4. Select **Demo-offer** and fill in:

   | Field | Value |
   | --- | --- |
   | **Name** | `harbor-hearth-demo` (this becomes part of your link if available) |
   | **Branch** | `main` |
   | **Root Directory** | *leave empty* |
   | **Build Command** | leave empty. If Render insists on a value, type `echo "no build needed"` |
   | **Publish Directory** | `site` |

5. Tap **Create Static Site**. Wait for the log to show **Your site is live 🎉** (usually under 2 minutes).
6. Tap the link at the top (something like `https://harbor-hearth-demo.onrender.com`). That's your demo. Bookmark it, and add it to your home screen (Chrome menu ⋮ → **Add to Home screen**) so it opens like an app during calls.

**Alternative (Blueprint):** Render can read [`render.yaml`](../render.yaml) instead: **New +** → **Blueprint** → choose this repository → **Apply**. It creates the same static site with the settings already filled in.

> **Important:** the publish directory must be `site`. If you publish the whole repository by mistake, the sales scripts in `docs/` would become public web pages.

---

## B. Edit the site from your phone

1. Open **github.com/Orfanel-0205/Demo-offer** in Chrome and sign in.
2. Tip: for the full editor, open the Chrome menu ⋮ and tick **Desktop site**. Zoom in as needed.
3. Tap `site` → `config.js` → the ✏️ **pencil icon** (Edit this file).
4. Change the text between quotes, for example:

   ```js
   tagline: "Comfort food, cooked with care.",
   ```

5. Tap **Commit changes…**. Write a short message (e.g. "Update tagline") → **Commit changes**.
6. Render notices the commit and republishes automatically. Wait 1–2 minutes, then reload your demo link. If you still see the old version, close and reopen the tab.

**Golden rules for `config.js`:**

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

Open the live link in Chrome on your phone and go through this list:

- [ ] Page loads quickly and the photos appear.
- [ ] No sideways scrolling: drag left/right on every section, and nothing should move.
- [ ] Text is readable without zooming.
- [ ] **Explore Our Menu** jumps to the menu.
- [ ] Menu category buttons (All / Starters / …) each show the right dishes.
- [ ] ☰ button opens and closes the navigation, and each link jumps to its section.
- [ ] **Get Directions** opens Google Maps at the right place.
- [ ] **Call** opens the phone dialer with the right number. (On the demo it's a fictional 555 number, so don't press dial.)
- [ ] Opening-hours badge says "Open now" or "Closed now" correctly for the restaurant's local time.
- [ ] Ordering / reservation / delivery buttons open the right pages (client sites) or show the demo explanation (demo).
- [ ] Bottom bar (Menu · Call · Directions) works and doesn't cover the last lines of the page.
- [ ] Rotate the phone to landscape and check again.
- [ ] If you can, borrow an **iPhone** and check in Safari. It's the most common browser among US customers.

**Free automated check from your phone:** open **[pagespeed.web.dev](https://pagespeed.web.dev)**, paste your link, tap **Analyze**. It reports performance, accessibility, best practices and SEO for mobile. Treat it as a guide; scores vary between runs.

---

## E. Troubleshooting

| Problem | Fix |
| --- | --- |
| Page is blank or shows "could not load its settings" | Syntax error in `config.js` (missing quote or comma). Check the file's History on GitHub. |
| A photo doesn't show | File names are **case-sensitive** online: `Hero.webp` ≠ `hero.webp`. Check the spelling in `config.js` matches the uploaded file exactly. |
| My change isn't visible | Wait 2 minutes, check Render's **Events** tab says "Deploy live", then close and reopen the tab. |
| Render deploy failed | Open the deploy log in Render. The most common cause is a wrong **Publish Directory** (must be `site`). |
| Link previews (WhatsApp/Facebook) show old text | Update the tags in the `<head>` of `site/index.html`. Social apps cache previews for a while. |

---

## F. If you do have a computer

```bash
git clone https://github.com/Orfanel-0205/Demo-offer.git
cd Demo-offer
node tools/serve.mjs        # open http://localhost:8080
```

Or double-click `site/index.html`. The site also works when opened directly as a file.
