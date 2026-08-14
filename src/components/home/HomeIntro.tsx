import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formation, memberTerm, site } from "@/data/content";
import { Reveal } from "@/components/ui/Reveal";

export function HomeIntro() {
  const src = site.introImage;

  return (
    <section
      id="gioi-thieu-ngan"
      className="relative scroll-mt-24 overflow-hidden texture-paper"
    >
      <div className="grain absolute inset-0" aria-hidden />
      <div className="site-container site-section relative grid gap-10 md:grid-cols-12 md:gap-12">
        <Reveal className="md:col-span-5">
          <div className="relative aspect-[3/2] overflow-hidden">
            <Image
              src={src}
              alt={`${memberTerm.ofSchoolTitle} biểu diễn tại Tổ Đình`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
        </Reveal>

        <Reveal
          className="flex flex-col justify-center md:col-span-7 md:pl-4 lg:pl-8"
          delay={0.06}
        >
          <p className="type-eyebrow text-brown/55">Giới thiệu</p>
          <h2 className="h2-section mt-3 text-brown-deep">{site.name}</h2>
          <div className="gold-rule my-5" />
          <p className="type-body measure text-[0.95rem] text-brown-deep/85 md:text-base">
            {formation.yearBody}
          </p>
          <p className="type-body measure mt-4 text-[0.95rem] text-brown/70 md:text-base">
            {formation.toDinh.body}
          </p>
          <Link
            href="/gioi-thieu"
            className="type-label group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brown-deep transition hover:text-brown"
          >
            Tìm hiểu thêm về chúng tôi
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
