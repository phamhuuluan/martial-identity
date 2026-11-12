import { beltSystem } from "@/data/content";
import { SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ZoomableImage } from "@/components/ui/Lightbox";
import { CurriculumTabs } from "@/components/sections/CurriculumTabs";

export function BeltAndCurriculum() {
  return (
    <>
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

      <CurriculumTabs />
    </>
  );
}
