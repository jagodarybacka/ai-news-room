import { NewsItemRow } from "./NewsItemRow"
import { sectionInk } from "@/lib/sections"
import type { BriefSection } from "@/lib/types"

export function SectionBlock({
  section,
  briefDate,
}: {
  section: BriefSection
  briefDate?: string
}) {
  if (section.items.length === 0) return null
  const ink = sectionInk[section.id]

  // Sparse sections (1–2 items) leave dead space in the 3-column grid, so the
  // most important item leads wide. The first item at the highest importance
  // wins ties, preserving the brief's ordering.
  const leadIndex =
    section.items.length < 3
      ? section.items.reduce(
          (best, item, i) =>
            item.importance > section.items[best].importance ? i : best,
          0
        )
      : -1

  return (
    <section className="mt-12">
      <div className="flex items-baseline gap-3">
        <h2
          className={`text-sm font-bold uppercase tracking-[0.2em] ${ink.text}`}
        >
          {section.title}
        </h2>
        <span className={`h-0.5 flex-1 ${ink.edge} opacity-40`} aria-hidden />
      </div>
      {section.comment && (
        <p
          className={`mt-3 max-w-2xl border-l-2 pl-3 font-serif text-[15px] italic leading-snug text-muted-foreground ${ink.border}`}
        >
          {section.comment}
        </p>
      )}
      <div className="mt-4 grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
        {section.items.map((item, i) => (
          <NewsItemRow
            key={item.url}
            item={item}
            sectionId={section.id}
            briefDate={briefDate}
            wide={i === leadIndex}
          />
        ))}
      </div>
    </section>
  )
}
