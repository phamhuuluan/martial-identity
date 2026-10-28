import { parsePhilosophy } from "@/data/siteSchema";
import { PhilosophyForm } from "@/components/admin/PhilosophyForm";
import { readRepoFileOrThrow } from "@/lib/admin/github";

export default async function PhilosophyAdminPage() {
  const file = await readRepoFileOrThrow("content/site/philosophy.json");
  return <PhilosophyForm initial={parsePhilosophy(JSON.parse(file.content))} sha={file.sha} />;
}
