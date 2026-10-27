# Demo videos

Three ready-to-share walkthroughs of the Bright Site Tech sample designs. They're silent (captions on screen), so they work with the sound off, which is how most people watch on their phones.

| File | Sample | Format | Length | Best for |
| --- | --- | --- | --- | --- |
| [`harbor-hearth-phone-demo.mp4`](harbor-hearth-phone-demo.mp4) | Restaurant | Vertical 1080 × 1920 | ~1:06 | Restaurant owners: Messenger, WhatsApp, Reels/Stories |
| [`copperline-auto-phone-demo.mp4`](copperline-auto-phone-demo.mp4) | Auto repair | Vertical 1080 × 1920 | ~0:58 | Mechanics and other service businesses |
| [`harbor-hearth-desktop-demo.mp4`](harbor-hearth-desktop-demo.mp4) | Restaurant (desktop + phone) | Landscape 1920 × 1080 | ~0:45 | Email links, YouTube (unlisted), Facebook posts, laptops |

Each video has a matching `-poster.jpg` thumbnail. All are H.264 MP4 (standard colors), which plays on iPhone, Android, Facebook, Instagram and WhatsApp.

**What they show:** the first screen with live opening hours → the menu or the price list and its filters → the business story and photo gallery → links to ordering, booking, quotes or delivery → address, hours, tap-to-call and directions → phone navigation → the Bright Site Tech packages (Starter $149 / Business $249 / Updates $39 per month) with the note "introductory prices, domain separate, scope confirmed in writing, no guaranteed results".

Every video states that the business is **fictional** and makes no claims about increasing customers, orders or rankings.

---

## How to use them from your phone

1. On github.com, open this folder → tap the video → **Download** (or "View raw"). Save it to your phone.
2. **Send directly** in Messenger/WhatsApp to an owner who agreed to see a sample, with one line of context (see [guide 6](../docs/06-demo-walkthrough-script.md#if-youre-sending-the-video-instead)).
3. **For email,** don't attach large files. Upload the video to YouTube as **Unlisted** (or Google Drive with "Anyone with the link") and paste the link.
4. **Social media:** the vertical videos fit Facebook/Instagram Reels and Stories. Post them on your Bright Site Tech page with a caption like *"Sample website for a fictional auto shop: prices, booking and one-tap calling. Want one for your business?"*
5. **Adding music (optional):** use a phone editor such as CapCut and only tracks you're licensed to use **commercially**, e.g. YouTube Audio Library tracks marked as free to use.

## Re-recording after you change a design

The videos are generated automatically from the real websites. This needs a computer with Google Chrome, Node.js and ffmpeg:

```bash
cd tools
npm install
npm run videos                     # all three (takes about 15 minutes)
node record-videos.mjs vertical    # restaurant, phone
node record-videos.mjs landscape   # restaurant, desktop + phone
node record-videos.mjs auto        # auto repair, phone
```

Captions and timing are in `tools/record-videos.mjs`; the stage design (phone and browser frames, intro and end cards) is in `tools/video/stage.html`. Prices on the end card are read from `site/agency.config.js`, so they always match your website.
