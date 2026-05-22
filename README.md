# Tonkraft — Institut für Sonologie

Static, frontend-only website (HTML + CSS + vanilla JS, no backend, no build step).
Bilingual German (primary) / English with a persistent language toggle.

## Run locally

From the repository root, start any static server:

```bash
python3 -m http.server 8000     # then open http://localhost:8000/
# or
python3 serve.py
```

Open `http://localhost:8000/` (or whatever port `serve.py` prints).

## Structure

```
index.html              Startseite (hero + 6 story beats + 4 preview cards)
angebot.html            Das Angebot (5 accordion sections)
hintergrund.html        Hintergrund (Vemu Mukunda bio + Nadabrahma System)
ueber-uns/
  arbeitsweise.html     Unsere Arbeitsweise (6 accordion sections)
  praktizierende.html   Praktizierende (responsive practitioner grid)
ausbildung.html         Ausbildung
publikationen.html      Publikationen (essays + DSGVO two-click video component)
impressum.html          Legal — Impressum
datenschutz.html        Legal — Datenschutz
hinweis.html            Legal — Ausdrücklicher Hinweis
404.html                Not-found page
css/styles.css          Single design-system stylesheet
js/main.js              Shared progressive-enhancement script
assets/sonologen/       Practitioner photos + Vemu Mukunda stills
favicon.svg
```

## Design & behaviour

- **Aesthetic:** modern minimal — monochrome Vishuddha-blue on warm paper, Aum seal औं site-wide. Self-contained system font stack (no third-party font requests).
- **Bilingual:** every translatable string is present as paired `lang="de"` / `lang="en"`. A `<html>` class (`lang-de` / `lang-en`) controls visibility; the choice persists in `localStorage["tonkraft:lang"]`. A pre-paint inline script avoids any flash. German is the default and shows even with JavaScript disabled.
- **Progressive enhancement:** all content is readable with JS off; accordions use native `<details>`; `prefers-reduced-motion` is honoured.
- **Privacy:** no third-party requests. The Publikationen video component uses a DSGVO two-click pattern (`youtube-nocookie.com`, loaded only on consent).

## Content

All editorial text is preserved verbatim from `CONTENT_HANDOFF.md` and the existing source files. Several pages are intentional placeholders that mirror the current source (Impressum "(…)", Datenschutz "folgt", Publikationen "coming soon", Ausbildung "in Konzeption").
