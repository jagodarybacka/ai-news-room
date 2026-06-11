# Sources — The Must-Check List

A living list. Edit freely; the daily routine reads this file every run.
"Must-check" means the routine actively looks at it every day. Everything else
surfaces through general web search.

Maintenance: run `pnpm yield` now and then — it tallies which sources actually
produce brief items and flags ones not seen in 30+ days as pruning candidates.

## Paywall policy

**Never link paywalled content.** Every link in the brief must be readable
without a subscription or account. Do not use Fortune, The Information, WSJ,
NYT, Bloomberg, FT, The Atlantic, or paid-tier newsletter posts as item links.
If a story only exists behind a paywall, find free coverage or the primary
source instead — or drop the story.

## Blog watch (`lab-blogs`) — MUST list every new post

This is a completeness check, not curation: **every** post published on these
blogs since the last brief gets listed in the `lab-blogs` section (title +
link; summary optional). The reader must never miss a new lab post.

| Blog | Where |
|------|-------|
| Anthropic — research | https://www.anthropic.com/research |
| Anthropic — news | https://www.anthropic.com/news |
| Anthropic — engineering | https://www.anthropic.com/engineering |
| Transformer Circuits | https://transformer-circuits.pub/ |
| OpenAI — news & research | https://openai.com/news/ |
| Google DeepMind — blog | https://deepmind.google/discover/blog/ |
| Meta AI — blog | https://ai.meta.com/blog/ |
| Mistral — news | https://mistral.ai/news/ |
| xAI — news | https://x.ai/news |

## Frontier labs (`labs`)

| Source | Where |
|--------|-------|
| Anthropic — news | https://www.anthropic.com/news |
| Anthropic — research | https://www.anthropic.com/research |
| Anthropic — engineering | https://www.anthropic.com/engineering |
| OpenAI — news | https://openai.com/news/ |
| OpenAI — research | https://openai.com/research/ |
| Google DeepMind — blog | https://deepmind.google/discover/blog/ |
| Google — AI blog | https://blog.google/technology/ai/ |
| Google Labs | https://labs.google/ |
| xAI — news | https://x.ai/news |
| Meta AI — blog | https://ai.meta.com/blog/ |
| Mistral — news | https://mistral.ai/news/ |

Also watch (search, not crawl): DeepSeek and Qwen releases, notable open-weights drops.

## Research (`research`)

| Source | Where |
|--------|-------|
| arXiv cs.AI recent | https://arxiv.org/list/cs.AI/recent |
| arXiv cs.CL recent | https://arxiv.org/list/cs.CL/recent |
| Alignment Forum | https://www.alignmentforum.org/ |
| Transformer Circuits (Anthropic interpretability) | https://transformer-circuits.pub/ |
| METR | https://metr.org/ |
| UK AI Security Institute | https://www.aisi.gov.uk/ |
| Apart Research | https://apartresearch.com/ |
| Epoch AI | https://epoch.ai/ |

## AI for engineers (`engineering`)

| Source | Where |
|--------|-------|
| Simon Willison's weblog | https://simonwillison.net/ |
| Latent.Space | https://www.latent.space/ |
| Claude Code release notes | https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md |
| Cursor blog | https://cursor.com/blog |
| Hacker News (top AI threads) | https://news.ycombinator.com/ |

## Minds & machines (`safety-psych`)

| Source | Where |
|--------|-------|
| MIT Media Lab | https://www.media.mit.edu/ |
| Anthropic societal impacts | https://www.anthropic.com/research (societal impacts posts) |
| Center for Humane Technology | https://www.humanetech.com/ |

Targeted daily searches: new papers/posts on **sycophancy**, **cognitive offloading /
cognitive debt / deskilling**, **AI companionship**, **dark patterns in LLMs**,
**AI & mental health**, **eval methodology** for human-AI interaction.

## Voices (`voices`)

Blogs are reliable sources; X posts are best-effort via web search (no API).
Use `site:x.com "@<handle>"` to find recent posts; add a date filter (`after:YYYY-MM-DD`)
to avoid stale results. Missing tweets is acceptable; inventing them is not.
Bluesky is reliable: fetch
`https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=<handle>`
(public, no auth). Only the handles listed below are identity-verified — do not
guess handles for the others (lookalike accounts exist).

| Person | Blog / site | X | Bluesky (verified) |
|--------|-------------|---|--------------------|
| Boris Cherny | — | @bcherny | — |
| Andrej Karpathy | https://karpathy.ai/ | @karpathy | karpathy.bsky.social (rarely posts) |
| Simon Willison | https://simonwillison.net/ | @simonw | simonwillison.net (very active) |
| swyx | https://www.swyx.io/ | @swyx | swyx.io (active) |
| Amanda Askell | https://askell.io/ | @AmandaAskell | — |
| Chris Olah | https://colah.github.io/ | @ch402 | colah.bsky.social (occasional) |
| Neel Nanda | https://www.neelnanda.io/ | @NeelNanda5 | neelnanda.bsky.social (occasional) |
| Jan Leike | https://aligned.substack.com/ | @janleike | — |
| Ethan Mollick | https://www.oneusefulthing.org/ | @emollick | emollick.bsky.social (very active) |

## Community pulse

The mood of the field, not just its announcements. These feed items into
whichever section fits (often `engineering` or `voices`) and inform editor's
notes. All endpoints below were verified fetchable without auth.

| Source | How to check |
|--------|--------------|
| Hacker News front page | `https://hn.algolia.com/api/v1/search?tags=front_page` (filter AI stories) |
| Hacker News high-traction | `https://hn.algolia.com/api/v1/search_by_date?query=<topic>&numericFilters=points%3E100` — try claude, openai, gemini, llm |
| Lobsters AI tag | `https://lobste.rs/t/ai.json` (low volume, high signal) |
| Hugging Face daily papers | `https://huggingface.co/api/daily_papers` — community upvotes = which papers are actually trending (feeds `research`) |
| Bluesky | author feeds for the voices table above (see Voices) |
| Reddit | direct fetch is blocked — use targeted web searches. Per-subreddit patterns: `site:reddit.com/r/LocalLLaMA "<keyword>"`, `site:reddit.com/r/MachineLearning "<keyword>"`, `site:reddit.com/r/ClaudeAI OR site:reddit.com/r/OpenAI "<keyword>"`. Add `after:YYYY-MM-DD` to filter by recency. Thread comment count signals genuine engagement. r/LocalLLaMA = open-weights mood; r/MachineLearning = research reactions; r/ClaudeAI + r/OpenAI = product sentiment. |
| X | no free API — use targeted web searches: `site:x.com "@handle" "<keyword>"` for tracked voices (handles in the Voices table above); `"<keyword>" site:x.com` with `after:YYYY-MM-DD` for recency. For lab announcements: `site:x.com "@AnthropicAI" OR site:x.com "@OpenAI" OR site:x.com "@GoogleDeepMind"`. News coverage of viral posts is also reliable. Never fabricate engagement numbers. |
