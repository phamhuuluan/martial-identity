import { cache } from "react";
import fs from "node:fs";
import path from "node:path";
import {
  DEFAULT_NEWS_IMAGE,
  LEGACY_NEWS_CATEGORIES,
  NEWS_CATEGORIES,
  compareNewsRecency,
  mapToDisplayCategory,
  type AnyNewsCategory,
  type NewsCategory,
  type NewsDisplayEvent,
  type NewsItem,
} from "@/domain/news";

export type { NewsCategory, NewsDisplayEvent, NewsItem };

const CONTENT_ROOT = path.join(process.cwd(), "content");
const PUBLIC_ROOT = path.join(process.cwd(), "public");
const MIN_IMAGE_BYTES = 500;

const SCAN_CATEGORIES: AnyNewsCategory[] = [
  ...NEWS_CATEGORIES,
  ...LEGACY_NEWS_CATEGORIES,
];

/** Local public image that exists and is not a tiny corrupt placeholder. */
function isValidLocalImage(src: string | undefined | null): boolean {
  if (!src) return false;
  const s = src.trim();
  if (!s.startsWith("/")) return false;
  if (s === DEFAULT_NEWS_IMAGE) return true;
  const abs = path.join(PUBLIC_ROOT, s.replace(/^\//, ""));
  try {
    if (!fs.existsSync(abs)) return false;
    return fs.statSync(abs).size >= MIN_IMAGE_BYTES;
  } catch {
    return false;
  }
}

/** Keep only real local photos (no brand fallback injection, no artificial cap). */
export function sanitizeImages(images: string[]): string[] {
  return [
    ...new Set(
      images.filter(
        (src) => isValidLocalImage(src) && src !== DEFAULT_NEWS_IMAGE
      )
    ),
  ];
}

const NEWS_IMAGE_EXT = /\.(jpe?g|png|webp|gif)$/i;

/**
 * All downloaded stills for a Fanpage post under public/images/news/{id}/.
 * Sorted by filename (01.jpg, 02.jpg, …) so gallery order matches sync.
 */
function listLocalNewsImages(facebookPostId: string): string[] {
  const id = facebookPostId.trim();
  if (!id) return [];
  const dir = path.join(PUBLIC_ROOT, "images/news", id);
  if (!fs.existsSync(dir)) return [];
  try {
    return fs
      .readdirSync(dir)
      .filter((name) => NEWS_IMAGE_EXT.test(name))
      .sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
      )
      .map((name) => `/images/news/${id}/${name}`)
      .filter((src) => isValidLocalImage(src));
  } catch {
    return [];
  }
}

/**
 * Full image set for a post: prefer the on-disk news folder (complete sync),
 * then any extra valid paths from frontmatter cover/gallery.
 */
function resolvePostImages(options: {
  facebookPostId?: string;
  coverImage?: string;
  gallery?: string[];
}): string[] {
  const fromFm = [
    ...(options.coverImage ? [options.coverImage] : []),
    ...(options.gallery ?? []),
  ]
    .map((s) => String(s).trim())
    .filter(Boolean);

  const fromDisk = options.facebookPostId
    ? listLocalNewsImages(options.facebookPostId)
    : [];

  if (fromDisk.length === 0) {
    return [...new Set(fromFm)];
  }

  const diskSet = new Set(fromDisk);
  const extras = fromFm.filter((src) => !diskSet.has(src));
  return [...fromDisk, ...extras];
}

/**
 * Load all Markdown posts from content/{category}/*.md
 * Server-side / build-time only (uses fs). Deduped per request.
 */
export const getAllNews = cache(function getAllNews(): NewsItem[] {
  if (!fs.existsSync(CONTENT_ROOT)) return [];

  const items: NewsItem[] = [];
  const seen = new Set<string>();

  for (const category of SCAN_CATEGORIES) {
    const dir = path.join(CONTENT_ROOT, category);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".md")) continue;
      const filePath = path.join(dir, file);
      const raw = fs.readFileSync(filePath, "utf8");
      const parsed = parseMarkdownPost(raw, category, file, filePath);
      if (!parsed) continue;
      const key = parsed.facebookPostId || parsed.id;
      if (seen.has(key)) continue;
      seen.add(key);
      items.push(parsed);
    }
  }
  return items;
});

export function toDisplayEvents(items: NewsItem[]): NewsDisplayEvent[] {
  return items.map((item) => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    summary: item.summary,
    images: sanitizeImages(item.images),
    facebookUrl: item.facebookUrl,
    publishedAt: item.publishedAt,
    engagementScore: item.engagementScore,
    category: item.category,
  }));
}

export function getNewsBySlug(slug: string): NewsItem | null {
  const normalized = slug.trim();
  if (!normalized) return null;
  const found = getAllNews().find((item) => item.slug === normalized);
  if (!found) return null;
  return { ...found, images: sanitizeImages(found.images) };
}

/** Same-category recent items for detail “related” rail. */
export function getRelatedNews(
  slug: string,
  limit = 3
): NewsItem[] {
  const current = getNewsBySlug(slug);
  if (!current) return [];
  return queryNewsArchive({
    category: current.category,
    page: 1,
    pageSize: limit + 6,
    requireImages: true,
  }).items
    .filter((item) => item.slug !== current.slug)
    .slice(0, limit);
}

