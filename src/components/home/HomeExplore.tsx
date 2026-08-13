"use client";

import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";

const LINKS = [
  {
    href: "/gioi-thieu",
    title: "Tìm hiểu về hệ thống",
    body: "Lịch sử, tôn chỉ và võ đạo môn phái.",
  },
  {
    href: "/hoat-dong",
    title: "Xem các hoạt động",
    body: "Giải đấu, thiện nguyện và sinh hoạt môn phái.",
  },
  {
    href: "/dia-diem",
    title: "Tìm địa điểm tập luyện",
    body: "Danh sách CLB theo miền và quốc tế.",
  },
] as const;

export function HomeExplore() {
  return (
    <section className="relative overflow-hidden texture-paper">
      <div className="grain absolute inset-0" aria-hidden />
      <div className="site-container site-section relative">
        <Reveal>
          <p className="type-eyebrow text-brown/55">Khám phá tiếp</p>
          <h2 className="h2-section mt-3 text-brown-deep">
            Đi sâu vào từng phần
          </h2>
          <div className="gold-rule mt-6" />
        </Reveal>

        <Stagger
          className="mt-10 grid gap-0 border-t border-brown/12 md:grid-cols-3"
          stagger={0.06}
        >
          {LINKS.map((item) => (
            <StaggerItem key={item.href}>
              <Link
                href={item.href}
                className="group flex h-full flex-col border-b border-brown/12 px-0 py-7 transition md:border-r md:border-b-0 md:px-6 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
              >
                <h3 className="h3-block text-brown-deep transition group-hover:text-brown">
                  {item.title}
                </h3>
                <p className="type-body mt-3 flex-1 text-sm text-brown/65">
                  {item.body}
                </p>
                <span className="type-label mt-6 text-xs text-brown/45 transition group-hover:text-brown">
                  Xem thêm →
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
