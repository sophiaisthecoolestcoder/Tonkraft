# Architecture — Tonkraft

A static site. No framework, no build step.

## Layout

```
Tonkraft/
├── index.html           – single page (landing + placeholder section)
├── css/
│   └── style.css        – tokens, typography, layout, reveal states
├── js/
│   └── landing.js       – canvas wave, ripples, reveal, advance
├── docs/
│   ├── design.md        – palette, typography, motion rationale
│   └── architecture.md  – this file
├── wrangler.jsonc       – Cloudflare Workers static-assets config
├── CLAUDE.md            – instructions for future Claude sessions
└── README.md
```

## Runtime flow

1. **Page loads.** `body.is-loading` keeps all landing elements hidden
   (opacity 0). Stylesheet + Google Fonts + `landing.js` load. `landing.js`
   is `defer`red.
2. **First paint fires.** JS swaps `.is-loading` → `.is-ready`. CSS
   transitions stagger the seal → eyebrow → wordmark letters → tagline →
   hint over ~3 seconds.
3. **Canvas starts.** Unless `prefers-reduced-motion`, `landing.js` sizes
   the canvas for device DPI and begins a rAF loop that renders, every
   frame:
   - concentric ripples from the composition centre,
   - the ghost wave (slower, softer),
   - the primary wave (crisper).
4. **User advances.** A click inside `.landing`, or Enter / Space /
   ArrowDown / PageDown while the landing is ≥50 % in view, adds
   `.is-leaving` and smooth-scrolls `#next` into view. Scrolling with
   the wheel / trackpad does this natively without extra code.
5. **User scrolls back.** The IntersectionObserver re-enables input and
   `.is-leaving` is removed. The wave keeps running (no teardown).

## Canvas internals

- DPR-aware: canvas bitmap = CSS size × `min(devicePixelRatio, 2)`.
- Resize is debounced by 120 ms.
- Cursor influence is smoothed by lerping `cursor` toward `target` at
  `0.045` each frame (~60 fps gives a ~350 ms settle time).
- All colours are drawn from a single RGB constant that matches
  `--indigo`. Keep the two in sync if you change the palette.
- Ripple count stays small (~3 alive at once). Everything GC-free
  beyond array splicing.

## Deployment

- **Cloudflare Workers** with static assets, via a `wrangler.jsonc`
  pointing at `"./"` as the assets directory.
- Git integration in the Cloudflare dashboard auto-deploys on every
  push to `main`.
- No build step. `npx wrangler deploy` uploads the tree as-is.
- Preview URLs are generated automatically for non-`main` branches.
- Free tier: static-asset requests don't count against the Workers
  request quota, so the site is effectively unlimited on cost.

## Local preview

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Any static server works; no tooling required.

## Browser support

Modern evergreen only. Uses:

- Custom properties, `clamp()`, `:focus-visible`, `svh` units.
- `font-variation-settings` for Fraunces optical sizing & SOFT axis.
- Canvas 2D, `IntersectionObserver`, `requestAnimationFrame`.
- Graceful fallbacks: `svh` degrades to `vh`; optical axes degrade to
  the default weight/style.
