# Design — Tonkraft

> "Finden Sie Ihren Ton." — find your tone.
>
> Tonkraft is an institute working at the intersection of **Vedic / Indian
> tradition**, **esoteric practice**, **scientific acoustics**, **music**
> and **psychology**. Everything about the site must sit naturally at that
> intersection — neither clinical nor mystical alone, but both at once.

---

## Core principles

1. **One living element.** A single sine wave (plus radial ripples) carries
   the entire motion of the page. Nothing else moves. Restraint is what
   separates craft from AI slop.
2. **Typography as the hero.** The wordmark, set in Fraunces at a large
   optical size with tight tracking and a very light weight, is the emotional
   anchor. Effects decorate; they do not replace typography.
3. **Manuscript lineage.** The palette and composition reference classical
   Indian manuscript folios: **deep ink on warm paper**, with a single
   **saffron** mark reserved for sacred glyphs.
4. **Breath over bounce.** All motion has a 4–8 second natural cycle.
   Nothing springs, nothing punches, nothing slides in from the side.
5. **Bilingual-friendly.** Primary language is German. The Aum seal carries
   the Sanskrit / Vedic dimension without needing translation.

---

## Palette

| Token             | Hex        | Role                                      |
| ----------------- | ---------- | ----------------------------------------- |
| `--paper`         | `#f2ede4`  | Background. Warm near-white, paper-like.  |
| `--paper-2`       | `#ebe5d8`  | Layered paper (e.g. the `.next` section). |
| `--ink`           | `#12203f`  | Primary text. Deep indigo-black.          |
| `--ink-soft`      | `#3b4668`  | Secondary text.                           |
| `--ink-mute`      | `#7f8598`  | Tertiary text / labels.                   |
| `--line`          | `#d8cfbf`  | Hairline dividers (rarely used).          |
| `--indigo`        | `#1c528a`  | Wave, ripples, pulse, accents.            |
| `--indigo-glow`   | `rgba(…)`  | Focus/glow state.                         |
| `--saffron`       | `#b87a3e`  | **Reserved** for the Aum seal only.       |

### Why Vishuddha blue

Vishuddha — the throat chakra — is the energy centre governing **sound,
voice and communication**. Its traditional colour is a luminous dusk /
sky blue. Our `--indigo` (`#1c528a`) is a manuscript-legible version of
that colour: deep enough to read cleanly on paper, luminous enough to
suggest sky and resonance.

### Why saffron stays scarce

Saffron (`--saffron`) appears **only** on the Aum glyph (ॐ). This mirrors
classical Indian folios, where saffron and gold were reserved for sacred
initials while body text was copied in indigo or iron-gall ink. Saffron
used anywhere else cheapens it. Do not add saffron accents to buttons,
underlines, or icons.

---

## Typography

| Use        | Font                         | Notes                                     |
| ---------- | ---------------------------- | ----------------------------------------- |
| Display    | **Fraunces** (variable)      | `opsz` ~144 at display sizes; light weight (~320); very slightly softened via `SOFT` axis. |
| Body / UI  | **Inter Tight**              | Only for eyebrows, hints, small labels.   |
| Sanskrit   | **Noto Serif Devanagari**    | The Aum seal.                             |

**Rules**

- The wordmark "tonkraft" is **lowercase**, one word, low weight, wide
  tracking. Never title-case in large display type — reserve "Tonkraft"
  title-case for body copy and meta tags only.
- Italic serif is used sparingly — for the tagline trinity
  ("Klang · Resonanz · Grundton") and the placeholder line in `.next`.
- Never use a second accent font. Fraunces carries everything emotional.

---

## Motion

Two living elements on the landing, both in canvas, both respecting
`prefers-reduced-motion`:

1. **Sine wave** — temporal / linear. Two overlaid sinusoids (base + 1.73×
   harmonic) with a slow breathing amplitude. Cursor position nudges
   amplitude and phase smoothly; there is no hard follow.
2. **Ripples** — spatial / radial. One concentric ring spawns every ~2.6 s
   from slightly above the composition center (so it appears to emanate
   from the Aum seal). Each ripple lives ~6.4 s, expanding with ease-out-
   cubic while its alpha follows a `sin(πt)` bell curve.

Together they evoke the two ways sound actually propagates: along a
timeline, and outward in space.

### Reveal

- `body.is-loading` → `body.is-ready` after one paint frame.
- Seal fades up → eyebrow → wordmark letters stagger-fade-and-focus
  (blur 6 → 0) → tagline → hint. Full sequence ≈ 3 s.

### Leaving

- `body.is-leaving` fades stage + hint (opacity 0 / `translateY(-8px)`) and
  hides the wave. Section 2 scrolls into view smoothly. On scroll-back,
  the class is removed and the landing returns.

### Things to avoid

- Scroll-triggered reveal of card grids.
- Gradient text, glass, neon shadows.
- Parallax card tilts on hover.
- Bouncing springs; fast (<300 ms) decorative transitions.
- Emoji or pictograms used decoratively.
- Any second animated element beyond wave + ripples.

---

## Layout

- Single landing section at `100svh`.
- A second placeholder section (`#next`) at `100svh`, intentionally
  quiet. Scroll / click advances to it.
- No nav, no footer, no header on the landing. The brand is the
  wordmark and nothing else.
- Stage is vertically centered, nudged up ~4vh so the wave can thread
  under the wordmark's baseline.

---

## Accessibility

- The landing element has `role="button"` and `tabindex="0"`; Enter /
  Space / ArrowDown / PageDown advance.
- Canvas is `aria-hidden`.
- The Aum seal carries `aria-label="Aum"` and `lang="sa"`.
- All motion collapses when `prefers-reduced-motion: reduce`.
- Colour contrast: `--ink` on `--paper` is ~15.5:1 (WCAG AAA).

---

## Content voice

- **German** is primary. Formal Sie-form where appropriate ("Berühren, um
  fortzufahren"), but keep writing warm and plain — never marketing-speak.
- Short lines. Trust white space.
- Reserve English and Sanskrit for specific moments (the Aum glyph, any
  bilingual pull-quote later).
- Technical / scientific terms from acoustics and psychology are welcome
  alongside spiritual vocabulary — that juxtaposition **is** the brand.
