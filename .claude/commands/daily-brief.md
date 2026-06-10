---
description: Research the past day's AI news and publish today's brief
allowed-tools: Read, Write, Edit, Bash, WebSearch, WebFetch, Glob, Grep
---

# Daily Brief Routine

Produce today's edition of The AI News Room. Work through every step; do not skip
validation or stop before pushing.

## 1. Read the editorial guidelines

- `editorial/USER-NEEDS.md` — who the reader is, curation rules, section definitions.
- `editorial/SOURCES.md` — the must-check source list. This file is the source of
  truth; if it changed since the last run, follow the new version.

## 2. Determine the research window

- Find the most recent brief in `public/data/briefs/` and read its `generatedAt`.
- The window is from that timestamp until now. If there is no previous brief or the
  gap exceeds 3 days, cap the window at the last 3 days and prefer the most
  significant stories from it.

## 3. Research

Use WebSearch (and WebFetch for must-check pages) to cover, in this order:

1. **Blog watch (MANDATORY, exhaustive)** — visit every blog in the "Blog watch"
   table in SOURCES.md and list EVERY post published since the last brief in the
   `lab-blogs` section (title + link + source; summary optional). This is a
   completeness check, not curation — the 5–8 cap does not apply. If a blog
   blocks fetching, note it via search instead; if nothing is new anywhere,
   include the section with an empty items array.
2. **Frontier labs** — check each lab source for announcements and releases.
3. **Research** — new papers/posts: alignment, interpretability, evals, plus notable
   arXiv entries. Skim the Alignment Forum frontpage.
4. **AI for engineers** — coding-agent and tooling news, notable engineering posts,
   high-traction Hacker News AI threads.
5. **Minds & machines** — run the targeted searches listed in SOURCES.md
   (sycophancy, cognitive debt, companionship, dark patterns, AI × mental health).
6. **Voices** — for each tracked person: check their blog; then best-effort search
   for impactful X posts (e.g. `site:x.com @handle` or news coverage of viral posts).
   Missing tweets is acceptable; inventing them is not.

Rules:
- Every item MUST have a real, working URL you actually found during research.
  Never fabricate links, titles, or dates. If unsure a story is real, drop it.
- NO paywalled links (see the paywall policy in SOURCES.md): if a story is only
  behind a paywall, find free or primary coverage, or drop it.
- Freshness: news, releases, blog posts, tweets, and discussion threads MUST have
  been published within the last 30 days. Search engines surface old content in
  fresh results — always check the actual publication date (arXiv IDs encode
  YYMM; fetch the page if unsure). Papers are exempt when genuinely trending
  right now. If you cannot verify an item's date, drop the item.
- Deduplicate across sections; pick the best-fit section per story (a major
  lab-blog post can appear both in the wire AND as a curated item).

## 4. Curate and write

- Apply USER-NEEDS.md ruthlessly: max 5–8 items per section, 1–2 sentence summaries,
  importance mostly 1, importance 3 only for genuine must-reads. At most one headline.
- **Editor's notes:** for each curated section, optionally write a `comment` — ONE
  sentence (max 250 chars) capturing the section's vibe or the single thing that
  matters, so the reader gets the day in a 15-second skim of the notes alone.
  Skip the comment when the section had an unremarkable day; a skipped note is
  itself signal. Never restate item titles — synthesize.
- Write `public/data/briefs/<YYYY-MM-DD>.json` (today's local date) following the
  schema of the existing briefs (see any file in `public/data/briefs/`).
- Add today's date to `public/data/index.json`: append to `dates`, set `latest`.
- If a brief for today already exists, overwrite it (re-runs are fine).

## 5. Validate

Run `pnpm validate`. Fix any errors and re-run until it passes.

## 6. Publish

```bash
git add public/data
git commit -m "brief: <YYYY-MM-DD>"
git push
```

GitHub Actions builds and deploys the site from main. Finish by replying with a
3-line summary: headline story, item counts per section, anything noteworthy that
was deliberately left out.
