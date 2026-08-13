"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import {
  NEWS_CATEGORY_LABELS,
  type NewsDisplayEvent,
} from "@/domain/news";

function formatDate(iso: string): string {
  if (!iso || iso.startsWith("1970")) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function HomeActivities({
  events,
}: {
  events: NewsDisplayEvent[];
}) {
  if (events.length === 0) return null;

  return (
    <section className="relative overflow-hidden texture-paper">
      <div className="grain absolute inset-0" aria-hidden />
      <div className="site-container site-section relative">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="type-eyebrow text-brown/55">Hoạt động nổi bật</p>
              <h2 className="h2-section mt-3 text-brown-deep">
                Diễn biến gần đây
              </h2>
            </div>
            <Link
              href="/hoat-dong"
              className="type-label group inline-flex items-center gap-2 text-sm font-semibold text-brown-deep transition hover:text-brown"
            >
              Xem tất cả
              <ArrowRight
                size={15}
                className="transition group-hover:translate-x-0.5"
              />
            </Link>
          </div>
          <div className="gold-rule mt-6" />
        </Reveal>

        <Stagger
          className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.06}
        >
          {events.map((event) => {
            const cover = event.images[0];
            return (
              <StaggerItem key={event.id}>
                <Link
                  href={`/hoat-dong/${event.slug}`}
                  className="group block h-full"
                >
                  <article className="archive-item border-b-0">
                    <div className="archive-item-media">
                      <SafeImage
                        src={cover}
                        alt={event.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <div className="pt-4">
                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <span className="type-eyebrow text-brown/50">
                          {NEWS_CATEGORY_LABELS[event.category]}
                        </span>
                        {formatDate(event.publishedAt) ? (
                          <span className="text-brown/45">
                            {formatDate(event.publishedAt)}
                          </span>
                        ) : null}
                      </div>
                      <h3 className="h3-block mt-2 text-brown-deep transition group-hover:text-brown">
                        {event.title}
                      </h3>
                      {event.summary ? (
                        <p className="type-body mt-2 line-clamp-2 text-sm text-brown/65">
                          {event.summary}
                        </p>
                      ) : null}
                    </div>
                  </article>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
