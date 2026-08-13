/**
 * Domain types for Fanpage content under content/.
 * Categories phản ánh nhóm nội dung phát hiện từ dữ liệu thực tế
 * (không khóa cứng 4 nhóm cố định).
 */

export const NEWS_CATEGORIES = [
  "competitions",
  "charity",
  "ceremonies",
  "beltexams",
  "performances",
  "training",
  "activities",
] as const;

export const NEWS_CATEGORY_LABELS: Record<
  (typeof NEWS_CATEGORIES)[number],
  string
> = {
  competitions: "Các giải đấu đã tham gia",
  charity: "Các hoạt động thiện nguyện",
  ceremonies: "Kính mừng Đại lễ",
  beltexams: "Kỳ thi thăng đai",
  performances: "Biểu diễn",
  training: "Huấn luyện",
  activities: "Các hoạt động khác",
};

/** Legacy folders that may still exist until reclassify finishes. */
export const LEGACY_NEWS_CATEGORIES = [
  "achievements",
  "announcements",
] as const;

/** Categories shown on homepage / archive filters. */
export const DISPLAY_NEWS_CATEGORIES = NEWS_CATEGORIES;

export type NewsCategory = (typeof NEWS_CATEGORIES)[number];
export type LegacyNewsCategory = (typeof LEGACY_NEWS_CATEGORIES)[number];
export type AnyNewsCategory = NewsCategory | LegacyNewsCategory;

export interface NewsItem {
  id: string;
  slug: string;
  facebookPostId?: string;
  title: string;
  summary: string;
  content: string;
  category: NewsCategory;
  tags: string[];
  publishedAt: string;
  images: string[];
  facebookUrl: string;
  engagementScore: number;
  filePath: string;
}

export const DEFAULT_NEWS_IMAGE = "/images/extracted/hero-phat-quang-quyen.jpg";

/** Fallback cover when a list needs at least one image — never truncates galleries. */
export function ensureImages(images: string[]): string[] {
  if (images.length === 0) return [DEFAULT_NEWS_IMAGE];
  return images;
}

/** Prefer real local news photos; treat any non-empty path as usable cover. */
export function isUsableCoverImage(src: string | undefined | null): boolean {
  if (!src) return false;
  const s = src.trim();
  if (!s) return false;
  if (s === DEFAULT_NEWS_IMAGE) return false;
  return true;
}

/** Slim shape passed from Server Components into client section UIs. */
export interface NewsDisplayEvent {
  id: string;
  slug: string;
  title: string;
  summary: string;
  images: string[];
  facebookUrl: string;
  publishedAt: string;
  engagementScore: number;
  category: NewsCategory;
}

function yearOf(date: string): number {
  const y = Number((date || "").slice(0, 4));
  return Number.isFinite(y) ? y : 0;
}

/**
 * Sort: newer year first → newer publishedAt → higher engagement.
 * Ensures 2026 covers beat 2025 when selecting section images.
 */
export function compareNewsRecency(
  a: Pick<NewsItem, "publishedAt" | "engagementScore">,
  b: Pick<NewsItem, "publishedAt" | "engagementScore">
): number {
  const yearDiff = yearOf(b.publishedAt) - yearOf(a.publishedAt);
  if (yearDiff !== 0) return yearDiff;
  const timeDiff =
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  if (timeDiff !== 0) return timeDiff;
  return b.engagementScore - a.engagementScore;
}

/**
 * Pick up to `count` cover images from posts in the same category,
 * preferring newest year → usable image → newest publishedAt.
 * Client-safe (no Node APIs).
 */
export function selectSectionCoverImages(
  items: Array<Pick<NewsDisplayEvent, "publishedAt" | "images">>,
  count = 2
): string[] {
  const ranked = [...items].sort((a, b) => {
    const yearDiff = yearOf(b.publishedAt) - yearOf(a.publishedAt);
    if (yearDiff !== 0) return yearDiff;
    const aOk = a.images.some(isUsableCoverImage) ? 1 : 0;
    const bOk = b.images.some(isUsableCoverImage) ? 1 : 0;
    if (bOk !== aOk) return bOk - aOk;
    return (
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  });

  const covers: string[] = [];
  for (const item of ranked) {
    const img = item.images.find(isUsableCoverImage);
    if (!img) continue;
    if (covers.includes(img)) continue;
    covers.push(img);
    if (covers.length >= count) break;
  }
  return covers;
}
