import { sectionInk } from "@/lib/sections"
import type { BriefSection } from "@/lib/types"

// The wire: an exhaustive listing of every new post on the watched lab
// blogs — a checklist, not a ranking, so it renders tighter than the
// curated sections.
export function LabBlogsWire({ section }: { section: BriefSection }) {
  const ink = sectionInk["lab-blogs"]

  return (
    <section className="mt-8">
      <h2
        className={`border-b-2 pb-1 text-sm font-bold uppercase tracking-[0.2em] ${ink.border}`}
      >
        <span className={ink.text}>{section.title}</span>
      </h2>
      {section.items.length === 0 ? (
        <p className="py-3 text-sm italic text-muted-foreground">
          Nothing new on the watched lab blogs.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
          {section.items.map((item) => (
            <li
              key={item.url}
              className="border-b border-border py-2 leading-snug"
            >
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="group text-sm"
              >
                <span
                  className={`font-semibold uppercase tracking-wide text-xs ${ink.text}`}
                >
                  {item.source}
                </span>
                <span className="mx-2 text-muted-foreground">·</span>
                <span className="font-serif group-hover:underline">
                  {item.title}
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
