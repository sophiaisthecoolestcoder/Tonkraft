# Tonkraft Website Constitution

The non-negotiable principles for the Tonkraft — Institut für Sonologie website
(`001-tonkraft-website-redesign`). This document supersedes habit and
convenience; when a change conflicts with a principle here, the principle wins.

## Core Principles

### I. Don't Repeat Yourself — Single Source of Truth (NON-NEGOTIABLE)

Every design value and every reusable widget is defined **once** and referenced
everywhere else. Repetition is the mechanism by which the design drifts, so we
forbid it.

- **Design tokens are the only source of colour, typography, spacing, radius,
  shadow and timing.** They live in the `:root` (and theme) blocks at the top of
  `css/styles.css`. Components MUST paint via `var(--token)`. A hard-coded hex,
  `rgb()`/`rgba()`, font stack, or raw colour anywhere outside the token blocks
  is a defect — fix it by adding/using a token, never by copying a value.
- **A value used in more than one place must be a token**, even alpha overlays,
  scrims and glows (use `color-mix(... var(--token) ...)` so they track the
  brand and re-theme automatically).
- **Widgets are centralized and reusable.** A visual component is authored once
  as a class (e.g. `.btn`, `.teaser`, `.tone-pill`, `.video__play`) in
  `css/styles.css` and reused across pages. Per-instance differences are
  expressed with **modifiers** (`.hero__word--compact`) or by passing a token
  through a custom property (`--tone-color`), never by re-implementing the
  widget or pasting tweaked CSS.
- **No inline `style=` attributes** for design values in HTML. Use a class, a
  modifier, or one of the centralized spacing utilities (`.u-mt-*`, `.u-mb-*`).
  The only allowed inline style is a genuinely dynamic, data-driven value set by
  JS that itself reads from the tokens.
- **JS never re-declares design data.** Palettes, breakpoints and the like are
  read from the CSS tokens at runtime (e.g. `getComputedStyle(...)
  .getPropertyValue('--tone-c')`), so JS and CSS can never disagree.

Litmus test before committing: *If this value/needs to change, is there exactly
one place to change it?* If not, centralize first.

### II. Design Isolation

The previous site is a **content and asset source only**. Zero visual
carry-over: no old CSS, layout, typography or colour is reused. Prior attempts
were poisoned by reusing the old design; that is why the project restarted clean.

### III. Content Fidelity

All copy (German **and** English) is preserved **verbatim** from
`CONTENT_HANDOFF.md` and the extracted source data (9 practitioners, training
notice, legal text). Translation, paraphrase or trimming of legal/biographical
content is not permitted without explicit instruction.

### IV. Monochrome Brand System

One palette: monochrome Vishuddha-blue on warm paper, no other accent colours.
The Aum seal औं appears on every page. The chromatic `--tone-*` scale is the
single documented exception, scoped to the Interna tone visualization. Aesthetic
direction is **modern minimal**: crisp, structured, restrained motion.

### V. Progressive Enhancement & Accessibility

Content is fully readable with JavaScript disabled (German visible by default).
A pre-paint inline script sets the language to avoid FOUC. Reduced motion is
honored, focus is always visible, contrast meets WCAG AA, and the layout is
responsive 320–1920px. Bilingual content uses paired `lang="de"/"en"` with an
`<html>` class toggle (`localStorage` key `tonkraft:lang`).

## Technical Constraints

- Static multi-page site: hand-authored HTML at repo root, **no framework, no
  build step**. One stylesheet (`css/styles.css`), one script (`js/main.js`).
- Theming is token-only: a new theme (e.g. the dark scaffold under
  `[data-theme="dark"]`) is created by overriding semantic tokens in one block —
  never by editing component rules.
- DSGVO two-click solution for any YouTube embed (youtube-nocookie, no
  third-party request before consent).
- Run locally: `python3 -m http.server 8000` from repo root.

## Governance

- This constitution supersedes ad-hoc practice. Every change must comply.
- Before adding any colour, font, spacing or widget, check whether a token or
  component already exists; extend the central system rather than duplicating.
- Any review (human or automated) must reject hard-coded design values,
  duplicated widgets, and design-bearing inline styles.

**Version**: 1.0.0 | **Ratified**: 2026-06-22 | **Last Amended**: 2026-06-22
