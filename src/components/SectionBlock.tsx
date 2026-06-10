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

  return (
    <section className="mt-8">
      <h2
        className={`border-b-2 pb-1 text-sm font-bold uppercase tracking-[0.2em] ${ink.border}`}
      >
        <span className={ink.text}>{section.title}</span>
      </h2>
      {section.comment && (
        <p
          className={`mt-3 border-l-2 pl-3 font-serif text-[15px] italic leading-snug text-muted-foreground ${ink.border}`}
        >
          {section.comment}
        </p>
      )}
      <div className="grid grid-cols-1 gap-x-10 divide-y divide-border sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-3">
        {section.items.map((item) => (
          <NewsItemRow key={item.url} item={item} briefDate={briefDate} />
        ))}
      </div>
    </section>
  )
}
