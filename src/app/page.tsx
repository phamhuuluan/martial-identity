import { SiteShell } from "@/components/layout/SiteShell";
import { Hero } from "@/components/sections/Hero";
import { HomeIntro } from "@/components/home/HomeIntro";
import { HomeValues } from "@/components/home/HomeValues";
import { HomeActivities } from "@/components/home/HomeActivities";
import { HomeScale } from "@/components/home/HomeScale";
import { HomeTraining } from "@/components/home/HomeTraining";
import { HomeExplore } from "@/components/home/HomeExplore";
import { HomeContact } from "@/components/sections/Contact";
import { getFeaturedNews, toDisplayEvents } from "@/data/news";
import { selectHomepageSectionCovers } from "@/data/sectionCovers";

export default async function HomePage() {
  const featured = toDisplayEvents(getFeaturedNews(6));
  const sectionCovers = await selectHomepageSectionCovers();

  return (
    <SiteShell>
      <Hero />
      <HomeIntro coverImage={sectionCovers["gioi-thieu"]?.src} />
      <HomeValues />
      <HomeActivities events={featured} />
      <HomeScale coverImage={sectionCovers["quy-mo"]?.src} />
      <HomeTraining />
      <HomeExplore />
      <HomeContact />
    </SiteShell>
  );
}
