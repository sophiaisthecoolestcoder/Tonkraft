# Phase 0 Research: Tonkraft Website Redesign

All decisions below resolve the Technical Context. No open `NEEDS CLARIFICATION` items remain.

---

## R1. Site architecture — multi-page static vs. SPA

- **Decision**: Multi-page static HTML, one file per navigation destination, authored at the repo root.
- **Rationale**: Content is inherently page-oriented; multi-page gives free deep-linking and SEO, works with JS disabled, requires no build tooling, and mirrors the existing structure so it migrates into the same repo cleanly. An SPA would add complexity and a no-JS failure mode for pure content.
- **Alternatives considered**: SPA with client routing (rejected: needless complexity, worse no-JS story); static-site generator (rejected: introduces a build step the "frontend-only HTML/CSS/JS" brief doesn't want).

## R2. No framework / no build step

- **Decision**: Hand-authored HTML, one shared CSS file, one shared ES-module JS file. Zero runtime dependencies.
- **Rationale**: Matches the brief, keeps the bundle tiny, maximizes control over an original design, and avoids generic framework aesthetics. Nothing in scope needs a framework.
- **Alternatives considered**: Tailwind/Bootstrap (rejected: utility/framework look fights the bespoke design goal and the design-isolation constraint); React/Vue (rejected: overkill for static content).

## R3. Shared header/footer without a build step

- **Decision**: Author a single canonical header/footer markup and **inline it into every page** (duplicated markup), keeping it identical via a shared structure. Optionally provide a tiny progressive-enhancement JS include from `partials/` that swaps in the markup when JS is present — but the inlined markup is the source of truth so nav/footer work with JS off.
- **Rationale**: No-JS safety requires the nav/footer to exist in the HTML. Duplication across ~11 small pages is acceptable and avoids `fetch()`-based includes that break on the `file://` protocol and harm no-JS users.
- **Alternatives considered**: JS `fetch()` partial injection as the *only* mechanism (rejected: fails without JS and on `file://`); server-side includes (rejected: no backend).

## R4. Bilingual model & persistence

- **Decision**: Reuse the proven paired-content pattern: every translatable string is present in the HTML inside `lang="de"` / `lang="en"` wrappers (or `data-i18n` paired spans). A class on `<html>` (`lang-de` / `lang-en`) controls visibility via CSS. The choice is stored in `localStorage` under key **`tonkraft:lang`** (same key as the existing site, for continuity). German is the default.
- **Anti-FOUC**: A tiny **inline `<head>` script** reads `localStorage` and sets the `<html>` class before first paint, so there is no flash of the wrong language.
- **No-JS behavior**: CSS defaults to showing `lang="de"` and hiding `lang="en"`; with JS off, the site is fully readable in German (the primary language). The toggle is a progressive enhancement.
- **`lang` attribute correctness**: For accessibility, set the document `lang` attribute appropriately and ensure inactive-language content is hidden with `hidden`/`display:none` so screen readers don't read both.
- **Rationale**: Content-present-in-HTML satisfies no-JS and SEO; localStorage satisfies persistence (SC-003); the inline head script prevents FOUC.
- **Alternatives considered**: Separate `/de/` and `/en/` page trees (rejected: doubles file count and complicates the same-repo migration); fetch-based JSON i18n (rejected: no-JS failure, FOUC, complexity).

## R5. Color system — monochrome Vishuddha-blue on warm paper

- **Decision**: Define CSS custom properties for a single blue hue family (Vishuddha throat-chakra blue) layered on a warm off-white "paper" background, with neutral ink for body text. Use tonal steps of the one blue (tints/shades) plus paper/ink neutrals — **no other accent hues**. All text/background pairings verified to meet **WCAG AA** (≥4.5:1 body, ≥3:1 large text).
- **Rationale**: Honors the brand directive (FR-016) while leaving room for depth via tonal variation; tokens make AA compliance auditable.
- **Alternatives considered**: Introducing a complementary accent (rejected: violates the monochrome directive).
- **Implementation note**: Leverage the **ui-ux-pro-max** skill for a tuned monochrome blue palette + warm-paper neutrals and contrast pairings during implementation.

## R6. Typography & the Aum glyph (औं)

- **Decision**: Self-host a small, distinctive type pairing (a characterful display/serif for headings + a clean humanist sans or readable serif for body) plus a **Devanagari-capable font** (e.g., Noto Serif/Sans Devanagari, subset) so औं renders consistently across platforms. Fluid type via `clamp()`.
- **Rationale**: Self-hosting avoids third-party (Google Fonts) requests for DSGVO/privacy and removes a render-blocking external dependency; a guaranteed Devanagari face prevents the Aum seal from showing as tofu (▯).
- **Alternatives considered**: Google Fonts CDN (rejected: third-party request, privacy); relying on system fonts only for Devanagari (rejected: inconsistent glyph availability, risks broken brand mark).
- **Implementation note**: Use **ui-ux-pro-max** font-pairing intelligence and **frontend-design** to pick a pairing that reads as bespoke, not generic-AI.

## R7. Landing story-beat sequencer (advance by click, keyboard, scroll)

- **Decision**: A `<section>` of six beats. JS manages an "active beat" index with three advance methods: pointer (click/tap on a control or the stage), keyboard (Arrow/Space/Enter, with `Esc`/Home to reset), and scroll (IntersectionObserver-driven activation as beats enter the viewport, or wheel/scroll-snap). A progress affordance shows position (e.g., 6 dots). **No-JS / reduced-motion fallback**: all six beats render stacked and fully visible; reveals become instant.
- **Rationale**: Satisfies FR-010 and SC-004 (all three interaction methods) while degrading gracefully. IntersectionObserver is the modern, performant scroll primitive.
- **Alternatives considered**: Pure scroll-snap carousel (rejected: weak keyboard story); third-party slider lib (rejected: dependency + generic feel).

## R8. Accordion / expandable sections

- **Decision**: Use the native `<details>`/`<summary>` element as the base (works with no JS, accessible by default, keyboard-operable), enhanced with JS + CSS for smooth open/close animation and ARIA niceties. Respect `prefers-reduced-motion`.
- **Rationale**: Native semantics give built-in accessibility and a no-JS fallback (FR-012, FR-019, FR-020) with minimal code.
- **Alternatives considered**: Custom `div` + ARIA `button[aria-expanded]` (viable, but more code and easier to get a11y wrong); JS-only accordions (rejected: no-JS failure).

## R9. DSGVO two-click video embed (Zwei-Klick-Lösung)

- **Decision**: Render a **local** placeholder (CSS/poster image from our own assets — *not* the YouTube thumbnail, which is itself a third-party request) with a play button and a short consent note. First activation = consent: JS injects an `<iframe>` pointing at **`youtube-nocookie.com`** with `src` set only then. Optionally remember consent in `localStorage`. Before consent: zero third-party requests/cookies.
- **Rationale**: Satisfies FR-014 / SC-005 exactly; `youtube-nocookie.com` minimizes tracking post-consent.
- **Alternatives considered**: Loading the YouTube thumbnail as the placeholder (rejected: that thumbnail fetch is already a third-party call before consent); lite-youtube-embed library (good pattern, but we implement equivalently with no dependency).
- **Current-content note**: Publications are "coming soon" in the source, so this is built as a reusable component ready for real video IDs; the page ships with the verbatim "coming soon" content plus the component scaffold.

## R10. Imagery & assets

- **Decision**: Copy the reused images from `~/Tonkraft/assets/sonologen/` into the new `assets/sonologen/`: 9 practitioner photos (`clausing.jpg`, `coers.jpg`, `huss.jpg`, `lay.jpg`, `mueschenborn.jpg`, `puehn.jpg`, `schoser.jpg`, `sen.jpg`, `trauzettel.jpg`, all 320×320) and 5 Vemu Mukunda stills (`vemu-1.jpg`…`vemu-5.jpg`, ~1280×720). Serve responsive sizes, `loading="lazy"`, and meaningful `alt` text. Vemu images anchor the Hintergrund biography.
- **Rationale**: Reuse satisfies the user's explicit choice; lazy-loading + sizing supports the 3s performance goal (SC-006).
- **Alternatives considered**: Re-shooting/replacing imagery (out of scope); CSS-only visuals (kept for the hero wave/ripple, but real photos are required for people/biography).

## R11. Hero wave/ripple visual

- **Decision**: Build the hero's wave/ripple as **CSS/SVG/Canvas animation** (no media file), tied to the sound/resonance theme, honoring `prefers-reduced-motion` (static state when reduced).
- **Rationale**: Lightweight, scalable, on-theme, no third-party asset; reinforces "cutting-edge" without a heavy dependency.
- **Alternatives considered**: Video/GIF background (rejected: weight, battery, reduced-motion handling); WebGL library (rejected: dependency + overkill).

## R12. Accessibility & responsiveness baseline

- **Decision**: Semantic landmarks (`header/nav/main/footer`), visible focus styles, skip link, AA contrast, `prefers-reduced-motion` honored throughout, fluid layouts with CSS grid/flex and `clamp()`, tested 320px→1920px. Practitioner grid reflows 1 / 2–3 / 4 columns (FR-013).
- **Rationale**: Directly satisfies FR-018/019/020 and SC-002/007/008.
- **Alternatives considered**: Fixed breakpoints only (kept as needed, but intrinsic/fluid sizing reduces breakpoint count and edge-case bugs).

## R13. Testing & verification strategy

- **Decision**: Lightweight, manual-first. Serve via `python3 -m http.server` (or `serve.py`). Verify: (a) content fidelity by comparing rendered text to `CONTENT_HANDOFF.md` and the extracted source data; (b) language persistence across pages + restart; (c) story-beat advance via all three methods; (d) network panel shows no third-party calls pre-consent; (e) keyboard-only pass; (f) responsive sweep 320–1920px; (g) JS-disabled read-through. Document all steps in quickstart.md.
- **Rationale**: No constitution mandates a test framework; for a static content site, structured manual verification against the success criteria is proportionate.
- **Alternatives considered**: Playwright/automated E2E (deferred; could be added later via `/speckit-add-tests`, but not required to meet the spec).

## R14. Design isolation (anti-"poisoning") workflow

- **Decision**: Treat `~/Tonkraft` HTML/ODT strictly as a **content + asset source**. When extracting, copy text and asset files only — never CSS/class names/layout. Build the visual system fresh from the design tokens, using the **frontend-design** and **ui-ux-pro-max** skills to generate a distinctive, non-generic aesthetic. Final check: SC-009 (a reviewer confirms no recognizable visual carry-over).
- **Rationale**: Directly enforces the user's hard constraint (FR-017) and the reason the project was restarted.
- **Alternatives considered**: Iterating on the old CSS (explicitly rejected by the user — this is what "poisoned" prior attempts).
