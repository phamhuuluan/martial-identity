import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { Locations } from "@/components/sections/Locations";
import { locationStats, site } from "@/data/content";

export const metadata: Metadata = {
  title: "Địa điểm",
  description: `Hệ thống ${locationStats.total} CLB / điểm tập Phật Quang Quyền trong và ngoài nước.`,
  alternates: { canonical: "/dia-diem" },
  openGraph: {
    title: `Địa điểm | ${site.name}`,
    description: `Danh sách ${locationStats.total} CLB theo miền Nam, Trung, Bắc và quốc tế.`,
    url: "/dia-diem",
  },
};

export default function DiaDiemPage() {
  return (
    <SiteShell>
      <Locations />
    </SiteShell>
  );
}
