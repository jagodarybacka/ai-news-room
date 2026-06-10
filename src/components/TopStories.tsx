import { sectionInk } from "@/lib/sections"
import type { TopStory } from "@/lib/topStories"

export function TopStories({ stories }: { stories: TopStory[] }) {
  if (stories.length === 0) return null

  return (
    <section className="border-b border-foreground/20 py-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {stories.map((story, i) => {
          const ink = sectionInk[story.sectionId]
          return (
            <a
              key={story.item.url}
              href={story.item.url}
              target="_blank"
              rel="noreferrer"
              className="group flex gap-3"
            >
              <span
                className={`font-serif text-4xl font-bold leading-none ${ink.text}`}
                aria-hidden
              >
                {i + 1}
              </span>
              <span>
                <span
                  className={`block text-[10px] font-semibold uppercase tracking-[0.2em] ${ink.text}`}
                >
                  {story.sectionTitle}
                </span>
                <span className="mt-1 block font-serif text-base font-semibold leading-snug group-hover:underline">
                  {story.item.title}
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {story.item.source}
                </span>
              </span>
            </a>
          )
        })}
      </div>
    </section>
  )
}
