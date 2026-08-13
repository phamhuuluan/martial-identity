"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  logoMeaning,
  martialSpirit,
  philosophy,
  phuongCham,
  sixOaths,
  site,
} from "@/data/content";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";

export function Philosophy({ coverImage }: { coverImage?: string }) {
  const spiritRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: spiritRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <>
      {/* Logo meaning — ceremonial centered */}
      <section
        id="ton-chi"
        className="relative scroll-mt-24 overflow-hidden texture-paper motif-lotus"
      >
        <div className="grain absolute inset-0" aria-hidden />
        <div className="site-container site-section relative text-center">
          <Reveal>
            <p className="type-eyebrow text-brown/50">{logoMeaning.number}</p>
            <h3 className="h2-section mx-auto mt-2 max-w-2xl text-brown-deep">
              {logoMeaning.title}
            </h3>
            <div className="gold-rule mx-auto my-6" />
          </Reveal>

          <Reveal delay={0.08}>
            <div className="relative mx-auto mb-10 max-w-[220px] md:max-w-[260px]">
              <Image
                src={logoMeaning.logo}
                alt={logoMeaning.title}
                width={638}
                height={638}
                className="relative h-auto w-full"
                sizes="(max-width: 768px) 60vw, 260px"
              />
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="mx-auto max-w-2xl space-y-3 text-left text-brown-deep/90 md:text-center">
              {logoMeaning.paragraphs.map((p) => (
                <p key={p.slice(0, 32)} className="type-body text-[0.95rem] md:text-base">
                  {p}
                </p>
              ))}
            </div>
          </Reveal>

          <Stagger
            className="mx-auto mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4"
            stagger={0.05}
          >
            {logoMeaning.qualities.map((q, i) => (
              <StaggerItem key={q}>
                <div className="border-t border-brown/15 px-2 py-4 text-center">
                  <span
                    className="mx-auto mb-2 block h-2.5 w-2.5 rounded-full"
                    style={{ background: logoMeaning.colors[i].hex }}
                    aria-hidden
                  />
                  <span className="block text-sm font-semibold text-brown-deep">
                    {q}
                  </span>
                  <span className="mt-1 block text-[11px] text-brown/50">
                    {logoMeaning.colors[i].name}
                  </span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.15}>
            <p className="type-body mx-auto mt-10 max-w-2xl text-[0.95rem] text-brown-deep/90 md:text-base">
              {logoMeaning.closing}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Two factors — dual cinematic panels */}
      <section
        id="hai-yeu-to"
        className="relative scroll-mt-24 overflow-hidden texture-ink"
      >
        <div className="grain absolute inset-0" aria-hidden />
        <div className="site-container site-section relative">
          <Reveal>
            <p className="type-eyebrow text-gold-soft/70">{philosophy.number}</p>
            <h3 className="h2-section mt-2 max-w-3xl text-ivory">
              {philosophy.title}
            </h3>
            <div className="gold-rule my-6" />
          </Reveal>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {philosophy.factors.map((f, i) => (
              <Reveal key={f.label} delay={i * 0.06}>
                <article className="h-full border border-ivory/10 p-6 md:p-7">
                  <span className="type-eyebrow text-ivory/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h4 className="h3-block mt-3 text-ivory">{f.label}</h4>
                  <p className="type-body mt-3 text-[0.95rem] text-ivory/75">
                    {f.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Phương châm — large typography immersion */}
      <Section id="phuong-cham" sand>
        <Reveal>
          <p className="type-eyebrow text-brown/50">{phuongCham.number}</p>
          <h3 className="h2-section mt-2 max-w-3xl text-brown-deep">
            {phuongCham.title}
          </h3>
          <div className="gold-rule my-6" />
        </Reveal>

        <div className="mx-auto max-w-2xl space-y-5">
          {phuongCham.body.map((p, i) => (
            <Reveal key={p.slice(0, 40)} delay={i * 0.04}>
              <p
                className={`text-brown-deep/90 ${
                  i === 0
                    ? "type-quote text-xl md:text-2xl"
                    : "type-body text-[0.95rem] md:text-base"
                }`}
              >
                {p}
              </p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Six oaths — horizontal scroll journey */}
      <section
        id="sau-loi-the"
        className="relative scroll-mt-24 overflow-hidden texture-dark"
      >
        <div className="grain absolute inset-0" aria-hidden />
        <div className="relative site-section px-5 md:px-8">
          <div className="site-container !px-0">
            <Reveal>
              <SectionHeading
                tone="dark"
                eyebrow="Sáu lời thề"
                title="Sáu lời thề của môn sinh Phật Quang Quyền"
                size="md"
              />
            </Reveal>
          </div>

          <div className="h-scroll no-scrollbar mt-2 pl-5 md:pl-[max(1.25rem,calc((100vw-72rem)/2+2rem))]">
            {sixOaths.map((oath, i) => (
              <article
                key={oath}
                className="relative flex h-[300px] w-[min(72vw,280px)] flex-col justify-between border border-ivory/12 p-5 md:h-[320px] md:w-[300px] md:p-6"
              >
                <span className="type-eyebrow text-gold-soft/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="type-body relative text-[0.95rem] text-ivory/90 md:text-base">
                  {oath}
                </p>
              </article>
            ))}
            <div className="w-6 shrink-0" aria-hidden />
          </div>
        </div>
      </section>

      {/* Martial spirit — full-bleed cinematic */}
      <section
        id="vo-dao"
        ref={spiritRef}
        className="relative min-h-[70svh] scroll-mt-24 overflow-hidden md:min-h-[78svh]"
      >
        <motion.div style={{ y: bgY }} className="absolute inset-[-8%]">
          <Image
            src={coverImage || site.heroFallback}
            alt="Môn sinh Phật Quang Quyền"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-brown-dark via-brown-dark/78 to-brown-dark/35" />

        <div className="relative z-10 flex min-h-[70svh] items-center md:min-h-[78svh]">
          <div className="site-container site-section">
            <Reveal>
              <div className="glass-dark max-w-xl p-7 md:p-9">
                <p className="type-eyebrow text-gold-soft/80">
                  Tinh thần võ đạo
                </p>
                <h3 className="h2-section mt-3 text-ivory">
                  Giá trị đạo đức làm kim chỉ nam
                </h3>
                <div className="gold-rule my-5" />
                <div className="space-y-3 text-ivory/80">
                  {martialSpirit.paragraphs.map((p) => (
                    <p key={p.slice(0, 40)} className="type-body text-[0.95rem]">
                      {p}
                    </p>
                  ))}
                </div>
                {site.motto && (
                  <p className="type-eyebrow mt-6 text-xs text-gold/70">
                    {site.motto}
                  </p>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
