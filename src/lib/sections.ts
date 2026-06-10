import type { SectionId } from "./types"

// Print-style section flags: each section carries its own ink color,
// used in rules, kickers, and Top 3 numerals. Static class names so
// Tailwind can see them.
export const sectionInk: Record<SectionId, { text: string; border: string }> = {
  labs: { text: "text-ink-labs", border: "border-ink-labs" },
  research: { text: "text-ink-research", border: "border-ink-research" },
  engineering: { text: "text-ink-engineering", border: "border-ink-engineering" },
  "safety-psych": { text: "text-ink-minds", border: "border-ink-minds" },
  voices: { text: "text-ink-voices", border: "border-ink-voices" },
  "lab-blogs": { text: "text-ink-wire", border: "border-ink-wire" },
}
