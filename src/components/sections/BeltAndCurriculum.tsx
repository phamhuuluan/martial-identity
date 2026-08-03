"use client";

import { useState } from "react";
import { beltSystem, curriculum } from "@/data/content";
import { ChapterCurtain, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ZoomableImage } from "@/components/ui/Lightbox";

export function BeltAndCurriculum() {
  const [tab, setTab] = useState(0);

  return (
    <>
      <ChapterCurtain
        id="he-thong-dai"
        eyebrow="Chương 04"
        title={beltSystem.sectionTitle}
      />

      {/* Belt — sticky viewer */}
      <section
        id="cap-dai"
        className="relative scroll-mt-24 overflow-hidden texture-sand"
      >
        <div className="grain absolute inset-0" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl lg:grid-cols-12">
          <div className="px-5 py-16 md:px-8 md:py-24 lg:col-span-4 lg:px-10">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <p className="type-eyebrow text-gold">
                  Hệ thống cấp đai
                </p>
                <h3 className="type-display mt-4 text-3xl font-semibold text-brown-deep md:text-4xl">
                  {beltSystem.chartTitle}
                </h3>
                <div className="gold-rule my-6 w-20" />
                <p className="type-body text-brown/75">{beltSystem.note}</p>
                <p className="type-label mt-6 text-xs text-brown/50">
                  Chạm vào bảng để phóng to
                </p>
              </Reveal>
            </div>
          </div>

          <div className="space-y-6 px-5 pb-20 md:px-8 lg:col-span-8 lg:px-6 lg:pb-28">
            <Reveal>
              <div className="overflow-hidden rounded-sm border border-brown/15 bg-ivory shadow-[0_30px_80px_rgba(31,20,14,0.12)]">
                <ZoomableImage
                  src={beltSystem.pageImages[0]}
                  alt={beltSystem.chartTitle}
                  sizes="(max-width: 1280px) 100vw, 800px"
                />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="overflow-hidden rounded-sm border border-brown/10 shadow-lg">
                <ZoomableImage
                  src={beltSystem.pageImages[1]}
                  alt="Chi tiết bảng hệ thống đẳng cấp"
                  sizes="(max-width: 1280px) 100vw, 800px"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Curriculum — immersive studio */}
      <section
        id="chuong-trinh"
        className="relative scroll-mt-24 overflow-hidden texture-ink"
      >
        <div className="grain absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28 lg:px-12">
          <Reveal>
            <SectionHeading
              tone="dark"
              eyebrow="Chương trình huấn luyện"
              title={curriculum.title}
              subtitle="Toàn bộ bảng chương trình huấn luyện được giữ nguyên từ catalogue. Chọn tab và phóng to để đọc từng hàng."
              size="xl"
            />
          </Reveal>

          <div
            role="tablist"
            aria-label="Chương trình huấn luyện"
            className="mb-8 flex flex-wrap gap-2"
          >
            {curriculum.pages.map((p, i) => (
              <button
                key={p.label}
                type="button"
                role="tab"
                aria-selected={tab === i}
                className={`rounded-sm px-5 py-3 text-sm font-medium transition ${
                  tab === i
                    ? "bg-gold text-brown-dark shadow-[0_0_24px_rgba(201,162,39,0.35)]"
                    : "border border-ivory/20 text-ivory/80 hover:border-gold hover:text-gold-soft"
                }`}
                onClick={() => setTab(i)}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div role="tabpanel" className="space-y-6">
            <Reveal key={`page-${tab}`}>
              <div className="overflow-hidden rounded-sm border border-gold/20 bg-black/30 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
                <ZoomableImage
                  src={curriculum.pages[tab].src}
                  alt={curriculum.pages[tab].label}
                  sizes="(max-width: 1280px) 100vw, 1100px"
                />
              </div>
            </Reveal>

            <div className="grid gap-4 md:grid-cols-2">
              {curriculum.pages[tab].extracted.map((src) => (
                <div
                  key={src}
                  className="overflow-hidden rounded-sm border border-ivory/10"
                >
                  <ZoomableImage
                    src={src}
                    alt={`${curriculum.pages[tab].label} — chi tiết`}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
