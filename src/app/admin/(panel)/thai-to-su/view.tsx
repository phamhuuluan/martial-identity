import { parseThaiToSuLife } from "@/data/siteSchema";
import { LifeForm } from "@/components/admin/LifeForm";
import { readRepoFileOrThrow } from "@/lib/admin/github";

export default async function ThaiToSuAdminPage() {
  const file = await readRepoFileOrThrow("content/site/thai-to-su-life.json");
  return <LifeForm initial={parseThaiToSuLife(JSON.parse(file.content))} sha={file.sha} />;
}
