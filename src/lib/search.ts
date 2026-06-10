import type { Brief, BriefItem } from "./types"

export interface SearchResultGroup {
  date: string
  items: BriefItem[]
}

/** Case-insensitive substring search over title/summary/source, grouped by brief date, newest first. */
export function searchBriefs(briefs: Brief[], query: string): SearchResultGroup[] {
  const q = query.trim().toLowerCase()
  if (q === "") return []
  const matches = (text?: string) => text?.toLowerCase().includes(q) ?? false
  return [...briefs]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((brief) => ({
      date: brief.date,
      items: brief.sections
        .flatMap((section) => section.items)
        .filter(
          (item) =>
            matches(item.title) || matches(item.summary) || matches(item.source)
        ),
    }))
    .filter((group) => group.items.length > 0)
}
