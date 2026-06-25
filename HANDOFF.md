# Handoff — Tonkraft Website

Working directory: `/Users/sophiaclausing/Tonkraft II`
GitHub: `git@github.com:sophiaisthecoolestcoder/Tonkraft.git` (branch `main`, deployed)
Stack: hand-authored HTML5 + one `css/styles.css` + vanilla `js/main.js`. No build step. Local preview: `python3 -m http.server 8080` from repo root.

---

## Project context (short version)

Tonkraft Institut website. Multi-page static site, monochrome brand blue on warm paper. Manrope sans for body / UI, Fraunces display serif for every heading. Bilingual DE/EN via paired `lang="de"/"en"` spans plus an `<html>` class toggle, key `tonkraft:lang` in localStorage. German is the default.

Pages:
- `index.html` — hero, Welcome paragraph, five preview tiles (Das Angebot, Hintergrund, Über uns, Ausbildung, Publikationen).
- `angebot.html` — Intro + five Blocks (A–E) each with a visible Kurzfassung + "mehr erfahren" Aufklappen + a closing Ausdrücklicher Hinweis section.
- `hintergrund.html` — Vemu Mukunda bio + pull-quote + Nadabrahma System block + Von der Nadabrahma Music Therapy zur SaMa Sonologie® block.
- `ueber-uns/arbeitsweise.html` — **Unsere Grundsätze** page (intro paragraphs + 11 Grundsätze in `.blocks--principles` + Schlussabsatz). The URL slug `arbeitsweise.html` was kept deliberately to avoid breaking inbound links — the page itself is the Grundsätze content.
- `ueber-uns/praktizierende.html` — practitioner roster, PLZ-banded inside Deutschland + an Österreich & Schweiz region.
- `ausbildung.html`, `publikationen.html`, `impressum.html`, `datenschutz.html`, `hinweis.html`, `404.html`.
- `interna.html` — gated practitioners page with a body silhouette + tone visualisation. Access word lives in JS as base64. Session-storage gate.

Content source of truth: the handoff document `Tonkraft_Website_Inhalte-2.pdf` the client provided (pasted into the conversation earlier this session). All original-text blocks are marked `【ORIGINAL – wörtlich】` and were inserted verbatim. New labels were marked `【NEU – zur Freigabe】`.

---

## What was just done (last few commits — `git log --oneline -20`)

- `d5ead18` Essay back to PDF link with white card style; fix anchor cut-off on Angebot
- `7642604` Dropdown fix, essay reading template, anchors, email cleanup, PLZ-sorted roster
- `4f2f7c0` Hintergrund quote rhythm + revert sidebar + de-box Ausdrücklicher Hinweis
- `036bc7f` Block titles open up + Hintergrund role/dates polish + bolder display-serif top nav
- `acc5554` Revert "Typography: drop SOFT axis from headings + tighten weight ramp to 300/300/400"
- `d07919d` Typography consistency pass + softer header navigation
- `6a10411` Blocks: equal whitespace around "mehr erfahren" + rotating chevron arrow
- `d1560dc` Content tweaks (part 3): Ausbildung/Pub/Grundsätze polish + Interna table & Tonpaare fixes

There is also one **uncommitted** working change at the moment: `css/styles.css` — the `.essay` card styling was reverted from the white-card variant back to the original hairline-bordered list (see "Unfinished — pick this up first" below).

---

## Unfinished — pick this up first

### The Tonkraft essay PDF needs a white background

**What the user wants:** the essay file `assets/essays/die-tonkraft.pdf` (the document that opens when you click "Die Tonkraft" on `publikationen.html`) currently renders on a cream/paper-coloured background with a dark blue header bar. The user wants the PDF itself to have a plain **white** page background. The visible site listing on Publikationen already has the original hairline-list styling restored (no more white box around the essay row).

**Source of the PDF:** `files/Tonkraft.odt` is the original LibreOffice/OpenOffice source. Its content.xml has the full essay prose; styles.xml has no explicit page background colour, so the cream tint in the current PDF comes from whatever HTML→PDF template was used when the existing `die-tonkraft.pdf` was generated. There is no generation script committed — the current PDF was provided by the client.

