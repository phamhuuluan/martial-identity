import Image from "next/image";
import Link from "next/link";
import { memberTerm, site } from "@/data/content";
import { HeroStage } from "@/components/sections/HeroStage";

export function Hero() {
  return (
    <HeroStage image={site.heroImage} imageAlt={memberTerm.ofSchoolTitle}>
      <div className="mb-6 flex items-center gap-3.5">
        <Image
          src={site.logo}
          alt={`Logo ${site.name}`}
          width={64}
          height={64}
          className="h-14 w-14 rounded-full object-cover ring-1 ring-gold/45 md:h-16 md:w-16"
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
    </HeroStage>
  );
}
