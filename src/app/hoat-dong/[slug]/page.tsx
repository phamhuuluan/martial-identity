import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/SiteShell";
import { ActivityDetail } from "@/components/activities/ActivityDetail";
import {
  getAllNewsSlugs,
  getNewsBySlug,
  getRelatedNews,
  sanitizeImages,
  toDisplayEvents,
} from "@/data/news";
import { NEWS_CATEGORY_LABELS } from "@/domain/news";
import { site } from "@/data/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllNewsSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getNewsBySlug(slug);
  if (!item) {
    return { title: "Không tìm thấy hoạt động" };
  }

  const images = sanitizeImages(item.images);
  const description =
    item.summary ||
    `${NEWS_CATEGORY_LABELS[item.category]} — ${site.name}`;

  return {
    title: item.title,
    description,
    alternates: { canonical: `/hoat-dong/${item.slug}` },
    openGraph: {
      title: item.title,
      description,
      url: `/hoat-dong/${item.slug}`,
      type: "article",
      publishedTime: item.publishedAt,
      images: images.length
        ? [{ url: images[0], alt: item.title }]
        : undefined,
    },
  };
}

export default async function HoatDongDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getNewsBySlug(slug);
  if (!item) notFound();

  const images = sanitizeImages(item.images);
  const related = toDisplayEvents(getRelatedNews(item.slug, 3));

  return (
    <SiteShell>
      <div className="relative min-h-screen overflow-hidden texture-paper">
        <div className="grain absolute inset-0" aria-hidden />
        <div className="relative">
          <ActivityDetail
            title={item.title}
            content={item.content}
            category={item.category}
            publishedAt={item.publishedAt}
            images={images}
            related={related}
          />
        </div>
      </div>
    </SiteShell>
  );
}
