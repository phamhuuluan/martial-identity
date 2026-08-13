import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { ActivitiesArchive } from "@/components/activities/ActivitiesArchive";
import { PageHeader } from "@/components/ui/PageHeader";
import { queryNewsArchive, toDisplayEvents } from "@/data/news";
import { NEWS_CATEGORIES, type NewsCategory } from "@/domain/news";
import { site } from "@/data/content";

export const metadata: Metadata = {
  title: "Hoạt động",
  description:
    "Giải đấu, thiện nguyện, kính mừng Đại lễ và sinh hoạt môn phái.",
  alternates: { canonical: "/hoat-dong" },
  openGraph: {
    title: `Hoạt động | ${site.name}`,
    description:
      "Archive giải đấu, thiện nguyện, kính mừng Đại lễ và các hoạt động khác của môn phái.",
    url: "/hoat-dong",
  },
};

function parseCategory(raw: string | undefined): NewsCategory | "all" {
  if (!raw || raw === "all") return "all";
  return (NEWS_CATEGORIES as readonly string[]).includes(raw)
    ? (raw as NewsCategory)
    : "all";
}

export default async function HoatDongPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const category = parseCategory(params.category);
  const q = params.q ?? "";
  const page = Math.max(1, Number(params.page) || 1);

  const result = queryNewsArchive({
    category,
    q,
    page,
    pageSize: 500,
    sinceMonths: 6,
    requireImages: true,
  });

  return (
    <SiteShell>
      <PageHeader
        eyebrow="Hoạt động"
        title="Nhật ký môn phái"
        description={
          <p>
            Toàn bộ hoạt động 6 tháng gần nhất, phân nhóm theo nội dung thực tế
            từ Fanpage. Chọn một bài để đọc đầy đủ và xem toàn bộ hình ảnh.
          </p>
        }
      />

      <section className="relative overflow-hidden texture-sand">
        <div className="grain absolute inset-0" aria-hidden />
        <div className="site-container relative py-8 md:py-10">
          <Suspense
            fallback={
              <p className="text-brown/50">Đang tải danh sách hoạt động…</p>
            }
          >
            <ActivitiesArchive
              key={`${category}-${q}-${page}`}
              events={toDisplayEvents(result.items)}
              total={result.total}
              page={result.page}
              totalPages={result.totalPages}
              initialCategory={category}
              initialQuery={q}
            />
          </Suspense>
        </div>
      </section>
    </SiteShell>
  );
}
