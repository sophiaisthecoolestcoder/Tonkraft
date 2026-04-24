# Tonkraft

Static website for the **Tonkraft** institute — sound, resonance, and the
*Persönlicher Grundton*, at the intersection of Vedic tradition, esoteric
practice, scientific acoustics, music and psychology.

## Project structure

```
Tonkraft/
├── index.html           – landing page (+ empty next section)
├── css/style.css
├── js/landing.js        – sine wave + Vishuddha ripples + advance
├── docs/
│   ├── design.md        – palette, typography, motion rules
│   └── architecture.md  – runtime, canvas internals, deployment
├── wrangler.jsonc       – Cloudflare Workers config
├── CLAUDE.md            – instructions for future Claude sessions
└── README.md
```

## Development

Pure vanilla HTML / CSS / JS — no build step, no dependencies.

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deployment

Git-connected Cloudflare Workers (static assets). Every push to `main`
auto-deploys. See [docs/architecture.md](docs/architecture.md) for details.
