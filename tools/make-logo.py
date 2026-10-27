"""Build the Bright Site Tech logo as pure-path SVG files.

Text is converted to outlines from Plus Jakarta Sans (SIL OFL 1.1), so the
logo renders identically everywhere without the font installed.
usage: python make_logo.py <font.ttf> <out_dir>
"""
import io
import math
import sys
from pathlib import Path

import uharfbuzz as hb
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

FONT = Path(sys.argv[1])
OUT = Path(sys.argv[2])
OUT.mkdir(parents=True, exist_ok=True)

NAVY = "#0B1B33"
AMBER = "#FFB020"
SLATE = "#52627A"
WHITE = "#FFFFFF"
MIST = "#C9D3E3"

_instances = {}


def instance(wght):
    if wght not in _instances:
        tt = TTFont(FONT)
        inst = instantiateVariableFont(tt, {"wght": wght}, inplace=False)
        buf = io.BytesIO()
        inst.save(buf)
        data = buf.getvalue()
        _instances[wght] = (TTFont(io.BytesIO(data)), data)
    return _instances[wght]


def text_path(text, wght, size, tracking=0.0):
    """Return (path_d, advance_width, (xmin, ymin, xmax, ymax)) with baseline at y=0."""
    tt, data = instance(wght)
    upm = tt["head"].unitsPerEm
    face = hb.Face(data)
    font = hb.Font(face)
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    hb.shape(font, buf, {"kern": True, "liga": True})
    s = size / upm
    glyph_set = tt.getGlyphSet()
    order = tt.getGlyphOrder()
    svg = SVGPathPen(glyph_set)
    bounds = BoundsPen(glyph_set)
    x = 0.0
    track = tracking * size
    n = len(buf.glyph_infos)
    for i, (info, pos) in enumerate(zip(buf.glyph_infos, buf.glyph_positions)):
        name = order[info.codepoint]
        t = (s, 0, 0, -s, x + pos.x_offset * s, -pos.y_offset * s)
        glyph_set[name].draw(TransformPen(svg, t))
        glyph_set[name].draw(TransformPen(bounds, t))
        x += pos.x_advance * s + (track if i < n - 1 else 0)
    return svg.getCommands(), x, bounds.bounds


def f(v):
    return f"{v:.2f}".rstrip("0").rstrip(".")


def mark(x, y, size, reversed_=False):
    """The sunrise-window mark, drawn in a 64-unit box scaled to `size`."""
    k = size / 64
    box = WHITE if reversed_ else NAVY
    detail = NAVY if reversed_ else WHITE
    dots_opacity = "0.35" if reversed_ else "0.5"
    cx, cy = 32, 45.5
    rays = []
    for ang in (90, 126, 54, 162, 18):
        a = math.radians(ang)
        r1, r2 = (19.0, 25.5) if ang in (90, 126, 54) else (19.0, 24.0)
        rays.append(
            f'<line x1="{f(cx + r1 * math.cos(a))}" y1="{f(cy - r1 * math.sin(a))}" '
            f'x2="{f(cx + r2 * math.cos(a))}" y2="{f(cy - r2 * math.sin(a))}"/>'
        )
    return f"""<g transform="translate({f(x)} {f(y)}) scale({f(k)})">
    <rect width="64" height="64" rx="15" fill="{box}"/>
    <g fill="{detail}" opacity="{dots_opacity}"><circle cx="14.5" cy="14.5" r="2.6"/><circle cx="22" cy="14.5" r="2.6"/><circle cx="29.5" cy="14.5" r="2.6"/></g>
    <path d="M{cx - 14.5} {cy}a14.5 14.5 0 0 1 29 0z" fill="{AMBER}"/>
    <g stroke="{AMBER}" stroke-width="3.8" stroke-linecap="round">{''.join(rays)}</g>
    <rect x="11" y="{cy - 1.6}" width="42" height="4.6" rx="2.3" fill="{detail}"/>
  </g>"""


def svg_doc(w, h, body, title):
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {f(w)} {f(h)}" width="{f(w)}" height="{f(h)}" role="img" aria-labelledby="t">
  <title id="t">{title}</title>
  {body}
