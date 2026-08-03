"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";
import { site, toc } from "@/data/content";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "32%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <section
      id="hero"
      ref={ref}
      className="relative flex min-h-[100svh] items-end overflow-hidden"
    >
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <Image
          src={site.heroImage}
          alt="Môn sinh Phật Quang Quyền"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brown-dark/90 via-brown-dark/55 to-brown-dark/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-brown-dark via-transparent to-brown-dark/40" />
      </motion.div>

      {/* Floating decorative frame */}
      <div
        className="pointer-events-none absolute inset-6 z-[1] hidden border border-gold/20 md:block lg:inset-10"
        aria-hidden
      />

      <motion.div
        style={{ opacity, y: titleY }}
        className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 px-5 pb-24 pt-36 md:grid-cols-[1.2fr_0.8fr] md:px-8 md:pb-28 lg:items-end"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-8 flex items-center gap-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative"
            >
              <span className="absolute -inset-2 animate-pulse rounded-full bg-gold/20 blur-md" />
              <Image
                src={site.logo}
                alt={`Logo ${site.name}`}
                width={80}
                height={80}
                className="relative h-[72px] w-[72px] rounded-full object-cover ring-2 ring-gold/70 md:h-20 md:w-20"
                priority
              />
            </motion.div>
            <p className="type-eyebrow text-xs text-gold-soft md:text-sm">
              {site.federationLine}
            </p>
          </div>

          <h1 className="type-display-hero text-[clamp(2.8rem,9vw,7.5rem)] font-semibold text-ivory">
            {site.nameUpper}
          </h1>
          <p className="type-body mt-7 max-w-lg text-base text-ivory/80 md:text-lg">
            Lịch sử hình thành và phát triển · Tôn chỉ và võ đạo · Hệ thống cấp
            đai và chương trình huấn luyện
          </p>

          <div className="mt-11 flex flex-wrap items-center gap-4">
            <a
              href="#gioi-thieu"
              className="type-label group relative inline-flex items-center justify-center overflow-hidden rounded-sm bg-gold px-8 py-3.5 text-sm font-semibold text-brown-dark"
            >
              <span className="absolute inset-0 translate-y-full bg-gold-soft transition duration-400 group-hover:translate-y-0" />
              <span className="relative">Khám phá môn phái</span>
            </a>
            <a
              href="#lien-he"
              className="type-label inline-flex items-center justify-center rounded-sm border border-ivory/35 px-8 py-3.5 text-sm font-medium text-ivory transition hover:border-gold hover:text-gold-soft"
            >
              Địa điểm tập luyện
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.45, duration: 1 }}
          className="hidden md:block"
        >
          <div className="glass-dark ml-auto max-w-sm rounded-sm p-6">
            <p className="type-eyebrow text-gold-soft">{site.motto}</p>
            <div className="gold-rule my-4 w-16" />
            <ol className="space-y-3">
              {toc.slice(0, 3).map((item, i) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="group flex gap-3 text-sm text-ivory/75 transition hover:text-gold-soft"
                  >
                    <span className="font-display text-gold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="leading-relaxed">{item.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </motion.div>
      </motion.div>

      <a
        href="#gioi-thieu"
        className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-ivory/65 transition hover:text-gold-soft"
        aria-label="Cuộn xuống phần giới thiệu"
      >
        <span className="type-eyebrow text-[10px]">Cuộn</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown size={22} />
        </motion.span>
      </a>

      <nav className="sr-only" aria-label="Mục lục catalogue">
        <h2>MỤC LỤC</h2>
        <ul>
          {toc.map((item) => (
            <li key={item.href}>
              <a href={item.href}>
                {item.title} — trang {item.page}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
