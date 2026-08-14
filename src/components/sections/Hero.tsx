"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";
import { memberTerm, site } from "@/data/content";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      id="hero"
      ref={ref}
      className="relative flex min-h-[82svh] items-end overflow-hidden md:min-h-[88svh]"
    >
      <motion.div style={{ y }} className="absolute inset-0">
        <Image
          src={site.heroImage}
          alt={memberTerm.ofSchoolTitle}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brown-dark/92 via-brown-dark/58 to-brown-dark/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-brown-dark via-transparent to-brown-dark/35" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="site-container relative z-10 w-full pb-20 pt-32 md:pb-24 md:pt-36"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <div className="mb-6 flex items-center gap-3.5">
            <Image
              src={site.logo}
              alt={`Logo ${site.name}`}
              width={64}
              height={64}
              className="h-14 w-14 rounded-full object-cover ring-1 ring-gold/45 md:h-16 md:w-16"
              priority
            />
            <p className="type-eyebrow text-gold-soft/90">
              {site.federationLine || "Võ cổ truyền Việt Nam"}
            </p>
          </div>

          <h1 className="type-display-hero text-[clamp(2.4rem,7vw,5rem)] font-semibold text-ivory">
            {site.nameUpper}
          </h1>
          <p className="type-body mt-5 max-w-md text-[0.95rem] text-ivory/78 md:text-base">
            {site.tagline}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/gioi-thieu" className="btn btn-accent">
              Tìm hiểu môn phái
            </Link>
            <Link href="/dia-diem" className="btn btn-ghost text-ivory">
              Tìm địa điểm tập luyện
            </Link>
          </div>
        </motion.div>
      </motion.div>

      <a
        href="#gioi-thieu-ngan"
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1.5 text-ivory/55 transition hover:text-ivory/80"
        aria-label="Cuộn xuống phần giới thiệu"
      >
        <span className="type-eyebrow text-[10px]">Cuộn</span>
        <ChevronDown size={18} />
      </a>
    </section>
  );
}
