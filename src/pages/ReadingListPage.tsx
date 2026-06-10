import { Masthead } from "@/components/Masthead"
import { ItemActions } from "@/components/ItemActions"
import { savedItems, useItemStates } from "@/lib/readState"
import { formatLongDate } from "@/lib/data"

export function ReadingListPage() {
  const states = useItemStates()
  const saved = savedItems(states)

  return (
    <>
      <Masthead />
      <section className="py-8">
        <h2 className="border-b-2 border-ink-voices pb-1 text-sm font-bold uppercase tracking-[0.2em] text-ink-voices">
          Reading List
        </h2>
        {saved.length === 0 ? (
          <p className="py-8 text-center font-serif italic text-muted-foreground">
            Nothing saved yet — use the bookmark on any story to read it later.
            The list lives in this browser only.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {saved.map((entry) => {
              const isRead = entry.status === "read"
              return (
                <li key={entry.url} className="flex items-baseline gap-3 py-3">
                  <div className={`min-w-0 flex-1 ${isRead ? "opacity-55" : ""}`}>
                    <a
                      href={entry.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-serif text-lg font-semibold leading-snug hover:underline"
                    >
                      {entry.title ?? entry.url}
                    </a>
                    <p className="mt-0.5 text-xs uppercase tracking-wide text-muted-foreground">
                      {entry.source}
                      {entry.briefDate && (
                        <> · from the {formatLongDate(entry.briefDate)} brief</>
                      )}
                    </p>
                  </div>
                  <ItemActions
                    meta={{
                      url: entry.url,
                      title: entry.title ?? entry.url,
                      source: entry.source ?? "",
                      briefDate: entry.briefDate,
                    }}
                  />
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </>
  )
}
