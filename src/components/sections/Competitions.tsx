"use client";

import Image from "next/image";
import { useState } from "react";
import { competitions } from "@/data/content";
import { ChapterCurtain } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Lightbox } from "@/components/ui/Lightbox";

export function Competitions() {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(
    null
  );

  return (
    <>
      <ChapterCurtain
        id="giai-dau"
        eyebrow="Chương 05"
        title={competitions.sectionTitle}
      />

      {/* Editorial intro + overlapping posters */}
      <section className="relative overflow-hidden texture-paper">
        <div className="grain absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28 lg:px-12">
          <div className="grid items-start gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <div className="space-y-6 text-brown-deep/90">
                {competitions.intro.map((p, i) => (
                  <p
                    key={p.slice(0, 48)}
                    className={`${
                      i === 0 ? "type-quote text-xl md:text-2xl" : "type-body text-base md:text-lg"
                    }`}
                  >
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>

            <div className="relative lg:col-span-7">
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                {competitions.posterImages.map((src, i) => (
                  <Reveal key={src} delay={i * 0.12} y={40}>
                    <button
                      type="button"
                      className={`img-zoom lift block w-full overflow-hidden shadow-2xl ${
                        i === 1 ? "mt-10 md:mt-16" : ""
                      }`}
                      onClick={() =>
                        setLightbox({
                          src,
                          alt: `Poster giải đấu ${i + 1}`,
                        })
                      }
                    >
                      <Image
                        src={src}
                        alt={`Poster giải đấu ${i + 1}`}
                        width={1341}
                        height={1557}
                        className="h-auto w-full object-cover"
                        sizes="(max-width: 768px) 50vw, 35vw"
                      />
                    </button>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events — alternating cinematic layouts */}
      {competitions.events.map((event, ei) => {
        const isDark = ei % 2 === 0;
        const isLast = ei === competitions.events.length - 1;
        const heroImg = event.images[0];
        const rest = event.images.slice(1);

        return (
          <section
            key={event.title}
            id={isLast ? "quoc-te" : undefined}
            className={`relative scroll-mt-24 overflow-hidden ${
              isDark ? "texture-dark" : "texture-sand"
            }`}
          >
            <div className="grain absolute inset-0" aria-hidden />

            {/* Full-bleed hero image for event */}
            <button
              type="button"
              className="group relative block h-[50vh] w-full overflow-hidden md:h-[70vh]"
              onClick={() =>
                setLightbox({ src: heroImg, alt: `${event.title} — hình 1` })
              }
              aria-label={`Xem ảnh ${event.title}`}
            >
              <Image
                src={heroImg}
                alt={`${event.title} — hình 1`}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                sizes="100vw"
              />
              <div
                className={`absolute inset-0 ${
                  isDark
                    ? "bg-gradient-to-t from-brown-dark via-brown-dark/40 to-transparent"
                    : "bg-gradient-to-t from-[#1f140e]/80 via-transparent to-transparent"
                }`}
              />
              <div className="absolute inset-x-0 bottom-0 px-5 pb-10 md:px-8 lg:px-12">
                <div className="mx-auto max-w-7xl">
                  <p className="type-eyebrow text-gold-soft">
                    {String(ei + 1).padStart(2, "0")}
                  </p>
                  <h3 className="type-display mt-2 max-w-4xl text-2xl font-semibold text-ivory md:text-4xl lg:text-5xl">
                    {event.title}
                  </h3>
                </div>
              </div>
            </button>

            {rest.length > 0 ? (
              <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14 lg:px-12">
                <div className="h-scroll no-scrollbar">
                  {rest.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      className="img-zoom relative h-56 w-[75vw] overflow-hidden rounded-sm sm:w-[420px] md:h-72"
                      onClick={() =>
                        setLightbox({
                          src,
                          alt: `${event.title} — hình ${i + 2}`,
                        })
                      }
                    >
                      <Image
                        src={src}
                        alt={`${event.title} — hình ${i + 2}`}
                        fill
                        className="object-cover"
                        sizes="420px"
                      />
                    </button>
                  ))}
                  <div className="w-4 shrink-0" aria-hidden />
                </div>
              </div>
            ) : null}
          </section>
        );
      })}

      <Lightbox
        src={lightbox?.src ?? ""}
        alt={lightbox?.alt ?? ""}
        open={!!lightbox}
        onClose={() => setLightbox(null)}
      />
    </>
  );
}
