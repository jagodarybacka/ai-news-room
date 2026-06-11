import { ItemActions } from "@/components/ItemActions"
import { formatShortDate } from "@/lib/data"
import { useSelectedUrl } from "@/lib/keyboardNav"
import { markReadOnClick, useItemStates } from "@/lib/readState"
import { sectionInk } from "@/lib/sections"
import type { BriefItem, SectionId } from "@/lib/types"

const titleSize: Record<number, string> = {
  1: "text-base",
  2: "text-lg",
  3: "text-xl",
}

export function NewsItemRow({
  item,
  sectionId,
  briefDate,
  wide = false,
}: {
  item: BriefItem
  /** Tints the type tag with the section's ink; omitted in cross-section lists. */
  sectionId?: SectionId
  briefDate?: string
  /** Span two columns on desktop — used to give a sparse section a lead story. */
  wide?: boolean
}) {
  const states = useItemStates()
  const status = states[item.url]?.status
  const selected = useSelectedUrl() === item.url
  const ink = sectionId ? sectionInk[sectionId] : null

  const meta = {
    url: item.url,
    title: item.title,
    source: item.source,
    briefDate,
  }

  const dimmed =
    status === "read" ? "opacity-55" : status === "dismissed" ? "opacity-30" : ""

  return (
    <article
      data-item-url={item.url}
      className={`flex h-full flex-col border-b border-border py-4 transition-opacity ${wide ? "lg:col-span-2" : ""} ${dimmed} ${selected ? "-ml-3 border-l-2 border-l-foreground pl-3" : ""}`}
    >
      <h3
        className={`font-serif font-semibold leading-snug ${titleSize[item.importance] ?? "text-base"} ${status === "dismissed" ? "line-through decoration-1" : ""}`}
      >
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="hover:underline"
          {...markReadOnClick(meta)}
        >
          {item.title}
        </a>
      </h3>
      {item.summary && (
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {item.summary}
        </p>
      )}
      <div className="mt-auto flex items-center gap-2 pt-3 text-xs text-muted-foreground">
        <span className="font-medium uppercase tracking-wide">{item.source}</span>
        <span
          className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${ink ? ink.pill : "bg-secondary text-muted-foreground"}`}
        >
          {item.type}
        </span>
        {item.publishedAt && <span>{formatShortDate(item.publishedAt)}</span>}
        <span className="ml-auto">
          <ItemActions meta={meta} />
        </span>
      </div>
    </article>
  )
}
