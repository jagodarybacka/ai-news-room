# The AI News Room

A daily AI news brief — static site on GitHub Pages, content researched and
written by Claude each morning.

## How it works

1. The readers' needs live in `editorial/USER-NEEDS.md`; the must-check source list
   in `editorial/SOURCES.md`. Both are the editorial contract — read them before
   touching content.
2. Each morning the `/daily-brief` command (`.claude/commands/daily-brief.md`)
   researches the past day, writes `public/data/briefs/<date>.json`, updates
   `public/data/index.json`, validates, commits, and pushes.
3. Push to `main` triggers `.github/workflows/deploy.yml`: validate → build →
   deploy to GitHub Pages.

## Stack

- Vite + React 19 + TypeScript, Tailwind v4, shadcn/ui (radix-nova preset)
- `react-router-dom` with **HashRouter** (GitHub Pages has no SPA rewrites)
- Briefs are plain JSON fetched at runtime from `public/data/` — daily updates are
  data-only commits, no app code changes
- Vite `base` is `/ai-news-room/`; keep it in sync if the repo is renamed

## Commands

| Command | What |
|---------|------|
| `pnpm dev` | Dev server |
| `pnpm build` | Typecheck + production build |
| `pnpm typecheck` | TypeScript only |
| `pnpm lint` | ESLint |
| `pnpm validate` | Validate `index.json` + all briefs (run after any data change) |
| `pnpm preview` | Serve the production build locally |

## Rules

- Never fabricate news items, URLs, or quotes — every brief item must come from a
  real source found during research. When in doubt, leave it out.
- Brief JSON must satisfy `scripts/validate-brief.mjs` (schema + index consistency).
  Section ids: `labs`, `research`, `engineering`, `safety-psych`, `voices`, `lab-blogs`.
- Keep the UI typographic and minimal — newspaper, not dashboard. The only images
  are small grayscale article thumbnails from the linked page's own `og:image`
  (never guessed); no boxes where a hairline rule will do.
- Run `pnpm typecheck && pnpm lint` after app-code changes; `pnpm validate` after
  data changes.
