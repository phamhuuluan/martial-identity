import { notFound } from "next/navigation";
import AdminHome from "../view";
import LocationsAdmin from "../dia-diem/view";
import SyncAdmin from "../dong-bo/view";
import IntroAdmin from "../gioi-thieu/view";
import NewsAdmin from "../hoat-dong/view";
import NewNews from "../hoat-dong/moi/view";
import EditNews from "../hoat-dong/sua/view";
import ContactAdmin from "../lien-he/view";
import TrainingAdmin from "../tap-luyen/view";
import ThaiToSuAdmin from "../thai-to-su/view";
import PhilosophyAdmin from "../ton-chi/view";
import SiteAdmin from "../trang/view";

export default async function AdminPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ q?: string; page?: string; path?: string }>;
}) {
  const { slug = [] } = await params;
  const key = slug.join("/");

  if (key === "") return <AdminHome />;
  if (key === "trang") return <SiteAdmin />;
  if (key === "lien-he") return <ContactAdmin />;
  if (key === "gioi-thieu") return <IntroAdmin />;
  if (key === "ton-chi") return <PhilosophyAdmin />;
  if (key === "thai-to-su") return <ThaiToSuAdmin />;
  if (key === "dia-diem") return <LocationsAdmin />;
  if (key === "tap-luyen") return <TrainingAdmin />;
  if (key === "dong-bo") return <SyncAdmin />;
  if (key === "hoat-dong") return <NewsAdmin searchParams={searchParams} />;
  if (key === "hoat-dong/moi") return <NewNews />;
  if (key === "hoat-dong/sua") return <EditNews searchParams={searchParams} />;
  notFound();
}
