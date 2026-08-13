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
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";

function splitLeadershipBody(body: string): { name: string; credential?: string } {
  const parts = body.split(/\s*[-–—]\s*/).map((s) => s.trim()).filter(Boolean);
  if (parts.length <= 1) return { name: body.trim() };
  return { name: parts[0], credential: parts.slice(1).join(" — ") };
}

function LeadershipCard({
  number,
  role,
  body,
  featured = false,
}: {
  number: string;
  role: string;
  body: string;
  featured?: boolean;
}) {
  const { name, credential } = splitLeadershipBody(body);

  return (
    <article
      className={`leadership-card relative overflow-hidden ${
        featured ? "leadership-card-featured" : "leadership-card-secondary"
      }`}
    >
      <div className="leadership-card-accent" aria-hidden />
      <div className="relative flex h-full flex-col p-6 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <p
            className={`type-eyebrow ${
              featured ? "text-gold-soft/75" : "text-gold"
            }`}
          >
            {String(number).padStart(2, "0")}
          </p>
          <span
            className={`leadership-card-mark type-eyebrow ${
              featured ? "text-gold-soft/35" : "text-brown/25"
            }`}
            aria-hidden
          >
            ●
          </span>
        </div>

        <p
          className={`type-eyebrow mt-5 tracking-[0.16em] ${
            featured ? "text-ivory/55" : "text-brown/50"
          }`}
        >
          {role}
        </p>

        <div
          className={`my-4 h-px w-12 ${
            featured ? "bg-gold/55" : "bg-gold/60"
          }`}
          aria-hidden
        />

        <h3
          className={`type-display text-[clamp(1.35rem,2.4vw,1.75rem)] font-semibold leading-snug ${
            featured ? "text-ivory" : "text-brown-deep"
          }`}
        >
          {name}
        </h3>

        {credential ? (
          <p
            className={`type-body mt-3 text-[0.9rem] leading-relaxed md:text-[0.95rem] ${
              featured ? "text-ivory/70" : "text-brown-deep/70"
            }`}
          >
            {credential}
          </p>
        ) : null}
      </div>
    </article>
  );
}

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
      <div className="relative mx-auto grid max-w-[72rem] lg:grid-cols-12">
        <div className="relative lg:col-span-5">
          <div className="lg:sticky lg:top-0 lg:h-[85vh]">
            <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden bg-[#ebe3d4] sm:max-w-lg lg:mx-0 lg:aspect-auto lg:h-full lg:max-w-none">
              <motion.div
                style={{ y: imgY }}
                className="absolute inset-0 lg:inset-[-4%]"
              >
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-contain object-center lg:object-cover"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  priority
                />
              </motion.div>
            </div>
          </div>
        </div>

        <div className="flex items-center px-5 py-10 md:px-8 md:py-16 lg:col-span-7 lg:px-12">
          <Reveal>
            <p className="type-eyebrow text-brown/50">{number}</p>
            <h3 className="h2-section mt-2 text-brown-deep">{title}</h3>
            <div className="gold-rule my-5" />
            <div className="prose-body measure text-brown-deep/90">{body}</div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function History() {
  return (
    <>
      <Section id="lich-su" sand>
        <Reveal>
          <SectionHeading
            eyebrow="Giới thiệu"
            title={organization.sectionTitle}
            size="lg"
          />
        </Reveal>
      </Section>

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
        <div className="site-container site-section relative">
          <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-10">
            <Reveal className="lg:col-span-5 lg:pb-6">
              <p className="type-eyebrow text-brown/50">{sangToSu.number}</p>
              <h3 className="h2-section mt-2 text-brown-deep">
                {sangToSu.title}
              </h3>
              <div className="gold-rule my-5" />
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

            <Reveal delay={0.1} className="relative lg:col-span-7">
              <div className="relative overflow-hidden">
                <div className="img-zoom relative aspect-[4/5] md:aspect-[5/6]">
                  <Image
                    src={sangToSu.image}
                    alt={sangToSu.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                </div>
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
            title="Nhân duyên"
            size="md"
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
              <article className="glass-panel relative ml-10 p-5 md:ml-0 md:mr-8 md:p-6">
                <p className="type-eyebrow text-brown/50">{formation.yearNumber}</p>
                <h3 className="h3-block mt-2 text-brown-deep">
                  {formation.yearTitle}
                </h3>
                <p className="type-body mt-3 text-[0.95rem] text-brown-deep/90">
                  {formation.yearBody}
                </p>
              </article>
              <div className="hidden md:block" />
              <span className="absolute top-7 left-2.5 h-3 w-3 rounded-full border border-brown/30 bg-ivory md:left-1/2 md:-translate-x-1/2" />
            </StaggerItem>

            <StaggerItem className="relative grid gap-6 md:grid-cols-2">
              <div className="hidden md:block" />
              <article className="glass-panel relative ml-10 p-5 md:ml-8 md:p-6">
                <p className="type-eyebrow text-brown/50">
                  {formation.toDinh.number}
                </p>
                <h3 className="h3-block mt-2 text-brown-deep">
                  {formation.toDinh.title}
                </h3>
                <p className="type-body mt-3 text-[0.95rem] text-brown-deep/90">
                  {formation.toDinh.body}
                </p>
              </article>
              <span className="absolute top-7 left-2.5 h-3 w-3 rounded-full border border-brown/30 bg-ivory md:left-1/2 md:-translate-x-1/2" />
            </StaggerItem>

            <StaggerItem className="relative ml-10 md:ml-0 md:px-12">
              <article className="bg-brown-deep px-5 py-7 text-ivory md:px-8 md:py-9">
                <p className="type-eyebrow text-gold-soft/70">
                  {formation.nhanDuyen.number}
                </p>
                <h3 className="h3-block mt-2">{formation.nhanDuyen.title}</h3>
                <ul className="mt-5 space-y-3">
                  {formation.nhanDuyen.bullets.map((b) => (
                    <li
                      key={b.slice(0, 40)}
                      className="type-body text-[0.95rem] text-ivory/80 before:mr-2 before:text-gold/60 before:content-['–']"
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              </article>
              <span className="absolute top-7 left-2.5 h-3 w-3 rounded-full border border-gold/50 bg-gold/80 md:left-1/2 md:-translate-x-1/2" />
            </StaggerItem>

            <StaggerItem className="relative ml-10 md:ml-0 md:px-6">
              <div className="grid gap-4 md:grid-cols-2 md:gap-5">
                <LeadershipCard
                  number={formation.chuongMon.number}
                  role={formation.chuongMon.title}
                  body={formation.chuongMon.body}
                  featured
                />
                <LeadershipCard
                  number={formation.truongBan.number}
                  role={formation.truongBan.title}
                  body={formation.truongBan.body}
                />
              </div>
              <span className="absolute top-7 left-2.5 h-3 w-3 rounded-full border border-brown/30 bg-ivory md:left-1/2 md:-translate-x-1/2" />
            </StaggerItem>
          </Stagger>
        </div>
      </Section>
    </>
  );
}
