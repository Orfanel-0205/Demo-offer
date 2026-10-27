# 2 · Set up the inquiry form (from your phone)

The "Tell us about your business" form on your website can deliver inquiries in two ways. Start with **Step 1** (2 minutes) so the form works today, then do **Step 2** when you have 10 minutes.

Everything is in one file: [`site/agency.config.js`](../site/agency.config.js).

---

## Step 1: Add your business email (required)

1. On github.com, open `site/agency.config.js` → ✏️ **Edit**.
2. In the `contact` block, fill in your email:

   ```js
   contact: {
     email: "hello@yourbusiness.com",
     phoneDisplay: "",
     phoneLink: "",
     whatsapp: "https://wa.me/qr/…",
     whatsappQr: "assets/img/whatsapp-qr.svg",
     hours: "Calls and messages during US business hours, Monday to Friday.",
   },
   ```

3. **Commit changes.** After Render republishes (1–2 minutes), your email appears next to the form and in the footer.

**What the form does now:** when a visitor presses **Send inquiry**, their own email app opens with your address, a subject like *"Website inquiry: Jane's Diner"* and all their answers filled in. They press Send.

**Limits:** the visitor has to press Send in their email app, and a few desktop visitors have no email app set up. That's why the page also shows your address to copy. Step 2 removes both limits.

> Use a **business** email (a separate Gmail is fine), not your personal one. It's shown publicly on the website.

### Optional contact buttons

- `phoneDisplay` / `phoneLink`: shows **Call** and **Text** buttons. Add the US number from your calling service once you have one, e.g. `"(555) 010-0000"` and `"+15550100000"`. Only add a number you can answer. A Philippine number would make every call from the US international for the caller.
- `whatsapp`: shows a **WhatsApp** button, a WhatsApp link in the footer and a QR code. See [WhatsApp](#whatsapp) below.

---

## Step 2: Deliver inquiries straight to your inbox with Formspree (recommended)

[Formspree](https://formspree.io) receives the form and emails it to you. Its free plan (checked October 2026) allows **50 submissions a month** with email notifications and basic spam filtering. That's plenty while you're starting.

1. In Chrome, open **formspree.io** → **Sign up** with your business email. Confirm the email they send you.
2. Create a **New form** (name it "Bright Site Tech inquiries").
3. Copy the form's **endpoint**. It looks like `https://formspree.io/f/abcdwxyz`.
4. In `site/agency.config.js`, paste it into `inquiry.endpoint` and commit:

   ```js
   inquiry: {
     endpoint: "https://formspree.io/f/abcdwxyz",
     replyTime: "We reply personally, usually within one business day.",
   },
   ```

5. **Test it:** open your website on your phone, fill in the form with your own details, and send. You should see *"Thanks, … your inquiry is on its way"*, and an email from Formspree should arrive within a minute. Formspree may ask you to confirm the very first submission.
6. Recommended: in the form's settings on Formspree, restrict submissions to your website's domain (your `onrender.com` address, later your own domain).

**Spam:** the form already includes a hidden spam trap (`_gotcha`) that Formspree understands.

**Get notified on your phone:** install the Gmail app (or your email app) and turn on notifications for that inbox.

**Reply time:** edit `replyTime` to something you can always keep. It's a promise to prospects.

---

## WhatsApp

`contact.whatsapp` takes either:

- **the link from your WhatsApp QR code**, e.g. `"https://wa.me/qr/BATWZA4GHVGJG1"`. This opens a chat with you without showing your number on the page (WhatsApp shows it once they message you). Or
- **your number**, digits only with country code, e.g. `"639171234567"`.

Where it appears:

- **On phones:** a **WhatsApp** contact button next to the form, in the footer, in the chat assistant and in the panel under each sample design. Tapping it opens the WhatsApp app.
- **On computers:** also a **QR code** next to the form (`contact.whatsappQr`). Visitors scan it with their phone. It's hidden on phones because nobody can scan their own screen.
- **In the form:** visitors can pick **WhatsApp** as the way you should reply, and must then enter their number.

**If your WhatsApp link changes** (for example after *Reset QR code* in WhatsApp), update `contact.whatsapp` *and* replace the QR image. Either run `cd tools && npm run qr` on a computer, or upload a screenshot of your new WhatsApp QR code to `site/assets/img/` and point `whatsappQr` at it. The automated tests check that the QR code scans to the same link as the button.

**Good to know:**

- WhatsApp is common in the Philippines but **less common among US business owners**, many of whom prefer a phone call, a text or email. Keep your email visible, and add a US number when you have one.
- Consider the free **WhatsApp Business** app, with your logo (`brand/png/profile-1024.png`), the name *Bright Site Tech*, your hours and an away message. Owners who scan your code then see your business, not your personal profile.

---

## The chat assistant ("Questions?" button)

Your website has a chat button in the bottom-right corner. It opens a small chat that answers common questions instantly:

- **prices and what each package includes**, from `packages` in `agency.config.js`;
- **which package fits**, as a two-question guide;
- **every FAQ answer**, from the FAQ section of `site/index.html`;
- **the industries you serve** and **how it works**, from those sections of the page;
- **sample designs for the visitor's type of business**: "What business are you in?" → "You might like these" with three previews from the [design gallery](12-design-gallery.md).

Visitors can tap suggested questions or type their own. When it doesn't know an answer, it says so and offers **WhatsApp**, **email** (with the question already filled in), or **"Add my question to the quote form"**.

**How it works, honestly:** it's not an AI. It matches the words in a question to your own answers, so it can only say what your website already says. It never invents a price, a promise or a date, costs nothing, needs no API key, and nothing a visitor types leaves their browser. It's labelled *"Automated answers"* so nobody thinks they're talking to a person.

**Changing its answers:** edit the FAQ, packages or sections. The assistant uses them automatically. To add a new FAQ answer, copy one of the `<details …>` blocks in the FAQ section of `site/index.html`, change the question and answer, and put the words people might type in `data-keywords` (for example `data-keywords="spanish language translate"`).

**The bubble:** a few seconds after the page opens, a small *"What business are you in?"* bubble appears beside the chat button with a few business types. Tapping one opens the chat with matching designs. It shows once per visit.

**Settings** (in `agency.config.js` → `assistant`): `name`, the `greeting`, `teaser: false` to turn off the bubble, and `enabled: false` to switch the whole assistant off.

> **Want a real AI assistant later?** It's possible, but it needs a server function with an API key kept secret, which this static site doesn't have. You'd pay for usage, and you'd need limits so it can't be abused or make promises you can't keep. Revisit once you have paying clients.

---

## Quote forms on client websites (Business package)

The Business package includes an inquiry or quote-request form for the client. The simplest, free and client-owned way:

1. The client (or you, in a Google account you hand over) creates a **Google Form** with the questions they want: name, phone, vehicle/party size, date, message.
2. In Google Forms → **Responses** → ⋮ → **Get email notifications for new responses**.
3. Copy the form's **Send → link** and paste it as the `url` of the "Request a quote" button in the client's `config.js` (`actions` section).

Alternatively, create a separate Formspree form for each client. Remember the free plan's monthly limit applies to your whole account.

---

## Privacy

The form only collects what's needed to reply. The page says *"We only use your details to reply to this inquiry. We never sell or share them."* Keep that promise: don't add inquiry emails to marketing lists without permission.
