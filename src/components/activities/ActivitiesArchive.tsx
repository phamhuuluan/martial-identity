"use client";

import { useMemo, useState, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "@bprogress/next/app";
import { Search } from "lucide-react";
import {
  NEWS_CATEGORIES,
  NEWS_CATEGORY_LABELS,
  type NewsCategory,
} from "@/domain/news";

export function ActivitiesArchive({
  total,
  page,
  totalPages,
  initialCategory,
  initialQuery,
  children,
}: {
  total: number;
  page: number;
  totalPages: number;
  initialCategory: NewsCategory | "all";
  initialQuery: string;
  children: ReactNode;
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
    const nextPage = next.page ?? 1;

    if (!cat || cat === "all") params.delete("category");
    else params.set("category", cat);

    if (!query.trim()) params.delete("q");
    else params.set("q", query.trim());

    if (nextPage <= 1) params.delete("page");
    else params.set("page", String(nextPage));

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
          onSubmit={(event) => {
            event.preventDefault();
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
              onChange={(event) => setQ(event.target.value)}
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
          {filters.map((filter) => {
            const active = category === filter.key;
            return (
              <button
                key={filter.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => pushParams({ category: filter.key, page: 1 })}
                className={`chip ${active ? "chip-active" : "chip-idle"}`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-5 text-sm text-brown/50" aria-live="polite">
        {total} kết quả
        {category !== "all" ? ` · ${NEWS_CATEGORY_LABELS[category]}` : ""}
        {initialQuery ? ` · “${initialQuery}”` : ""}
      </p>

      {children}

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
