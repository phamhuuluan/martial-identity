"use client";

import { useMemo, useState } from "react";
import { curriculum } from "@/data/content";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Section";
import { ImageGallery, type GalleryImage } from "@/components/ui/Lightbox";

export function CurriculumTabs() {
  const [tab, setTab] = useState(0);

  const pageImages: GalleryImage[] = useMemo(() => {
    const page = curriculum.pages[tab];
    return page.images.map((src, index) => ({
      src,
      alt: `${page.label} — trang ${index + 1}`,
    }));
  }, [tab]);

  return (
    <section
      id="chuong-trinh"
      className="relative scroll-mt-24 overflow-hidden texture-ink"
    >
      <div className="grain absolute inset-0" aria-hidden />
      <div className="site-container site-section relative">
        <Reveal>
          <SectionHeading
            tone="dark"
            eyebrow="Chương trình huấn luyện"
            title={curriculum.title}
            subtitle={curriculum.subtitle}
            size="lg"
          />
        </Reveal>

        <div
          role="tablist"
          aria-label="Chương trình huấn luyện"
          className="mb-6 flex flex-wrap gap-2"
        >
          {curriculum.pages.map((page, index) => (
            <button
              key={page.label}
              type="button"
              role="tab"
              aria-selected={tab === index}
              className={`chip ${
                tab === index
                  ? "border border-gold/40 bg-gold text-brown-dark"
                  : "border border-ivory/20 text-ivory/75 hover:border-ivory/40"
              }`}
              onClick={() => setTab(index)}
            >
              {page.label}
              <span className="ml-1.5 opacity-60">({page.images.length})</span>
            </button>
          ))}
        </div>

        <div role="tabpanel">
          <p className="mb-4 text-sm text-ivory/45">
            Chọn ảnh để phóng to · mũi tên hoặc vuốt để chuyển trang
          </p>
          <ImageGallery
            key={tab}
            images={pageImages}
            columns="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4"
            aspect="aspect-[3/4]"
            fit="cover"
          />
        </div>

        <p className="mt-8 text-center text-sm text-ivory/45">
          <a
            href={curriculum.pdf}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-ivory/25 underline-offset-4 transition hover:text-gold-soft hover:decoration-gold/50"
          >
            Tải giáo trình PDF (12/2025)
          </a>
        </p>
      </div>
    </section>
  );
}
