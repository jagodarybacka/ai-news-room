import type { Headline } from "@/lib/types"

export function HeadlineStory({ headline }: { headline: Headline }) {
  return (
    <section className="border-b border-foreground/20 py-8 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
        {headline.source}
      </p>
      <a href={headline.url} target="_blank" rel="noreferrer" className="group">
        <h2 className="mx-auto mt-3 max-w-3xl font-serif text-3xl font-bold leading-tight group-hover:underline sm:text-4xl">
          {headline.title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl font-serif text-lg italic leading-relaxed text-muted-foreground">
          {headline.summary}
        </p>
        {headline.imageUrl && (
          <img
            src={headline.imageUrl}
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.hidden = true
            }}
            className="mx-auto mt-6 max-h-64 border border-border object-cover grayscale"
          />
        )}
      </a>
    </section>
  )
}
