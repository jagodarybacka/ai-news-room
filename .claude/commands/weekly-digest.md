---
description: Synthesize the past week's briefs into the Friday weekly edition
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# Weekly Digest Routine

Produce "The Week in AI" — the Friday edition that synthesizes the week's daily
briefs into themes. Work through every step; do not skip validation or stop
before pushing.

## Ground rules

- **No new research.** The weekly is built ONLY from the week's daily briefs in
  `public/data/briefs/`. Every link in the digest MUST be the URL of an item
  (or headline) that appeared in one of those briefs. Never add a link, title,
  or claim that is not in the source briefs.
- The digest is synthesis, not repetition: themes connect stories across days
  and say what the week added up to. Don't restate item summaries.

## 1. Read the editorial guidelines

`editorial/USER-NEEDS.md` — audience, tone (plain language, no hype), and the
15-minute job to be done. The weekly serves the reader who skipped some dailies.

## 2. Collect the week

- Today is Friday; the week is the 7 days ending today (weekStart = today − 6).
- Read every brief in `public/data/briefs/` whose date falls in that window.
- If fewer than 3 briefs exist in the window, skip the digest (reply explaining
  why) — a weekly synthesized from one or two days is filler.

## 3. Synthesize and write

Write `public/data/weekly/<YYYY-MM-DD>.json` (today's date) with:

- `date` (today, a Friday), `weekStart`, `weekEnd` (= today), `generatedAt`.
- `overview` — the week's arc in 3–4 sentences (max 800 chars). What actually
  mattered; no hype.
- `themes` — 2–5 themes, each:
  - `title` — short, newspaper-section style.
  - `body` — one or two paragraphs of synthesis (max 1200 chars) connecting
    the week's stories: what happened, what it adds up to, what to watch.
  - `links` — the brief items the theme draws on (`title`, `url`, `source`),
    at least one; copy them verbatim from the briefs.
- `topReads` — 5–12 items re-ranked across the whole week: the things a reader
  who missed everything should open first. Copy items verbatim from the briefs
  (including `publishedAt`); you may trim summaries. Order by importance.

Then update `public/data/index.json`: set `weekly.latest` to today and append
today to `weekly.dates` (create the `weekly` object on first run).

If a weekly for today already exists, overwrite it (re-runs are fine).

## 4. Validate

Run `pnpm validate`. Fix any errors and re-run until it passes.

## 5. Publish

```bash
git add public/data
git commit -m "weekly: <YYYY-MM-DD>"
git push
```

Finish by replying with a 3-line summary: the week's overview in one line, the
theme titles, and the number of top reads.
