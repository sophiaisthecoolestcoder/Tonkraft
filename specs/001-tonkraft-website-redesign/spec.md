# Feature Specification: Tonkraft Website Redesign

**Feature Branch**: `001-tonkraft-website-redesign`

**Created**: 2026-05-22

**Status**: Draft

**Input**: User description: "Build a frontend-only (HTML/CSS/JS, no backend) website for 'Tonkraft — Institut für Sonologie' based on the content in CONTENT_HANDOFF.md. The content must be preserved EXACTLY (all German and English text verbatim); only the presentation, layout, and overall design change. The site must be modern, engaging, professional, cutting-edge, interactive, user-friendly, and fully responsive — stunning across all devices. It is bilingual German (primary) / English with a language toggle persisted via localStorage."

## Overview

Tonkraft — Institut für Sonologie needs a complete visual and experiential redesign of its public website. The institute teaches SAMA Sonology® and the work of the Personal Fundamental Tone (Persönlicher Grundton) based on Vemu Mukunda's Nadabrahma System. The existing website's content is sound, but its visual design is considered poor and is being abandoned. Every previous redesign attempt was creatively "poisoned" by the old design, so this effort starts from a clean foundation.

The redesign keeps **100% of the editorial content** (German primary, English secondary) and reimagines only the presentation: a modern, interactive, fully responsive experience that is stunning across phones, tablets, and desktops, centered on a monochrome Vishuddha-blue-on-warm-paper aesthetic with the Aum seal (औं) as the brand mark.

## Content Source & Design Constraints *(mandatory)*

- **Canonical content source**: `CONTENT_HANDOFF.md` (in the existing `~/Tonkraft` repo) is the authoritative content for the main pages. Where the handoff marks sections "to be populated" (Praktizierende, Ausbildung, Publikationen lists, Impressum, Datenschutz), the exact content is extracted from the existing source files in `~/Tonkraft` (e.g., `ueber-uns/praktizierende.html`, `ausbildung.html`, `publikationen.html`, `impressum.html`, `datenschutz.html`, and the `*.odt` documents).
- **Asset reuse**: Existing imagery in `~/Tonkraft/assets` (e.g., the Vemu Mukunda photograph for the Hintergrund biography) is reused where the content calls for it. The Aum seal is rendered as the Unicode glyph औं.
- **Verbatim preservation**: All editorial text — German and English — is preserved exactly, character for character, including the ® mark, Sanskrit transliterations (sāma, śama, Nāda brahmā), the quote "I only did the first step, you have to continue.", dates, and bullet lists. No paraphrasing, summarizing, translating, or reordering of content.
- **DESIGN ISOLATION (hard constraint)**: The old site is used **only** as a source of content text, asset files, and information structure. Its visual design — colors beyond the agreed scheme, typography, layout, CSS, component styling — MUST NOT influence the new design. The new design is original work.
- **Frontend-only**: The deliverable is a static frontend (no backend, no server-side processing, no database). It will be committed to the same git repository as the existing site.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - First impression & guided discovery on the landing page (Priority: P1)

A prospective client arrives at the Startseite. They are met with a striking hero (Tonkraft wordmark, Aum seal, an animated wave/ripple element). As they advance — by click, keyboard, or scroll — six story beats progressively reveal the core narrative (concept → system → practitioner → practice → transformation → call to action). Below, four preview cards tease the main areas (Das Angebot, Über uns, Hintergrund, Ausbildung) and invite deeper exploration.

**Why this priority**: The landing page is the first and most decisive touchpoint. It must immediately convey quality and draw the visitor in; without it the "stunning" goal fails and visitors never reach the deeper content.

**Independent Test**: Load the landing page on mobile, tablet, and desktop; verify the hero renders, all six beats reveal in sequence via each supported interaction, and the four preview cards link to the correct pages — all content verbatim.

**Acceptance Scenarios**:

1. **Given** a visitor on the landing page, **When** the page loads, **Then** the hero (wordmark, Aum seal औं, wave/ripple element) is visible and visually striking on any device.
2. **Given** the landing narrative, **When** the visitor advances via click, keyboard, or scroll, **Then** each of the six story beats is revealed in order with its exact German (and English when EN is active) text.
3. **Given** the preview cards, **When** the visitor selects a card, **Then** they are taken to the corresponding page (Das Angebot, Über uns, Hintergrund, Ausbildung).
4. **Given** a visitor who prefers reduced motion, **When** the page loads, **Then** all content remains fully accessible without motion-dependent reveals.

