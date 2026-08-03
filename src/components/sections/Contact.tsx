"use client";

import { MapPin } from "lucide-react";
import { locations, site, toc } from "@/data/content";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";

const contactHighlights = [
  {
    region: "Miền Nam — Tổ đình",
    address:
      "Chùa Thiền Tôn Phật Quang, núi Dinh, thôn Chu Hải, xã Tân Hải, huyện Tân Thành, tỉnh Bà Rịa Vũng Tàu.",
  },
  {
    region: "Miền Nam — Pháp Quang",
    address:
      "Công ty văn hóa Pháp Quang - Số 28 Hoàng Diệu, thành phố Hồ Chí Minh.",
  },
  {
    region: "Miền Trung — Viên Quang",
    address:
      "Chùa Viên Quang Nam Thanh - Xóm 3, xã Nam Thanh, huyện Nam Đàn, tỉnh Nghệ An.",
  },
  {
    region: "Miền Bắc — Thắng Quang",
    address:
      "Lớp võ Hà Nội - Chùa Linh Thông, ngõ 80 Hoàng Ngân, Trung Hòa, Cầu Giấy, Hà Nội.",
  },
  {
    region: "Hàn Quốc",
    address: "Chùa 수원사 — 경기도 수원시 팔달구 수원천로 300",
  },
];

export function Contact() {
  return (
    <section
      id="lien-he"
      className="relative scroll-mt-24 overflow-hidden texture-dark motif-lotus"
    >
      <div className="grain absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="type-eyebrow text-gold-soft">
              Liên hệ
            </p>
            <h2 className="type-display mt-4 text-4xl font-semibold text-ivory md:text-6xl">
              Địa điểm tập luyện
            </h2>
            <div className="gold-rule my-8 w-24" />
            <p className="type-body max-w-md text-ivory/75">
              Mọi địa chỉ trong catalogue đều được liệt kê đầy đủ tại mục Quy mô
              hoạt động. Dưới đây là các điểm tiêu biểu.
            </p>
            <a
              href="#quy-mo"
              className="type-label mt-8 inline-flex items-center gap-2 text-sm text-gold-soft underline-offset-4 transition hover:underline"
            >
              Xem toàn bộ địa điểm tập luyện
            </a>
          </Reveal>

          <Stagger className="grid gap-4 sm:grid-cols-2 lg:col-span-7" stagger={0.08}>
            {contactHighlights.map((c, i) => (
              <StaggerItem
                key={c.region}
                className={i === 0 ? "sm:col-span-2" : ""}
              >
                <article className="lift glass-dark h-full rounded-sm p-6">
                  <p className="type-eyebrow text-gold-soft">
                    {c.region}
                  </p>
                  <p className="type-body mt-4 flex gap-3 text-sm text-ivory/90 md:text-base">
                    <MapPin size={18} className="mt-0.5 shrink-0 text-gold" />
                    {c.address}
                  </p>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#0a0705] px-5 py-16 text-ivory md:px-8 md:py-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 20% 0%, rgba(201,162,39,0.15), transparent 50%)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto grid max-w-7xl gap-12 md:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="type-display text-4xl font-semibold md:text-5xl">
            {site.nameUpper}
          </p>
          <p className="type-eyebrow mt-3 text-sm text-gold-soft">
            {site.federationLine}
          </p>
          <p className="type-body mt-5 max-w-md text-sm text-ivory/65">
            {site.motto}
          </p>
        </div>

        <div>
          <p className="type-eyebrow mb-5 text-gold">
            Mục lục
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {toc.map((t) => (
              <li key={t.href}>
                <a
                  href={t.href}
                  className="text-sm text-ivory/70 transition hover:text-gold-soft"
                >
                  {t.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="sr-only">
        <p>
          Tổng võ đường miền Nam:{" "}
          {locations.south.dojos.reduce((a, d) => a + d.locations.length, 0)} địa
          điểm
        </p>
        <p>
          Tổng võ đường miền Trung:{" "}
          {locations.central.dojos.reduce((a, d) => a + d.locations.length, 0)} địa
          điểm
        </p>
        <p>
          Tổng võ đường miền Bắc:{" "}
          {locations.north.dojos.reduce((a, d) => a + d.locations.length, 0)} địa
          điểm
        </p>
        <p>
          Tổng lớp võ Hàn Quốc:{" "}
          {locations.korea.dojos.reduce((a, d) => a + d.locations.length, 0)} địa
          điểm
        </p>
      </div>

      <div className="gold-rule relative mx-auto mt-14 max-w-7xl" />
      <p className="relative mx-auto mt-6 max-w-7xl text-center text-xs text-ivory/40">
        © {year} {site.name}. Nội dung từ sổ tay giới thiệu 27/02/2023.
      </p>
    </footer>
  );
}
