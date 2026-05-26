<!-- SPECKIT START -->
## Active Feature: Tonkraft Website Redesign (`001-tonkraft-website-redesign`)

Current plan: `specs/001-tonkraft-website-redesign/plan.md`
Spec: `specs/001-tonkraft-website-redesign/spec.md` · Research: `research.md` · Data model: `data-model.md` · Contracts: `contracts/ui-contracts.md` · Quickstart: `quickstart.md`

**What**: Original, modern, fully responsive **static multi-page** website (HTML5 + CSS3 + vanilla ES2020 JS, no framework, no build step) for Tonkraft — Institut für Sonologie.

**Tech**: Hand-authored HTML at repo root; one `css/styles.css` design system (CSS custom properties); one `js/main.js`. `localStorage` for state. Headings use **Manrope** via Google Fonts; body + Devanagari (Aum glyph औं) fall back to system fonts.

**Hard rules**:
- Preserve ALL content verbatim (DE + EN) from `CONTENT_HANDOFF.md` + extracted `~/Tonkraft` source data (9 practitioners, training notice, legal text).
- **Design isolation**: old site is a content/asset source ONLY — zero visual carry-over (no old CSS/layout/typography).
- Monochrome Vishuddha-blue on warm paper, no other accent colors. Aum seal औं on every page.
- **Aesthetic direction: Modern minimal** — crisp/structured/contemporary, clean grid, sans-serif type, subtle micro-interactions, restrained/tasteful motion. Professional and timeless, not flashy. (Chosen by user 2026-05-22.)
- Bilingual: paired `lang="de"/"en"` + `<html>` class toggle, key `tonkraft:lang`, German default, no-JS safe (German visible), pre-paint inline script to avoid FOUC.
- Progressive enhancement: content readable with JS off; reduced-motion honored; WCAG AA; responsive 320–1920px.
- Key components: story-beat landing (advance by click/keyboard/scroll), `<details>` accordions, responsive practitioner grid (1/2–3/4 cols), DSGVO two-click YouTube embed (youtube-nocookie, no 3rd-party request pre-consent).
- Reuse `~/Tonkraft/assets/sonologen/*.jpg` (practitioner photos + `vemu-1..5.jpg`).
- Design work may use the `frontend-design` and `ui-ux-pro-max` skills to avoid generic AI aesthetics.

Run locally: `python3 -m http.server 8000` from repo root.
<!-- SPECKIT END -->
