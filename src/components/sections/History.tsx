"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  formation,
  organization,
  sangToSu,
  thaiToSu,
} from "@/data/content";
import { ChapterCurtain, Section, SectionHeading } from "@/components/ui/Section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { ZoomableImage } from "@/components/ui/Lightbox";

function StickyPortrait({
  id,
  number,
  title,
  body,
  image,
}: {
  id: string;
  number: string;
  title: string;
  body: ReactNode;
  image: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section
      id={id}
      ref={ref}
      className="relative scroll-mt-24 overflow-hidden texture-paper"
    >
      <div className="grain absolute inset-0" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl lg:grid-cols-12">
        <div className="relative lg:col-span-6">
          <div className="lg:sticky lg:top-0 lg:h-screen">
            {/* Mobile/tablet: portrait frame + contain so the full figure is visible.
                Desktop: sticky cover with gentle parallax. */}
            <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden bg-[#ebe3d4] sm:max-w-lg md:max-w-xl lg:mx-0 lg:aspect-auto lg:h-full lg:max-w-none">
              <motion.div
                style={{ y: imgY }}
                className="absolute inset-0 lg:inset-[-8%]"
              >
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-contain object-center lg:object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-brown-dark/25 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-brown-dark/10" />
            </div>
          </div>
        </div>

        <div className="flex items-center px-5 py-12 md:px-10 md:py-28 lg:col-span-6 lg:px-16">
          <Reveal>
            <p className="font-display text-7xl leading-none text-gold md:text-8xl">{number}</p>
            <h3 className="type-display mt-2 text-3xl font-semibold text-brown-deep md:text-5xl">
              {title}
            </h3>
            <div className="gold-rule my-8 w-20" />
            <div className="prose-catalogue max-w-xl text-brown-deep/90">{body}</div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function History() {
  return (
    <>
      <ChapterCurtain
        id="lich-su"
        eyebrow="Chương 01"
        title={organization.sectionTitle}
      />

      <StickyPortrait
        id="thai-to-su"
        number={thaiToSu.number}
        title={thaiToSu.title}
        image={thaiToSu.image}
        body={<p>{thaiToSu.body}</p>}
      />

      {/* Sáng Tổ Sư — offset magazine */}
      <section
        id="sang-to-su"
        className="relative scroll-mt-24 overflow-hidden texture-sand"
      >
        <div className="grain absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28 lg:px-12">
          <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-8">
            <Reveal className="lg:col-span-5 lg:pb-10">
              <p className="font-display text-7xl leading-none text-gold md:text-8xl">
                {sangToSu.number}
              </p>
              <h3 className="type-display mt-2 text-3xl font-semibold text-brown-deep md:text-5xl">
                {sangToSu.title}
              </h3>
              <div className="gold-rule my-8 w-20" />
              <dl className="space-y-1">
                {sangToSu.fields.map((f) => (
                  <div
                    key={f.label}
                    className="grid grid-cols-[6.5rem_1fr] gap-3 border-b border-brown/10 py-3 md:grid-cols-[8rem_1fr]"
                  >
                    <dt className="type-eyebrow text-xs text-gold">
                      {f.label}
                    </dt>
                    <dd className="text-brown-deep">{f.value}</dd>
                  </div>
                ))}
                <div className="grid grid-cols-[6.5rem_1fr] gap-3 py-3 md:grid-cols-[8rem_1fr]">
                  <dt className="type-eyebrow text-xs text-gold">
                    Chức vụ
                  </dt>
                  <dd>
                    <ul className="space-y-1.5 text-brown-deep">
                      {sangToSu.positions.map((p) => (
                        <li key={p}>+ {p}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
            </Reveal>

            <Reveal delay={0.15} className="relative lg:col-span-7">
              <div className="relative ml-0 overflow-hidden shadow-2xl md:ml-8 lg:-mr-12 lg:ml-0">
                <div className="img-zoom relative aspect-[4/5] md:aspect-[5/6]">
                  <Image
                    src={sangToSu.image}
                    alt={sangToSu.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                </div>
                <div className="pointer-events-none absolute -top-4 -left-4 hidden h-24 w-24 border-t border-l border-gold/50 md:block" />
                <div className="pointer-events-none absolute -right-4 -bottom-4 hidden h-24 w-24 border-r border-b border-gold/50 md:block" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Formation — asymmetric bento / timeline */}
      <Section id="thanh-lap" motif>
        <Reveal>
          <SectionHeading
            eyebrow="Hình thành môn phái"
            title="Nhân duyên và tổ chức"
            size="xl"
          />
        </Reveal>

        <div className="relative">
          {/* Vertical timeline spine */}
          <div
            className="absolute top-0 bottom-0 left-[1.15rem] w-px bg-gradient-to-b from-gold via-gold/40 to-transparent md:left-1/2"
            aria-hidden
          />

          <Stagger className="space-y-10 md:space-y-16" stagger={0.12}>
            {/* Year — left */}
            <StaggerItem className="relative grid gap-6 md:grid-cols-2">
              <article className="glass-panel relative ml-10 rounded-sm p-6 md:ml-0 md:mr-10 md:p-8">
                <p className="font-display text-5xl leading-none text-gold">{formation.yearNumber}</p>
                <h3 className="type-display mt-2 text-2xl font-semibold text-brown-deep md:text-3xl">
                  {formation.yearTitle}
                </h3>
                <p className="type-body mt-4 text-brown-deep/90">
                  {formation.yearBody}
                </p>
              </article>
              <div className="hidden md:block" />
              <span className="absolute top-8 left-2 h-4 w-4 rounded-full border-2 border-gold bg-ivory md:left-1/2 md:-translate-x-1/2" />
            </StaggerItem>

            {/* Tổ Đình — right */}
            <StaggerItem className="relative grid gap-6 md:grid-cols-2">
              <div className="hidden md:block" />
              <article className="glass-panel relative ml-10 rounded-sm p-6 md:ml-10 md:p-8">
                <p className="font-display text-5xl leading-none text-gold">
                  {formation.toDinh.number}
                </p>
                <h3 className="type-display mt-2 text-2xl font-semibold text-brown-deep md:text-3xl">
                  {formation.toDinh.title}
                </h3>
                <p className="type-body mt-4 text-brown-deep/90">
                  {formation.toDinh.body}
                </p>
              </article>
              <span className="absolute top-8 left-2 h-4 w-4 rounded-full border-2 border-gold bg-ivory md:left-1/2 md:-translate-x-1/2" />
            </StaggerItem>

            {/* Nhân duyên — full width feature */}
            <StaggerItem className="relative ml-10 md:ml-0 md:px-16">
              <article className="rounded-sm border border-gold/25 bg-brown-deep px-6 py-8 text-ivory shadow-2xl md:px-12 md:py-12">
                <p className="font-display text-5xl leading-none text-gold-soft">
                  {formation.nhanDuyen.number}
                </p>
                <h3 className="type-display mt-2 text-2xl font-semibold md:text-4xl">
                  {formation.nhanDuyen.title}
                </h3>
                <ul className="mt-6 space-y-5">
                  {formation.nhanDuyen.bullets.map((b) => (
                    <li
                      key={b.slice(0, 40)}
                      className="type-body text-ivory/85 before:mr-2 before:text-gold before:content-['–']"
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              </article>
              <span className="absolute top-8 left-2 h-4 w-4 rounded-full border-2 border-gold bg-gold md:left-1/2 md:-translate-x-1/2" />
            </StaggerItem>

            {/* Leadership pair */}
            <StaggerItem className="relative grid gap-6 md:grid-cols-2 md:gap-10 md:px-8">
              <article className="glass-panel ml-10 rounded-sm p-6 md:ml-0 md:p-8">
                <p className="font-display text-4xl leading-none text-gold">
                  {formation.chuongMon.number}
                </p>
                <h3 className="type-display mt-2 text-xl font-semibold text-brown-deep md:text-2xl">
                  {formation.chuongMon.title}
                </h3>
                <p className="type-body mt-4 text-brown-deep/90">
                  {formation.chuongMon.body}
                </p>
              </article>
              <article className="glass-panel ml-10 rounded-sm p-6 md:ml-0 md:p-8">
                <p className="font-display text-4xl leading-none text-gold">
                  {formation.truongBan.number}
                </p>
                <h3 className="type-display mt-2 text-xl font-semibold text-brown-deep md:text-2xl">
                  {formation.truongBan.title}
                </h3>
                <p className="type-body mt-4 text-brown-deep/90">
                  {formation.truongBan.body}
                </p>
              </article>
            </StaggerItem>
          </Stagger>
        </div>
      </Section>

      {/* Org chart — cinematic dark + floating glass meta */}
      <Section id="to-chuc" dark fullBleed noPad>
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28 lg:px-12">
          <Reveal>
            <SectionHeading
              tone="dark"
              eyebrow="Tổ chức"
              title={organization.title}
              subtitle="Sơ đồ tổ chức nguyên bản từ catalogue — phóng to để xem đầy đủ chi tiết."
              size="xl"
            />
          </Reveal>

          <Reveal>
            <div className="overflow-hidden rounded-sm border border-gold/25 shadow-[0_40px_100px_rgba(0,0,0,0.45)]">
              <ZoomableImage
                src={organization.pageImage}
                alt={organization.title}
                sizes="(max-width: 1280px) 100vw, 1200px"
              />
            </div>
          </Reveal>

          <div className="mt-14 grid gap-4 md:grid-cols-3">
            <div className="glass-dark rounded-sm p-6">
              <h4 className="type-eyebrow mb-5 text-gold-soft">
                Dòng truyền thừa
              </h4>
              <ul className="space-y-4">
                {organization.lineage.map((l, i) => (
                  <li key={l.role} className="flex gap-3">
                    <span className="font-display text-gold">{i + 1}</span>
                    <div>
                      <p className="type-eyebrow text-gold">{l.role}</p>
                      <p className="text-ivory/90">{l.name}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-dark rounded-sm p-6">
              <h4 className="type-eyebrow mb-5 text-gold-soft">
                Các ban
              </h4>
              <ul className="flex flex-wrap gap-2">
                {organization.committees.map((c) => (
                  <li
                    key={c}
                    className="type-label rounded-sm border border-gold/20 px-3 py-1.5 text-xs text-ivory/90"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-dark rounded-sm p-6">
              <h4 className="type-eyebrow mb-5 text-gold-soft">
                Võ đường
              </h4>
              <ul className="space-y-2">
                {organization.dojos.map((d) => (
                  <li
                    key={d}
                    className="border-l border-gold/40 pl-3 text-sm text-ivory/90"
                  >
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
