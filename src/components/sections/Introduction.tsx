"use client";

import Image from "next/image";
import { site, toc } from "@/data/content";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";

export function Introduction() {
  return (
    <section
      id="gioi-thieu"
      className="relative overflow-hidden texture-paper scroll-mt-24"
    >
      <div className="grain absolute inset-0" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl gap-0 lg:grid-cols-12">
        {/* Sticky magazine image */}
        <div className="relative lg:col-span-5 lg:min-h-screen">
          <div className="lg:sticky lg:top-0 lg:h-screen">
            <div className="relative h-[50vh] w-full overflow-hidden lg:h-full">
              <Image
                src={site.heroFallback}
                alt="Môn sinh Phật Quang Quyền"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 42vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brown-dark/70 via-transparent to-brown-dark/20" />
              <div className="absolute right-0 bottom-0 left-0 p-8 md:p-10">
                <p className="type-eyebrow text-gold-soft">{site.motto}</p>
                <p className="type-display mt-3 text-3xl text-ivory md:text-4xl">
                  {site.name}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Editorial TOC */}
        <div className="motif-lotus px-5 py-16 md:px-10 md:py-24 lg:col-span-7 lg:px-14">
          <Reveal>
            <p className="type-eyebrow text-gold">Giới thiệu</p>
            <h2 className="type-display mt-4 text-5xl font-semibold text-brown-deep md:text-7xl">
              MỤC LỤC
            </h2>
            <p className="type-body mt-5 max-w-md text-brown/70">
              Sáu chương nội dung từ sổ tay giới thiệu môn phái Phật Quang Quyền.
            </p>
            <div className="gold-rule mt-8 w-24" />
          </Reveal>

          <Stagger className="mt-12 space-y-0" stagger={0.12}>
            {toc.map((item, i) => (
              <StaggerItem key={item.href}>
                <a
                  href={item.href}
                  className="group relative flex items-start justify-between gap-6 border-b border-brown/10 py-7 transition"
                >
                  <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gold transition duration-500 group-hover:scale-x-100" />
                  <span className="flex min-w-0 gap-5 md:gap-8">
                    <span className="font-display text-4xl leading-none text-gold/80 transition group-hover:text-gold md:text-6xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="pt-1 text-base leading-relaxed font-medium text-brown-deep md:pt-3 md:text-xl">
                      {item.title}
                    </span>
                  </span>
                  <span className="font-display shrink-0 pt-1 text-2xl text-brown/30 transition group-hover:text-gold md:pt-3 md:text-3xl">
                    {item.page}
                  </span>
                </a>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
