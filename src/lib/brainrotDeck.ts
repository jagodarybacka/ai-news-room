import type { Brief, BriefItem, Importance, SectionId } from "./types"
import type { ItemMeta, ItemState } from "./readState"
import { savedItems } from "./readState"
import { fetchBrief } from "./data"

export interface DeckCard {
  url: string
  title: string
  source: string
  summary?: string
  sectionId?: SectionId
  sectionTitle?: string
  importance?: Importance
  type?: BriefItem["type"]
  briefDate?: string
  publishedAt?: string
}

export function metaOf(card: DeckCard): ItemMeta {
  return {
    url: card.url,
    title: card.title,
    source: card.source,
    briefDate: card.briefDate,
    summary: card.summary,
    sectionId: card.sectionId,
    sectionTitle: card.sectionTitle,
  }
}

/** Flatten today's brief into cards, excluding already-triaged items. */
export function buildTodayDeck(
  brief: Brief,
  states: Record<string, ItemState>
): DeckCard[] {
  const cards: DeckCard[] = []

  if (brief.headline) {
    cards.push({
      url: brief.headline.url,
      title: brief.headline.title,
      source: brief.headline.source,
      summary: brief.headline.summary,
      briefDate: brief.date,
      publishedAt: brief.headline.publishedAt,
    })
  }

  for (const section of brief.sections) {
    for (const item of section.items) {
      cards.push({
        url: item.url,
        title: item.title,
        source: item.source,
        summary: item.summary,
        sectionId: section.id,
        sectionTitle: section.title,
        importance: item.importance,
        type: item.type,
        briefDate: brief.date,
        publishedAt: item.publishedAt,
      })
    }
  }

  // Un-triaged = no status and no savedAt (patch() deletes empty records)
  return cards.filter((card) => {
    const s = states[card.url]
    return !s || (s.status === undefined && s.savedAt === undefined)
  })
}

/**
 * Backfill summary/section/importance for saved items that predate the
 * summary-storage feature. Fetches only the unique brief dates that are
 * actually needed (parallel), ignores network failures gracefully.
 */
export async function enrichReadingDeck(deck: DeckCard[]): Promise<DeckCard[]> {
  const dates = [
    ...new Set(deck.filter((c) => !c.summary && c.briefDate).map((c) => c.briefDate!)),
  ]
  if (dates.length === 0) return deck

  const results = await Promise.allSettled(dates.map((d) => fetchBrief(d)))

  const lookup = new Map<string, Partial<DeckCard>>()
  results.forEach((r) => {
    if (r.status !== "fulfilled") return
    const brief = r.value
    if (brief.headline) {
      lookup.set(brief.headline.url, {
        summary: brief.headline.summary,
        publishedAt: brief.headline.publishedAt,
      })
    }
    for (const section of brief.sections) {
      for (const item of section.items) {
        lookup.set(item.url, {
          summary: item.summary,
          sectionId: section.id,
          sectionTitle: section.title,
          importance: item.importance,
          type: item.type,
          publishedAt: item.publishedAt,
        })
      }
    }
  })

  return deck.map((card) => {
    if (card.summary) return card
    const extra = lookup.get(card.url)
    return extra ? { ...card, ...extra } : card
  })
}

/** Saved reading-list items, oldest-saved first (ready to finally read). */
export function buildReadingDeck(
  states: Record<string, ItemState>
): DeckCard[] {
  // savedItems returns newest-first; reverse to oldest-first
  return [...savedItems(states)].reverse().map((entry) => ({
    url: entry.url,
    title: entry.title ?? entry.url,
    source: entry.source ?? "",
    briefDate: entry.briefDate,
    summary: entry.summary,
    sectionId: entry.sectionId,
    sectionTitle: entry.sectionTitle,
  }))
}
