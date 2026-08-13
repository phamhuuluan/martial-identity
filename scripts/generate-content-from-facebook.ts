/**
 * Generate content/*.md from MCP dump (data/facebook-sync-input.json).
 * Classification + copy normalization are Cursor-agent rules — no external LLM API.
 */
import fs from "node:fs";
import path from "node:path";
import https from "node:https";
import http from "node:http";
import {
  NEWS_CONTENT_CATEGORIES,
  classifyPost,
  type ContentCategory,
} from "../src/sync/classifyPost";

const ROOT = process.cwd();
const INPUT = path.join(ROOT, "data/facebook-sync-input.json");
const CONTENT = path.join(ROOT, "content");
const IMAGES = path.join(ROOT, "public/images/news");
const MIN_MESSAGE = 80;
/** Real photos only. No video thumbnails. No artificial gallery cap. */
const MAX_IMAGES = 100;

type Category = ContentCategory;

interface RawPost {
  facebookPostId: string;
  message: string;
  publishedAt: string;
  facebookUrl: string;
  /** MCP/GraphClient field name */
  remoteImages?: string[];
  /** Legacy field name used by older sync scripts */
  images?: string[];
  engagementScore: number;
  statusType?: string;
  status_type?: string;
  hasPhotos?: boolean;
  hasVideo?: boolean;
}

function isVideoThumbUrl(url: string): boolean {
  return /\/t15\.5256-/.test(url) || /\/v\/t15\./.test(url);
}

function isVideoOnlyPost(p: RawPost): boolean {
  const status = (p.statusType || p.status_type || "").toLowerCase();
  if (status === "added_video" || status === "shared_video") return true;
  const url = p.facebookUrl || "";
  if (/\/videos\//i.test(url) || /\/reel\//i.test(url) || /\/watch\//i.test(url)) {
    return true;
  }
  return false;
}

/**
 * Real photos only — never video thumbnails.
 */
function mediaUrlsOf(p: RawPost): string[] {
  const raw = p.remoteImages ?? p.images ?? [];
  const unique = [...new Set(raw)].filter(Boolean);
  return unique.filter((u) => !isVideoThumbUrl(u)).slice(0, MAX_IMAGES);
}

const REJECT = [
  /\bcheck[\s-]?in\b/i,
  /\bchecked in\b/i,
  /\blivestream\b/i,
  /\blive stream\b/i,
  /\bđang phát trực tiếp\b/i,
  /\bsinh nhật\b/i,
  /\bhappy birthday\b/i,
];