---

### User Story 2 - Bilingual experience with persistent language choice (Priority: P1)

A visitor toggles the interface between German (default) and English. Their choice persists across every page and across return visits, so the entire site — navigation, headings, body content, buttons — appears in the selected language.

**Why this priority**: The audience is bilingual and German-primary. A reliable, persistent toggle is core to the site being usable for both audiences and is referenced throughout the content.

**Independent Test**: Toggle to English on one page, navigate to several other pages, close and reopen the browser; verify the entire site remains in English and that switching back to German persists likewise.

**Acceptance Scenarios**:

1. **Given** a first-time visitor, **When** the site loads, **Then** German is shown by default.
2. **Given** a visitor who selects English, **When** they navigate to any other page, **Then** that page is shown in English.
3. **Given** a visitor who selected a language, **When** they return in a later session, **Then** their previously chosen language is restored.
4. **Given** either language is active, **When** any page is viewed, **Then** all paired content is shown only in the active language with no mixed-language leakage.

---

### User Story 3 - Reading the offer, background, and methodology in depth (Priority: P2)

A visitor explores Das Angebot, Hintergrund (Vemu Mukunda biography + the Nadabrahma System with its subsections), and Unsere Arbeitsweise. Lengthy material is organized into expandable/accordion sections so readers can scan headings and open only what interests them, while every word remains preserved.

**Why this priority**: This is the substantive intellectual content that converts interest into trust. It must be elegantly readable and navigable, but it depends on the shell (nav, language, layout) from P1 stories.

**Independent Test**: Open each of these pages, expand and collapse every section, and confirm the full verbatim content is present and the disclaimer (Ausdrücklicher Hinweis) appears intact.

**Acceptance Scenarios**:

1. **Given** Das Angebot, **When** the visitor expands each section, **Then** all five sections (Was ist SaMa Sonologie?, Grundtonbestimmung, Arbeit mit dem Grundton, Langfristige Perspektiven, Ausdrücklicher Hinweis) reveal their exact text plus the cross-link to Hintergrund.
2. **Given** Hintergrund, **When** the visitor reads the page, **Then** the Vemu Mukunda biography (dates 1929–2000, full text, photo) and the Nadabrahma System with its three subsections (Philosophische Grundlagen, Tonale Struktur, Weiterentwicklung) appear verbatim, including all bullet lists.
3. **Given** Unsere Arbeitsweise, **When** the visitor expands the sections, **Then** all six expandable sections and both cross-link blocks (to practitioners and to training) appear verbatim.
4. **Given** any accordion, **When** the visitor uses a keyboard, **Then** sections can be expanded/collapsed and are announced to assistive technology.

---

### User Story 4 - Finding a practitioner (Priority: P2)

A prospective client browses the Praktizierende directory to find a trained sonologist near them, viewing each practitioner's details (name, location, contact, optional photo/bio) in a responsive card grid.

**Why this priority**: This is the primary conversion path from interest to a real session, but it relies on the broader site shell and content extracted from existing source files.

**Independent Test**: Open the Praktizierende page on mobile, tablet, and desktop; verify the card grid reflows (1 / 2–3 / 4 columns) and each card shows the practitioner's preserved details with working contact links.

**Acceptance Scenarios**:

1. **Given** the Praktizierende page, **When** it loads on different devices, **Then** the practitioner cards reflow to 1 column (mobile), 2–3 columns (tablet), and 4 columns (desktop).
2. **Given** a practitioner card, **When** the visitor views it, **Then** name, location, and contact information appear with the exact data from the source content.
3. **Given** a practitioner's contact details, **When** the visitor activates an email or phone link, **Then** the appropriate contact action is triggered.

---

### User Story 5 - Browsing publications and watching videos with privacy consent (Priority: P3)

A visitor reads essays/articles and watches video material on Publikationen. Videos are not loaded until the visitor explicitly consents (a DSGVO-compliant two-click / Zwei-Klick-Lösung), so no third-party (YouTube) requests occur before consent.

**Why this priority**: Valuable but secondary content, with a legal/privacy requirement that must be correct.

