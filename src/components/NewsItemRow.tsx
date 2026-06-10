import { Badge } from "@/components/ui/badge"
import type { BriefItem } from "@/lib/types"

const titleSize: Record<number, string> = {
  1: "text-base",
  2: "text-lg",
  3: "text-xl",
}

export function NewsItemRow({ item }: { item: BriefItem }) {
  return (
    <article className="py-3">
      <a
        href={item.url}
        target="_blank"
        rel="noreferrer"
        className="group block"
      >
        <h3
          className={`font-serif font-semibold leading-snug group-hover:underline ${titleSize[item.importance] ?? "text-base"}`}
        >
          {item.title}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {item.summary}
        </p>
        <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium uppercase tracking-wide">
            {item.source}
          </span>
          <Badge variant="outline" className="rounded-none px-1.5 py-0 text-[10px] uppercase">
            {item.type}
          </Badge>
        </div>
      </a>
    </article>
  )
}
