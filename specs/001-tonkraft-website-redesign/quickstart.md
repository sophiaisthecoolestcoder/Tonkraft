# Quickstart: Tonkraft Website Redesign

## Run locally

The site is static — no build step. From the repository root, start any static server:

```bash
# Option A: Python (built-in)
python3 -m http.server 8000

# Option B: the existing helper copied from the source repo (if present)
python3 serve.py
```

Then open <http://localhost:8000/> (Startseite). Navigate to `angebot.html`, `hintergrund.html`, `ueber-uns/praktizierende.html`, etc.

> Tip: prefer a server over opening `file://` directly — relative paths, fonts, and any JS includes behave correctly over HTTP.

## Verify against success criteria

Walk through each in the browser:

1. **Content fidelity (SC-001)** — Compare rendered text on each page against `CONTENT_HANDOFF.md` (and the extracted practitioner/training/legal data in `data-model.md`). Zero discrepancies; check ®, Sanskrit (sāma, śama, Nāda brahmā), dates (1929–2000), the quote, and all bullet lists.
2. **Responsive (SC-002)** — DevTools device toolbar; sweep widths 320 → 1920px on every page. No horizontal scroll, overlap, or clipping. Confirm practitioner grid reflows 1 / 2–3 / 4 columns.
3. **Language persistence (SC-003)** — Switch to EN; navigate ≥3 pages; reload / reopen the browser. Site stays EN. Repeat back to DE. Confirm no mixed-language leakage.
4. **Story beats (SC-004)** — On the landing, advance through all 6 beats using (a) click/tap, (b) keyboard, (c) scroll. Confirm the 4 preview cards link correctly.
5. **Video consent (SC-005)** — Open `publikationen.html` with the Network panel recording. Confirm **no** youtube/third-party requests before clicking a video; after consent, the embed loads.
6. **Performance (SC-006)** — Throttle to "Fast 3G"; confirm primary content is visible/interactive within ~3s. Images lazy-load.
7. **Keyboard & contrast (SC-007)** — Tab through every page: skip link, nav, toggle, accordions, beats, cards, video consent all reachable with visible focus. Run a contrast check on text/background pairs (AA).
8. **No-JS (SC-008)** — Disable JavaScript; every page's content is readable and all pages reachable (German default). Accordions still open (`<details>`), nav works, video shows a plain link.
9. **Design isolation (SC-009)** — Sanity check: nothing visually echoes the old site's layout/typography/styling.

## Asset checklist

Copied from `~/Tonkraft/assets/sonologen/` into `assets/sonologen/`:
- Practitioners: `huss.jpg`, `clausing.jpg`, `trauzettel.jpg`, `sen.jpg`, `puehn.jpg`, `coers.jpg`, `lay.jpg`, `schoser.jpg`, `mueschenborn.jpg`
- Vemu Mukunda: `vemu-1.jpg` … `vemu-5.jpg`

Self-hosted fonts in `assets/fonts/` (incl. a Devanagari face so औं renders).

## Deploy

Static files — deploy the repo root to any static host, or commit into the same git repository as the existing site. No server runtime required.
