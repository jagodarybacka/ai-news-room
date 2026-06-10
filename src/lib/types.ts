export type SectionId =
  | "labs"
  | "research"
  | "engineering"
  | "safety-psych"
  | "voices"
  | "lab-blogs"

export type ItemType = "news" | "paper" | "blog" | "tweet" | "release"

/** 1 = notable, 2 = important, 3 = must-read (drives visual weight) */
export type Importance = 1 | 2 | 3

export interface BriefItem {
  title: string
  /** Optional only in the lab-blogs wire section; required elsewhere. */
  summary?: string
  url: string
  source: string
  type: ItemType
  importance: Importance
  /** Verified publication date (YYYY-MM-DD). Required in briefs from 2026-06-11 on. */
  publishedAt?: string
  /** og:image (or similar) found on the linked page. Never guessed; omitted when absent. */
  imageUrl?: string
}

export interface BriefSection {
  id: SectionId
  title: string
  /** Optional one-sentence editor's note: the section's vibe at a glance. */
  comment?: string
  items: BriefItem[]
}

export interface Headline {
  title: string
  summary: string
  url: string
  source: string
  /** Verified publication date (YYYY-MM-DD). Required in briefs from 2026-06-11 on. */
  publishedAt?: string
  /** og:image (or similar) found on the linked page. Never guessed; omitted when absent. */
  imageUrl?: string
}

export interface Brief {
  date: string
  generatedAt: string
  headline?: Headline
  sections: BriefSection[]
}

export interface BriefIndex {
  latest: string
  dates: string[]
  /** Friday weekly digests; absent until the first one is published. */
  weekly?: {
    latest: string
    dates: string[]
  }
}

export interface WeeklyThemeLink {
  title: string
  url: string
  source: string
}

/** One synthesized storyline of the week, built only from the week's brief items. */
export interface WeeklyTheme {
  title: string
  body: string
  links: WeeklyThemeLink[]
}

export interface Weekly {
  /** Publication date — a Friday (YYYY-MM-DD). */
  date: string
  weekStart: string
  weekEnd: string
  generatedAt: string
  /** The week's arc in a few sentences. */
  overview: string
  themes: WeeklyTheme[]
  /** The week's best items, re-ranked across all dailies. */
  topReads: BriefItem[]
}
