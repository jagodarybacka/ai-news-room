import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Masthead } from "@/components/Masthead"
import { fetchIndex, formatLongDate } from "@/lib/data"
import type { BriefIndex } from "@/lib/types"

export function ArchivePage() {
  const [index, setIndex] = useState<BriefIndex | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchIndex()
      .then(setIndex)
      .catch((err: Error) => setError(err.message))
  }, [])

  const dates = index ? [...index.dates].sort().reverse() : []

  return (
    <>
      <Masthead />
      <section className="py-8">
        <h2 className="border-b-2 border-foreground pb-1 text-sm font-bold uppercase tracking-[0.2em]">
          Archive
        </h2>
        {error && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Could not load the archive: {error}
          </p>
        )}
        <ul className="divide-y divide-border">
          {dates.map((date) => (
            <li key={date}>
              <Link
                to={`/brief/${date}`}
                className="block py-3 font-serif text-lg hover:underline"
              >
                {formatLongDate(date)}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
