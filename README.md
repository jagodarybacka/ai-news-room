# The AI News Room 🗞️

A daily brief of AI frontier news, research, and engineering trends — researched
and written by Claude every morning, published as a static site on GitHub Pages.

**The goal:** open the page and know within 15 minutes what happened in AI since
yesterday. Titles, short summaries, links — nothing more.

## Sections

- **Frontier Labs** — releases and announcements from Anthropic, OpenAI, Google
  DeepMind, xAI, Meta AI, Mistral, and friends
- **Research** — new papers and research posts: alignment, interpretability, evals
- **AI for Engineers** — coding agents, tooling, and workflows for developers
- **Minds & Machines** — AI × human psychology: sycophancy, cognitive debt,
  companionship, dark patterns
- **Voices** — notable posts from tracked people in the space

## How it works

```
6:00  claude "/daily-brief"            # researches the past day via web search
      → writes public/data/briefs/YYYY-MM-DD.json
      → pnpm validate                  # schema check
      → git commit + push
      → GitHub Actions builds & deploys to Pages

Fri   claude "/weekly-digest"          # synthesizes the week's briefs into
      → public/data/weekly/YYYY-MM-DD.json   "The Week in AI" (no new research)
```

Subscribe via the Atom feed at `/ai-news-room/feed.xml` (generated at build time).

Editorial control lives in two markdown files:

- [`editorial/USER-NEEDS.md`](editorial/USER-NEEDS.md) — who the reader is and how to curate
- [`editorial/SOURCES.md`](editorial/SOURCES.md) — the living must-check source list

## Development

```bash
pnpm install
pnpm dev        # local dev server
pnpm validate   # check brief data integrity
pnpm build      # production build
```

Stack: Vite, React 19, TypeScript, Tailwind v4, shadcn/ui. Briefs are plain JSON
fetched at runtime — a daily update is a data-only commit.

## One-time setup

In the GitHub repo: **Settings → Pages → Source: GitHub Actions**. Every push to
`main` then deploys automatically.
