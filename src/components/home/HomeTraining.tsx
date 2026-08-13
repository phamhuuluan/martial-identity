"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { beltSystem, curriculum } from "@/data/content";
import { Reveal } from "@/components/ui/Reveal";

export function HomeTraining() {
  return (
    <section className="relative overflow-hidden texture-sand">
      <div className="grain absolute inset-0" aria-hidden />
      <div className="site-container site-section relative">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
          <Reveal className="lg:col-span-7">
            <p className="type-eyebrow text-brown/55">Tập luyện</p>
            <h2 className="h2-section mt-3 text-brown-deep">
              Hệ thống đai và chương trình huấn luyện
            </h2>
            <p className="type-body measure mt-4 text-[0.95rem] text-brown/70 md:text-base">
              {beltSystem.note}
            </p>
            <p className="type-body measure mt-3 text-[0.95rem] text-brown/70 md:text-base">
              {curriculum.subtitle}
            </p>
          </Reveal>

          <Reveal className="lg:col-span-5" delay={0.06}>
            <ul className="space-y-3 border-l border-brown/20 pl-5">
              <li className="type-body text-[0.95rem] text-brown-deep/90">
                Hệ thống đẳng cấp: Sơ · Trung · Cao &amp; Thượng đẳng
              </li>
              <li className="type-body text-[0.95rem] text-brown-deep/90">
                Giáo trình: kỹ thuật căn bản, đối luyện, đơn luyện, lý thuyết
              </li>
              <li className="type-body text-[0.95rem] text-brown-deep/90">
                Phương pháp gắn với đạo đức và võ đạo
              </li>
            </ul>
            <Link
              href="/tap-luyen"
              className="type-label group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brown-deep transition hover:text-brown"
            >
              Khám phá chương trình tập luyện
              <ArrowRight
                size={15}
                className="transition group-hover:translate-x-0.5"
              />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
