import { useEffect, useRef, useState, useCallback } from "react"
import { CheckCircle2, X } from "lucide-react"
import { fetchBrief, fetchIndex } from "@/lib/data"
import {
  buildTodayDeck,
  buildReadingDeck,
  enrichReadingDeck,
  metaOf,
  type DeckCard,
} from "@/lib/brainrotDeck"
import {
  finishSaved,
  getItemStates,
  toggleSaved,
  toggleStatus,
  useItemStates,
} from "@/lib/readState"
import { SwipeCard } from "@/components/SwipeCard"

type Phase = "triage" | "reading"
type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; phase: Phase; deck: DeckCard[]; index: number }
  | { status: "triage-done"; readingDeck: DeckCard[] }
  | { status: "done" }

export function BrainrotMode({ onClose }: { onClose: () => void }) {
  const allStates = useItemStates()
  const initialStates = useRef(allStates)
  const [load, setLoad] = useState<LoadState>({ status: "loading" })
  const loadRef = useRef(load)
  loadRef.current = load

  // Scroll lock
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = prev }
  }, [])

  // Fetch brief and build initial deck using state snapshot at open time
  useEffect(() => {
    let cancelled = false
    async function init() {
      const { latest } = await fetchIndex()
      const brief = await fetchBrief(latest)
      if (cancelled) return
      const snapshot = initialStates.current
      const todayDeck = buildTodayDeck(brief, snapshot)
      if (todayDeck.length > 0) {
        setLoad({ status: "ready", phase: "triage", deck: todayDeck, index: 0 })
        return
      }
      const readingDeck = await enrichReadingDeck(buildReadingDeck(snapshot))
      if (readingDeck.length > 0) {
        setLoad({ status: "ready", phase: "reading", deck: readingDeck, index: 0 })
        return
      }
      setLoad({ status: "done" })
    }
    init().catch((err: Error) => {
      if (!cancelled) setLoad({ status: "error", message: err.message })
    })
    return () => { cancelled = true }
  }, [])

  // Stable reference — reads current load via ref, side effects outside setState.
  const handleSwipe = useCallback((dir: "left" | "right") => {
    const current = loadRef.current
    if (current.status !== "ready") return
    const { phase, deck, index } = current
    const card = deck[index]
    if (!card) return
    const meta = metaOf(card)

    // Write side effects first (synchronous store writes)
    if (phase === "triage") {
      if (dir === "right") toggleSaved(meta)
      else toggleStatus(meta, "dismissed")
    } else {
      if (dir === "right") finishSaved(meta)
      // left: keep saved, advance only
    }

    const nextIndex = index + 1
    if (nextIndex < deck.length) {
      setLoad({ status: "ready", phase, deck, index: nextIndex })
      return
    }

    // Current phase exhausted — read updated store directly (side effects already ran)
    if (phase === "triage") {
      const readingDeck = buildReadingDeck(getItemStates())
      setLoad({ status: "triage-done", readingDeck })
      return
    }

    setLoad({ status: "done" })
  }, []) // stable — state access via loadRef

  function startReadingPhase(readingDeck: DeckCard[]) {
    if (readingDeck.length === 0) { setLoad({ status: "done" }); return }
    // Show cards immediately, then silently swap in enriched data
    setLoad({ status: "ready", phase: "reading", deck: readingDeck, index: 0 })
    enrichReadingDeck(readingDeck).then((enriched) => {
      setLoad((prev) =>
        prev.status === "ready" && prev.phase === "reading"
          ? { ...prev, deck: enriched }
          : prev
      )
    }).catch(() => {/* leave unenriched cards as-is */})
  }

  // Keyboard capture (intercepts before KeyboardNavProvider)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault(); e.stopPropagation()
        onClose()
        return
      }
      const current = loadRef.current
      if (current.status === "triage-done") {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault(); e.stopPropagation()
          startReadingPhase(current.readingDeck)
        }
        return
      }
      if (current.status !== "ready") return
      if (e.key === "ArrowRight" || e.key === "l") {
        e.preventDefault(); e.stopPropagation()
        handleSwipe("right")
      } else if (e.key === "ArrowLeft" || e.key === "h") {
        e.preventDefault(); e.stopPropagation()
        handleSwipe("left")
      } else if (e.key === "o" || e.key === "ArrowUp") {
        e.preventDefault(); e.stopPropagation()
        const card = current.deck[current.index]
        if (card) window.open(card.url, "_blank", "noreferrer")
      }
    }

    window.addEventListener("keydown", onKey, { capture: true })
    return () => window.removeEventListener("keydown", onKey, { capture: true })
  }, [onClose, handleSwipe]) // eslint-disable-line react-hooks/exhaustive-deps

  const currentCard =
    load.status === "ready" ? load.deck[load.index] : undefined

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-background/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Brainrot mode"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-3 shrink-0">
        <div className="flex items-baseline gap-3">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            {load.status === "ready" && load.phase === "reading"
              ? "Reading List"
              : "Today's Brief"}
          </span>
          {load.status === "ready" && (
            <span className="text-xs tabular-nums text-muted-foreground">
              {load.index + 1} / {load.deck.length}
            </span>
          )}
        </div>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          onClick={onClose}
          aria-label="Close brainrot mode"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden sm:items-center sm:justify-center sm:p-6">
        {load.status === "loading" && (
          <p className="m-auto font-serif italic text-muted-foreground animate-pulse">
            Loading today's brief…
          </p>
        )}

        {load.status === "error" && (
          <div className="m-auto text-center">
            <p className="font-serif text-muted-foreground">
              Couldn't load the brief.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{load.message}</p>
          </div>
        )}

        {load.status === "triage-done" && (
          <div className="m-auto text-center max-w-xs px-6">
            <CheckCircle2 className="size-14 text-emerald-500 mx-auto mb-5" strokeWidth={1.5} />
            <h2 className="font-serif text-2xl font-semibold">
              You're all caught up
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              You've browsed through today's brief.
            </p>
            {load.readingDeck.length > 0 ? (
              <>
                <p className="mt-1 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {load.readingDeck.length}
                  </span>{" "}
                  {load.readingDeck.length === 1 ? "article" : "articles"} waiting in your reading list.
                </p>
                <button
                  className="mt-6 flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80 mx-auto"
                  onClick={() => startReadingPhase(load.readingDeck)}
                >
                  Go to reading list
                  <span className="opacity-60">→</span>
                </button>
                <button
                  className="mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={onClose}
                >
                  Close
                </button>
              </>
            ) : (
              <button
                className="mt-6 rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:bg-secondary transition-colors"
                onClick={onClose}
              >
                Close
              </button>
            )}
          </div>
        )}

        {load.status === "done" && (
          <div className="m-auto text-center">
            <p className="font-serif text-2xl font-semibold">All done.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Nothing left to read.
            </p>
            <button
              className="mt-6 rounded-full border border-border px-5 py-2 text-sm font-medium hover:bg-secondary transition-colors"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        )}

        {load.status === "ready" && currentCard && (
          <SwipeCard
            key={currentCard.url}
            card={currentCard}
            onSwipe={handleSwipe}
            phase={load.phase}
          />
        )}
      </div>

      {/* Footer hint */}
      {load.status === "ready" && (
        <div className="border-t border-border px-5 py-2.5 shrink-0">
          <p className="text-center text-[11px] text-muted-foreground">
            ← / → to swipe · ↑ or O to open · Esc to close
          </p>
        </div>
      )}
      {load.status === "triage-done" && load.readingDeck.length > 0 && (
        <div className="border-t border-border px-5 py-2.5 shrink-0">
          <p className="text-center text-[11px] text-muted-foreground">
            Enter to continue · Esc to close
          </p>
        </div>
      )}
    </div>
  )
}