**Why this wasn't finished in this session:**
No PDF-generation tool is installed on this machine:
- `which wkhtmltopdf` → not found
- `which soffice / libreoffice` → not found
- `python3 -c "import weasyprint"` → not installed
- No Chrome / Chromium installed (only Safari + Grammarly)
- Homebrew is available (5.1.14) but installing `wkhtmltopdf` or `libreoffice` was not initiated, since the user asked for a handoff before it ran.

**Suggested approach for the next agent:**
1. Install a renderer. Fastest: `brew install --cask libreoffice` (gives `soffice --headless --convert-to pdf`), or `brew install weasyprint`.
2. Either:
   - **Re-export the existing .odt:** open `files/Tonkraft.odt`, set the page background to white in LibreOffice (it currently inherits white but the existing PDF's tint may come from a header block — check the page-1 banner specifically), `File → Export as PDF`, replace `assets/essays/die-tonkraft.pdf`.
   - **Or render from HTML:** the full bilingual essay text is preserved in this conversation — also visible in `git log -p -- essays/die-tonkraft.html` (that file was created in commit `7642604` and removed in `d5ead18`; resurrecting it with a few CSS tweaks gives a clean white reading view). Use weasyprint or wkhtmltopdf to convert that HTML to PDF, then drop it into `assets/essays/die-tonkraft.pdf`.
3. After replacing the PDF, do a smoke check: open `publikationen.html`, click the essay row, confirm the new PDF opens with a white background.
4. Commit + push. The link itself (`assets/essays/die-tonkraft.pdf`, `target="_blank"`) does not need to change.

**Important:** the essay title must read **"Die Tonkraft"** (with "Die"). It was briefly trimmed to "Tonkraft" earlier in the session but the user explicitly asked for "Die" back. Currently correct in `publikationen.html`.

---

## Other things the user is actively iterating on (recent feedback patterns)

- **Typography ramp.** Headings use Fraunces with `opsz` axis only (the `SOFT` axis was tried and reverted; only `.brandmark` keeps a bespoke `opsz 40 + SOFT 0` lockup). Page title h1 = weight 200, lead = weight 300, `.block__title` = weight 400. Letter-spacing was opened up on `.block__title` to `+0.02em` per user feedback ("Was ist der Persönliche Grundton?" needed breathing room).
- **Header nav.** Currently sans Manrope, weight 400, uppercase, 0.12em tracking, `--ink-soft` colour. A Fraunces normal-case version was tried and the user disliked it — was reverted in commit `4f2f7c0`. Don't switch the header back to Fraunces without confirmation.
- **"mehr erfahren" toggle.** Symmetric 1.1rem padding top + bottom, no rule line, rotating CSS-border chevron (down when collapsed, up when open). Same treatment on every Blocks pattern across the site, including `.blocks--principles`.
- **Anchor cut-off.** `.block__title` has `scroll-margin-top: calc(var(--header-h) + 2rem)` so the four `#block-*` deep-links from the index land below the sticky masthead. Don't remove that.

---

## Site-wide invariants — please don't break these

1. **Email scrubbing.** `kontakt@tonkraft.de` must not appear anywhere on the site. Ullrich Pühn's `ullrich.puehn@web.de` on Ausbildung is intentional and stays.
2. **Ausdrücklicher Hinweis.** Only appears once, at the foot of Angebot, styled as a plain `.callout` (no blue box). Not in the footer. Not on any other page.
3. **Footer.** "Rechtliches" column now has only Impressum + Datenschutz. No email line, no Hinweis link.
4. **Brand string.** Hero subtitle on Index reads **"Institut für SaMa Sonologie®"** (DE) / "Institute of SAMA Sonology®" (EN). Footer brand tag matches. The page `<title>` and meta description still say "Tonkraft — Institut für Sonologie" (no SaMa) — the user hasn't asked to change those yet; leave them unless asked.
5. **Practitioners.** Sorted into PLZ bands under "Deutschland" (00000–19999 / 20000–39999 / 60000–79999 / 80000–99999), then a separate "Österreich & Schweiz" region with Michaela Coers listed a second time (location line: "Auch in der Schweiz im Sarganserland & Kanton St. Gallen").
6. **Index → Angebot deep-links.** The four overview list items on the index link to `angebot.html`, `angebot.html#block-b`, `angebot.html#block-c`, `angebot.html#block-e`.
7. **Über-uns dropdown.** Panel sits flush against the bottom of the toggle (no 6px gap). Don't reintroduce the gap — that's what was breaking clicks.
8. **DRY / no drift (NON-NEGOTIABLE).** All design values live ONCE as tokens in the `:root`/theme blocks of `css/styles.css`; components use `var(--token)`. Never hard-code a hex/rgb/font/raw colour outside those blocks, never paste a tweaked copy of a widget (use a modifier or pass a token like `--tone-color`), and never put a design-bearing inline `style=` in HTML (use a class or the `.u-mt-*`/`.u-mb-*` utilities). JS reads the palette from CSS via `getComputedStyle` (see `interna.html` `TONE_COLORS`) — it must never re-declare colours. Full rule: `.specify/memory/constitution.md` §I.

---

## Interner Bereich (`interna.html`) — quick reference

- Access word lives in JS as `var GATE = "dG9ua3JhZnQyMDI2";` (base64 of `tonkraft2026`). Change with `btoa("new-word")`.
- Session gate (sessionStorage `tonkraft:gate`). Not a real auth boundary — described as obscurity-level.
- Body is a hand-drawn SVG silhouette. Dot Y-coordinates are anchored to the Intervalle II body landmarks (Stirnkuhle … Bauchnabel), kept internal per the user's request.
- Tonpaare: 5 pairs (1.Tp Ni₂↔Ri₁, 2.Tp Ni₁↔Ri₂, 3.Tp Dha₂↔Ga₁, 4.Tp Dha₁↔Ga₂, 5.Tp Pa↔Ma₁). Ma₂ is the only unpaired chromatic position besides Sa/Sa'. Brackets anchor at `xStart = CX` so each one visibly connects its two dots.
- Audio: monochord MP3s under `assets/audio/` (`monochord-c.mp3`, …, `monochord-h.mp3`).
- Table column unified: one font (sans), one size, ink/ink-soft only. Grundfunktion column was removed.

---

## House style — keep this in mind

- Don't add explanatory comments to code unless the *why* is non-obvious. The user reads diffs and prefers terse commit messages over chatter inside files.
- Commit messages on this project use a one-line summary + a short body explaining *why*. They end with `Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>`.
- The user is German-speaking; English is fine but check translations sit beside the original in `<span lang="de">…</span><span lang="en">…</span>` pairs.
- Hard-reload after every push is the user's normal verification step. Don't claim success based on file edits alone — say "hard-reload to pick it up" when relevant.

---

## Quick map of the CSS

`css/styles.css` is sectioned with banner comments. Section 1 is the **single
source of truth** for the whole site:
1. Design tokens (`:root`) — brand primitives + semantic aliases (`--on-accent`,
   `--inverse-text`, `--danger`, `--glass-*`, `--swatch-inset`), a `--space-*`
   scale, and shadows built from `color-mix(var(--blue-ink) …)`.
   1b. `[data-theme="dark"]` — inert dark scaffold; flip the whole UI from here.
   Spacing utilities `.u-mt-*` / `.u-mb-*` live in the layout-helpers section.
2. Reset + base + headings + brand wordmark
3. Skip link
4. Masthead / topnav / has-sub dropdown / langswitch / mobile menu
5. Hero + ripples
6. Story beats
7. Buttons
8. Teasers + feature previews + overview list
9. Welcome / intro / blocks / callout
10. Pagehead + prose + accordion
11. Bio + section image
12. Roster + roster__band (the PLZ kicker)
13. Two-click video + film grid
14. Essays + films
15. Footer
16. Reveal animation
17. Reduced-motion fallback
18. Interna page (gate, picker, body SVG, table)

---

## Open items the user mentioned but hasn't pushed on yet

- The video grid in Publikationen still references local `assets/videos/*.mp4` paths but those files are gitignored. Hosting decision (self-host vs YouTube embed) is still open per the original Tonkraft handoff doc, page 21. No action requested in this session.
- The Mitarbeitende profile content (per the original handoff doc page 14) is still using only name + location + email. The user hasn't supplied richer Kurzvorstellung text yet.
- The page `<title>` / OG meta descriptions across all pages still read "Tonkraft — Institut für Sonologie" without the SaMa qualifier. User declined to globalize the change earlier; reconfirm before touching.

---

That's the state of the world. Start with the PDF (white background), commit + push, then ask the user what's next.