function stripNoise(text: string): string {
  return text
    .replace(/#[\p{L}\p{N}_]+/gu, "")
    .replace(/@fan\s*cứngg?/gi, "")
    .replace(/@[\w.]+/g, "")
    .replace(
      /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu,
      ""
    )
    .replace(/[📸👇✨🔥🥋📅📍❤️❤🤝🏆🇻🇳🇩🇿🌈🎋📲💥🎇😍😮‍💨🌱🌿]/gu, "")
    .replace(/_{3,}/g, "")
    .replace(/[|]{2,}/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function dropEnglishMirror(text: string): string {
  const paras = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  if (paras.length < 2) return text;
  const kept: string[] = [];
  for (const p of paras) {
    const letters = p.replace(/[^A-Za-zÀ-ỹ]/g, "");
    const ascii = (p.match(/[A-Za-z]/g) || []).length;
    const ratio = letters.length ? ascii / letters.length : 0;
    // Drop paragraphs that are mostly English (mirror translations)
    if (ratio > 0.75 && p.length > 40 && !/[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i.test(p)) {
      continue;
    }
    kept.push(p);
  }
  return (kept.length ? kept : paras).join("\n\n");
}

function titleCaseLine(line: string): string {
  const t = stripNoise(line).replace(/^["“]+|["”]+$/g, "").trim();
  if (!t) return "Tin Phật Quang Quyền";
  // Prefer first meaningful sentence / line, max ~90 chars
  const cut = t.split(/[.\n|]/)[0].trim() || t;
  return cut.length > 90 ? `${cut.slice(0, 87).trim()}…` : cut;
}

function slugify(title: string, id: string): string {
  const base = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  const shortId = id.split("_").pop()?.slice(-8) || "post";
  return `${base || "bai-viet"}-${shortId}`;
}

function tagsFor(category: Category, message: string): string[] {
  const tags = new Set<string>(["phat-quang-quyen"]);
  if (/festival|hà nội|ha noi/i.test(message)) tags.add("festival");
  if (/gia lai|quy nhơn|quy nhon/i.test(message)) tags.add("gia-lai");
  if (/hồ chí minh|tp\.?\s*hcm|sài gòn/i.test(message)) tags.add("hcm");
  if (/nâng đai|đổi đai|thăng cấp/i.test(message)) tags.add("nang-dai");
  if (/thiện nguyện|trồng cây|nhặt rác|27\/7/i.test(message)) {
    tags.add("thien-nguyen");
  }
  if (/đại lễ|phật đản|thành đạo|vu lan/i.test(message)) tags.add("dai-le");
  if (/quốc tế|international/i.test(message)) tags.add("quoc-te");
  if (/algeria/i.test(message)) tags.add("algeria");
  tags.add(category);
  return [...tags].slice(0, 8);
}

function buildSummary(cleaned: string, title: string): string {
  const paras = cleaned.split(/\n+/).map((p) => p.trim()).filter(Boolean);
  const body = paras.filter((p) => p !== title && p.length > 20).join(" ");
  const src = body || cleaned || title;
  const sentences = src.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [src];
  const summary = sentences
    .slice(0, 3)
    .map((s) => s.trim())
    .filter(Boolean)
    .join(" ");
  const out = summary.length > 320 ? `${summary.slice(0, 317).trim()}…` : summary;
  return out || title;
}

function buildBody(cleaned: string, title: string): string {
  let body = dropEnglishMirror(cleaned);
  // Remove redundant all-caps title line if duplicated
  const lines = body.split("\n");
  if (lines[0] && stripNoise(lines[0]).toLowerCase() === title.toLowerCase()) {
    body = lines.slice(1).join("\n").trim();
  }
  body = body
    .split(/\n/)
    .filter((line) => {
      const t = line.trim();
      if (!t) return true;
      if (/like|share|bình luận|chia sẻ để|comment/i.test(t) && t.length < 120) {
        return false;
      }
      return true;
    })
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!body || body.length < 40) {
    return `${title}.\n\nNội dung được chuẩn hóa từ bài đăng Fanpage Tổ Đình Phật Quang Quyền.`;
  }
  return body;
}

function yamlEscape(s: string): string {
  // Prefer characters that don't need backslash escapes (our YAML parser is minimal)
  return s
    .replace(/\\/g, "")
    .replace(/"/g, "'")
    .replace(/\n/g, " ")
    .trim();
}

function findExistingByPostId(postId: string): string | null {
  for (const cat of NEWS_CONTENT_CATEGORIES) {
    const dir = path.join(CONTENT, cat);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".md")) continue;
      const fp = path.join(dir, file);
      const raw = fs.readFileSync(fp, "utf8");
      if (raw.includes(`facebookPostId: "${postId}"`)) return fp;
    }
  }
  return null;
}

function download(url: string, dest: string): Promise<boolean> {
  return new Promise((resolve) => {
    const mod = url.startsWith("https") ? https : http;
    const file = fs.createWriteStream(dest);
    const req = mod.get(
      url,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; MartialIdentitySync/1.0)",
          Accept: "image/*,*/*",
        },
        timeout: 30000,
      },
      (res) => {
        if (
          res.statusCode &&
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          file.close();
          fs.unlinkSync(dest);
          download(res.headers.location, dest).then(resolve);
          return;
        }
        if (res.statusCode !== 200) {
          file.close();
          try {
            fs.unlinkSync(dest);
          } catch {
            /* ignore */
          }
          resolve(false);
          return;
        }
        res.pipe(file);
        file.on("finish", () => {
          file.close();
          try {
            const size = fs.statSync(dest).size;
            // Reject 1x1 / error-page placeholders (FB sometimes returns 200 + tiny PNG)
            if (size < 500) {
              try {
                fs.unlinkSync(dest);
              } catch {
                /* ignore */
              }
              resolve(false);
              return;
            }
          } catch {
            resolve(false);
            return;
          }
          resolve(true);
        });
      }
    );
    req.on("error", () => {
      file.close();
      try {
        fs.unlinkSync(dest);
      } catch {
        /* ignore */
      }
      resolve(false);
    });
    req.on("timeout", () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function downloadImages(
  postId: string,
  urls: string[]
): Promise<string[]> {
  const unique = [...new Set(urls)].slice(0, MAX_IMAGES);
  const safeId = postId.replace(/[^a-zA-Z0-9_-]/g, "_");
  const dir = path.join(IMAGES, safeId);

  // Reuse cache only when it already covers the full remote set
  if (fs.existsSync(dir)) {
    const existingFiles = fs
      .readdirSync(dir)
      .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
      .sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
      );

    if (existingFiles.length > 0) {
      const allValid = existingFiles.every((f) => {
        try {
          return fs.statSync(path.join(dir, f)).size > 500;
        } catch {
          return false;
        }
      });

      if (allValid && existingFiles.length >= unique.length && unique.length > 0) {
        return existingFiles
          .slice(0, unique.length)
          .map((f) => `/images/news/${safeId}/${f}`);
      }

      // Incomplete or broken — clear and re-download full set
      for (const f of existingFiles) {
        try {
          fs.unlinkSync(path.join(dir, f));
        } catch {
          /* ignore */
        }
      }
    }
  }

  if (!unique.length) return [];

  fs.mkdirSync(dir, { recursive: true });

  const local: string[] = [];
  for (let i = 0; i < unique.length; i++) {
    const n = String(i + 1).padStart(2, "0");
    const dest = path.join(dir, `${n}.jpg`);
    const ok = await download(unique[i], dest);
    if (ok && fs.existsSync(dest) && fs.statSync(dest).size > 500) {
      local.push(`/images/news/${safeId}/${n}.jpg`);
    }
  }
  return local;
}

function renderMarkdown(opts: {
  title: string;
  summary: string;
  date: string;
  category: Category;
  tags: string[];
  facebookUrl: string;
  facebookPostId: string;
  engagementScore: number;
  coverImage: string;
  gallery: string[];
  body: string;
}): string {
  const galleryYaml =
    opts.gallery.length === 0
      ? "[]"
      : `\n${opts.gallery.map((g) => `  - "${g}"`).join("\n")}`;

  return `---
title: "${yamlEscape(opts.title)}"
summary: "${yamlEscape(opts.summary)}"
date: "${opts.date}"
category: ${opts.category}
tags:
${opts.tags.map((t) => `  - ${t}`).join("\n")}
facebookUrl: "${yamlEscape(opts.facebookUrl)}"
facebookPostId: "${opts.facebookPostId}"
engagementScore: ${opts.engagementScore}
coverImage: "${opts.coverImage}"
gallery:${galleryYaml === "[]" ? " []" : galleryYaml}
---

${opts.body}
`;
}

async function main() {
  if (!fs.existsSync(INPUT)) {
    console.error("Missing", INPUT);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(INPUT, "utf8")) as {
    posts: RawPost[];
  };

  let skipped = 0;
  let skippedNoPhoto = 0;
  let created = 0;
  let updated = 0;
  const byCat = Object.fromEntries(
    NEWS_CONTENT_CATEGORIES.map((c) => [c, 0])
  ) as Record<Category, number>;

  const eligible = data.posts.filter((p) => {
    const msg = (p.message || "").trim();
    if (msg.length < MIN_MESSAGE) {
      skipped += 1;
      return false;
    }
    if (REJECT.some((re) => re.test(msg))) {
      skipped += 1;
      return false;
    }

    // Skill: chỉ bài viết ảnh — bỏ video / reel (kể cả khi có thumbnail)
    if (isVideoOnlyPost(p)) {
      skippedNoPhoto += 1;
      return false;
    }

    // Media rules: ≥1 real photo required. Video-only / text-only → skip.
    if (mediaUrlsOf(p).length === 0) {
      skippedNoPhoto += 1;
      return false;
    }

    return true;
  });

  console.log(
    `Eligible: ${eligible.length} / ${data.posts.length} (skippedNoPhoto=${skippedNoPhoto}, skippedOther=${skipped})`
  );

  // Process sequentially for downloads (batch concurrency 6)
  const concurrency = 6;
  for (let i = 0; i < eligible.length; i += concurrency) {
    const batch = eligible.slice(i, i + concurrency);
    await Promise.all(
      batch.map(async (post) => {
        const cleaned = stripNoise(post.message);
        const title = titleCaseLine(
          cleaned.split("\n").find((l) => l.trim().length > 8) || cleaned
        );
        const category = classifyPost(post.message);
        const date = (post.publishedAt || "").slice(0, 10) || "1970-01-01";
        const summary = buildSummary(cleaned, title);
        const body = buildBody(cleaned, title);
        const tags = tagsFor(category, post.message);

        const photoUrls = mediaUrlsOf(post);
        const images = await downloadImages(post.facebookPostId, photoUrls);

        // Must have at least one successfully downloaded photo
        if (images.length === 0) {
          skippedNoPhoto += 1;
          return;
        }

        const coverImage = images[0];
        const gallery = images.slice(1);

        const md = renderMarkdown({
          title,
          summary,
          date,
          category,
          tags,
          facebookUrl: post.facebookUrl,
          facebookPostId: post.facebookPostId,
          engagementScore: post.engagementScore,
          coverImage,
          gallery,
          body,
        });

        const existing = findExistingByPostId(post.facebookPostId);
        let dest: string;
        if (existing) {
          // If category changed, move file
          const desiredDir = path.join(CONTENT, category);
          fs.mkdirSync(desiredDir, { recursive: true });
          const baseName = path.basename(existing);
          dest = path.join(desiredDir, baseName);
          if (path.dirname(existing) !== desiredDir) {
            fs.unlinkSync(existing);
          }
          fs.writeFileSync(dest, md, "utf8");
          updated += 1;
        } else {
          const slug = slugify(title, post.facebookPostId);
          const desiredDir = path.join(CONTENT, category);
          fs.mkdirSync(desiredDir, { recursive: true });
          dest = path.join(desiredDir, `${date}-${slug}.md`);
          fs.writeFileSync(dest, md, "utf8");
          created += 1;
        }
        byCat[category] += 1;
      })
    );
    process.stdout.write(
      `\rProcessed ${Math.min(i + concurrency, eligible.length)}/${eligible.length}`
    );
  }

  console.log("\nDone.");
  console.log({ created, updated, skipped, skippedNoPhoto, byCat });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
