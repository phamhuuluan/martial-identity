import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { BeltAndCurriculum } from "@/components/sections/BeltAndCurriculum";
import { site } from "@/data/content";

export const metadata: Metadata = {
  title: "Tập luyện",
  description:
    "Hệ thống cấp đai và chương trình huấn luyện Phật Quang Quyền.",
  alternates: { canonical: "/tap-luyen" },
  openGraph: {
    title: `Tập luyện | ${site.name}`,
    description:
      "Hệ thống đẳng cấp, giáo trình và phương pháp rèn luyện Phật Quang Quyền.",
    url: "/tap-luyen",
  },
};

export default function TapLuyenPage() {
  return (
    <SiteShell>
      <BeltAndCurriculum />
    </SiteShell>
  );
}
