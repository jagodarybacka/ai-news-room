import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { markRead, toggleSaved, toggleStatus, type ItemMeta } from "./readState"

// Newsreader keys over the brief: j/k move a selection marker through the
// items in reading order, the rest act on the selected item.
//   o / Enter  open link        r  toggle read
//   x          toggle dismiss   s  toggle saved   Esc  clear

const SelectedUrlContext = createContext<string | null>(null)

export function useSelectedUrl(): string | null {
  return useContext(SelectedUrlContext)
}

export function KeyboardNavProvider({
  items,
  children,
}: {
  items: ItemMeta[]
  children: ReactNode
}) {
  const [selected, setSelected] = useState(-1)
  const itemsRef = useRef(items)
  itemsRef.current = items
  const selectedRef = useRef(selected)
  selectedRef.current = selected

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const target = event.target as HTMLElement | null
      if (target?.closest("a, button, input, textarea, select, [contenteditable]")) {
        return
      }

      const all = itemsRef.current
      const item = all[selectedRef.current]
      switch (event.key) {
        case "j":
        case "k": {
          const delta = event.key === "j" ? 1 : -1
          setSelected((prev) =>
            Math.min(Math.max(prev + delta, 0), all.length - 1)
          )
          event.preventDefault()
          break
        }
        case "Escape":
          setSelected(-1)
          break
        case "o":
        case "Enter":
          if (item) {
            window.open(item.url, "_blank", "noopener,noreferrer")
            markRead(item)
          }
          break
        case "r":
          if (item) toggleStatus(item, "read")
          break
        case "x":
          if (item) toggleStatus(item, "dismissed")
          break
        case "s":
          if (item) toggleSaved(item)
          break
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  useEffect(() => {
    const url = itemsRef.current[selected]?.url
    if (url === undefined) return
    document
      .querySelector(`[data-item-url="${CSS.escape(url)}"]`)
      ?.scrollIntoView({ block: "nearest" })
  }, [selected])

  const selectedUrl = items[selected]?.url ?? null
  return (
    <SelectedUrlContext.Provider value={selectedUrl}>
      {children}
    </SelectedUrlContext.Provider>
  )
}
