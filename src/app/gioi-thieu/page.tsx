import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/layout/SiteShell";
import { History } from "@/components/sections/History";
import { Philosophy } from "@/components/sections/Philosophy";
import { PageHeader } from "@/components/ui/PageHeader";
import { site } from "@/data/content";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description:
    "Lịch sử hình thành và phát triển, tôn chỉ võ đạo Phật Quang Quyền.",
  alternates: { canonical: "/gioi-thieu" },
  openGraph: {
    title: `Giới thiệu | ${site.name}`,
    description:
      "Lịch sử, tôn chỉ và võ đạo Phật Quang Quyền.",
    url: "/gioi-thieu",
  },
};

const TOPICS = [
  {
    href: "#lich-su",
    label: "Lịch sử",
    body: "Thái Tổ Sư, Sáng Tổ Sư và nhân duyên hình thành.",
  },
  {
    href: "#ton-chi",
    label: "Tinh thần",
    body: "Biểu tượng, tôn chỉ, phương châm và sáu lời thề.",
  },
] as const;

export default function GioiThieuPage() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Giới thiệu"
        title={site.name}
        description="Hai mạch đọc: lịch sử hình thành và tinh thần võ đạo."
        tone="sand"
      >
        <nav
          aria-label="Chủ đề giới thiệu"
          className="grid gap-0 border-t border-brown/12 sm:grid-cols-2"
        >
          {TOPICS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group border-b border-brown/12 py-5 transition sm:border-r sm:border-b-0 sm:px-5 sm:first:pl-0 sm:last:border-r-0 sm:last:pr-0"
            >
              <p className="h3-block text-brown-deep transition group-hover:text-brown">
                {t.label}
              </p>
              <p className="type-body mt-2 text-sm text-brown/60">{t.body}</p>
            </Link>
          ))}
        </nav>
      </PageHeader>

      <History />
      <Philosophy />
    </SiteShell>
  );
}
