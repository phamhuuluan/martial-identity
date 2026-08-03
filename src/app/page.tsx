import dynamic from "next/dynamic";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { Introduction } from "@/components/sections/Introduction";
import { History } from "@/components/sections/History";
import { Philosophy } from "@/components/sections/Philosophy";
import { Locations } from "@/components/sections/Locations";
import { Contact, Footer } from "@/components/sections/Contact";
import { ScrollProgress, DotNav } from "@/components/ui/Chrome";

const BeltAndCurriculum = dynamic(
  () =>
    import("@/components/sections/BeltAndCurriculum").then(
      (m) => m.BeltAndCurriculum
    ),
  { ssr: true }
);

const Competitions = dynamic(
  () =>
    import("@/components/sections/Competitions").then((m) => m.Competitions),
  { ssr: true }
);

const Volunteer = dynamic(
  () => import("@/components/sections/Volunteer").then((m) => m.Volunteer),
  { ssr: true }
);

const CatalogueArchive = dynamic(
  () =>
    import("@/components/sections/CatalogueArchive").then(
      (m) => m.CatalogueArchive
    ),
  { ssr: true }
);

export default function HomePage() {
  return (
    <>
      <ScrollProgress />
      <Header />
      <DotNav />
      <main>
        <Hero />
        <Introduction />
        <History />
        <Philosophy />
        <Locations />
        <BeltAndCurriculum />
        <Competitions />
        <Volunteer />
        <CatalogueArchive />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
