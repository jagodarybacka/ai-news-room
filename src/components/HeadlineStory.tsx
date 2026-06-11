import { markReadOnClick } from "@/lib/readState";
import type { Headline } from "@/lib/types";

export function HeadlineStory({
  headline,
  briefDate,
}: {
  headline: Headline;
  briefDate?: string;
}) {
  return (
    <section className="flex min-h-[60vh] flex-col justify-center border-b border-foreground/20 pb-12 pt-4 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
        {headline.source}
      </p>
      <a
        href={headline.url}
        target="_blank"
        rel="noreferrer"
        className="group"
        {...markReadOnClick({
          url: headline.url,
          title: headline.title,
          source: headline.source,
          briefDate,
        })}
      >
        <h2 className="mx-auto mt-3 max-w-3xl font-serif text-3xl font-bold leading-tight group-hover:underline sm:text-4xl">
          {headline.title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl font-serif text-lg italic leading-relaxed text-muted-foreground">
          {headline.summary}
        </p>
      </a>
    </section>
  );
}
