"use client";

import Image from "next/image";
import { useState } from "react";
import { volunteer, sixOaths } from "@/data/content";
import { ChapterCurtain } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Lightbox } from "@/components/ui/Lightbox";

export function Volunteer() {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(
    null
  );

  return (
    <>
      <ChapterCurtain
        id="thien-nguyen"
        eyebrow="Chương 06"
        title={volunteer.sectionTitle}
      />

      {/* Quote break using 6th oath (existing content) */}
      <section className="relative overflow-hidden texture-ink px-5 py-24 md:py-32">
        <div className="grain absolute inset-0" aria-hidden />
        <Reveal>
          <blockquote className="mx-auto max-w-4xl text-center">
            <p className="type-quote text-3xl text-ivory md:text-5xl">
              “{sixOaths[5]}”
            </p>
            <div className="gold-rule mx-auto mt-10 w-24" />
            <p className="type-body mt-8 text-base text-ivory/75 md:text-lg">
              {volunteer.intro}
            </p>
          </blockquote>
        </Reveal>
      </section>

      {volunteer.activities.map((activity, ai) => {
        const layouts = ["mosaic", "rail", "collage"] as const;
        const layout = layouts[ai % layouts.length];
        const [hero, ...rest] = activity.images;

        return (
          <section
            key={activity.title}
            className={`relative overflow-hidden ${
              ai % 2 === 0 ? "texture-paper" : "texture-sand"
            }`}
          >
            <div className="grain absolute inset-0" aria-hidden />
            <div className="relative mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24 lg:px-12">
              <Reveal>
                <p className="type-eyebrow text-gold">
                  {String(ai + 1).padStart(2, "0")}
                </p>
                <h3 className="type-display mt-3 text-3xl font-semibold text-brown-deep md:text-5xl">
                  {activity.title}
                </h3>
                <div className="gold-rule my-8 w-20" />
              </Reveal>

              {layout === "mosaic" ? (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                  <button
                    type="button"
                    className="img-zoom relative col-span-2 row-span-2 aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-[420px]"
                    onClick={() =>
                      setLightbox({
                        src: hero,
                        alt: `${activity.title} — hình 1`,
                      })
                    }
                  >
                    <Image
                      src={hero}
                      alt={`${activity.title} — hình 1`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </button>
                  {rest.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      className="img-zoom relative aspect-square overflow-hidden"
                      onClick={() =>
                        setLightbox({
                          src,
                          alt: `${activity.title} — hình ${i + 2}`,
                        })
                      }
                    >
                      <Image
                        src={src}
                        alt={`${activity.title} — hình ${i + 2}`}
                        fill
                        className="object-cover"
                        sizes="25vw"
                      />
                    </button>
                  ))}
                </div>
              ) : null}

              {layout === "rail" ? (
                <>
                  <button
                    type="button"
                    className="img-zoom relative mb-4 block h-[45vh] w-full overflow-hidden md:h-[55vh]"
                    onClick={() =>
                      setLightbox({
                        src: hero,
                        alt: `${activity.title} — hình 1`,
                      })
                    }
                  >
                    <Image
                      src={hero}
                      alt={`${activity.title} — hình 1`}
                      fill
                      className="object-cover"
                      sizes="100vw"
                    />
                  </button>
                  <div className="h-scroll no-scrollbar">
                    {rest.map((src, i) => (
                      <button
                        key={src}
                        type="button"
                        className="img-zoom relative h-48 w-[70vw] overflow-hidden sm:w-80 md:h-56"
                        onClick={() =>
                          setLightbox({
                            src,
                            alt: `${activity.title} — hình ${i + 2}`,
                          })
                        }
                      >
                        <Image
                          src={src}
                          alt={`${activity.title} — hình ${i + 2}`}
                          fill
                          className="object-cover"
                          sizes="320px"
                        />
                      </button>
                    ))}
                  </div>
                </>
              ) : null}

              {layout === "collage" ? (
                <div className="columns-2 gap-3 md:columns-3 lg:columns-4">
                  {activity.images.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      className="img-zoom mb-3 block w-full break-inside-avoid overflow-hidden"
                      onClick={() =>
                        setLightbox({
                          src,
                          alt: `${activity.title} — hình ${i + 1}`,
                        })
                      }
                    >
                      <Image
                        src={src}
                        alt={`${activity.title} — hình ${i + 1}`}
                        width={800}
                        height={600}
                        className="h-auto w-full object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
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
