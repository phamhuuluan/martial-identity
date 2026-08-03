"use client";

import Image from "next/image";
import { useState } from "react";
import { MapPin } from "lucide-react";
import { locations, scaleIntro } from "@/data/content";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";

const regions = [
  { key: "south" as const, data: locations.south },
  { key: "central" as const, data: locations.central },
  { key: "north" as const, data: locations.north },
  { key: "korea" as const, data: locations.korea },
];

export function Locations() {
  const [active, setActive] = useState(0);
  const current = regions[active];

  return (
    <section id="quy-mo" className="relative scroll-mt-24 overflow-hidden texture-paper">
      <div className="grain absolute inset-0" aria-hidden />

      {/* Full-bleed banner image */}
      <div className="relative h-[55vh] min-h-[320px] w-full overflow-hidden clip-diagonal md:h-[65vh]">
        <Image
          src={scaleIntro.image}
          alt="Quy mô hoạt động môn phái"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brown-dark via-brown-dark/50 to-brown-dark/20" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-5 pb-16 md:px-8 md:pb-24 lg:px-12">
            <Reveal>
              <p className="type-eyebrow text-gold-soft">
                Chương 03
              </p>
              <h2 className="type-display mt-4 max-w-4xl text-3xl font-semibold text-ivory md:text-5xl lg:text-6xl">
                {scaleIntro.sectionTitle}
              </h2>
            </Reveal>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24 lg:px-12">
        <Reveal>
          <p className="type-body max-w-3xl text-lg text-brown-deep/90 md:text-xl">
            {scaleIntro.body}
          </p>
        </Reveal>

        {/* Region explorer tabs */}
        <div
          role="tablist"
          aria-label="Khu vực hoạt động"
          className="mt-12 flex gap-2 overflow-x-auto pb-2 no-scrollbar"
        >
          {regions.map((r, i) => (
            <button
              key={r.key}
              type="button"
              role="tab"
              aria-selected={active === i}
              onClick={() => setActive(i)}
              className={`shrink-0 rounded-sm px-5 py-3 text-left text-sm transition ${
                active === i
                  ? "bg-brown-deep text-ivory shadow-lg"
                  : "border border-brown/15 bg-ivory/70 text-brown-deep hover:border-gold"
              }`}
            >
              <span className="block max-w-[220px] leading-relaxed whitespace-normal">
                {r.data.region}
              </span>
            </button>
          ))}
        </div>

        <div role="tabpanel" className="mt-10">
          <Reveal key={current.key}>
            <h3 className="type-display text-2xl font-semibold text-gold md:text-4xl">
              {current.data.region}
            </h3>
          </Reveal>

          <Stagger className="mt-8 space-y-8" stagger={0.1}>
            {current.data.dojos.map((dojo) => (
              <StaggerItem key={dojo.name}>
                <article className="overflow-hidden rounded-sm border border-brown/10 bg-gradient-to-br from-ivory to-beige/60 shadow-[0_20px_50px_rgba(31,20,14,0.08)]">
                  <div className="border-b border-gold/20 bg-brown-deep px-6 py-5 md:px-8">
                    <h4 className="type-display text-xl font-semibold text-ivory md:text-2xl">
                      {dojo.name}
                    </h4>
                    <p className="mt-1 text-sm text-gold-soft/80">
                      Địa điểm tập luyện:
                    </p>
                  </div>
                  <ol className="grid gap-0 md:grid-cols-2">
                    {dojo.locations.map((loc, i) => (
                      <li
                        key={loc}
                        className="flex gap-4 border-b border-brown/8 px-6 py-4 md:border-r md:px-8 odd:md:border-r"
                      >
                        <span className="font-display mt-0.5 text-2xl text-gold">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="type-body text-brown-deep/90">
                          <MapPin
                            size={14}
                            className="mr-1.5 inline text-gold"
                            aria-hidden
                          />
                          {loc}
                        </span>
                      </li>
                    ))}
                  </ol>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
