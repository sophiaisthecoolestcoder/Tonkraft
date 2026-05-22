---
description: "Task list for Tonkraft Website Redesign implementation"
---

# Tasks: Tonkraft Website Redesign

**Input**: Design documents from `specs/001-tonkraft-website-redesign/`

**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ui-contracts.md ✓, quickstart.md ✓

**Tests**: No automated test framework requested. Verification is **manual** against `quickstart.md` and the spec's Success Criteria (one verification task per user story + a polish pass). Automated E2E can be added later via `/speckit-add-tests`.

**Organization**: Tasks grouped by user story (priority order) for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: US1–US6 (maps to spec.md user stories)
- All paths are relative to the repository root

## Path Conventions

Static multi-page site authored at the **repo root** (per plan.md): `index.html`, `*.html`, `ueber-uns/*.html`, shared `css/styles.css`, shared `js/main.js`, `assets/`, reusable snippets in `partials/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project skeleton, assets, and fonts in place.

- [x] T001 Create directory structure at repo root: `css/`, `js/`, `ueber-uns/`, `assets/sonologen/`, `assets/fonts/`, `partials/`
- [x] T002 [P] Copy reused images from `/Users/sophiaclausing/Tonkraft/assets/sonologen/` into `assets/sonologen/` — 9 practitioner photos (`clausing.jpg`, `coers.jpg`, `huss.jpg`, `lay.jpg`, `mueschenborn.jpg`, `puehn.jpg`, `schoser.jpg`, `sen.jpg`, `trauzettel.jpg`) + 5 Vemu stills (`vemu-1.jpg`…`vemu-5.jpg`); verify counts
- [x] T003 [P] Add self-hosted font files to `assets/fonts/` (display/heading face, body face, and a Devanagari face for the Aum glyph औं) and write `@font-face` rules in `css/styles.css` with `font-display: swap`
- [x] T004 [P] Provide local preview helper: copy `serve.py` from the source repo or document `python3 -m http.server 8000` in a short `README` note

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared design system, page chrome, and bilingual rendering convention that every page depends on.

**⚠️ CRITICAL**: No user-story page work begins until this phase is complete. **Design isolation: author all visuals fresh — no CSS/layout/typography from the old site.**

- [x] T005 Define the design-system tokens in `css/styles.css`: monochrome Vishuddha-blue palette (tints/shades of one blue) + warm-paper background + ink neutrals as CSS custom properties; fluid type scale via `clamp()`; spacing, radius, shadow tokens. Verify all text/background pairings meet WCAG AA. (May use the `ui-ux-pro-max` skill for palette/contrast.)
- [x] T006 Base/reset + global element styles in `css/styles.css`: typography, links, images, lists, `:focus-visible` styling, visually-hidden skip link, and a global `prefers-reduced-motion` baseline
- [x] T007 Bilingual rendering convention in `css/styles.css`: show `[lang="de"]` and hide `[lang="en"]` by default; flip under `html.lang-en`; ensure inactive language is removed from the a11y tree (`hidden`/`display:none`)
- [x] T008 Pre-paint language script (inline `<head>` snippet) in `partials/lang-prepaint.html`: read `localStorage["tonkraft:lang"]` (fallback `de`), set `html` class `lang-de`/`lang-en` and the document `lang` attribute before first paint (no FOUC)
- [x] T009 Shared header markup in `partials/header.html`: lowercase `tonkraft` wordmark + Aum seal औं + primary nav (Startseite, Das Angebot, Hintergrund, Über uns ▸ {Arbeitsweise, Praktizierende}, Ausbildung, Publikationen) + language-toggle control — all labels paired DE/EN
- [x] T010 Shared footer markup in `partials/footer.html`: legal links (Impressum, Datenschutz, Ausdrücklicher Hinweis) + © 2026 — labels paired DE/EN
- [x] T011 Responsive navigation styles + mobile disclosure menu in `css/styles.css`: hamburger using a `<details>`-based no-JS fallback, `aria-current="page"` indication, focus-visible
- [x] T012 Reusable accordion component: enhance native `<details>`/`<summary>` with smooth open/close animation (honoring reduced-motion) in `css/styles.css` and `js/main.js`
- [x] T013 `js/main.js` skeleton: ES-module init on `DOMContentLoaded`, feature detection, and wiring stubs for menu, language toggle, accordion, story-beats, and video consent
- [x] T014 Canonical page scaffold in `partials/page-skeleton.html`: `<head>` (charset, viewport, meta, document lang, pre-paint script, `css/styles.css`, deferred `js/main.js`), header include, `<main>`, footer include — the template every page copies

**Checkpoint**: Shared chrome renders on a sample page in German (no-JS safe); design tokens applied.

---

## Phase 3: User Story 1 - First impression & guided discovery (Priority: P1) 🎯 MVP

**Goal**: A striking, original landing page with a hero, a progressive 6-beat narrative advanceable by click/keyboard/scroll, and 4 preview cards.

**Independent Test**: Load `index.html` on mobile/tablet/desktop; hero renders; all 6 beats reveal via each interaction method; 4 cards link correctly; content verbatim; reduced-motion shows all beats.

- [x] T015 [US1] Build `index.html` from the scaffold (shared header/footer, `<main>` landing regions)
- [x] T016 [US1] Hero section in `index.html` + `css/styles.css`: lowercase `tonkraft` wordmark + Aum seal औं + a CSS/SVG wave-ripple animation (static state under `prefers-reduced-motion`)
- [x] T017 [US1] Story-beat markup in `index.html`: 6 beats with **verbatim DE+EN** text (Beat 1 Concept, 2 System, 3 Practitioner, 4 Practice, 5 Transformation, 6 Call to Action with links to main pages)
- [x] T018 [US1] Story-beat sequencer in `js/main.js` + `css/styles.css`: advance via pointer (click/tap), keyboard (Arrow/Space/Enter; Home/Esc reset), and scroll (IntersectionObserver); progress indicator; no-JS/reduced-motion → all 6 beats visible stacked (per contract C3)
- [x] T019 [US1] Preview cards in `index.html` + `css/styles.css`: 4 cards (Das Angebot, Über uns, Hintergrund, Ausbildung) with **verbatim DE+EN** hooks linking to their pages
- [x] T020 [US1] Verify US1 per quickstart (hero; 6 beats via all 3 methods; 4 card links; responsive 320–1920px; reduced-motion fallback)

**Checkpoint**: Landing page fully functional and demoable as the MVP.

---

## Phase 4: User Story 2 - Bilingual experience with persistent language (Priority: P1)

**Goal**: A working DE/EN toggle that persists across pages and sessions, applied site-wide with no mixed-language leakage.

**Independent Test**: Toggle to EN, navigate ≥3 pages, restart browser → still EN; switch back to DE persists; no mixed-language leakage; German default with JS off.

- [x] T021 [US2] Implement language-toggle behavior in `js/main.js` (per contract C1): toggle `de`/`en`, set `html` class + document `lang`, hide inactive language from AT, persist to `localStorage["tonkraft:lang"]`, invalid value → `de`
- [x] T022 [US2] Finalize the toggle control in `partials/header.html`: real `<button>`(s) with accessible names reflecting action/state; confirm every interface string is paired DE/EN
- [x] T023 [US2] Verify US2 per quickstart across the full page set (persists ≥3 navigations + browser restart; no mixed-language leakage; no-JS German default)

**Checkpoint**: Bilingual toggle works everywhere; US1 + US2 both pass independently.

---

## Phase 5: User Story 3 - Offer, background & methodology in depth (Priority: P2)

**Goal**: Das Angebot, Hintergrund (Vemu bio + Nadabrahma System), and Unsere Arbeitsweise rendered with accordions, all content verbatim.

**Independent Test**: Open each page; expand/collapse every section by mouse and keyboard; full verbatim content present (incl. ®, Sanskrit, dates, bullet lists); cross-links resolve.

- [x] T024 [P] [US3] Build `angebot.html`: page title + lead + 5 accordion sections **verbatim DE+EN** (Was ist SaMa Sonologie?, Die Grundtonbestimmung, Die Arbeit mit dem Grundton, Langfristige Perspektiven, Ausdrücklicher Hinweis) + cross-link block to Hintergrund
- [x] T025 [P] [US3] Build `hintergrund.html` part 1: page title + lead + Vemu Mukunda biography (subtitle "Der Gründer/The Founder", dates 1929–2000, full **verbatim DE+EN** text) with `vemu-*.jpg` imagery (lazy, alt text)
- [x] T026 [US3] Add Nadabrahma System to `hintergrund.html` part 2: 3 subsections **verbatim DE+EN** (2.1 Philosophische Grundlagen incl. sama meanings list, 2.2 Tonale Struktur incl. core-principles bullet list, 2.3 Weiterentwicklung incl. additions bullet list)
- [x] T027 [P] [US3] Build `ueber-uns/arbeitsweise.html`: page title + lead + 6 accordion sections **verbatim DE+EN** + 2 cross-link blocks (to Praktizierende, to Ausbildung). Mind relative paths from the `ueber-uns/` subfolder
- [x] T028 [US3] Verify US3 per quickstart (accordions keyboard-operable + no-JS open; verbatim incl. ®/Sanskrit/bullets; cross-links resolve)

**Checkpoint**: All three deep-content pages complete and independently testable.

---

## Phase 6: User Story 4 - Finding a practitioner (Priority: P2)

**Goal**: A responsive practitioner directory with the 9 verbatim entries and working contact links.

**Independent Test**: Open `ueber-uns/praktizierende.html` on each device; grid reflows 1 / 2–3 / 4 cols; each card shows exact data; email/website links work.

- [x] T029 [US4] Build `ueber-uns/praktizierende.html`: page title + lead **verbatim DE+EN** + responsive grid container
- [x] T030 [US4] Add 9 practitioner cards using the **verbatim dataset** in `data-model.md` (name, location, `mailto:` email, optional website link, photo `loading="lazy"` + descriptive `alt`); clean text-only fallback when a photo is absent. Re-verify every email/address against the source file
- [x] T031 [US4] Practitioner grid responsive styles in `css/styles.css` (1 col mobile / 2–3 tablet / 4 desktop) per contract C6
- [x] T032 [US4] Verify US4 per quickstart (grid reflow; contact links trigger; data matches source exactly)

**Checkpoint**: Practitioner directory complete.

---

## Phase 7: User Story 5 - Publications & privacy-respecting video (Priority: P3)

**Goal**: Publikationen page with verbatim content and a DSGVO two-click video component; plus the Kontakt page.

**Independent Test**: Load `publikationen.html` with the Network panel; no third-party requests before clicking a video; after consent the embed loads.

- [x] T033 [P] [US5] Build `publikationen.html`: title + lead + "Essays und Artikel" section + "Video-Materialien" section, **verbatim DE+EN** (current source state = "coming soon")
- [x] T034 [US5] Two-click video component in `js/main.js` + `css/styles.css` (per contract C4): local placeholder + consent note, inject `youtube-nocookie.com` iframe only on activation, zero third-party requests pre-consent, optional `localStorage` consent, plain-link fallback with JS off
- [x] T035 [P] [US5] Build `kontakt.html`: **verbatim DE+EN**, contact `kontakt@tonkraft.de` as a `mailto:` link (no backend/form submission)
- [x] T036 [US5] Verify US5 per quickstart (Network panel shows no 3rd-party calls pre-consent; embed plays after consent; essays/videos content verbatim)

**Checkpoint**: Publications + contact complete.

---

## Phase 8: User Story 6 - Legal & compliance pages (Priority: P3)

**Goal**: Impressum, Datenschutz, and Ausdrücklicher Hinweis reachable from the footer with verbatim content.

**Independent Test**: From any page footer, open each legal page; content renders verbatim in both languages.

- [x] T037 [P] [US6] Build `hinweis.html` (Ausdrücklicher Hinweis): full disclaimer **verbatim DE+EN** (matches handoff)
- [x] T038 [P] [US6] Build `impressum.html`: **verbatim** content from source (current placeholder per § 5 TMG), structured so real legal data drops in later
- [x] T039 [P] [US6] Build `datenschutz.html`: **verbatim** content from source (current "detailed privacy policy to follow" placeholder), structured for later completion
- [x] T040 [US6] Verify US6 per quickstart (footer links present on every page; content verbatim DE+EN)

**Checkpoint**: All pages built; full site navigable.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Site-wide quality, fidelity, and the success-criteria sweep.

- [x] T041 [P] Add favicon, per-page `<title>` + meta description, and Open Graph/Twitter tags across all pages
- [x] T042 [P] Add a custom `404.html` consistent with the design system
- [x] T043 Content-fidelity audit: compare all rendered text against `CONTENT_HANDOFF.md` + the extracted practitioner/training/legal data — zero discrepancies (SC-001)
- [x] T044 Responsive sweep 320px→1920px on every page — no horizontal scroll/overlap/clipping (SC-002)
- [x] T045 Accessibility pass: keyboard-only walkthrough, visible focus, AA contrast, semantic landmarks + skip link (SC-007)
- [x] T046 No-JS pass: all content readable and all pages reachable with JavaScript disabled (SC-008)
- [x] T047 Performance pass: lazy images, sized media, `font-display`, minimal JS — primary content usable < 3s on throttled mobile (SC-006)
- [x] T048 Design-isolation review: confirm no recognizable visual carry-over from the old site (SC-009)
- [x] T049 Run the full `quickstart.md` validation checklist end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: no dependencies — start immediately
- **Foundational (Phase 2)**: depends on Setup — **BLOCKS all user stories**
- **User Stories (Phases 3–8)**: all depend on Foundational
  - Recommended order: P1 (US1, US2) → P2 (US3, US4) → P3 (US5, US6)
  - With capacity, stories can run in parallel after Foundational
- **Polish (Phase 9)**: depends on all targeted stories

### User Story Dependencies

- **US1 (P1)** — landing: needs Foundational only
- **US2 (P1)** — toggle: needs Foundational (uses the bilingual rendering convention from T007/T008); independently testable
- **US3, US4 (P2)**: need Foundational; independent of each other (US3 uses the accordion from T012; US4 uses the grid)
- **US5, US6 (P3)**: need Foundational; independent of each other
- Cross-links between pages resolve once the target pages exist, but each page is independently buildable/testable.

### Within Each User Story

- Page structure → content (verbatim) → component behavior → styles → verify
- Complete and verify a story before moving to the next priority

---

## Parallel Opportunities

- **Setup**: T002, T003, T004 in parallel (after T001)
- **Foundational**: largely sequential (shared `css/styles.css` + `js/main.js`); T008/T009/T010 (separate partials) can parallelize
- **Across stories** (after Foundational): US3 pages T024/T025/T027 touch different files → parallel; US5 T033/T035 parallel; US6 T037/T038/T039 parallel
- **Polish**: T041, T042 parallel

### Parallel Example: User Story 3

```bash
# Different files → run together:
Task: "Build angebot.html (5 accordion sections, verbatim DE+EN)"
Task: "Build hintergrund.html biography (verbatim DE+EN + vemu images)"
Task: "Build ueber-uns/arbeitsweise.html (6 sections + 2 cross-links)"
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Phase 1 Setup → 2. Phase 2 Foundational → 3. Phase 3 US1 → **STOP & validate the landing** → demo.

