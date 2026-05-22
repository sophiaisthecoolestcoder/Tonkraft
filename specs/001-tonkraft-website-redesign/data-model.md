# Phase 1 Data Model: Tonkraft Website Redesign

This is a static content site; "data" means the **content entities** rendered into HTML (no database). Each entity below lists its fields, relationships, and validation/rendering rules derived from the spec.

---

## Page

A primary content destination.

| Field | Description | Rules |
|-------|-------------|-------|
| slug/path | File path (e.g., `angebot.html`, `ueber-uns/praktizierende.html`) | Unique; matches nav |
| title (de/en) | Page title | Both languages present |
| lead (de/en) | Intro paragraph | Verbatim from handoff |
| sections[] | Ordered Content Sections | May be empty for simple pages |
| cross_links[] | Links to other pages | From content (FR-006) |

**Pages**: Startseite, Das Angebot, Hintergrund, Unsere Arbeitsweise, Praktizierende, Ausbildung, Publikationen, Kontakt, Impressum, Datenschutz, Ausdrücklicher Hinweis.

**Rendering rules**: every page includes the shared header (with brand mark + nav + language toggle), `<main>`, and footer (legal links). Document `lang` reflects active language.

---

## Story Beat (landing only)

| Field | Description | Rules |
|-------|-------------|-------|
| index | Order 1–6 | Exactly 6 beats |
| title | Internal label (Concept, System, Practitioner, Practice, Transformation, Call to Action) | — |
| text (de/en) | Verbatim beat text from handoff | Both languages |
| is_cta | Beat 6 only; links to main pages | Beat 6 = true |

**Relationship**: belongs to Startseite. **Rendering**: progressive reveal; all 6 visible as fallback (no-JS / reduced-motion).

---

## Preview Card (landing only)

| Field | Description | Rules |
|-------|-------------|-------|
| target page | Das Angebot / Über uns / Hintergrund / Ausbildung | 4 cards |
| hook (de/en) | Verbatim teaser text | Both languages |
| link | Path to target page | Must resolve |

---

## Content Section

An expandable unit of long-form content (rendered as `<details>`/accordion).

| Field | Description | Rules |
|-------|-------------|-------|
| heading (de/en) | Section heading | Both languages, verbatim |
| body (de/en) | Section body (paragraphs, lists) | Verbatim incl. bullet lists, ®, Sanskrit |
| order | Position on page | Preserve handoff order |

**Used by**: Das Angebot (5), Unsere Arbeitsweise (6), Hintergrund (biography + 3 Nadabrahma subsections).

---

## Practitioner

Directory entry. **The 9 entries below are the verbatim dataset extracted from `~/Tonkraft/ueber-uns/praktizierende.html` and must be preserved exactly.**

| Field | Description | Rules |
|-------|-------------|-------|
| name | Full name | Required, verbatim |
| location | City with postal code | Required, verbatim |
| email | Contact email | Required; `mailto:` link |
| website | Optional website | Optional; external link |
| photo | `assets/sonologen/<file>` | Optional; clean card if absent |
| bio/specialization | Optional | Optional |

### Practitioner dataset (verbatim)

| # | Name | Location | Email | Website | Photo |
|---|------|----------|-------|---------|-------|
| 1 | Katrin Huß | D 01809 Dohna | katrinhuss@gmx.de | — | assets/sonologen/huss.jpg |
| 2 | Christine Clausing | D 10437 Berlin | christine@cc-coaching.net | — | assets/sonologen/clausing.jpg |
| 3 | Mechthild Trauzettel | D 18211 Rethwisch | innenraumsein@gmx.de | naturheilpraxis-trauzettel.de | assets/sonologen/trauzettel.jpg |
| 4 | Louise Sen | D 28203 Bremen | louisepuehn@gmail.com | — | assets/sonologen/sen.jpg |
| 5 | Ullrich Pühn | D 28209 Bremen | ullrich.puehn@web.de | grundtonbestimmung.de | assets/sonologen/puehn.jpg |
| 6 | Michaela Coers | D 78647 Trossingen | michaelacoers@gmx.de | — | assets/sonologen/coers.jpg |
| 7 | Cornelia Lay | D 88079 Kressbronn | lay.cornelia@gmail.com | cornelia-lay.com | assets/sonologen/lay.jpg |
| 8 | Verena Schoser | D 88147 Achberg | info@verena-schoser.com | verena-schoser.com | assets/sonologen/schoser.jpg |
| 9 | Dorothea Müschenborn | D 99817 Eisenach | summerball@freenet.de | — | assets/sonologen/mueschenborn.jpg |

> ⚠️ During implementation, re-verify each value against the source file before shipping (emails/addresses are personal data — zero transcription errors allowed). Grid reflows 1 / 2–3 / 4 columns (FR-013).

---

## Publication Item

| Field | Description | Rules |
|-------|-------------|-------|
| type | `essay` or `video` | — |
| title (de/en) | Title | Verbatim |
| description (de/en) | Description | Verbatim |
| link / video_id | Essay URL or YouTube ID | Video uses two-click consent |
| category | Grouping (videos) | Optional |

**Current state**: source content is "coming soon" for both essays and videos — preserve that verbatim while shipping the reusable two-click video component scaffold (R9).

---

## Training Content (Ausbildung)

Not a repeating entity — a single verbatim content block reflecting the current source: training is "still in the design phase / curriculum being created," with contact **Ullrich Pühn (ullrich.puehn@web.de)**. Preserve exactly (DE + EN).

---

## Legal Content

| Page | Current source state | Rule |
|------|----------------------|------|
| Impressum | Placeholder ("(…)", per § 5 TMG) | Render verbatim placeholder; structured for real data later |
| Datenschutz | "Detailed privacy policy to follow" | Render verbatim placeholder |
| Ausdrücklicher Hinweis | Complete text (matches handoff) | Render verbatim (DE + EN) |

---

## Language Preference

| Field | Description | Rules |
|-------|-------------|-------|
| value | `de` or `en` | Default `de`; unknown → fallback `de` |
| storage | `localStorage["tonkraft:lang"]` | Persist across pages + sessions (SC-003) |

State transitions: `de ⇄ en` via the toggle; applied by setting `lang-de`/`lang-en` class on `<html>` (set pre-paint by inline head script).

---

## Brand Mark

| Field | Description | Rules |
|-------|-------------|-------|
| wordmark | "tonkraft" (lowercase) | Every page header |
| aum_seal | Unicode glyph औं | Every page (FR-015); Devanagari font ensures render |

---

## Video Consent (per video)

| Field | Description | Rules |
|-------|-------------|-------|
| consented | boolean | False until user activates |
| storage | optional `localStorage` | No third-party request/cookie until true (SC-005) |
