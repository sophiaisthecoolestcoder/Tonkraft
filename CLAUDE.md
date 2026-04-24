# Tonkraft

Static website for **Tonkraft**, an institute working at the intersection
of Vedic / Indian tradition, esoteric practice, scientific acoustics,
music and psychology. Sibling project of sama-sonologie.com.

**Principle of the site**: sound, resonance, and the *Persönlicher
Grundton* (personal fundamental tone). Everything the site does should
point back to that.

---

## Stack

- Plain HTML / CSS / JS. **No framework, no build step.**
- Deployed as Cloudflare Workers static assets (`wrangler.jsonc` at the
  root). Git-connected in the Cloudflare dashboard — every push to
  `main` auto-deploys.
- Fonts: Fraunces (display, variable), Inter Tight (UI), Noto Serif
  Devanagari (the Aum seal). All via Google Fonts.

---

## Read before designing

- [docs/design.md](docs/design.md) — palette, typography, motion rules,
  and what to avoid. Read this first.
- [docs/architecture.md](docs/architecture.md) — file layout, runtime
  flow, canvas internals, deployment.

---

## Current scope

The site is deliberately minimal:

1. **Landing** (`#landing`) — wordmark, Aum seal, tagline, one living
   wave + slow concentric ripples, a hint.
2. **Next** (`#next`) — intentionally empty placeholder. Click / tap /
   scroll / Enter advances here from the landing.

Subpages (Grundton, Über uns, Kontakt) are not yet in scope — they
existed in an earlier draft and were removed to focus on the landing.
Do not recreate them without the user's explicit direction.

---

## Hard rules

- **Saffron (`--saffron`, `#b87a3e`) is reserved for the Aum seal
  (ॐ/ओं) only.** Never use it on buttons, lines, underlines, dots,
  icons, or anything else.
- **Only two animated elements**: the sine wave and the radial ripples,
  both drawn on the single canvas in `landing.js`. If a third moving
  thing feels tempting, remove something first.
- **No extra CSS frameworks, no build tools, no npm install in the
  repo.** The site must remain a folder you can open in a browser.
- **Typography does the heavy lifting.** Before reaching for an effect,
  try spacing, weight, tracking, or optical sizing.
- **Respect `prefers-reduced-motion`.** All animations must collapse
  gracefully.
- **Preserve accessibility**: keyboard advance, aria-label on the seal,
  aria-hidden on canvas, visible focus state.

---

## Don't do

- Don't add a dark theme — the manuscript-on-paper palette is the brand.
- Don't add gradient text, glass morphism, neon shadows, scroll-triggered
  card reveals, or tilt-on-hover cards.
- Don't add emojis or decorative pictograms. The Aum glyph is the only
  symbol.
- Don't add a JS framework. If something seems to require one, it's
  probably the wrong solution.
- Don't change the wordmark casing. It's lowercase "tonkraft" in display
  type. Title-case "Tonkraft" is fine in body copy, the `<title>` tag
  and meta descriptions.

---

## Content voice

- **German first.** Sie-form, warm and plain — never marketing-speak.
- Sanskrit and English are allowed only with intent (e.g. the Aum seal,
  a pull-quote).
- Scientific vocabulary (Frequenz, Resonanz, Obertöne, Psychoakustik)
  sits side by side with spiritual vocabulary (Grundton, Kraft, Stille,
  Klangräume). The juxtaposition *is* the voice; don't sand it smooth.

---

## Working on this repo

- The user and their partner both push to `main`. Coordinate before
  committing — don't assume the tree is clean between tool calls.
- Local preview: `python3 -m http.server 8000`.
- The old direct-upload Cloudflare Pages project has been replaced by
  the Git-connected Workers project. Don't recreate the old one.
