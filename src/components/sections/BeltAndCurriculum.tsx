"use client";

import { useMemo, useState } from "react";
import { beltSystem, curriculum } from "@/data/content";
import { ChapterCurtain, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import {
  ImageGallery,
  ZoomableImage,
  type GalleryImage,
} from "@/components/ui/Lightbox";

export function BeltAndCurriculum({
  showCurtain = false,
}: {
  showCurtain?: boolean;
}) {
  const [tab, setTab] = useState(0);

  const pageImages: GalleryImage[] = useMemo(() => {
    const page = curriculum.pages[tab];
    return page.images.map((src, i) => ({
      src,
      alt: `${page.label} — trang ${i + 1}`,
    }));
  }, [tab]);

  return (
    <>
      {showCurtain ? (
        <ChapterCurtain
          id="he-thong-dai"
          eyebrow="Tập luyện"
          title={beltSystem.sectionTitle}
        />
      ) : (
        <section
          id="he-thong-dai"
          className="relative scroll-mt-24 overflow-hidden texture-paper"
        >
          <div className="grain absolute inset-0" aria-hidden />
          <div className="site-container site-section relative pt-28 md:pt-32">
            <Reveal>
              <SectionHeading
                eyebrow="Tập luyện"
                title={beltSystem.sectionTitle}
                subtitle="Hệ thống đẳng cấp và giáo trình — xem bảng đai, rồi duyệt giáo trình theo nhóm."
                size="xl"
              />
            </Reveal>
          </div>
        </section>
      )}

      <section
        id="cap-dai"
        className="relative scroll-mt-24 overflow-hidden texture-sand"
      >
        <div className="grain absolute inset-0" aria-hidden />
        <div className="site-container relative grid lg:grid-cols-12 lg:gap-10">
          <div className="site-section lg:col-span-4 lg:py-16">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <p className="type-eyebrow text-brown/55">Hệ thống cấp đai</p>
                <h2 className="h3-block mt-3 text-brown-deep">
                  {beltSystem.chartTitle}
                </h2>
                <div className="gold-rule my-5" />
                <p className="type-body text-[0.95rem] text-brown/70">
                  {beltSystem.note}
                </p>
                <p className="type-label mt-5 text-xs text-brown/45">
                  Chạm vào bảng để phóng to
                </p>
              </Reveal>
            </div>
          </div>

          <div className="space-y-5 pb-12 md:pb-16 lg:col-span-8 lg:pt-16">
            {beltSystem.charts.map((chart, i) => (
              <Reveal key={chart.src} delay={i * 0.05}>
                <div>
                  <p className="type-label mb-2 text-xs text-brown/50">
                    {chart.label}
                  </p>
                  <div className="overflow-hidden border border-brown/10 bg-ivory">
                    <ZoomableImage
                      src={chart.src}
                      alt={`${beltSystem.chartTitle} — ${chart.label}`}
                      sizes="(max-width: 1280px) 100vw, 720px"
                      fit="contain"
                    />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

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
            {curriculum.pages.map((p, i) => (
              <button
                key={p.label}
                type="button"
                role="tab"
                aria-selected={tab === i}
                className={`chip ${
                  tab === i
                    ? "border border-gold/40 bg-gold text-brown-dark"
                    : "border border-ivory/20 text-ivory/75 hover:border-ivory/40"
                }`}
                onClick={() => setTab(i)}
              >
                {p.label}
                <span className="ml-1.5 opacity-60">({p.images.length})</span>
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
    </>
  );
}
