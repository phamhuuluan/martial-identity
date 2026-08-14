/**
 * Audit content/*.md image paths against public/.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, "content");
const cats = ["competitions", "charity", "activities"] as const;

type Issue = {
  file: string;
  cat: string;
  date: string;
  title: string;
  cover: string;
  gallery: string[];
  problems: string[];
  facebookPostId: string;
};

function parse(raw: string) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const fm = m[1];
  const fields: Record<string, string> = {};
  const gallery: string[] = [];
  let inGallery = false;
  for (const line of fm.split(/\n/)) {
    if (/^gallery:\s*$/.test(line)) {
      inGallery = true;
      continue;
    }
    if (inGallery) {
      const item = line.match(/^\s+-\s+(.*)$/);
      if (item) {
        gallery.push(item[1].replace(/^["']|["']$/g, "").trim());
        continue;
      }
      inGallery = false;
    }
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (kv) fields[kv[1]] = kv[2].replace(/^["']|["']$/g, "").trim();
  }
  return { fields, gallery };
}

const issues: Issue[] = [];
let total = 0;
let ok = 0;
const missingFiles: string[] = [];

for (const cat of cats) {
  const dir = path.join(CONTENT, cat);
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".md")) continue;
    total += 1;
    const filePath = path.join(dir, file);
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = parse(raw);
    if (!parsed) continue;

    const cover = parsed.fields.coverImage || "";
    const gallery = parsed.gallery;
    const all = [cover, ...gallery].filter(Boolean);
    const problems: string[] = [];

    if (!cover) problems.push("missing_coverImage");
    if (all.length === 0) problems.push("no_images");

    for (const img of all) {
      if (img.includes("extracted/img-029")) {
        problems.push(`fallback_placeholder:${img}`);
      }
      if (img.startsWith("http")) {
        problems.push(`remote_url:${img.slice(0, 100)}`);
      }
      if (img.startsWith("/")) {
        const abs = path.join(ROOT, "public", img.replace(/^\//, ""));
        if (!fs.existsSync(abs)) {
          problems.push(`file_missing:${img}`);
          missingFiles.push(img);
        } else {
          const st = fs.statSync(abs);
          if (st.size < 200) problems.push(`file_too_small:${img}:${st.size}`);
        }
      }
    }

    if (problems.length) {
      issues.push({
        file: path.relative(ROOT, filePath),
        cat,
        date: parsed.fields.date || "",
        title: parsed.fields.title || "",
        cover,
        gallery,
        problems,
        facebookPostId: parsed.fields.facebookPostId || "",
      });
    } else {
      ok += 1;
    }
  }
}

console.log(
  JSON.stringify(
    {
      total,
      ok,
      withIssues: issues.length,
      missingFileCount: missingFiles.length,
      uniqueMissing: [...new Set(missingFiles)].length,
    },
    null,
    2
  )
);

const byProblem: Record<string, number> = {};
for (const i of issues) {
  for (const p of i.problems) {
    const key = p.split(":")[0];
    byProblem[key] = (byProblem[key] || 0) + 1;
  }
}
console.log("\nBy problem type:", byProblem);

console.log("\n=== ISSUES ===");
for (const i of issues) {
  console.log(`\n[${i.cat}] ${i.date} | ${i.title.slice(0, 80)}`);
  console.log(`  ${i.file}`);
  console.log(`  cover: ${i.cover || "(none)"}`);
  console.log(`  id: ${i.facebookPostId}`);
  console.log(`  problems: ${i.problems.join(" | ")}`);
}

// Check if image dirs exist under public/images/news for broken posts
console.log("\n=== Image folder status for broken posts ===");
for (const i of issues.slice(0, 40)) {
  const id = i.facebookPostId;
  if (!id) continue;
  const dir = path.join(ROOT, "public/images/news", id);
  const exists = fs.existsSync(dir);
  const files = exists ? fs.readdirSync(dir) : [];
  console.log(`${id}: dir=${exists} files=${files.join(",") || "(none)"}`);
}

fs.mkdirSync(path.join(ROOT, "data"), { recursive: true });
fs.writeFileSync(
  path.join(ROOT, "data/image-audit.json"),
  JSON.stringify({ total, ok, withIssues: issues.length, issues }, null, 2)
);
console.log("\nWrote data/image-audit.json");
