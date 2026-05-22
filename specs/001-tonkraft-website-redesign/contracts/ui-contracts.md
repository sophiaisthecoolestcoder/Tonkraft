# UI Interaction Contracts: Tonkraft Website Redesign

These are the behavioral contracts for the site's interactive components. Each defines inputs, outputs/state, accessibility, and the no-JS / reduced-motion fallback. They are the acceptance surface for `/speckit-tasks` and `/speckit-implement`.

---

## C1. Language Toggle

- **Trigger**: User activates the language control (DE / EN) in the header.
- **State**: `localStorage["tonkraft:lang"]` ∈ {`de`,`en`}; `<html>` carries `lang-de` or `lang-en`; document `lang` attribute updated.
- **Behavior**:
  - Pre-paint inline `<head>` script reads storage and sets the class before first paint (no FOUC).
  - Activating toggles the value, updates the class + `lang` attribute, persists to storage.
  - Inactive-language content is hidden from assistive tech (`hidden`/`display:none`), not just visually.
- **Default**: `de`. **Invalid stored value** → fallback `de`.
- **A11y**: Control is a real `<button>` (or pair) with accessible name reflecting action/state; operable by keyboard; state announced.
- **No-JS fallback**: CSS shows `lang="de"`, hides `lang="en"`; site fully readable in German. Toggle is a no-op enhancement.
- **Acceptance**: SC-003 (persists across ≥3 navigations + restart); FR-007/008/009 (no mixed-language leakage).

---

## C2. Accordion / Expandable Section

- **Trigger**: User activates a section header.
- **Base**: native `<details>`/`<summary>`.
- **Behavior**: toggles open/closed; multiple may be open; smooth height animation when motion allowed.
- **A11y**: keyboard operable (Enter/Space); expanded/collapsed state exposed (native semantics or `aria-expanded`); focus stays on the header.
- **No-JS fallback**: `<details>` works natively (open/close) with no script.
- **Reduced-motion**: instant open/close (no height animation).
- **Acceptance**: FR-012, FR-019, FR-020; US3 scenarios.

---

## C3. Story-Beat Sequencer (Startseite)

- **Inputs (advance)**: pointer (click/tap), keyboard (Arrow/Space/Enter; Home/Esc reset), scroll (IntersectionObserver / wheel / scroll-snap).
- **State**: active beat index 1–6; progress indicator reflects position.
- **Behavior**: advancing reveals the next beat in order; beat 6 surfaces CTA links to main pages.
- **A11y**: focusable controls with accessible names; progress conveyed to assistive tech; not pointer-only.
- **No-JS fallback**: all 6 beats render stacked and fully visible in document order.
- **Reduced-motion**: reveals are instant (no transition); no scroll-jacking.
- **Acceptance**: FR-010, SC-004 (reachable via all three methods); US1.

---

## C4. Two-Click Video Embed (Publikationen) — DSGVO Zwei-Klick-Lösung

- **Initial state**: local placeholder (own asset/CSS, **not** the YouTube thumbnail) + play affordance + brief consent note. **Zero** third-party requests/cookies.
- **First activation (consent)**: JS injects `<iframe src="https://www.youtube-nocookie.com/embed/<id>?...">`; video becomes playable; optionally persist consent in `localStorage`.
- **A11y**: placeholder is a real button with an accessible name (e.g., "Video laden: <title>"); keyboard operable; consent note readable.
- **No-JS fallback**: show a plain link to the video plus the consent note (no auto-embed).
- **Acceptance**: FR-014, SC-005 (no third-party calls before consent); US5.

---

## C5. Primary Navigation & Footer

- **Behavior**: persistent header nav reflecting hierarchy (Startseite, Das Angebot, Hintergrund, Über uns ▸ {Arbeitsweise, Praktizierende}, Ausbildung, Publikationen); footer with legal links (Impressum, Datenschutz, Ausdrücklicher Hinweis). Mobile: accessible disclosure menu (hamburger) with focus trap when open.
- **State**: current page indicated (`aria-current="page"`).
- **A11y**: skip link to `<main>`; keyboard operable menu; visible focus.
- **No-JS fallback**: nav links present and usable; mobile menu degrades to visible links (e.g., `<details>`-based disclosure).
- **Acceptance**: FR-004/005/006; brand mark + Aum seal present (FR-015).

---

## C6. Practitioner Grid

- **Behavior**: responsive grid of 9 cards; reflow 1 col (mobile) / 2–3 (tablet) / 4 (desktop). Each card: name, location, `mailto:` email, optional website link, optional photo (`loading="lazy"`, descriptive `alt`).
- **A11y**: each card a list item / article with a heading; links have accessible names; missing photo → clean text-only card.
- **No-JS fallback**: fully static (no JS needed).
- **Acceptance**: FR-013, US4; verbatim data per data-model.md.

---

## Cross-cutting contracts

- **Responsiveness**: no horizontal scroll/overlap/clipping 320px→1920px (SC-002, FR-018).
- **Color/contrast**: WCAG AA within the monochrome blue-on-paper palette (SC-007, FR-016/020).
- **Performance**: usable < 3s on typical mobile; lazy images; minimal JS (SC-006).
- **Content fidelity**: all rendered text verbatim vs. handoff/source (SC-001, FR-001/002/003).
- **Design isolation**: no visual carry-over from old site (SC-009, FR-017).
