import { parseSite } from "@/data/siteSchema";
import { SiteForm } from "@/components/admin/SiteForm";
import { readRepoFileOrThrow } from "@/lib/admin/github";

export default async function SiteAdminPage() {
  const file = await readRepoFileOrThrow("content/site/site.json");
  const data = parseSite(JSON.parse(file.content));
  return <SiteForm initial={data} sha={file.sha} />;
}
