/**
 * Reclassify existing content/*.md with 3-group classifyPost rules.
 * Moves files between folders and updates frontmatter `category`.
 *
 * Usage: npx tsx scripts/reclassify-content.ts
 * Dry-run: npx tsx scripts/reclassify-content.ts --dry-run
 */
import fs from "node:fs";
import path from "node:path";
import {
  LEGACY_CONTENT_CATEGORIES,
  NEWS_CONTENT_CATEGORIES,
  classifyPost,
  classifyPostDetailed,
  type ContentCategory,
} from "../src/sync/classifyPost";

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, "content");
const DRY_RUN = process.argv.includes("--dry-run");

function parseFrontmatter(raw: string): {
  fm: string;
  body: string;
  fields: Record<string, string>;
} | null {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return null;
  const fm = match[1];
  const body = match[2];
  const fields: Record<string, string> = {};
  for (const line of fm.split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!m) continue;
    fields[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
  }
  return { fm, body, fields };
}

function setCategoryInFrontmatter(fm: string, category: ContentCategory): string {
  if (/^category:\s*.+$/m.test(fm)) {
    return fm.replace(/^category:\s*.+$/m, `category: ${category}`);
  }
  return `category: ${category}\n${fm}`;
}

function classifyTextFromFile(fields: Record<string, string>, body: string): string {
  return [fields.title || "", fields.summary || "", body].join("\n");
}

function main() {
  const moves: { from: string; to: string; category: ContentCategory }[] = [];
  const kept: string[] = [];
  const byCat: Record<string, number> = Object.fromEntries(
    NEWS_CONTENT_CATEGORIES.map((c) => [c, 0])
  );
  const uncertain: string[] = [];
  const seenIds = new Set<string>();
  let duplicates = 0;

  const dirs = [
    ...NEWS_CONTENT_CATEGORIES,
    ...LEGACY_CONTENT_CATEGORIES,
  ].filter((c) => fs.existsSync(path.join(CONTENT, c)));

  for (const folder of dirs) {
    const dir = path.join(CONTENT, folder);
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".md")) continue;
      const src = path.join(dir, file);
      const raw = fs.readFileSync(src, "utf8");
      const parsed = parseFrontmatter(raw);
      if (!parsed) {
        console.warn("Skip (no frontmatter):", src);
        continue;
      }

      const postId = parsed.fields.facebookPostId || file;
      if (seenIds.has(postId)) {
        duplicates += 1;
        console.warn("Duplicate skipped:", src);
        continue;
      }
      seenIds.add(postId);

      const text = classifyTextFromFile(parsed.fields, parsed.body);
      const detailed = classifyPostDetailed(text);
      const category = detailed.category;
      byCat[category] = (byCat[category] || 0) + 1;
      if (detailed.uncertain) {
        uncertain.push(
          `${parsed.fields.date || "?"} | ${parsed.fields.title || file} → ${category} (${detailed.reason})`
        );
      }

      const newFm = setCategoryInFrontmatter(parsed.fm, category);
      const newRaw = `---\n${newFm}\n---\n${parsed.body.startsWith("\n") ? parsed.body : `\n${parsed.body}`}`;

      const destDir = path.join(CONTENT, category);
      const dest = path.join(destDir, file);

      if (path.resolve(src) === path.resolve(dest)) {
        if (parsed.fields.category !== category) {
          if (!DRY_RUN) fs.writeFileSync(src, newRaw, "utf8");
          moves.push({ from: src, to: dest, category });
        } else {
          kept.push(src);
        }
        continue;
      }

      if (!DRY_RUN) {
        fs.mkdirSync(destDir, { recursive: true });
        // Avoid overwrite if destination exists with different content
        if (fs.existsSync(dest) && path.resolve(src) !== path.resolve(dest)) {
          console.warn("Dest exists, removing source after write check:", dest);
        }
        fs.writeFileSync(dest, newRaw, "utf8");
        fs.unlinkSync(src);
      }
      moves.push({ from: src, to: dest, category });
    }
  }

  // Remove empty legacy dirs after move
  if (!DRY_RUN) {
    for (const legacy of LEGACY_CONTENT_CATEGORIES) {
      const dir = path.join(CONTENT, legacy);
      if (!fs.existsSync(dir)) continue;
      const left = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
      if (left.length === 0) {
        try {
          fs.rmdirSync(dir);
        } catch {
          /* ignore */
        }
      }
    }
  }

  console.log(DRY_RUN ? "Dry-run reclassify." : "Reclassify done.");
  console.log({
    movedOrUpdated: moves.length,
    unchanged: kept.length,
    duplicates,
    byCat,
    uncertainCount: uncertain.length,
    total: moves.length + kept.length,
  });
  for (const m of moves.slice(0, 80)) {
    console.log(
      `${path.relative(ROOT, m.from)} → ${path.relative(ROOT, m.to)} [${m.category}]`
    );
  }
  if (moves.length > 80) console.log(`… and ${moves.length - 80} more`);
  if (uncertain.length) {
    console.log("\nUncertain / conflict:");
    for (const u of uncertain.slice(0, 40)) console.log(`- ${u}`);
    if (uncertain.length > 40) console.log(`… and ${uncertain.length - 40} more`);
  }
}

main();
