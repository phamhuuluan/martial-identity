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
import { ChapterCurtain, Section, SectionHeading } from "@/components/ui/Section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";

export function Philosophy() {
  const spiritRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: spiritRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <>
      <ChapterCurtain
        id="ton-chi"
        eyebrow="Chương 02"
        title={logoMeaning.sectionTitle}
      />

      {/* Logo meaning — ceremonial centered */}
      <section
        id="bieu-tuong"
        className="relative scroll-mt-24 overflow-hidden texture-paper motif-lotus"
      >
        <div className="grain absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-5 py-24 text-center md:px-8 md:py-32">
          <Reveal>
            <p className="font-display text-6xl leading-none text-gold md:text-7xl">
              {logoMeaning.number}
            </p>
            <h3 className="type-display mx-auto mt-3 max-w-3xl text-3xl font-semibold text-brown-deep md:text-5xl">
              {logoMeaning.title}
            </h3>
            <div className="gold-rule mx-auto my-10 w-28" />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative mx-auto mb-14 max-w-sm">
              <div className="absolute inset-0 scale-125 rounded-full bg-gold/10 blur-3xl" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                className="pointer-events-none absolute inset-[-12%] rounded-full border border-dashed border-gold/25"
                aria-hidden
              />
              <Image
                src={logoMeaning.logo}
                alt={logoMeaning.title}
                width={638}
                height={638}
                className="relative h-auto w-full drop-shadow-2xl"
                sizes="(max-width: 768px) 80vw, 380px"
              />
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mx-auto max-w-3xl space-y-4 text-left text-brown-deep/90 md:text-center">
              {logoMeaning.paragraphs.map((p) => (
                <p key={p.slice(0, 32)} className="type-body md:text-lg">
                  {p}
                </p>
              ))}
            </div>
          </Reveal>

          <Stagger
            className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4"
            stagger={0.08}
          >
            {logoMeaning.qualities.map((q, i) => (
              <StaggerItem key={q}>
                <div className="lift rounded-sm border border-brown/10 bg-ivory/80 px-3 py-6 text-center backdrop-blur">
                  <span
                    className="mx-auto mb-3 block h-3 w-3 rounded-full shadow-[0_0_16px_currentColor]"
                    style={{
                      background: logoMeaning.colors[i].hex,
                      color: logoMeaning.colors[i].hex,
                    }}
                    aria-hidden
                  />
                  <span className="block text-sm font-semibold text-brown-deep">
                    {q}
                  </span>
                  <span className="mt-1 block text-[11px] text-brown/55">
                    {logoMeaning.colors[i].name}
                  </span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.2}>
            <p className="type-body mx-auto mt-12 max-w-3xl text-brown-deep/90 md:text-lg">
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
        <div className="relative mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28 lg:px-12">
          <Reveal>
            <p className="font-display text-6xl leading-none text-gold-soft md:text-7xl">
              {philosophy.number}
            </p>
            <h3 className="type-display mt-3 max-w-4xl text-3xl font-semibold text-ivory md:text-5xl">
              {philosophy.title}
            </h3>
            <div className="gold-rule my-8 w-24" />
          </Reveal>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {philosophy.factors.map((f, i) => (
              <Reveal key={f.label} delay={i * 0.1} x={i === 0 ? -24 : 24}>
                <article
                  className={`h-full rounded-sm p-7 md:p-10 ${
                    i === 0
                      ? "border border-gold/25 bg-gradient-to-br from-white/10 to-transparent"
                      : "border border-ivory/10 bg-brown-deep/60"
                  }`}
                >
                  <span className="font-display text-5xl text-gold/50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h4 className="type-display mt-4 text-2xl font-semibold text-ivory md:text-3xl">
                    {f.label}
                  </h4>
                  <p className="type-body mt-5 text-ivory/80">{f.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Phương châm — large typography immersion */}
      <Section id="phuong-cham" sand>
        <Reveal>
          <p className="font-display text-6xl leading-none text-gold md:text-7xl">
            {phuongCham.number}
          </p>
          <h3 className="type-display mt-2 max-w-4xl text-4xl font-semibold text-brown-deep md:text-6xl">
            {phuongCham.title}
          </h3>
          <div className="gold-rule my-10 w-24" />
        </Reveal>

        <div className="mx-auto max-w-4xl space-y-8">
          {phuongCham.body.map((p, i) => (
            <Reveal key={p.slice(0, 40)} delay={i * 0.06}>
              <p
                className={`text-brown-deep/90 ${
                  i === 0
                    ? "type-quote text-2xl md:text-3xl"
                    : "type-body text-base md:text-lg"
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
        <div className="relative px-5 py-20 md:px-8 md:py-28 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <SectionHeading
                tone="dark"
                eyebrow="Sáu lời thề"
                title="Sáu lời thề của môn sinh Phật Quang Quyền"
                size="xl"
              />
            </Reveal>
          </div>

          <div className="h-scroll no-scrollbar mt-4 pl-5 md:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]">
            {sixOaths.map((oath, i) => (
              <article
                key={oath}
                className="lift group relative flex h-[420px] w-[min(78vw,340px)] flex-col justify-between overflow-hidden rounded-sm border border-gold/20 bg-gradient-to-b from-white/10 to-black/30 p-7 md:h-[480px] md:w-[380px] md:p-9"
              >
                <div
                  className="pointer-events-none absolute -right-6 -bottom-10 font-display text-[10rem] leading-none text-gold/10 transition group-hover:text-gold/20"
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <span className="font-display text-5xl text-gold-soft">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="type-body relative text-lg text-ivory md:text-xl">
                  {oath}
                </p>
              </article>
            ))}
            <div className="w-8 shrink-0" aria-hidden />
          </div>
        </div>
      </section>

      {/* Martial spirit — full-bleed cinematic */}
      <section
        id="vo-dao"
        ref={spiritRef}
        className="relative min-h-[100svh] scroll-mt-24 overflow-hidden"
      >
        <motion.div style={{ y: bgY }} className="absolute inset-[-10%]">
          <Image
            src={martialSpirit.groupImage}
            alt="Môn sinh Phật Quang Quyền"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-brown-dark via-brown-dark/75 to-brown-dark/30" />

        <div className="relative z-10 flex min-h-[100svh] items-center px-5 py-24 md:px-8 lg:px-12">
          <div className="mx-auto w-full max-w-7xl">
            <Reveal>
              <div className="glass-dark max-w-2xl rounded-sm p-8 md:p-12">
                <p className="type-eyebrow text-gold-soft">
                  Tinh thần võ đạo
                </p>
                <h3 className="type-display mt-4 text-3xl font-semibold text-ivory md:text-5xl">
                  Giá trị đạo đức làm kim chỉ nam
                </h3>
                <div className="gold-rule my-8 w-20" />
                <div className="space-y-5 text-ivory/85">
                  {martialSpirit.paragraphs.map((p) => (
                    <p key={p.slice(0, 40)} className="type-body">
                      {p}
                    </p>
                  ))}
                </div>
                <p className="type-eyebrow mt-8 text-xs text-gold">
                  {site.motto}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
