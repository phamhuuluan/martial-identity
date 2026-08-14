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

export default async function HomePage() {
  const featured = toDisplayEvents(getFeaturedNews(6));

  return (
    <SiteShell>
      <Hero />
      <HomeIntro />
      <HomeValues />
      <HomeActivities events={featured} />
      <HomeScale />
      <HomeTraining />
      <HomeExplore />
      <HomeContact />
    </SiteShell>
  );
}
