import { useState } from "react"
import { BrainrotMode } from "@/components/BrainrotMode"

export function BrainrotButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-foreground shadow-lg hover:scale-105 active:scale-95 transition-transform text-xl leading-none"
        onClick={() => setOpen(true)}
        aria-label="Open brainrot mode"
        title="Brainrot mode — triage today's articles"
      >
        🧠
      </button>

      {open && <BrainrotMode onClose={() => setOpen(false)} />}
    </>
  )
}
