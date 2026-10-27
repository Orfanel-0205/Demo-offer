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
     whatsapp: "",
     hours: "Calls and messages during US business hours, Monday to Friday.",
   },
   ```

3. **Commit changes.** After Render republishes (1–2 minutes), your email appears next to the form and in the footer.

**What the form does now:** when a visitor presses **Send inquiry**, their own email app opens with your address, a subject like *"Website inquiry: Jane's Diner"* and all their answers filled in. They press Send.

**Limits:** the visitor has to press Send in their email app, and a few desktop visitors have no email app set up. That's why the page also shows your address to copy. Step 2 removes both limits.

> Use a **business** email (a separate Gmail is fine), not your personal one. It's shown publicly on the website.

### Optional contact buttons

- `phoneDisplay` / `phoneLink`: shows **Call** and **Text** buttons. Only add a number you can answer. Calls from the US to a Philippine number are international for the caller.
- `whatsapp`: digits only with country code (e.g. `"639171234567"`). Shows a **WhatsApp** button, which is free for the visitor.

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

## Quote forms on client websites (Business package)

The Business package includes an inquiry or quote-request form for the client. The simplest, free and client-owned way:

1. The client (or you, in a Google account you hand over) creates a **Google Form** with the questions they want: name, phone, vehicle/party size, date, message.
2. In Google Forms → **Responses** → ⋮ → **Get email notifications for new responses**.
3. Copy the form's **Send → link** and paste it as the `url` of the "Request a quote" button in the client's `config.js` (`actions` section).

Alternatively, create a separate Formspree form for each client. Remember the free plan's monthly limit applies to your whole account.

---

## Privacy

The form only collects what's needed to reply. The page says *"We only use your details to reply to this inquiry. We never sell or share them."* Keep that promise: don't add inquiry emails to marketing lists without permission.
