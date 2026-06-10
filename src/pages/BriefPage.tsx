import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Masthead } from "@/components/Masthead"
import { HeadlineStory } from "@/components/HeadlineStory"
import { SectionBlock } from "@/components/SectionBlock"
import { LabBlogsWire } from "@/components/LabBlogsWire"
import { TopStories } from "@/components/TopStories"
import { pickTopStories } from "@/lib/topStories"
import { fetchBrief, fetchIndex, formatTime } from "@/lib/data"
import type { Brief } from "@/lib/types"

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; brief: Brief }

export function BriefPage() {
  const { date } = useParams<{ date: string }>()
  const [state, setState] = useState<State>({ status: "loading" })

  useEffect(() => {
    let cancelled = false
    setState({ status: "loading" })

    const load = async () => {
      const briefDate = date ?? (await fetchIndex()).latest
      return fetchBrief(briefDate)
    }

    load()
      .then((brief) => {
        if (!cancelled) setState({ status: "ready", brief })
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
          Loading the brief…
        </p>
      </>
    )
  }

  if (state.status === "error") {
    return (
      <>
        <Masthead />
        <div className="py-16 text-center">
          <p className="font-serif text-xl">No brief found.</p>
          <p className="mt-2 text-sm text-muted-foreground">{state.message}</p>
        </div>
      </>
    )
  }

  const { brief } = state
  const labBlogs = brief.sections.find((s) => s.id === "lab-blogs")
  const curated = brief.sections.filter((s) => s.id !== "lab-blogs")
  return (
    <>
      <Masthead date={brief.date} />
      {brief.headline && <HeadlineStory headline={brief.headline} />}
      <TopStories stories={pickTopStories(brief)} />
      {labBlogs && <LabBlogsWire section={labBlogs} />}
      {curated.map((section) => (
        <SectionBlock key={section.id} section={section} />
      ))}
      <footer className="mt-12 border-t border-foreground/20 py-6 text-center text-xs text-muted-foreground">
        Researched and written by Claude · generated at{" "}
        {formatTime(brief.generatedAt)}
      </footer>
    </>
  )
}