**Independent Test**: Load the Publikationen page with network monitoring; confirm no YouTube/third-party requests fire until the visitor clicks to load a specific video, after which the video plays.

**Acceptance Scenarios**:

1. **Given** the Publikationen page, **When** it loads, **Then** essays/articles are listed verbatim and no third-party video requests have been made.
2. **Given** a video placeholder, **When** the visitor clicks to load it (first click = consent), **Then** the video is loaded and can be played, and the consent choice behaves per the two-click pattern.
3. **Given** a visitor has not consented, **When** they browse the page, **Then** no YouTube cookies or third-party calls are present.

---

### User Story 6 - Accessing legal & compliance pages (Priority: P3)

A visitor reaches Impressum, Datenschutz, and the Ausdrücklicher Hinweis from a persistent footer or navigation, and reads the required legal/compliance information.

**Why this priority**: Legally required for a German-facing site, but not part of the primary discovery experience.

**Independent Test**: From any page, navigate to each legal page via the footer; verify each renders its preserved content in both languages.

**Acceptance Scenarios**:

1. **Given** any page, **When** the visitor opens the footer/nav, **Then** links to Impressum, Datenschutz, and Ausdrücklicher Hinweis are present.
2. **Given** the Ausdrücklicher Hinweis, **When** viewed, **Then** the disclaimer text appears exactly as in the handoff (both languages).
3. **Given** Impressum and Datenschutz, **When** viewed, **Then** the preserved legal content from the existing source files is displayed.

---

### Edge Cases

- **Reduced motion**: Visitors with `prefers-reduced-motion` get all content and navigation without depending on animations or scroll-driven reveals.
- **No JavaScript / JS fails**: Core content remains readable and navigable; progressive enhancement means the language toggle and accordions degrade gracefully (content visible by default).
- **Very small (≤320px) and very large (≥1920px) viewports**: Layout has no horizontal scroll, overlap, or clipped content.
- **Long German compound words**: Headings and cards handle long words without breaking the layout.
- **Missing optional data**: A practitioner without a photo or bio still renders a clean card; a page section with no source data shows a clearly-marked, intentional empty state rather than broken markup.
- **Keyboard-only and screen-reader users**: Every interactive element (toggle, accordion, story-beat advance, video consent, cards) is operable and announced.
- **Returning visitor with stale stored language value**: An unrecognized stored language falls back to German.
- **Deep-linking**: Opening any page directly (not via the landing) still shows correct navigation, language, and footer.

## Requirements *(mandatory)*

### Functional Requirements

**Content fidelity**

- **FR-001**: The site MUST present all editorial content from `CONTENT_HANDOFF.md` verbatim, with no additions, omissions, paraphrasing, or reordering of text.
- **FR-002**: For sections the handoff marks "to be populated," the site MUST present the exact corresponding content extracted from the existing `~/Tonkraft` source files (HTML/ODT).
- **FR-003**: The site MUST preserve all special characters and formatting semantics exactly, including ®, Sanskrit transliterations, dates, quotations, and bullet lists.

**Structure & navigation**

- **FR-004**: The site MUST provide the full page set: Startseite, Das Angebot, Hintergrund, Über uns (with Unsere Arbeitsweise and Praktizierende), Ausbildung, Publikationen, and legal pages (Impressum, Datenschutz, Ausdrücklicher Hinweis).
- **FR-005**: The site MUST provide persistent primary navigation reflecting the defined hierarchy and a footer with legal links, available on every page.
- **FR-006**: Internal cross-links described in the content (e.g., Das Angebot → Hintergrund; Arbeitsweise → Praktizierende and Ausbildung; preview cards → main pages) MUST be present and functional.

**Bilingual behavior**

- **FR-007**: The site MUST default to German and provide a control to switch between German and English.
- **FR-008**: The selected language MUST persist across navigation and across return sessions, and MUST apply to all interface and content text.
- **FR-009**: When a language is active, the site MUST display only that language's content with no mixed-language leakage.

**Interaction & experience**

- **FR-010**: The landing page MUST present a hero (Tonkraft wordmark, Aum seal औं, wave/ripple element) and a progressive reveal of the six story beats advanceable by click, keyboard, and scroll.
- **FR-011**: The landing page MUST present the four preview cards linking to their respective pages.
- **FR-012**: Long-form pages MUST organize content into expandable/accordion sections that are individually openable and keyboard-operable.
- **FR-013**: The Praktizierende page MUST present practitioners in a responsive card grid (1 / 2–3 / 4 columns by viewport) with each card showing preserved details and functional contact links.
- **FR-014**: Publikationen videos MUST use a DSGVO-compliant two-click consent pattern so no third-party video requests occur before explicit consent.

