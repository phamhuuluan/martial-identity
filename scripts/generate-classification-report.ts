/**
 * Generate classification report for all content/*.md posts.
 * Uses classifyPostDetailed (3 groups) — dry-run, does not move files.
 *
 * Usage: npx tsx scripts/generate-classification-report.ts
 */
import fs from "node:fs";
import path from "node:path";
import {
  LEGACY_CONTENT_CATEGORIES,
  NEWS_CONTENT_CATEGORIES,
  classifyPostDetailed,
  mapToDisplayCategory,
} from "../src/sync/classifyPost";

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, "content");
const OUT_MD = path.join(ROOT, "CONTENT_COVERAGE_REPORT.md");
const OUT_CSV = path.join(ROOT, "data/classification-report.csv");

function parseFrontmatter(raw: string): {
  body: string;
  fields: Record<string, string>;
  coverImage: string;
} | null {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return null;
  const fm = match[1];
  const body = match[2];
  const fields: Record<string, string> = {};
  let coverImage = "";
  let inGallery = false;
  for (const line of fm.split(/\r?\n/)) {
    if (/^gallery:\s*$/.test(line)) {
      inGallery = true;
      continue;
    }
    if (inGallery && /^\s+-/.test(line)) continue;
    inGallery = false;
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    const val = m[2].replace(/^["']|["']$/g, "").trim();
    fields[key] = val;
    if (key === "coverImage") coverImage = val;
  }
  return { body, fields, coverImage };
}

function yearOf(date: string): number {
  const y = Number((date || "").slice(0, 4));
  return Number.isFinite(y) ? y : 0;
}

function main() {
  const dirs = [
    ...NEWS_CONTENT_CATEGORIES,
    ...LEGACY_CONTENT_CATEGORIES,
  ].filter((c) => fs.existsSync(path.join(CONTENT, c)));

  type Row = {
    id: string;
    title: string;
    date: string;
    current: string;
    keywords: string;
    detected: string;
    reason: string;
    image: string;
    uncertain: boolean;
  };

  const rows: Row[] = [];
  const seen = new Set<string>();
  const stats = Object.fromEntries(
    NEWS_CONTENT_CATEGORIES.map((c) => [c, { total: 0, y2026: 0 }])
  ) as Record<string, { total: number; y2026: number }>;
  const byDetected: Record<
    string,
    { id: string; title: string; date: string; image: string }[]
  > = Object.fromEntries(NEWS_CONTENT_CATEGORIES.map((c) => [c, []]));

  for (const folder of dirs) {
    const dir = path.join(CONTENT, folder);
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".md")) continue;
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const parsed = parseFrontmatter(raw);
      if (!parsed) continue;

      const id = parsed.fields.facebookPostId || file;
      if (seen.has(id)) continue;
      seen.add(id);

      const title = parsed.fields.title || "";
      const date = parsed.fields.date || "";
      const current = mapToDisplayCategory(
        parsed.fields.category || folder
      );
      const text = [title, parsed.fields.summary || "", parsed.body].join("\n");
      const res = classifyPostDetailed(text);

      stats[res.category].total += 1;
      if (date.startsWith("2026")) stats[res.category].y2026 += 1;

      byDetected[res.category].push({
        id,
        title,
        date,
        image: parsed.coverImage || "",
      });

      rows.push({
        id,
        title,
        date,
        current: parsed.fields.category || folder,
        keywords: res.keywords.join("; "),
        detected: res.category,
        reason: res.reason,
        image: parsed.coverImage || "",
        uncertain: res.uncertain,
      });
    }
  }

  rows.sort((a, b) => {
    if (b.date !== a.date) return b.date.localeCompare(a.date);
    return a.title.localeCompare(b.title);
  });

  // Cover candidates per group (2026 first, with image)
  function pickCovers(
    list: { id: string; title: string; date: string; image: string }[],
    n = 2
  ) {
    return [...list]
      .sort((a, b) => {
        const yd = yearOf(b.date) - yearOf(a.date);
        if (yd !== 0) return yd;
        const aOk = a.image ? 1 : 0;
        const bOk = b.image ? 1 : 0;
        if (bOk !== aOk) return bOk - aOk;
        return b.date.localeCompare(a.date);
      })
      .filter((p) => p.image)
      .slice(0, n);
  }

  const coverByCat = Object.fromEntries(
    NEWS_CONTENT_CATEGORIES.map((c) => [c, pickCovers(byDetected[c] || [])])
  );
  const uncertainRows = rows.filter((r) => r.uncertain);
  const changed = rows.filter(
    (r) => mapToDisplayCategory(r.current) !== r.detected
  );

  const csvHeader =
    "Post ID,Title,Published Date,Current Category,Detected Keywords,Detected Category,Reason,Image,Uncertain";
  const csvLines = rows.map((r) =>
    [
      r.id,
      `"${r.title.replace(/"/g, '""')}"`,
      r.date,
      r.current,
      `"${r.keywords.replace(/"/g, '""')}"`,
      r.detected,
      `"${r.reason.replace(/"/g, '""')}"`,
      r.image,
      r.uncertain ? "yes" : "no",
    ].join(",")
  );

  fs.mkdirSync(path.dirname(OUT_CSV), { recursive: true });
  fs.writeFileSync(OUT_CSV, [csvHeader, ...csvLines].join("\n"), "utf8");

  const labels: Record<string, string> = {
    competitions: "Các giải đấu đã tham gia",
    charity: "Các hoạt động thiện nguyện",
    ceremonies: "Kính mừng Đại lễ",
    beltexams: "Kỳ thi thăng đai",
    performances: "Biểu diễn",
    training: "Huấn luyện",
    activities: "Các hoạt động khác",
  };

  let md = `# Classification Report (${NEWS_CONTENT_CATEGORIES.length} nhóm)\n\n`;
  md += `Generated: dry-run — chưa ghi file content.\n\n`;
  md += `## Summary\n\n`;
  md += `| Nhóm | Tổng | Bài 2026 |\n`;
  md += `|---|---:|---:|\n`;
  let y2026Sum = 0;
  for (const c of NEWS_CONTENT_CATEGORIES) {
    const s = stats[c];
    y2026Sum += s.y2026;
    md += `| ${labels[c] || c} (${c}) | ${s.total} | ${s.y2026} |\n`;
  }
  md += `| **Tổng** | **${rows.length}** | **${y2026Sum}** |\n\n`;

  md += `## Ảnh cover đề xuất (ưu tiên 2026)\n\n`;
  for (const c of NEWS_CONTENT_CATEGORIES) {
    md += `### ${labels[c] || c}\n`;
    for (const item of coverByCat[c] || []) {
      md += `- ${item.date} — ${item.title} — \`${item.image}\` (post ${item.id})\n`;
    }
    md += `\n`;
  }

  md += `## Bài đổi category (${changed.length})\n\n`;
  for (const r of changed.slice(0, 60)) {
    md += `- ${r.date} | ${r.title}\n  - ${r.current} → **${r.detected}**: ${r.reason}\n`;
  }
  if (changed.length > 60) md += `\n… và ${changed.length - 60} bài nữa.\n`;

  md += `\n## Không chắc chắn / xung đột từ khóa (${uncertainRows.length})\n\n`;
  for (const r of uncertainRows) {
    md += `- ${r.date} | ${r.title}\n  - → ${r.detected}: ${r.reason}\n  - keywords: ${r.keywords || "(none)"}\n`;
  }

  md += `\n## Bài 2026 (chi tiết)\n\n`;
  for (const r of rows.filter((x) => x.date.startsWith("2026"))) {
    md += `- ${r.date} | ${r.title} | ${r.current} → **${r.detected}** | ${r.reason}\n`;
  }

  md += `\n## CSV đầy đủ\n\nXem \`${path.relative(ROOT, OUT_CSV)}\`.\n`;

  fs.writeFileSync(OUT_MD, md, "utf8");
  console.log(`Report: ${OUT_MD}`);
  console.log(`CSV: ${OUT_CSV}`);
  console.log(stats);
  console.log({ total: rows.length, changed: changed.length, uncertain: uncertainRows.length });
}

main();
