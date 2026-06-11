import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Masthead } from "@/components/Masthead"
import { NewsItemRow } from "@/components/NewsItemRow"
import { fetchBrief, fetchIndex, formatLongDate } from "@/lib/data"
import { searchBriefs } from "@/lib/search"
import type { Brief, BriefIndex } from "@/lib/types"

export function ArchivePage() {
  const [index, setIndex] = useState<BriefIndex | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [briefs, setBriefs] = useState<Brief[] | null>(null)

  useEffect(() => {
    fetchIndex()
      .then(setIndex)
      .catch((err: Error) => setError(err.message))
  }, [])

  // Briefs are fetched once, lazily, on the first keystroke.
  const searching = query.trim() !== ""
  useEffect(() => {
    if (!searching || briefs !== null || index === null) return
    Promise.all(index.dates.map(fetchBrief))
      .then(setBriefs)
      .catch((err: Error) => setError(err.message))
  }, [searching, briefs, index])

  const dates = index ? [...index.dates].sort().reverse() : []
  const weeklyDates = index?.weekly ? [...index.weekly.dates].sort().reverse() : []
  const results = searching && briefs ? searchBriefs(briefs, query) : []

  return (
    <>
      <Masthead />
      <section className="pt-2 pb-8 sm:pt-6">
        <div className="flex items-baseline gap-3">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em]">
            Archive
          </h2>
          <span className="h-0.5 flex-1 bg-foreground opacity-30" aria-hidden />
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search past briefs…"
          aria-label="Search past briefs"
          className="mt-5 w-full border-b border-foreground/30 bg-transparent py-2 font-serif text-lg placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
        />
        {error && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Could not load the archive: {error}
          </p>
        )}
        {searching ? (
          briefs === null && !error ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Loading briefs…
            </p>
          ) : results.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Nothing in the archive matches “{query.trim()}”.
            </p>
          ) : (
            results.map((group) => (
              <div key={group.date} className="mt-8">
                <Link
                  to={`/brief/${group.date}`}
                  className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground hover:underline"
                >
                  {formatLongDate(group.date)}
                </Link>
                <div className="mt-2 grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((item) => (
                    <NewsItemRow
                      key={item.url}
                      item={item}
                      briefDate={group.date}
                    />
                  ))}
                </div>
              </div>
            ))
          )
        ) : (
          <>
            {weeklyDates.length > 0 && (
              <>
                <h3 className="mt-8 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Weekly editions
                </h3>
                <ul className="mt-1">
                  {weeklyDates.map((date) => (
                    <li key={date} className="border-b border-border">
                      <Link
                        to={`/weekly/${date}`}
                        className="block py-3 font-serif text-lg hover:underline"
                      >
                        The Week in AI · {formatLongDate(date)}
                      </Link>
                    </li>
                  ))}
                </ul>
                <h3 className="mt-8 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Daily briefs
                </h3>
              </>
            )}
            <ul className="mt-1">
              {dates.map((date) => (
                <li key={date} className="border-b border-border">
                  <Link
                    to={`/brief/${date}`}
                    className="block py-3 font-serif text-lg hover:underline"
                  >
                    {formatLongDate(date)}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </>
  )
}
