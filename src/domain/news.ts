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

export type NewsCategory = (typeof NEWS_CATEGORIES)[number];
export type LegacyNewsCategory = (typeof LEGACY_NEWS_CATEGORIES)[number];
export type AnyNewsCategory = NewsCategory | LegacyNewsCategory;

/** Map folder/frontmatter category → nhóm hiển thị hiện tại. */
export function mapToDisplayCategory(category: string): NewsCategory {
  if ((NEWS_CATEGORIES as readonly string[]).includes(category)) {
    return category as NewsCategory;
  }
  if (category === "achievements") return "competitions";
  return "activities";
}

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

export const DEFAULT_NEWS_IMAGE = "/images/extracted/hero-home-a1.webp";

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
