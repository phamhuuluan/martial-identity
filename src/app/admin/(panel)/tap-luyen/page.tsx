import { parseTraining } from "@/data/siteSchema";
import { TrainingForm } from "@/components/admin/TrainingForm";
import { readRepoFileOrThrow } from "@/lib/admin/github";

export default async function TrainingAdminPage() {
  const file = await readRepoFileOrThrow("content/site/training.json");
  return <TrainingForm initial={parseTraining(JSON.parse(file.content))} sha={file.sha} />;
}
