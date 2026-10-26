# Demo videos

Two ready-to-share walkthroughs of the Harbor & Hearth Kitchen sample website. They're silent (captions on screen), so they work with the sound off, which is how most people watch on their phones.

| File | Format | Length | Best for |
| --- | --- | --- | --- |
| [`harbor-hearth-phone-demo.mp4`](harbor-hearth-phone-demo.mp4) | Vertical 1080 × 1920, H.264 | ~1:06 | Messenger, WhatsApp, Instagram/Facebook Reels and Stories, showing on your phone |
| [`harbor-hearth-desktop-demo.mp4`](harbor-hearth-desktop-demo.mp4) | Landscape 1920 × 1080, H.264 | ~0:45 | Email links, YouTube (unlisted), Facebook posts, laptop presentations |

Each video has a matching `-poster.jpg` thumbnail.

**What they show:** the first screen with live opening hours → the menu and category filters → the restaurant story and photo gallery → links to ordering, reservation and delivery services → address, hours, tap-to-call and directions → mobile navigation → the RestaurantLaunch packages ($149 / $249 / $39 per month), with the "introductory prices, domain separate, scope confirmed in writing, no guaranteed results" note.

Both videos state that **Harbor & Hearth Kitchen is a fictional restaurant**, and make no claims about increasing customers, orders or rankings.

---

## How to use them from your phone

1. On github.com, open this folder → tap the video → **Download** (or "View raw"). Save it to your phone.
2. **Send directly** in Messenger/WhatsApp to an owner who agreed to see a sample, with one line of context (see [guide 4](../docs/04-demo-walkthrough-script.md#if-youre-sending-the-video-instead)).
3. **For email,** don't attach large files. Upload the video to YouTube as **Unlisted** (or Google Drive with "Anyone with the link") and paste the link.
4. **Adding music (optional):** use a phone editor such as CapCut and only use tracks you're licensed to use **commercially**, e.g. YouTube Audio Library tracks marked as free to use.

## Re-recording after you change the site

The videos are generated automatically from the real website, so they can be re-made after design changes. This needs a computer with Google Chrome, Node.js and ffmpeg:

```bash
cd tools
npm install
npm run videos              # both videos (takes about 5 minutes)
node record-videos.mjs vertical    # only the phone video
node record-videos.mjs landscape   # only the desktop video
```

Captions and timing are in `tools/record-videos.mjs`, and the frame/stage design is in `tools/video/stage.html`. Prices on the end card are read from `site/agency.config.js`, so they always match the website.
