import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { sixOaths, martialSpirit } from "@/data/content";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";

export function HomeValues() {
  return (
    <section className="relative overflow-hidden texture-sand">
      <div className="grain absolute inset-0" aria-hidden />
      <div className="site-container site-section relative">
        <Reveal>
          <p className="type-eyebrow text-brown/55">Tinh thần cốt lõi</p>
          <h2 className="h2-section mt-3 max-w-2xl text-brown-deep">
            Sáu lời thề môn sinh
          </h2>
          <p className="type-body measure mt-4 text-[0.95rem] text-brown/70 md:text-base">
            {martialSpirit.paragraphs[0]}
          </p>
          <div className="gold-rule mt-6" />
        </Reveal>

        <Stagger
          className="mt-10 grid gap-8 sm:grid-cols-2 md:grid-cols-3 md:gap-10"
          stagger={0.08}
        >
          {sixOaths.map((oath, i) => (
            <StaggerItem key={oath}>
              <article className="border-t border-brown/15 pt-5">
                <p className="font-display text-2xl text-brown/35">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="type-body mt-3 text-[0.95rem] text-brown-deep/90">
                  {oath}
                </p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.1}>
          <Link
            href="/gioi-thieu#ton-chi"
            className="type-label group mt-10 inline-flex items-center gap-2 text-sm font-semibold text-brown-deep transition hover:text-brown"
          >
            Đọc đầy đủ tôn chỉ và võ đạo
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
