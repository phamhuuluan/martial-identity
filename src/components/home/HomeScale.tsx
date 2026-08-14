import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { locationStats, scaleIntro, site } from "@/data/content";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";

const STATS = [
  { label: "Tổng CLB", value: locationStats.total },
  { label: "Miền Nam", value: locationStats.south },
  { label: "Miền Trung", value: locationStats.central },
  { label: "Miền Bắc", value: locationStats.north },
  { label: "Nước ngoài", value: locationStats.overseas },
] as const;

export function HomeScale({ coverImage }: { coverImage?: string }) {
  return (
    <section className="relative overflow-hidden texture-dark">
      <div className="grain absolute inset-0" aria-hidden />
      <div className="absolute inset-0 opacity-25" aria-hidden>
        <Image
          src={coverImage || scaleIntro.image || site.heroFallback}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brown-dark via-brown-dark/90 to-brown-dark/75" />
      </div>

      <div className="site-container site-section relative">
        <Reveal>
          <p className="type-eyebrow text-gold-soft/80">Quy mô hệ thống</p>
          <h2 className="h2-section mt-3 max-w-2xl text-ivory">
            {locationStats.total} CLB trong và ngoài nước
          </h2>
          <p className="type-body measure mt-4 text-[0.95rem] text-ivory/70 md:text-base">
            {scaleIntro.body}
          </p>
          <div className="gold-rule mt-6" />
        </Reveal>

        <Stagger
          className="mt-10 grid grid-cols-2 gap-px bg-ivory/10 md:grid-cols-5"
          stagger={0.04}
        >
          {STATS.map((stat) => (
            <StaggerItem key={stat.label}>
              <div className="bg-brown-dark/40 px-4 py-5 backdrop-blur-[2px]">
                <p className="font-display text-3xl text-gold-soft/90 md:text-[2rem]">
                  {stat.value}
                </p>
                <p className="mt-1.5 text-xs text-ivory/55">{stat.label}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.08}>
          <Link
            href="/dia-diem"
            className="type-label group mt-10 inline-flex items-center gap-2 text-sm font-semibold text-gold-soft/90 transition hover:text-gold-soft"
          >
            Xem hệ thống địa điểm
            <ArrowRight
              size={15}
              className="transition group-hover:translate-x-0.5"
            />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