</svg>
"""


def stacked_wordmark(x, top, word_size, color_main, color_sub):
    """'Bright Site' over a tracked 'TECH' line. Returns (svg, width, height)."""
    d1, w1, b1 = text_path("Bright Site", 800, word_size, tracking=-0.015)
    sub_size = word_size * 0.36
    d2, w2, b2 = text_path("TECH", 700, sub_size, tracking=0.5)
    cap1 = -b1[1] if b1 else word_size * 0.72  # height above baseline (incl. ascenders)
    base1 = top + cap1
    gap = word_size * 0.30
    cap2 = -b2[1]
    base2 = base1 + (b1[3] if b1[3] > 0 else 0) + gap + cap2
    rule_x = x + w2 + sub_size * 0.9
    rule_w = max(0, w1 - (rule_x - x))
    svg = f"""<g>
    <path d="{d1}" transform="translate({f(x - b1[0])} {f(base1)})" fill="{color_main}"/>
    <path d="{d2}" transform="translate({f(x - b2[0])} {f(base2)})" fill="{color_sub}"/>
    <rect x="{f(rule_x)}" y="{f(base2 - cap2 / 2 - word_size * 0.035)}" width="{f(rule_w)}" height="{f(word_size * 0.07)}" rx="{f(word_size * 0.035)}" fill="{AMBER}"/>
  </g>"""
    height = base2 - top
    return svg, w1, height


def build_horizontal(reversed_=False):
    m = 72
    gap = 18
    word_size = 36
    main = WHITE if reversed_ else NAVY
    sub = MIST if reversed_ else SLATE
    wm, ww, wh = stacked_wordmark(0, 0, word_size, main, sub)
    total_h = max(m, wh)
    wm_top = (total_h - wh) / 2
    body = mark(0, (total_h - m) / 2, m, reversed_=reversed_) + f'\n  <g transform="translate({m + gap} {f(wm_top)})">{wm}</g>'
    return svg_doc(m + gap + ww + 2, total_h, body, "Bright Site Tech")


def build_inline(reversed_=False):
    m = 48
    gap = 12
    size = 27
    main = WHITE if reversed_ else NAVY
    sub = MIST if reversed_ else SLATE
    d1, w1, b1 = text_path("Bright Site", 800, size, tracking=-0.015)
    d2, w2, b2 = text_path("Tech", 600, size, tracking=-0.01)
    space = size * 0.26
    cap = -b1[1]
    base = m / 2 + cap / 2 - size * 0.02
    x1 = m + gap
    x2 = x1 + w1 + space
    body = mark(0, 0, m, reversed_=reversed_) + f"""
  <path d="{d1}" transform="translate({f(x1 - b1[0])} {f(base)})" fill="{main}"/>
  <path d="{d2}" transform="translate({f(x2)} {f(base)})" fill="{sub}"/>"""
    return svg_doc(x2 + w2 + 2, m, body, "Bright Site Tech")


def build_stacked(reversed_=False):
    m = 96
    word_size = 40
    main = WHITE if reversed_ else NAVY
    sub = MIST if reversed_ else SLATE
    wm, ww, wh = stacked_wordmark(0, 0, word_size, main, sub)
    width = max(m, ww) + 4
    body = mark((width - m) / 2, 0, m, reversed_=reversed_) + f'\n  <g transform="translate({f((width - ww) / 2)} {m + 22})">{wm}</g>'
    return svg_doc(width, m + 22 + wh + 2, body, "Bright Site Tech")


def favicon():
    cx, cy = 32, 44
    rays = []
    for ang in (90, 135, 45):
        a = math.radians(ang)
        rays.append(
            f'<line x1="{f(cx + 21 * math.cos(a))}" y1="{f(cy - 21 * math.sin(a))}" '
            f'x2="{f(cx + 28 * math.cos(a))}" y2="{f(cy - 28 * math.sin(a))}"/>'
        )
    return f"""<rect width="64" height="64" rx="14" fill="{NAVY}"/>
  <path d="M{cx - 17} {cy}a17 17 0 0 1 34 0z" fill="{AMBER}"/>
  <g stroke="{AMBER}" stroke-width="6" stroke-linecap="round">{''.join(rays)}</g>
  <rect x="8" y="{cy - 2}" width="48" height="7" rx="3.5" fill="{WHITE}"/>"""


files = {
    "favicon.svg": svg_doc(64, 64, favicon(), "Bright Site Tech"),
    "logo.svg": build_horizontal(),
    "logo-white.svg": build_horizontal(reversed_=True),
    "logo-inline.svg": build_inline(),
    "logo-inline-white.svg": build_inline(reversed_=True),
    "logo-stacked.svg": build_stacked(),
    "logo-stacked-white.svg": build_stacked(reversed_=True),
    "mark.svg": svg_doc(64, 64, mark(0, 0, 64), "Bright Site Tech"),
    "mark-reversed.svg": svg_doc(64, 64, mark(0, 0, 64, reversed_=True), "Bright Site Tech"),
}
for name, content in files.items():
    (OUT / name).write_text(content, encoding="utf-8", newline="\n")
    print(name, len(content), "bytes")
