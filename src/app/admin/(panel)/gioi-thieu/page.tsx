import { parseIntro } from "@/data/siteSchema";
import { IntroForm } from "@/components/admin/IntroForm";
import { readRepoFileOrThrow } from "@/lib/admin/github";

export default async function IntroAdminPage() {
  const file = await readRepoFileOrThrow("content/site/intro.json");
  return <IntroForm initial={parseIntro(JSON.parse(file.content))} sha={file.sha} />;
}
