# 2 · Connect a client-owned domain

Each paying restaurant should **own its domain** (e.g. `tonyspizzeria.com`) in **its own account**. You connect it to the website they paid for. This protects the owner and keeps you out of disputes if you ever stop working together.

---

## Before you start

- [ ] The client's site is finished, approved in writing, and live on its `onrender.com` link.
- [ ] In `site/config.js`: `demoMode: false`, and `meta.siteUrl` is set to the final address (e.g. `"https://www.tonyspizzeria.com"`).
- [ ] In `site/index.html`: the `<meta name="robots" content="noindex, nofollow">` line is **deleted**, title/description/og tags match the restaurant, and `og:image` uses the full address (`https://www.tonyspizzeria.com/images/og-image.jpg`).
- [ ] You know who will log in to the domain's DNS settings: the owner on a video call with you, or you through the registrar's own "share/delegate access" feature. Avoid asking for the owner's password.

## 1. The client buys the domain (if they don't have one)

- Registrars such as Namecheap, Porkbun, Cloudflare Registrar or Squarespace Domains sell `.com` domains. Prices vary by registrar and renewal year. Have the owner check the **renewal** price, not just the first-year price.
- The domain, its renewal and any email service are **paid by the client** unless your written quote says otherwise.
- Domain-based email (e.g. `hello@tonyspizzeria.com`) is a separate paid service from the registrar or a provider like Google Workspace or Zoho. It's not part of your packages unless quoted.

## 2. Add the domain in Render

1. Render dashboard → open the client's static site → **Settings** → **Custom Domains** → **+ Add Custom Domain**.
2. Enter `www.tonyspizzeria.com` and save. Render adds the root domain (`tonyspizzeria.com`) too and redirects it to `www`.
3. Render now shows the DNS records it expects. **Use the values Render shows you.** They take priority over this guide.

## 3. Add the DNS records at the registrar

Log in to the registrar → the domain → **DNS** / **Advanced DNS** / **Manage DNS**:

| Type | Host / Name | Value / Points to | Notes |
| --- | --- | --- | --- |
| `CNAME` | `www` | `your-site-name.onrender.com` | Use the client site's own Render address. |
| `ALIAS` or `ANAME` | `@` | `your-site-name.onrender.com` | If the registrar supports ALIAS/ANAME (Namecheap and Porkbun do). |
| `A` | `@` | `216.24.57.1` | **Only if ALIAS/ANAME isn't available.** This is the IP in Render's docs as of October 2026. Confirm it in the Render dashboard. |

Also:

- **Delete any `AAAA` records** for `@` and `www`. Render's docs say they can cause problems.
- Delete old "parking page" or "URL redirect" records for `@` and `www` that the registrar created automatically.
- If the domain's DNS is on **Cloudflare**, follow Render's Cloudflare guide instead. It requires `CNAME` records rather than an `A` record.
- If the domain has `CAA` records, they must allow `letsencrypt.org` and `pki.goog`.

## 4. Verify and wait for HTTPS

1. Back in Render, tap **Verify** next to each domain. If it fails, DNS may still be spreading. Wait 10–30 minutes and try again (occasionally it takes a few hours).
2. Render issues a free HTTPS certificate automatically once verification succeeds.
3. Test on your phone: `tonyspizzeria.com`, `www.tonyspizzeria.com` and `http://…` should all end up at `https://www.tonyspizzeria.com`.

## 5. After launch

- [ ] Send the owner the link and the handover notes (what's included, how to request updates).
- [ ] Ask the owner to add the website to their **Google Business Profile**, Yelp, Instagram and Facebook bio. They control those accounts.
- [ ] Run the phone test checklist in [guide 1](01-preview-and-deploy-from-your-phone.md#d-test-the-site-on-your-phone-do-this-before-every-demo-and-every-launch) on the real domain.
- [ ] Note the domain's renewal date in your client tracker and remind the owner a month before.

---

## Hosting several clients on one Render account

- Each client gets its **own repository** and its **own Render static site** (see [guide 3](03-customize-for-a-client.md)).
- According to Render's docs (checked October 2026), a **Hobby** workspace includes **2 custom domains**, and each extra domain costs **$0.25/month**. A root + `www` pair may count as two. Check Render's pricing page as you grow, and include this small cost in your monthly update plan or quote.
- Keep each client's login details out of the repository. Never commit passwords, API keys or tokens.

## Free alternatives if Render's terms change

Other hosts with free static hosting and custom domains include **Cloudflare Pages** and **Netlify**. The site needs no build step, so on any of them set the **build output / publish directory** to `site` and leave the build command empty.
