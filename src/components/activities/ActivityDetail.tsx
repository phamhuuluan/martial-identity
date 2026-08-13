"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { Lightbox, type GalleryImage } from "@/components/ui/Lightbox";
import { RichText } from "@/components/ui/RichText";
import { ActivityCard } from "@/components/activities/ActivitiesArchive";
import {
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
    month: "long",
    year: "numeric",
  });
}

export function ActivityDetail({
  title,
  content,
  category,
  publishedAt,
  images,
  related = [],
}: {
  title: string;
  content: string;
  category: NewsCategory;
  publishedAt: string;
  images: string[];
  related?: NewsDisplayEvent[];
}) {
  const galleryImages: GalleryImage[] = useMemo(
    () =>
      images.map((src, i) => ({
        src,
        alt: i === 0 ? title : `${title} — hình ${i + 1}`,
      })),
    [images, title]
  );

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const cover = galleryImages[0];

  return (
    <article>
      <div className="site-container pt-28 md:pt-32">
        <Link
          href="/hoat-dong"
          className="type-label inline-flex items-center gap-2 text-sm text-brown/55 transition hover:text-brown-deep"
        >
          <ArrowLeft size={15} />
          Tất cả hoạt động
        </Link>

        <header className="mt-7 max-w-3xl">
          <p className="type-eyebrow text-brown/50">
            {NEWS_CATEGORY_LABELS[category]}
          </p>
          <h1 className="h1-page mt-3 text-brown-deep">{title}</h1>
          {formatDate(publishedAt) ? (
            <time
              dateTime={publishedAt}
              className="mt-4 block text-sm text-brown/45"
            >
              {formatDate(publishedAt)}
            </time>
          ) : null}
          <div className="gold-rule mt-6" />
        </header>
      </div>

      {cover ? (
        <button
          type="button"
          className="group relative mt-8 block w-full overflow-hidden bg-brown-dark/10 md:mt-10"
          onClick={() => setLightboxIndex(0)}
          aria-label={`Xem ảnh ${title}`}
        >
          <div className="relative mx-auto flex min-h-[40vh] max-h-[70vh] w-full items-center justify-center md:min-h-[48vh]">
            <SafeImage
              src={cover.src}
              alt={cover.alt}
              width={1600}
              height={1060}
              className="h-auto max-h-[70vh] w-full object-contain transition duration-500 group-hover:opacity-95"
              sizes="100vw"
              priority
            />
          </div>
        </button>
      ) : null}

      {content.trim() ? (
        <div className="site-container py-10 md:py-14">
          <div className="prose-article">
            <RichText
              content={content}
              hideFacebookUrls
              className="!space-y-5"
            />
          </div>
        </div>
      ) : null}

      {galleryImages.length > 0 ? (
        <section className="border-t border-brown/10">
          <div className="site-container site-section">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="h3-block text-brown-deep">Hình ảnh</h2>
              <p className="text-sm text-brown/45">
                {galleryImages.length} ảnh · bấm để xem lớn
              </p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-2 sm:gap-2.5 md:grid-cols-3 lg:grid-cols-4">
              {galleryImages.map((img, i) => (
                <button
                  key={`${img.src}-${i}`}
                  type="button"
                  className="group relative aspect-[4/3] overflow-hidden bg-brown-dark/8 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  onClick={() => setLightboxIndex(i)}
                  aria-label={`Xem phóng to: ${img.alt}`}
                >
                  <SafeImage
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    loading={i < 4 ? undefined : "lazy"}
                  />
                </button>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className="border-t border-brown/10 texture-sand">
          <div className="site-container site-section">
            <h2 className="h3-block text-brown-deep">Hoạt động liên quan</h2>
            <div className="mt-8 grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((event) => (
                <ActivityCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <Lightbox
        images={galleryImages}
        index={lightboxIndex ?? 0}
        open={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={setLightboxIndex}
      />
    </article>
  );
}
