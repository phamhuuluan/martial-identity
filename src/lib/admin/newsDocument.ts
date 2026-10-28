import {
  LEGACY_NEWS_CATEGORIES,
  NEWS_CATEGORIES,
  mapToDisplayCategory,
  type NewsCategory,
} from "@/domain/news";

const CATEGORIES = new Set<string>([
  ...NEWS_CATEGORIES,
  ...LEGACY_NEWS_CATEGORIES,
]);

export type NewsDraft = {
  title: string;
  summary: string;
  date: string;
  category: NewsCategory;
  tags: string[];
  facebookUrl: string;
  facebookPostId: string;
  engagementScore: number;
  coverImage: string;
  gallery: string[];
  locked: boolean;
  body: string;
};

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
      const inner = rest.replace(/^\[/, "").replace(/\]$/, "");
      result[key] = inner.trim()
        ? inner.split(",").map((part) => stripQuotes(part.trim()))
        : [];
      i += 1;
      continue;
    }
    result[key] = coerceScalar(stripQuotes(rest));
    i += 1;
  }
  return result;
}

function asStringList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  if (typeof value === "string" && value.trim()) {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

function imagePath(value: string, label: string): string {
  const path = value.trim();
  if (!path) return "";
  if (!path.startsWith("/") || path.includes("..") || /\s/.test(path)) {
    throw new Error(`${label} phải là đường dẫn bắt đầu bằng /`);
  }
  return path;
}

export function parseNewsMarkdown(raw: string): NewsDraft {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error("Bài viết thiếu khối frontmatter");
  const fm = parseSimpleYaml(match[1]);
  const categoryRaw = String(fm.category ?? "").trim();
  if (!CATEGORIES.has(categoryRaw)) {
    throw new Error("Chuyên mục không hợp lệ");
  }
  const date = String(fm.date ?? "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("Ngày phải là YYYY-MM-DD");
  const title = String(fm.title ?? "").trim();
  if (!title) throw new Error("Thiếu tiêu đề");
  const coverImage = imagePath(String(fm.coverImage ?? ""), "Ảnh bìa");
  const gallery = asStringList(fm.gallery).map((item, index) =>
    imagePath(item, `Ảnh ${index + 1}`)
  );
  return {
    title,
    summary: String(fm.summary ?? "").trim(),
    date,
    category: mapToDisplayCategory(categoryRaw),
    tags: asStringList(fm.tags),
    facebookUrl: String(fm.facebookUrl ?? "").trim(),
    facebookPostId: String(fm.facebookPostId ?? "").trim(),
    engagementScore: Number(fm.engagementScore ?? 0) || 0,
    coverImage,
    gallery: gallery.filter((item) => item && item !== coverImage),
    locked: fm.locked === true,
    body: match[2].trim(),
  };
}

function yamlEscape(value: string): string {
  return value.replace(/\\/g, "").replace(/"/g, "'").replace(/\n/g, " ").trim();
}

export function serializeNewsMarkdown(draft: NewsDraft): string {
  const gallery =
    draft.gallery.length === 0
      ? " []"
      : `\n${draft.gallery.map((item) => `  - "${yamlEscape(item)}"`).join("\n")}`;
  const tags =
    draft.tags.length === 0 ? " []" : `\n${draft.tags.map((tag) => `  - ${tag}`).join("\n")}`;
  const locked = draft.locked ? "locked: true\n" : "";
  return `---
title: "${yamlEscape(draft.title)}"
summary: "${yamlEscape(draft.summary)}"
date: "${draft.date}"
category: ${draft.category}
tags:${tags}
facebookUrl: "${yamlEscape(draft.facebookUrl)}"
facebookPostId: "${yamlEscape(draft.facebookPostId)}"
engagementScore: ${draft.engagementScore}
coverImage: "${yamlEscape(draft.coverImage)}"
gallery:${gallery}
${locked}---

${draft.body.trim()}
`;
}

export function validateNewsDraft(input: unknown): NewsDraft {
  if (typeof input !== "object" || input === null) {
    throw new Error("Bài viết không hợp lệ");
  }
  const row = input as Record<string, unknown>;
  const category = String(row.category ?? "");
  if (!(NEWS_CATEGORIES as readonly string[]).includes(category)) {
    throw new Error("Chuyên mục không hợp lệ");
  }
  const date = String(row.date ?? "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("Ngày phải là YYYY-MM-DD");
  const title = String(row.title ?? "").trim();
  if (!title) throw new Error("Thiếu tiêu đề");
  const gallery = Array.isArray(row.gallery) ? row.gallery.map(String) : [];
  const draft: NewsDraft = {
    title,
    summary: String(row.summary ?? "").trim(),
    date,
    category: category as NewsCategory,
    tags: Array.isArray(row.tags)
      ? row.tags.map((tag) => String(tag).trim()).filter(Boolean)
      : [],
    facebookUrl: String(row.facebookUrl ?? "").trim(),
    facebookPostId: String(row.facebookPostId ?? "").trim(),
    engagementScore: Math.max(0, Number(row.engagementScore ?? 0) || 0),
    coverImage: imagePath(String(row.coverImage ?? ""), "Ảnh bìa"),
    gallery: gallery
      .map((item, index) => imagePath(item, `Ảnh ${index + 1}`))
      .filter(Boolean),
    locked: row.locked === true,
    body: String(row.body ?? "").trim(),
  };
  if (!draft.body) throw new Error("Thiếu nội dung");
  if (draft.facebookUrl && !/^https?:\/\//.test(draft.facebookUrl)) {
    throw new Error("Link Facebook phải là URL http(s)");
  }
  return draft;
}

export function slugifyNewsTitle(title: string): string {
  const base = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  return base || "bai-viet";
}
