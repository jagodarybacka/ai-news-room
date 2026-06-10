import { BookmarkIcon, CheckIcon, XIcon } from "lucide-react"
import {
  toggleSaved,
  toggleStatus,
  useItemStates,
  type ItemMeta,
} from "@/lib/readState"

const buttonBase =
  "inline-flex h-6 w-6 items-center justify-center rounded-sm transition-colors hover:bg-secondary"

export function ItemActions({ meta }: { meta: ItemMeta }) {
  const states = useItemStates()
  const state = states[meta.url]
  const isRead = state?.status === "read"
  const isDismissed = state?.status === "dismissed"
  const isSaved = state?.savedAt !== undefined

  return (
    <span className="inline-flex items-center gap-0.5">
      <button
        type="button"
        title={isRead ? "Mark as unread" : "Mark as read"}
        aria-pressed={isRead}
        onClick={() => toggleStatus(meta, "read")}
        className={`${buttonBase} ${isRead ? "text-ink-engineering" : "text-muted-foreground/50 hover:text-foreground"}`}
      >
        <CheckIcon className="size-3.5" strokeWidth={isRead ? 3 : 2} />
      </button>
      <button
        type="button"
        title={isSaved ? "Remove from reading list" : "Read later"}
        aria-pressed={isSaved}
        onClick={() => toggleSaved(meta)}
        className={`${buttonBase} ${isSaved ? "text-ink-voices" : "text-muted-foreground/50 hover:text-foreground"}`}
      >
        <BookmarkIcon
          className="size-3.5"
          fill={isSaved ? "currentColor" : "none"}
        />
      </button>
      <button
        type="button"
        title={isDismissed ? "Undo not interested" : "Not interested"}
        aria-pressed={isDismissed}
        onClick={() => toggleStatus(meta, "dismissed")}
        className={`${buttonBase} ${isDismissed ? "text-ink-labs" : "text-muted-foreground/50 hover:text-foreground"}`}
      >
        <XIcon className="size-3.5" strokeWidth={isDismissed ? 3 : 2} />
      </button>
    </span>
  )
}
