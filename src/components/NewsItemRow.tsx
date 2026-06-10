import { Badge } from "@/components/ui/badge"
import { ItemActions } from "@/components/ItemActions"
import { formatShortDate } from "@/lib/data"
import { useSelectedUrl } from "@/lib/keyboardNav"
import { useItemStates } from "@/lib/readState"
import type { BriefItem } from "@/lib/types"

const titleSize: Record<number, string> = {
  1: "text-base",
  2: "text-lg",
  3: "text-xl",
}

export function NewsItemRow({
  item,
  briefDate,
}: {
  item: BriefItem
  briefDate?: string
}) {
  const states = useItemStates()
  const status = states[item.url]?.status
  const dimmed =
    status === "read" ? "opacity-55" : status === "dismissed" ? "opacity-30" : ""
  const selected = useSelectedUrl() === item.url

  return (
    <article
      data-item-url={item.url}
      className={`py-3 transition-opacity ${dimmed} ${selected ? "-ml-3 border-l-2 border-foreground pl-3" : ""}`}
    >
      <h3
        className={`font-serif font-semibold leading-snug ${titleSize[item.importance] ?? "text-base"} ${status === "dismissed" ? "line-through decoration-1" : ""}`}
      >
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="hover:underline"
        >
          {item.title}
        </a>
      </h3>
      {item.summary && (
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {item.summary}
        </p>
      )}
      <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
        <span className="font-medium uppercase tracking-wide">
          {item.source}
        </span>
        <Badge variant="outline" className="rounded-none px-1.5 py-0 text-[10px] uppercase">
          {item.type}
        </Badge>
        {item.publishedAt && <span>{formatShortDate(item.publishedAt)}</span>}
        <span className="ml-auto">
          <ItemActions
            meta={{
              url: item.url,
              title: item.title,
              source: item.source,
              briefDate,
            }}
          />
        </span>
      </div>
    </article>
  )
}