**Brand & visual**

- **FR-015**: The Aum seal (औं) MUST appear on every page as part of the brand identity.
- **FR-016**: The visual design MUST use a monochrome Vishuddha-blue-on-warm-paper scheme with no other accent colors.
- **FR-017**: The design MUST be original and MUST NOT reproduce or be derived from the existing site's visual design, layout, or styling.

**Responsiveness & quality**

- **FR-018**: Every page MUST be fully responsive and usable on phones, tablets, and desktops with no horizontal scrolling, overlap, or clipped content.
- **FR-019**: The site MUST remain readable and navigable when animations are disabled (reduced-motion) and when JavaScript is unavailable (core content visible by default).
- **FR-020**: All interactive elements MUST be operable by keyboard and exposed to assistive technologies, and color/contrast MUST meet accessibility contrast guidelines within the monochrome scheme.

### Key Entities

- **Page**: A primary content destination (e.g., Startseite, Das Angebot) with a title, lead, and ordered content sections; exists in two language variants.
- **Story Beat**: One of six ordered narrative units on the landing page, each with German and English text, revealed progressively.
- **Preview Card**: A landing-page teaser with a short hook (German/English) linking to a main page.
- **Content Section**: An expandable unit of long-form content with a heading and body, in both languages.
- **Practitioner**: A directory entry with name, location, contact information, and optional photo and bio.
- **Publication Item**: An essay/article (title, description, link) or a video (title, consent-gated embed reference, category).
- **Language Preference**: The visitor's chosen language (German or English), persisted across sessions.
- **Brand Mark**: The Tonkraft wordmark and the Aum seal (औं), present site-wide.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of the handoff content (and the designated source-file content) is present and verbatim — verifiable by a side-by-side text comparison with zero discrepancies.
- **SC-002**: Every page renders correctly with no horizontal scroll, overlap, or clipped content at viewport widths from 320px to 1920px.
- **SC-003**: A visitor's language choice persists across at least 3 page navigations and across a browser restart, 100% of the time.
- **SC-004**: All six landing story beats are reachable via each of the three interaction methods (click, keyboard, scroll), and all four preview cards link correctly.
- **SC-005**: On the Publikationen page, zero third-party (video) network requests occur before explicit consent; after consent, the selected video plays.
- **SC-006**: Pages become usable (primary content visible and interactive) within 3 seconds on a typical mobile connection.
- **SC-007**: The site is fully operable by keyboard alone, and text/background contrast meets WCAG AA within the monochrome scheme.
- **SC-008**: With JavaScript disabled, all editorial content on every page remains readable and all pages remain reachable.
- **SC-009**: A first-time reviewer confirms the design shows no recognizable visual carry-over (layout, typography, styling) from the old site.

## Assumptions

- The build happens in the `Tonkraft II` working directory and will ultimately be committed/pushed to the same git repository as the existing `~/Tonkraft` site.
- `CONTENT_HANDOFF.md` is the authoritative content; the existing source HTML/ODT files are read **only** to extract verbatim content, assets, and information structure for the "to be populated" sections — never as a design reference.
- Existing assets (e.g., the Vemu Mukunda photograph) are reused; the Aum seal is the Unicode glyph औं. If a referenced asset is missing, a clearly-marked, intentional placeholder is used.
- "Monochrome Vishuddha-blue on warm paper" means a single blue hue family on a warm off-white/paper background, with no additional accent colors (tonal variation of the blue and neutral text are acceptable).
- The site is a static, frontend-only deliverable (HTML/CSS/JS), deployable as static files with no backend or build-time server dependency required to view it.
- Practitioner, training, publication, and legal content reflects what currently exists in the source files; if the client later supplies updated data, it can be dropped into the same structures.
- The bilingual model uses paired content where both languages are available, with the inactive language hidden, consistent with the handoff's described approach.
- Email/phone contact actions rely on the visitor's own device/mail client (standard `mailto:`/`tel:` behavior); no contact form backend is in scope.
