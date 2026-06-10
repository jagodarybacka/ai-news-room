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
}

export interface BriefSection {
  id: SectionId
  title: string
  items: BriefItem[]
}

export interface Headline {
  title: string
  summary: string
  url: string
  source: string
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
}
