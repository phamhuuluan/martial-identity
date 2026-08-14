"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "@bprogress/next/app";
import { Search } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import {
  NEWS_CATEGORIES,
  NEWS_CATEGORY_LABELS,
  type NewsCategory,
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

function shortExcerpt(summary: string, max = 110): string {
  const t = summary.replace(/\s+/g, " ").trim();
  if (!t) return "";
  if (t.length <= max) return t;
  return `${t.slice(0, max).trim()}…`;
}

export function ActivityCard({ event }: { event: NewsDisplayEvent }) {
  const cover = event.images[0];
  const excerpt = shortExcerpt(event.summary);

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
          {formatDate(event.publishedAt) ? (
            <time
              dateTime={event.publishedAt}
              className="mt-2 block text-xs text-brown/45"
            >
              {formatDate(event.publishedAt)}
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

export function ActivitiesArchive({
  events,
  total,
  page,
  totalPages,
  initialCategory,
  initialQuery,
}: {
  events: NewsDisplayEvent[];
  total: number;
  page: number;
  totalPages: number;
  initialCategory: NewsCategory | "all";
  initialQuery: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(initialQuery);

  const category = initialCategory;

  const pushParams = (next: {
    category?: string;
    q?: string;
    page?: number;
  }) => {
    const params = new URLSearchParams(searchParams.toString());
    const cat = next.category ?? category;
    const query = next.q ?? q;
    const p = next.page ?? 1;

    if (!cat || cat === "all") params.delete("category");
    else params.set("category", cat);

    if (!query.trim()) params.delete("q");
    else params.set("q", query.trim());

    if (p <= 1) params.delete("page");
    else params.set("page", String(p));

    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  const filters = useMemo(
    () =>
      [
        { key: "all" as const, label: "Tất cả" },
        ...NEWS_CATEGORIES.map((key) => ({
          key,
          label: NEWS_CATEGORY_LABELS[key],
        })),
      ] as const,
    []
  );

  return (
    <div>
      <div className="control-panel">
        <form
          className="flex flex-col gap-3 md:flex-row md:items-center"
          onSubmit={(e) => {
            e.preventDefault();
            pushParams({ q, page: 1 });
          }}
        >
          <label className="relative block flex-1">
            <span className="sr-only">Tìm kiếm hoạt động</span>
            <Search
              size={16}
              className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-brown/40"
            />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm theo tiêu đề hoặc nội dung…"
              className="field-input"
            />
          </label>
          <button type="submit" className="btn btn-primary shrink-0">
            Tìm kiếm
          </button>
        </form>

        <div
          role="tablist"
          aria-label="Lọc theo nhóm"
          className="mt-4 flex flex-wrap gap-2 [&>button]:max-w-full [&>button]:text-left [&>button]:whitespace-normal"
        >
          {filters.map((f) => {
            const active = category === f.key;
            return (
              <button
                key={f.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => pushParams({ category: f.key, page: 1 })}
                className={`chip ${active ? "chip-active" : "chip-idle"}`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-5 text-sm text-brown/50" aria-live="polite">
        {total} kết quả
        {category !== "all"
          ? ` · ${NEWS_CATEGORY_LABELS[category]}`
          : ""}
        {initialQuery ? ` · “${initialQuery}”` : ""}
      </p>

      {events.length === 0 ? (
        <p className="type-body mt-14 text-center text-brown/55">
          Không tìm thấy hoạt động phù hợp.
        </p>
      ) : (
        <div className="mt-8 grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {events.map((event) => (
            <ActivityCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {totalPages > 1 ? (
        <nav
          className="mt-12 flex flex-wrap items-center justify-center gap-3"
          aria-label="Phân trang"
        >
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => pushParams({ page: page - 1 })}
            className="btn btn-outline disabled:opacity-40"
          >
            Trước
          </button>
          <span className="text-sm text-brown/55">
            Trang {page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => pushParams({ page: page + 1 })}
            className="btn btn-outline disabled:opacity-40"
          >
            Sau
          </button>
        </nav>
      ) : null}
    </div>
  );
}
