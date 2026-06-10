import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Masthead } from "@/components/Masthead"
import { NewsItemRow } from "@/components/NewsItemRow"
import { fetchIndex, fetchWeekly, formatLongDate, formatShortDate } from "@/lib/data"
import type { Weekly } from "@/lib/types"

type State =
  | { status: "loading" }
  | { status: "empty" }
  | { status: "error"; message: string }
  | { status: "ready"; weekly: Weekly }

export function WeeklyPage() {
  const { date } = useParams<{ date: string }>()
  const [state, setState] = useState<State>({ status: "loading" })

  useEffect(() => {
    let cancelled = false
    setState({ status: "loading" })

    const load = async (): Promise<State> => {
      const weeklyDate = date ?? (await fetchIndex()).weekly?.latest
      if (weeklyDate === undefined) return { status: "empty" }
      return { status: "ready", weekly: await fetchWeekly(weeklyDate) }
    }

    load()
      .then((next) => {
        if (!cancelled) setState(next)
      })
      .catch((err: Error) => {
        if (!cancelled) setState({ status: "error", message: err.message })
      })

    return () => {
      cancelled = true
    }
  }, [date])

  if (state.status === "loading") {
    return (
      <>
        <Masthead />
        <p className="py-16 text-center text-sm text-muted-foreground">
          Loading the weekly…
        </p>
      </>
    )
  }

  if (state.status === "empty") {
    return (
      <>
        <Masthead />
        <div className="py-16 text-center">
          <p className="font-serif text-xl">No weekly edition yet.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            The Week in AI appears every Friday.
          </p>
        </div>
      </>
    )
  }

  if (state.status === "error") {
    return (
      <>
        <Masthead />
        <div className="py-16 text-center">
          <p className="font-serif text-xl">No weekly edition found.</p>
          <p className="mt-2 text-sm text-muted-foreground">{state.message}</p>
        </div>
      </>
    )
  }

  const { weekly } = state
  return (
    <>
      <Masthead date={weekly.date} />
      <section className="border-b border-foreground/20 py-8 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
          The Week in AI · {formatShortDate(weekly.weekStart)} –{" "}
          {formatShortDate(weekly.weekEnd)}
        </p>
        <p className="mx-auto mt-4 max-w-2xl font-serif text-lg italic leading-relaxed">
          {weekly.overview}
        </p>
      </section>
      {weekly.themes.map((theme) => (
        <section key={theme.title} className="mt-8">
          <h2 className="border-b-2 border-foreground pb-1 text-sm font-bold uppercase tracking-[0.2em]">
            {theme.title}
          </h2>
          <p className="mt-3 max-w-3xl font-serif text-[17px] leading-relaxed">
            {theme.body}
          </p>
          <ul className="mt-3 space-y-1 text-sm">
            {theme.links.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  {link.title}
                </a>{" "}
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  {link.source}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <section className="mt-10">
        <h2 className="border-b-2 border-foreground pb-1 text-sm font-bold uppercase tracking-[0.2em]">
          Top Reads of the Week
        </h2>
        <div className="divide-y divide-border">
          {weekly.topReads.map((item) => (
            <NewsItemRow key={item.url} item={item} briefDate={weekly.date} />
          ))}
        </div>
      </section>
      <footer className="mt-12 border-t border-foreground/20 py-6 text-center text-xs text-muted-foreground">
        Synthesized by Claude from the week's briefs ·{" "}
        <Link to="/archive" className="hover:text-foreground hover:underline">
          {formatLongDate(weekly.weekStart)} – {formatLongDate(weekly.weekEnd)}
        </Link>
      </footer>
    </>
  )
}
