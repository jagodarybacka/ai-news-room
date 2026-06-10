# Reader Needs — Who This Brief Is For

## The audience

Software engineers and researchers who follow frontier AI closely and want signal,
not volume. The brief assumes technical fluency (they build with LLMs and AI coding
tools day to day) and serves four standing interests:

- **Frontier lab news** — model releases, product launches, company moves
- **AI safety and alignment research** — interpretability, evals, alignment methods
- **AI-assisted engineering** — coding agents, tooling, and how AI is changing
  software development in practice
- **AI × human psychology** — sycophancy, cognitive offloading and deskilling,
  AI companionship, manipulation/dark patterns, and the evaluation methodology
  around them

## The job to be done

> Open the page and within **15 minutes** know everything important that happened
> in frontier AI since the last brief.

That means:

- **Titles, one-to-two-sentence summaries, and links. Nothing more.** The page is a
  map, not the territory — readers click through only when something matters to them.
- **Curated, not exhaustive.** 5–8 items per section maximum. If a section had a slow
  day, fewer items (or none) is correct. An empty section is better than filler.
- **No hype.** Summaries state what happened and why it matters, in plain language.
  No "game-changing", no "stunning". If a claim is from a press release, say so.
- **Primary sources preferred.** Link the lab's own post or the paper, not coverage of
  it — unless the coverage adds real analysis.
- **Never paywalled.** Every link must be readable without a subscription (see the
  paywall policy in SOURCES.md). A brief item the reader can't open is worse than
  no item.
- **Fresh news, timeless papers.** News, releases, blog posts, tweets, and
  discussion threads must be from the last month — ideally from the research
  window. Papers are the one exception: an older paper may appear when it is
  genuinely trending or newly relevant right now. Anything else that's stale gets
  dropped, not grandfathered. Every item carries its verified publication date
  (`publishedAt`); the validator enforces freshness mechanically.
- **No duplicates across sections.** Each story appears once, in its best-fit section.
- **Importance is signal.** Reserve importance 3 ("must-read") for things readers
  would regret missing: major model releases, landmark papers, significant safety
  incidents. Most items are 1.

## Section definitions

| id | Section | What belongs here |
|----|---------|-------------------|
| `labs` | Frontier Labs | Announcements, model/product releases, and company news from frontier labs (Anthropic, OpenAI, Google DeepMind, xAI, Meta AI, Mistral, DeepSeek, Qwen…) |
| `research` | Research | New papers and research posts: alignment, interpretability, evals, capabilities. Both lab research and academia/arXiv. |
| `engineering` | AI for Engineers | AI-assisted development: coding agents, Claude Code/Cursor/IDE tooling, agent workflows, notable engineering write-ups and trends for full-stack devs. |
| `safety-psych` | Minds & Machines | AI × human psychology — sycophancy, cognitive debt, companionship, manipulation/dark patterns, mental-health effects, eval methodology for these. |
| `voices` | Voices | Notable posts from tracked people (see SOURCES.md): blogs and Bluesky reliably, impactful X posts best-effort. Also the community's mood when it's the story — a debate consuming HN or r/LocalLLaMA. Opinion and hot takes welcome here. |
| `lab-blogs` | The Lab Wire | **Exhaustive, not curated:** every new post on the watched lab blogs (see "Blog watch" in SOURCES.md) since the last brief. Title + link; summary optional. The 5–8 item cap does not apply. |

## Editor's notes

Each curated section may carry a one-sentence `comment`: the section's vibe or the
single thing that matters today. The notes alone should let a reader skim the whole
day in 15 seconds. Skip the note on unremarkable days — a missing note is itself
signal. Synthesize; never restate item titles.

## Top 3

The three most important items across the curated sections (by `importance`,
excluding the headline and the lab-blogs wire) are surfaced automatically as a
"Top 3" index under the headline. Assign `importance` with that in mind — the
three best non-headline stories of the day should carry the highest values.

## The headline

At most one story per day is promoted to the headline slot above all sections — the
single thing to read first. Days without a clear standout get no headline.
