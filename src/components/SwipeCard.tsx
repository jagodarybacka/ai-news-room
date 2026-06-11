import { useState, useRef } from "react"
import {
  ArrowUpRight,
  Bookmark,
  BookmarkPlus,
  Check,
  X,
} from "lucide-react"
import type { DeckCard } from "@/lib/brainrotDeck"
import { sectionInk } from "@/lib/sections"
import { formatShortDate, formatLongDate } from "@/lib/data"

const THRESHOLD = 110

export function SwipeCard({
  card,
  onSwipe,
  phase,
}: {
  card: DeckCard
  onSwipe: (dir: "left" | "right") => void
  phase: "triage" | "reading"
}) {
  const [dragX, setDragX] = useState(0)
  const [flying, setFlying] = useState<"left" | "right" | null>(null)
  const [snapping, setSnapping] = useState(false)
  const [hoverDir, setHoverDir] = useState<"left" | "right" | null>(null)
  const startX = useRef(0)
  const isDragging = useRef(false)

  const ink = card.sectionId ? sectionInk[card.sectionId] : null
  const rightLabel = phase === "triage" ? "Save" : "Mark read"
  const leftLabel = phase === "triage" ? "Skip" : "Keep"

  function commit(dir: "left" | "right") {
    setFlying(dir)
    setTimeout(() => onSwipe(dir), 320)
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    isDragging.current = true
    startX.current = e.clientX
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!isDragging.current) return
    setDragX(e.clientX - startX.current)
  }

  function handlePointerUp() {
    if (!isDragging.current) return
    isDragging.current = false

    if (Math.abs(dragX) >= THRESHOLD) {
      commit(dragX > 0 ? "right" : "left")
    } else {
      setSnapping(true)
      setDragX(0)
      setTimeout(() => setSnapping(false), 220)
    }
  }

  const progress = Math.min(Math.abs(dragX) / THRESHOLD, 1)
  const showRight = dragX > 24 || hoverDir === "right"
  const showLeft = dragX < -24 || hoverDir === "left"
  const overlayProgress = hoverDir ? 1 : progress

  let transform: string
  let transition: string
  if (flying === "right") {
    transform = "translateX(150vw) rotate(22deg)"
    transition = "transform 0.32s cubic-bezier(0.4,0,1,1)"
  } else if (flying === "left") {
    transform = "translateX(-150vw) rotate(-22deg)"
    transition = "transform 0.32s cubic-bezier(0.4,0,1,1)"
  } else if (snapping) {
    transform = "translateX(0) rotate(0deg)"
    transition = "transform 0.2s ease-out"
  } else {
    transform = `translateX(${dragX}px) rotate(${dragX * 0.04}deg)`
    transition = "none"
  }

  return (
    <div
      className="relative w-full grow sm:grow-0 sm:max-w-sm select-none touch-none"
      style={{ transform, transition }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Depth stack — desktop only */}
      <div
        className="hidden sm:block absolute inset-x-3 -bottom-3 top-3 rounded-2xl border border-border bg-secondary/60 -z-20"
        aria-hidden
      />
      <div
        className="hidden sm:block absolute inset-x-1.5 -bottom-1.5 top-1.5 rounded-2xl border border-border bg-secondary/80 -z-10"
        aria-hidden
      />

      {/* Save overlay */}
      {showRight && (
        <div
          className="pointer-events-none absolute inset-0 z-10 flex items-start justify-start rounded-2xl p-6"
          style={{ opacity: overlayProgress }}
        >
          <span className="flex items-center gap-1.5 rounded-lg border-2 border-emerald-400 bg-emerald-50/95 px-3 py-1.5 text-sm font-bold tracking-wide text-emerald-700 backdrop-blur-sm -rotate-12">
            <BookmarkPlus className="size-4" strokeWidth={2.5} />
            {rightLabel}
          </span>
        </div>
      )}

      {/* Skip overlay */}
      {showLeft && (
        <div
          className="pointer-events-none absolute inset-0 z-10 flex items-start justify-end rounded-2xl p-6"
          style={{ opacity: overlayProgress }}
        >
          <span className="flex items-center gap-1.5 rounded-lg border-2 border-rose-400 bg-rose-50/95 px-3 py-1.5 text-sm font-bold tracking-wide text-rose-700 backdrop-blur-sm rotate-12">
            <X className="size-4" strokeWidth={2.5} />
            {leftLabel}
          </span>
        </div>
      )}

      {/* Card surface */}
      <div className="flex flex-col h-full rounded-none sm:rounded-2xl bg-background sm:border border-border sm:shadow-xl overflow-hidden cursor-grab active:cursor-grabbing">
        {/* Section color bar */}
        <div className={`h-1.5 w-full shrink-0 ${ink ? ink.edge : "bg-border"}`} />

        {/* Content — scrollable so very long summaries don't overflow */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 pt-6 sm:pt-7 pb-4 sm:pb-6">
          {/* Kicker row */}
          <div className="mb-3 flex items-center justify-between gap-3">
            {/* Section or reading-list label */}
            {card.sectionTitle ? (
              <p className={`text-[11px] font-bold uppercase tracking-[0.15em] ${ink ? ink.text : "text-muted-foreground"}`}>
                {card.sectionTitle}
              </p>
            ) : phase === "reading" ? (
              <p className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.15em] text-ink-voices">
                <Bookmark className="size-3" strokeWidth={2.5} />
                Reading List
              </p>
            ) : null}

            {/* Reading-list saved-date badge */}
            {phase === "reading" && card.briefDate && (
              <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
                {formatLongDate(card.briefDate).split(",")[0]}
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="font-serif text-[1.6rem] font-semibold leading-[1.25] tracking-[-0.01em]">
            {card.title}
          </h2>

          {/* Summary */}
          {card.summary ? (
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground sm:line-clamp-4">
              {card.summary}
            </p>
          ) : (
            <div className="mt-4" />
          )}

          {/* Meta */}
          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12px] text-muted-foreground">
            <span className="font-semibold uppercase tracking-wide text-foreground/70">
              {card.source}
            </span>
            {card.type && ink && (
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${ink.pill}`}>
                {card.type}
              </span>
            )}
            {card.publishedAt && (
              <span className="tabular-nums">{formatShortDate(card.publishedAt)}</span>
            )}
            {card.importance && (
              <span className={`ml-auto flex gap-0.5 ${ink ? ink.text : "text-muted-foreground"}`}>
                {Array.from({ length: 3 }, (_, i) => (
                  <span
                    key={i}
                    className={`inline-block h-1.5 w-1.5 rounded-full ${i < card.importance! ? "bg-current" : "bg-current opacity-20"}`}
                  />
                ))}
              </span>
            )}
          </div>
        </div>

        {/* Action row */}
        <div className="shrink-0 border-t border-border bg-secondary/30 px-6 sm:px-8 py-4 sm:py-5 flex items-center justify-between gap-3">
          {/* Dismiss / Skip */}
          <button
            className="group flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-rose-200 text-rose-400 transition-all hover:border-rose-400 hover:bg-rose-50 hover:text-rose-600 active:scale-95 dark:border-rose-900 dark:hover:bg-rose-950/40"
            onClick={(e) => { e.stopPropagation(); commit("left") }}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseEnter={() => setHoverDir("left")}
            onMouseLeave={() => setHoverDir(null)}
            aria-label={leftLabel}
            title={leftLabel}
          >
            <X className="size-5" strokeWidth={2} />
          </button>

          {/* Open */}
          <a
            href={card.url}
            target="_blank"
            rel="noreferrer"
            className="flex h-12 flex-1 items-center justify-center gap-1.5 rounded-full border border-border px-5 text-sm font-medium transition-colors hover:bg-secondary active:scale-[0.98]"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            Open article
            <ArrowUpRight className="size-4 text-muted-foreground" strokeWidth={1.75} />
          </a>

          {/* Save / Read */}
          <button
            className={`group flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 transition-all active:scale-95 ${
              phase === "triage"
                ? "border-emerald-200 text-emerald-500 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-600 dark:border-emerald-900 dark:hover:bg-emerald-950/40"
                : "border-sky-200 text-sky-500 hover:border-sky-400 hover:bg-sky-50 hover:text-sky-600 dark:border-sky-900 dark:hover:bg-sky-950/40"
            }`}
            onClick={(e) => { e.stopPropagation(); commit("right") }}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseEnter={() => setHoverDir("right")}
            onMouseLeave={() => setHoverDir(null)}
            aria-label={rightLabel}
            title={rightLabel}
          >
            {phase === "triage"
              ? <BookmarkPlus className="size-5" strokeWidth={1.75} />
              : <Check className="size-5" strokeWidth={2} />
            }
          </button>
        </div>
      </div>
    </div>
  )
}
