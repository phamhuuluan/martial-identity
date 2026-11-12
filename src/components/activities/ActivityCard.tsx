import Link from "next/link";
import { SafeImage } from "@/components/ui/SafeImage";
import { NEWS_CATEGORY_LABELS, type NewsDisplayEvent } from "@/domain/news";
import { formatNewsDate } from "@/components/activities/formatDate";

function shortExcerpt(summary: string, max = 110): string {
  const text = summary.replace(/\s+/g, " ").trim();
  if (!text) return "";
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}

export function ActivityCard({ event }: { event: NewsDisplayEvent }) {
  const cover = event.images[0];
  const excerpt = shortExcerpt(event.summary);
  const date = formatNewsDate(event.publishedAt);

  return (
    <Link href={`/hoat-dong/${event.slug}`} className="group block h-full">
      <article className="archive-item border-b-0">
        <div className="archive-item-media">
          {cover ? (
            <SafeImage
              src={cover}
              alt={event.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            />
          ) : null}
        </div>
        <div className="pt-3.5 pb-1">
          <p className="type-eyebrow text-brown/50">
            {NEWS_CATEGORY_LABELS[event.category]}
          </p>
          <h2 className="h3-block mt-1.5 text-brown-deep transition group-hover:text-brown">
            {event.title}
          </h2>
          {date ? (
            <time
              dateTime={event.publishedAt}
              className="mt-2 block text-xs text-brown/45"
            >
              {date}
            </time>
          ) : null}
          {excerpt ? (
            <p className="type-body mt-2 line-clamp-2 text-sm text-brown/60">
              {excerpt}
            </p>
          ) : null}
        </div>
      </article>
    </Link>
  );
}
