import { NEWS_CATEGORIES, LEGACY_NEWS_CATEGORIES } from "@/domain/news";

const NEWS_FOLDERS = [...NEWS_CATEGORIES, ...LEGACY_NEWS_CATEGORIES];

const SITE_JSON = new Set([
  "content/site/site.json",
  "content/site/contact.json",
  "content/site/intro.json",
  "content/site/philosophy.json",
  "content/site/locations.json",
  "content/site/training.json",
  "content/site/thai-to-su-life.json",
]);

export function isSiteJsonPath(path: string): boolean {
  return SITE_JSON.has(path);
}

export function isNewsMarkdownPath(path: string): boolean {
  const match = path.match(/^content\/([a-z]+)\/([a-z0-9][a-z0-9-]*)\.md$/);
  if (!match) return false;
  return (NEWS_FOLDERS as readonly string[]).includes(match[1]);
}

export function isUploadImagePath(path: string): boolean {
  if (path.includes("..") || path.includes("\\")) return false;
  return /^public\/images\/[A-Za-z0-9._/-]+\.(jpe?g|png|webp|gif)$/i.test(path);
}

export function isAllowedRepoPath(path: string): boolean {
  return isSiteJsonPath(path) || isNewsMarkdownPath(path) || isUploadImagePath(path);
}

export function newsCategoryFromPath(path: string): string | null {
  const match = path.match(/^content\/([a-z]+)\//);
  return match?.[1] ?? null;
}
