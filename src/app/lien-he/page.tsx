import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { Contact } from "@/components/sections/Contact";
import { site } from "@/data/content";

export const metadata: Metadata = {
  title: "Liên hệ",
  description:
    "Địa điểm Tổ Đình, võ đường / CLB đại diện và mạng xã hội chính thức của Phật Quang Quyền.",
  alternates: { canonical: "/lien-he" },
  openGraph: {
    title: `Liên hệ | ${site.name}`,
    description: "Địa điểm và mạng xã hội chính thức — xem đầy đủ tại trang Địa điểm.",
    url: "/lien-he",
  },
};

export default function LienHePage() {
  return (
    <SiteShell>
      <Contact />
    </SiteShell>
  );
}
