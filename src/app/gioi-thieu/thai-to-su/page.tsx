import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { ThaiToSuBiography } from "@/components/lineage/ThaiToSuBiography";
import { site, thaiToSu } from "@/data/content";
import { thaiToSuLifeMeta } from "@/data/thaiToSuLife";

const title = "Cuộc đời Thái Tổ Sư";
const description = `${thaiToSuLifeMeta.title} (${thaiToSuLifeMeta.pali}) — ${thaiToSuLifeMeta.epithet}. ${thaiToSu.body}`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: thaiToSu.lifeHref },
  openGraph: {
    title: `${title} | ${site.name}`,
    description,
    url: thaiToSu.lifeHref,
    images: [
      {
        url: thaiToSu.image,
        alt: thaiToSuLifeMeta.imageAlt,
      },
    ],
  },
};

export default function ThaiToSuPage() {
  return (
    <SiteShell>
      <ThaiToSuBiography />
    </SiteShell>
  );
}
