"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  galleryFilters,
  galleryItems,
  type GalleryCategory,
} from "@/data/gallery";
import { Reveal } from "@/components/ui/Reveal";
import { Lightbox } from "@/components/ui/Lightbox";

export function Gallery() {
  const [filter, setFilter] = useState<GalleryCategory>("all");
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(
    null
  );

  const items = useMemo(() => {
    if (filter === "all") return galleryItems;
    return galleryItems.filter((g) => g.categories.includes(filter));
  }, [filter]);

  return (
    <section
      id="thu-vien"
      className="relative scroll-mt-24 overflow-hidden texture-ink"
    >
      <div className="grain absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28 lg:px-12">
        <Reveal>
          <p className="type-eyebrow text-gold-soft">
            Thư viện ảnh
          </p>
          <h2 className="type-display mt-4 text-4xl font-semibold text-ivory md:text-6xl lg:text-7xl">
            Thư viện hình ảnh catalogue
          </h2>
          <p className="type-body mt-5 max-w-xl text-ivory/70">
            Toàn bộ {galleryItems.length} hình ảnh trích xuất từ sổ tay giới thiệu.
          </p>
          <div className="gold-rule mt-8 w-28" />
        </Reveal>

        <div
          role="tablist"
          aria-label="Lọc thư viện"
          className="sticky top-20 z-20 -mx-5 mt-10 mb-8 flex gap-2 overflow-x-auto bg-gradient-to-b from-[#0a0705] via-[#0a0705]/95 to-transparent px-5 py-4 backdrop-blur-md no-scrollbar md:-mx-0 md:px-0"
        >
          {galleryFilters.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`shrink-0 rounded-sm px-4 py-2 text-sm transition ${
                filter === f.id
                  ? "bg-gold text-brown-dark"
                  : "border border-ivory/15 text-ivory/75 hover:border-gold hover:text-gold-soft"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <p className="mb-6 text-sm text-ivory/50" aria-live="polite">
          {items.length} hình ảnh
        </p>

        <div className="columns-2 gap-3 md:columns-3 lg:columns-4">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              className="img-zoom group relative mb-3 block w-full break-inside-avoid overflow-hidden"
              style={{ animationDelay: `${(i % 12) * 40}ms` }}
              onClick={() => setLightbox({ src: item.src, alt: item.alt })}
              aria-label={item.alt}
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={800}
                height={600}
                className="h-auto w-full object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
                loading="lazy"
              />
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brown-dark/50 to-transparent opacity-0 transition group-hover:opacity-100" />
            </button>
          ))}
        </div>
      </div>

      <Lightbox
        src={lightbox?.src ?? ""}
        alt={lightbox?.alt ?? ""}
        open={!!lightbox}
        onClose={() => setLightbox(null)}
      />
    </section>
  );
}
