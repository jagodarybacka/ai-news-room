import { ItemActions } from "@/components/ItemActions"
import { sectionInk } from "@/lib/sections"
import { useSelectedUrl } from "@/lib/keyboardNav"
import { useItemStates } from "@/lib/readState"
import type { BriefSection } from "@/lib/types"

// The wire: an exhaustive listing of every new post on the watched lab
// blogs — a checklist, not a ranking, so it renders tighter than the
// curated sections.
export function LabBlogsWire({
  section,
  briefDate,
}: {
  section: BriefSection
  briefDate?: string
}) {
  const ink = sectionInk["lab-blogs"]
  const states = useItemStates()
  const selectedUrl = useSelectedUrl()

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
      {section.items.length === 0 ? (
        <p className="py-3 text-sm italic text-muted-foreground">
          Nothing new on the watched lab blogs.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
          {section.items.map((item) => {
            const status = states[item.url]?.status
            const dimmed =
              status === "read"
                ? "opacity-55"
                : status === "dismissed"
                  ? "opacity-30"
                  : ""
            return (
              <li
                key={item.url}
                data-item-url={item.url}
                className={`flex items-baseline gap-2 border-b border-border py-2 leading-snug transition-opacity ${dimmed} ${selectedUrl === item.url ? "-ml-3 border-l-2 border-l-foreground pl-3" : ""}`}
              >
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group min-w-0 flex-1 text-sm"
                >
                  <span
                    className={`text-xs font-semibold uppercase tracking-wide ${ink.text}`}
                  >
                    {item.source}
                  </span>
                  <span className="mx-2 text-muted-foreground">·</span>
                  <span
                    className={`font-serif group-hover:underline ${status === "dismissed" ? "line-through decoration-1" : ""}`}
                  >
                    {item.title}
                  </span>
                </a>
                <ItemActions
                  meta={{
                    url: item.url,
                    title: item.title,
                    source: item.source,
                    briefDate,
                  }}
                />
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