export function getAllNewsSlugs(): string[] {
  return getAllNews().map((item) => item.slug);
}

export interface NewsArchiveQuery {
  category?: NewsCategory | "all";
  q?: string;
  page?: number;
  pageSize?: number;
  /** When false, include posts without local images (detail may still link). */
  requireImages?: boolean;
  /** Only include posts published within the last N months (default: no cutoff). */
  sinceMonths?: number;
}

export interface NewsArchiveResult {
  items: NewsItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function queryNewsArchive(
  options: NewsArchiveQuery = {}
): NewsArchiveResult {
  const category = options.category ?? "all";
  const q = (options.q ?? "").trim().toLowerCase();
  const pageSize = Math.max(1, options.pageSize ?? 48);
  const page = Math.max(1, options.page ?? 1);
  const requireImages = options.requireImages ?? true;
  const sinceMonths = options.sinceMonths;

  let items = getAllNews()
    .map((item) => ({ ...item, images: sanitizeImages(item.images) }))
    .filter((item) => (requireImages ? item.images.length > 0 : true));

  if (typeof sinceMonths === "number" && sinceMonths > 0) {
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - sinceMonths);
    const cutoffMs = cutoff.getTime();
    items = items.filter((item) => {
      const t = new Date(item.publishedAt).getTime();
      return Number.isFinite(t) && t >= cutoffMs;
    });
  }

  if (category !== "all") {
    items = items.filter((item) => item.category === category);
  }

  if (q) {
    items = items.filter((item) => {
      const hay = `${item.title} ${item.summary} ${item.content}`.toLowerCase();
      return hay.includes(q);
    });
  }

  items.sort(compareNewsRecency);
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}

/** Featured / latest items across all display categories for Home preview. */
export function getFeaturedNews(limit = 6): NewsItem[] {
  return queryNewsArchive({
    category: "all",
    page: 1,
    pageSize: limit,
    requireImages: true,
  }).items;
}

function parseMarkdownPost(
  raw: string,
  folderCategory: AnyNewsCategory,
  filename: string,
  filePath: string
): NewsItem | null {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return null;

  const fm = parseSimpleYaml(match[1]);
  const body = match[2].trim();
  const title = String(fm.title ?? "").trim();
  if (!title) return null;

  const categoryRaw = String(fm.category ?? folderCategory).trim();
  const category = mapToDisplayCategory(categoryRaw);

  const coverImage = String(fm.coverImage ?? "").trim();
  const gallery = Array.isArray(fm.gallery)
    ? fm.gallery.map(String)
    : typeof fm.gallery === "string"
      ? [fm.gallery]
      : [];

  const date = String(fm.date ?? "").trim();
  const slug = filename.replace(/\.md$/, "");
  const facebookUrl = String(fm.facebookUrl ?? "").trim();
  const facebookPostId = String(fm.facebookPostId ?? "").trim() || undefined;

  const uniqueImages = resolvePostImages({
    facebookPostId,
    coverImage,
    gallery,
  });

  const tags = Array.isArray(fm.tags)
    ? fm.tags.map(String)
    : typeof fm.tags === "string"
      ? fm.tags.split(",").map((t) => t.trim())
      : [];

  return {
    id: facebookPostId || `md-${category}-${slug}`,
    slug,
    facebookPostId,
    title,
    summary: String(fm.summary ?? "").trim(),
    content: body,
    category,
    tags,
    publishedAt: date || "1970-01-01",
    images: uniqueImages,
    facebookUrl,
    engagementScore: Number(fm.engagementScore ?? 0) || 0,
    filePath: path.relative(process.cwd(), filePath),
  };
}

/** Minimal YAML subset for our frontmatter (no external deps). */
function parseSimpleYaml(src: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const lines = src.split(/\r?\n/);
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!kv) {
      i += 1;
      continue;
    }
    const key = kv[1];
    const rest = kv[2].trim();
    if (rest === "" || rest === "|" || rest === ">") {
      const list: string[] = [];
      i += 1;
      while (i < lines.length) {
        const item = lines[i].match(/^\s+-\s+(.*)$/);
        if (!item) break;
        list.push(stripQuotes(item[1].trim()));
        i += 1;
      }
      result[key] = list;
      continue;
    }
    if (rest.startsWith("[")) {
      result[key] = parseInlineList(rest);
      i += 1;
      continue;
    }
    result[key] = coerceScalar(stripQuotes(rest));
    i += 1;
  }
  return result;
}

function parseInlineList(raw: string): string[] {
  const inner = raw.replace(/^\[/, "").replace(/\]$/, "");
  if (!inner.trim()) return [];
  return inner.split(",").map((s) => stripQuotes(s.trim()));
}

function stripQuotes(s: string): string {
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    return s.slice(1, -1);
  }
  return s;
}

function coerceScalar(s: string): string | number | boolean {
  if (s === "true") return true;
  if (s === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
  return s;
}
