import { Masthead } from "@/components/Masthead"
import { ItemActions } from "@/components/ItemActions"
import { markReadOnClick, savedItems, useItemStates } from "@/lib/readState"
import { formatLongDate } from "@/lib/data"

export function ReadingListPage() {
  const states = useItemStates()
  const saved = savedItems(states)

  return (
    <>
      <Masthead />
      <section className="pt-2 pb-8 sm:pt-6">
        <div className="flex items-baseline gap-3">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-ink-voices">
            Reading List
          </h2>
          <span className="h-0.5 flex-1 bg-ink-voices opacity-40" aria-hidden />
        </div>
        {saved.length === 0 ? (
          <p className="py-8 text-center font-serif italic text-muted-foreground">
            Nothing saved yet — use the bookmark on any story to read it later.
            The list lives in this browser only.
          </p>
        ) : (
          <ul className="mt-2">
            {saved.map((entry) => {
              const isRead = entry.status === "read"
              const meta = {
                url: entry.url,
                title: entry.title ?? entry.url,
                source: entry.source ?? "",
                briefDate: entry.briefDate,
              }
              return (
                <li
                  key={entry.url}
                  className="flex items-baseline gap-3 border-b border-border py-4"
                >
                  <div className={`min-w-0 flex-1 ${isRead ? "opacity-55" : ""}`}>
                    <a
                      href={entry.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-serif text-lg font-semibold leading-snug hover:underline"
                      {...markReadOnClick(meta)}
                    >
                      {entry.title ?? entry.url}
                    </a>
                    <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                      {entry.source}
                      {entry.briefDate && (
                        <> · from the {formatLongDate(entry.briefDate)} brief</>
                      )}
                    </p>
                  </div>
                  <ItemActions meta={meta} />
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </>
  )
}
