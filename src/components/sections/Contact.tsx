"use client";

import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";

/** Three representative locations — full list lives on /dia-diem. */
const contactHighlights = [
  {
    region: "Tổ Đình",
    address:
      "Chùa Thiền Tôn Phật Quang, núi Dinh, thôn Chu Hải, xã Tân Hải, Hồ Chí Minh",
  },
  {
    region: "Miền Bắc",
    address: "CLB Linh Thông — 68 Hoàng Ngân, phường Thanh Xuân, TP. Hà Nội",
  },
  {
    region: "Miền Trung",
    address:
      "VĐ Viên Quang — Chùa Viên Quang, xóm Thập Thổ, xã Nam Đàn, Nghệ An",
  },
];

/** Compact contact strip for Home hub. */
export function HomeContact() {
  return (
    <section className="relative scroll-mt-24 overflow-hidden texture-dark">
      <div className="grain absolute inset-0" aria-hidden />
      <div className="site-container site-section relative">
        <Reveal className="max-w-xl">
          <p className="type-eyebrow text-ivory/45">Liên hệ</p>
          <h2 className="h2-section mt-3 text-ivory">Bắt đầu từ Tổ Đình</h2>
          <p className="type-body mt-4 text-[0.95rem] text-ivory/65">
            {contactHighlights[0].address}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/lien-he" className="btn btn-accent">
              Thông tin liên hệ
            </Link>
            <Link href="/dia-diem" className="btn btn-ghost text-ivory">
              Xem địa điểm
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section
      id="lien-he"
      className="relative scroll-mt-24 overflow-hidden texture-dark"
    >
      <div className="grain absolute inset-0" aria-hidden />
      <div className="site-container site-section relative pt-28 md:pt-32">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <p className="type-eyebrow text-ivory/45">Liên hệ</p>
            <h1 className="h1-page mt-3 text-ivory">Địa điểm tiêu biểu</h1>
            <p className="type-body mt-5 max-w-sm text-[0.95rem] text-ivory/65">
              Vài điểm tập luyện đại diện. Danh sách đầy đủ nằm tại trang Địa
              điểm.
            </p>
          </Reveal>

          <div className="lg:col-span-7">
            <Stagger className="divide-y divide-ivory/[0.08]" stagger={0.04}>
              {contactHighlights.map((c) => (
                <StaggerItem key={c.region}>
                  <article className="py-5 first:pt-0 last:pb-0">
                    <p className="type-eyebrow text-ivory/40">{c.region}</p>
                    <p className="type-body mt-2 text-sm text-ivory/80 md:text-[0.95rem]">
                      {c.address}
                    </p>
                  </article>
                </StaggerItem>
              ))}
            </Stagger>

            <Link
              href="/dia-diem"
              className="type-label mt-8 inline-flex text-sm text-ivory/70 underline-offset-4 transition hover:text-ivory hover:underline"
            >
              Xem tất cả địa điểm →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
