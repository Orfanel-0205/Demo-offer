# Bright Site Tech brand guide

<p><img src="png/logo-1200.png" alt="Bright Site Tech logo" width="360"></p>

## The idea

A rounded **website window** with a **sun rising** over the horizon: a *bright site*. Navy stands for trust and professionalism; amber for energy and "bright". The shape is simple enough to read clearly as a 16-pixel browser icon or a round social-media profile picture.

## Files

| File | Use it for |
| --- | --- |
| [`svg/logo.svg`](svg/logo.svg) · [`png/logo-1200.png`](png/logo-1200.png) | Main logo on white or light backgrounds (documents, invoices, proposals) |
| [`svg/logo-white.svg`](svg/logo-white.svg) · [`png/logo-white-1200.png`](png/logo-white-1200.png) | On navy or dark backgrounds and photos |
| [`svg/logo-inline.svg`](svg/logo-inline.svg) · [`png/logo-inline-1200.png`](png/logo-inline-1200.png) | One-line version for narrow spaces (website header) |
| [`svg/logo-stacked.svg`](svg/logo-stacked.svg) / [`-white`](svg/logo-stacked-white.svg) | Square-ish spaces (flyers, slide title pages) |
| [`svg/mark.svg`](svg/mark.svg) · [`png/mark-1024.png`](png/mark-1024.png) | The symbol on its own (app-style icon) |
| [`svg/mark-reversed.svg`](svg/mark-reversed.svg) | Symbol on dark backgrounds |
| [`svg/favicon.svg`](svg/favicon.svg) | Browser tab icon (simplified so it stays clear at 16 px) |
| [`png/profile-1024.png`](png/profile-1024.png) | Facebook, Instagram, LinkedIn, WhatsApp Business, Google profile picture (safe for circle crops) |
| [`png/social-cover-1640x624.png`](png/social-cover-1640x624.png) | Facebook / LinkedIn cover image |
| [`png/email-signature-logo.png`](png/email-signature-logo.png) | Email signature (Gmail → Settings → Signature → insert image) |

SVG files are sharp at any size, so prefer them for the web and for print. Use PNGs where an app only accepts images.

## Colors

| Name | Hex | Use |
| --- | --- | --- |
| **Navy** | `#0B1B33` | Logo, headings, dark sections, text on amber |
| **Amber** | `#FFB020` | The sun, main buttons, highlights. Never use it as text on white (too light). |
| **Amber ink** | `#8A5200` | Small amber-toned labels on white (passes contrast) |
| **Slate** | `#52627A` / `#4A5568` | "TECH" in the logo, secondary text |
| **Mist** | `#C9D3E3` | Light text on navy |
| **Paper** | `#F5F7FA` | Light section backgrounds |

## Typography

**Plus Jakarta Sans** (free, [Google Fonts](https://fonts.google.com/specimen/Plus+Jakarta+Sans), SIL Open Font License). ExtraBold (800) for "Bright Site" and headlines; Bold (700) with wide letter-spacing for "TECH"; Regular/Medium for text. In the logo files the letters are converted to shapes, so the logo looks the same even where the font isn't installed. The OFL license allows this ([license](PlusJakartaSans-OFL.txt)).

## Do / don't

- ✅ Keep clear space around the logo at least the height of the "TECH" line.
- ✅ Main logo at least **120 px** wide on screens; below that, use the inline logo or the mark.
- ✅ Use the white version on navy, dark colors or busy photos.
- ❌ Don't stretch, rotate, outline, add shadows or recolor the sun.
- ❌ Don't put the navy logo on dark backgrounds or the white logo on light ones.
- ❌ Don't recreate the wordmark in another font.

## Before you rely on the name

"Bright Site Tech" was chosen as your working brand. Before printing materials or buying a domain:

1. Search the US trademark database ([tmsearch.uspto.gov](https://tmsearch.uspto.gov)) and a web search for similar names in web design.
2. Check domain availability (e.g. `brightsitetech.com`) and social handles.
3. Check what the Philippines requires for business name registration (DTI) if you'll invoice clients.

## Re-generating the files (computer only)

The logo is generated from code, so it can be adjusted precisely:

- `tools/make-logo.py`: builds the SVGs (needs Python with `fonttools` and `uharfbuzz`, plus the Plus Jakarta Sans font file).
- `tools/render-brand.mjs`: exports all PNGs, the website link-preview image and the iPhone icon.
