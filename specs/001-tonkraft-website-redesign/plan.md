# Implementation Plan: Tonkraft Website Redesign

**Branch**: `001-tonkraft-website-redesign` | **Date**: 2026-05-22 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-tonkraft-website-redesign/spec.md`

## Summary

Rebuild the Tonkraft — Institut für Sonologie public website as an original, modern, fully responsive **static multi-page site** (HTML/CSS/JS, no backend). All editorial content is preserved verbatim — the canonical text comes from `CONTENT_HANDOFF.md`, supplemented by the exact content already in the existing `~/Tonkraft` source files for sections the handoff leaves open (9 practitioners, the in-development training notice, the "coming soon" publications, and the legal/disclaimer text). Imagery (practitioner photos, Vemu Mukunda stills) is reused from `~/Tonkraft/assets`.

The technical approach: hand-authored semantic HTML pages sharing one design-token CSS file and one progressive-enhancement JS module. Bilingual DE/EN is implemented with paired `lang` content + a root class toggle persisted in `localStorage` (German default, no-JS safe). The experience is built around a monochrome Vishuddha-blue-on-warm-paper design language with the Aum seal (औं) site-wide, a progressive story-beat landing, accessible accordions, a responsive practitioner grid, and a DSGVO-compliant two-click video embed. **Hard constraint: zero visual carry-over from the old site — old files are a content/asset source only.**

## Technical Context

**Language/Version**: HTML5, CSS3 (custom properties, grid/flex, `clamp()`), vanilla JavaScript (ES2020+). No build step, no transpilation.

**Primary Dependencies**: None — no frameworks or runtime libraries. One or two **self-hosted** web fonts (privacy-friendly, no third-party font CDN), including a Devanagari-capable face so the Aum glyph औं renders reliably.

**Storage**: Browser `localStorage` only — language preference and per-video consent. No backend, no cookies set by us.

**Testing**: Manual verification against a local static server (`python3 -m http.server` or the existing `serve.py`); a content-fidelity check comparing rendered text to `CONTENT_HANDOFF.md`; keyboard/accessibility and responsive-breakpoint walkthroughs; DevTools network check confirming no third-party requests before video consent.

**Target Platform**: Modern evergreen browsers (mobile + tablet + desktop), served as static files from any static host (same git repo as the existing site).

**Project Type**: Static frontend web application (multi-page).

**Performance Goals**: Primary content visible/interactive within 3s on a typical mobile connection; animations target 60fps; minimal JS payload; images sized/lazy-loaded.

**Constraints**: Frontend-only (no backend/DB); no third-party network requests before explicit consent; core content readable with JavaScript disabled; WCAG AA contrast within the monochrome palette; **design isolation** — no reuse of old CSS/layout/typography.

**Scale/Scope**: ~10–12 pages, bilingual; 9 practitioner entries; ~5 Vemu Mukunda images; one shared stylesheet and one shared JS module.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution (`.specify/memory/constitution.md`) is the **unfilled template** — no ratified principles exist, so there are no project-specific gates to enforce. **Gate status: PASS (no constraints defined).**

In the absence of a ratified constitution, the plan voluntarily adheres to sensible defaults aligned with the spec:

- **Simplicity / YAGNI**: No framework or build tooling; plain static files.
- **No unnecessary dependencies**: Zero third-party runtime deps; fonts self-hosted.
- **Accessibility & progressive enhancement**: Semantic HTML, keyboard support, content works without JS.
- **Privacy by default**: No third-party calls before consent; no analytics.

No violations → **Complexity Tracking not required.**

**Post-Phase 1 re-check**: Design artifacts (research.md, data-model.md, contracts/, quickstart.md) introduce no new dependencies or complexity. **Gate status: PASS (unchanged).**

## Project Structure

### Documentation (this feature)

```text
specs/001-tonkraft-website-redesign/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output (technical decisions)
├── data-model.md        # Phase 1 output (content/UI entities)
├── quickstart.md        # Phase 1 output (run & verify)
├── contracts/
│   └── ui-contracts.md  # Phase 1 output (interaction contracts)
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (repository root)

The site is authored at the **repository root** to mirror the existing site's layout, so it migrates cleanly into the same git repository. Planning/tooling directories (`.specify/`, `specs/`, `.planning/`, `.claude/`) are development-only and not part of the deployed site.

```text
/ (repo root)
├── index.html                     # Startseite (landing: hero + 6 story beats + 4 preview cards)
├── angebot.html                   # Das Angebot (5 accordion sections + cross-link)
├── hintergrund.html               # Hintergrund (Vemu bio + Nadabrahma System, 3 subsections)
├── ueber-uns/
│   ├── arbeitsweise.html          # Unsere Arbeitsweise (6 accordion sections + 2 cross-links)
│   └── praktizierende.html        # Praktizierende (responsive 9-card directory grid)
├── ausbildung.html                # Ausbildung (in-development notice, verbatim)
├── publikationen.html             # Publikationen (essays + videos, two-click embeds)
├── kontakt.html                   # Kontakt (email; mailto-based, no backend)
├── impressum.html                 # Legal — Impressum
├── datenschutz.html               # Legal — Datenschutz
├── hinweis.html                   # Legal — Ausdrücklicher Hinweis (verbatim)
├── assets/
│   ├── sonologen/                 # Reused photos: clausing.jpg … trauzettel.jpg, vemu-1..5.jpg
│   └── fonts/                     # Self-hosted font files (incl. Devanagari for औं)
├── css/
│   └── styles.css                 # Single design-token stylesheet (the design system)
├── js/
│   └── main.js                    # lang toggle, accordions, story beats, video consent, nav
└── partials/                      # OPTIONAL: shared header/footer snippets (JS include) — see research.md
```

**Structure Decision**: Multi-page static site at the repo root. Each navigation destination is its own HTML file (matches the existing structure and the content's page-oriented nature, gives free deep-linking/SEO, and works without JS). Cross-cutting behavior (language, navigation, accordions, story beats, video consent) lives in one shared `js/main.js`; all visual design lives in one `css/styles.css` design system. Header/footer consistency approach is decided in research.md.

## Phase 0 — Research

See [research.md](./research.md). All technical decisions are resolved; no open `NEEDS CLARIFICATION` items.

## Phase 1 — Design & Contracts

- [data-model.md](./data-model.md) — content & UI entities (Page, Story Beat, Preview Card, Content Section, Practitioner, Publication Item, Language Preference, Brand Mark) with fields, relationships, and the verbatim practitioner dataset.
- [contracts/ui-contracts.md](./contracts/ui-contracts.md) — interaction contracts for the language toggle, accordion, story-beat sequencer, two-click video, and navigation, including no-JS/reduced-motion fallbacks and ARIA.
- [quickstart.md](./quickstart.md) — how to run the static site locally and verify each success criterion.
- Agent context (`CLAUDE.md`) updated to point at this plan.

## Complexity Tracking

> Not applicable — no Constitution Check violations (constitution is an unratified template).
