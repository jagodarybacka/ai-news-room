import type { Brief, BriefItem, SectionId } from "./types"

export interface TopStory {
  item: BriefItem
  sectionId: SectionId
  sectionTitle: string
}

// Above-the-fold index: the three most important items across the curated
// sections (the lab-blogs wire is a listing, not a ranking, so it's excluded).
export function pickTopStories(brief: Brief): TopStory[] {
  const candidates: TopStory[] = brief.sections
    .filter((section) => section.id !== "lab-blogs")
    .flatMap((section) =>
      section.items.map((item) => ({
        item,
        sectionId: section.id,
        sectionTitle: section.title,
      }))
    )
    .filter(({ item }) => item.url !== brief.headline?.url)

  // Stable sort: importance first, section order breaks ties.
  return candidates
    .sort((a, b) => b.item.importance - a.item.importance)
    .slice(0, 3)
}
