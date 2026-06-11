import type { SectionId } from "./types"

// Print-style section flags: each section carries its own ink color, used in
// header rules, kickers, Top 3 numerals, card top-edges, and tag pills.
// Static class names so Tailwind's scanner can see every variant.
export interface SectionInk {
  /** Foreground ink, for headers, kickers, numerals. */
  text: string
  /** Border ink, for header rules and editor's-note bars. */
  border: string
  /** Card top-edge accent (2px). */
  edge: string
  /** Soft tinted pill for the section/type tag on a card. */
  pill: string
}

export const sectionInk: Record<SectionId, SectionInk> = {
  labs: {
    text: "text-ink-labs",
    border: "border-ink-labs",
    edge: "bg-ink-labs",
    pill: "bg-ink-labs/10 text-ink-labs",
  },
  research: {
    text: "text-ink-research",
    border: "border-ink-research",
    edge: "bg-ink-research",
    pill: "bg-ink-research/10 text-ink-research",
  },
  engineering: {
    text: "text-ink-engineering",
    border: "border-ink-engineering",
    edge: "bg-ink-engineering",
    pill: "bg-ink-engineering/10 text-ink-engineering",
  },
  "safety-psych": {
    text: "text-ink-minds",
    border: "border-ink-minds",
    edge: "bg-ink-minds",
    pill: "bg-ink-minds/10 text-ink-minds",
  },
  voices: {
    text: "text-ink-voices",
    border: "border-ink-voices",
    edge: "bg-ink-voices",
    pill: "bg-ink-voices/10 text-ink-voices",
  },
  "lab-blogs": {
    text: "text-ink-wire",
    border: "border-ink-wire",
    edge: "bg-ink-wire",
    pill: "bg-ink-wire/10 text-ink-wire",
  },
}
