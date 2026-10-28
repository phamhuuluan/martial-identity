import { LEGACY_NEWS_CATEGORIES, NEWS_CATEGORIES } from "@/domain/news";
import { listRepoDir } from "./github";

export type NewsIndexItem = {
  path: string;
  name: string;
  sha: string;
  category: string;
  date: string;
};

export async function listNewsIndex(query: string): Promise<NewsIndexItem[]> {
  const folders = [...NEWS_CATEGORIES, ...LEGACY_NEWS_CATEGORIES];
  const groups = await Promise.all(
    folders.map(async (category) => {
      const files = await listRepoDir(`content/${category}`);
      return files.map((file) => ({
        ...file,
        category,
        date: file.name.slice(0, 10),
      }));
    })
  );
  const q = query.trim().toLowerCase();
  const items = groups
    .flat()
    .filter((item) => (q ? `${item.path} ${item.name}`.toLowerCase().includes(q) : true))
    .sort((a, b) => b.name.localeCompare(a.name));
  return items;
}