### Incremental Delivery

Foundational → US1 (MVP) → US2 → US3 → US4 → US5 → US6 → Polish. Each story is an independently testable increment that doesn't break earlier ones.

---

## Notes

- `[P]` = different files, no incomplete dependencies.
- **Every page**: shared header/footer, Aum seal औं, paired DE/EN content, no-JS readable, responsive.
- **Verbatim is non-negotiable** — copy text from `CONTENT_HANDOFF.md`/source; never paraphrase or translate. Re-verify personal data (practitioner emails/addresses).
- **Design isolation** — old files are content/asset source only; build visuals fresh (use `frontend-design` / `ui-ux-pro-max`).
- Commit after each task or logical group; stop at any checkpoint to validate.

## Task Summary

- **Total tasks**: 49
- **Setup**: 4 (T001–T004) · **Foundational**: 10 (T005–T014)
- **US1** (P1, MVP): 6 (T015–T020) · **US2** (P1): 3 (T021–T023)
- **US3** (P2): 5 (T024–T028) · **US4** (P2): 4 (T029–T032)
- **US5** (P3): 4 (T033–T036) · **US6** (P3): 4 (T037–T040)
- **Polish**: 9 (T041–T049)
- **Suggested MVP**: Phases 1–3 (Setup + Foundational + US1) = 20 tasks
