import { notFound } from "next/navigation";
import { NewsEditor } from "@/components/admin/NewsEditor";
import { readRepoFile } from "@/lib/admin/github";
import { parseNewsMarkdown } from "@/lib/admin/newsDocument";
import { isNewsMarkdownPath } from "@/lib/admin/paths";

export default async function EditNewsPage({
  searchParams,
}: {
  searchParams: Promise<{ path?: string }>;
}) {
  const { path = "" } = await searchParams;
  if (!isNewsMarkdownPath(path)) notFound();
  const file = await readRepoFile(path);
  if (!file) notFound();
  try {
    const draft = parseNewsMarkdown(file.content);
    return <NewsEditor initial={draft} sha={file.sha} originalPath={path} />;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không đọc được bài";
    return <p className="adm-note is-error">{message}</p>;
  }
}
