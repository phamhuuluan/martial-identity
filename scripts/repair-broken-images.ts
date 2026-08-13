/**
 * Repair broken/tiny news images:
 * 1) Re-download recoverable posts via Graph (shared_story full_picture etc.)
 * 2) Remove corrupt 1x1 placeholder files so loader can fall back cleanly
 *
 * Usage: npx tsx scripts/repair-broken-images.ts
 */
import fs from "node:fs";
import path from "node:path";
import https from "node:https";
import http from "node:http";
import dotenv from "dotenv";

dotenv.config();

const ROOT = process.cwd();
const IMAGES = path.join(ROOT, "public/images/news");
const AUDIT = path.join(ROOT, "data/image-audit.json");
const MIN_BYTES = 500;
const MAX_IMAGES = 5;

const TOKEN = process.env.FACEBOOK_ACCESS_TOKEN || "";
const VER = process.env.FACEBOOK_GRAPH_VERSION || "v21.0";

if (!TOKEN) {
  console.error("Missing FACEBOOK_ACCESS_TOKEN");
  process.exit(1);
}

function getJson(url: string): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () => {
          try {
            resolve(JSON.parse(d));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on("error", reject);
  });
}

function download(url: string, dest: string): Promise<boolean> {
  return new Promise((resolve) => {
    const mod = url.startsWith("https") ? https : http;
    const tmp = `${dest}.tmp`;
    const file = fs.createWriteStream(tmp);
    const req = mod.get(
      url,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; MartialIdentitySync/1.0)",
          Accept: "image/*,*/*",
        },
        timeout: 45000,
      },
      (res) => {
        if (
          res.statusCode &&
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          file.close();
          try {
            fs.unlinkSync(tmp);
          } catch {
            /* ignore */
          }
          download(res.headers.location, dest).then(resolve);
          return;
        }
        if (res.statusCode !== 200) {
          file.close();
          try {
            fs.unlinkSync(tmp);
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
            const size = fs.statSync(tmp).size;
            if (size < MIN_BYTES) {
              fs.unlinkSync(tmp);
              resolve(false);
              return;
            }
            fs.renameSync(tmp, dest);
            resolve(true);
          } catch {
            resolve(false);
          }
        });
      }
    );
    req.on("error", () => {
      file.close();
      try {
        fs.unlinkSync(tmp);
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

type Att = {
  type?: string;
  media?: { image?: { src?: string } };
  subattachments?: { data?: Att[] };
  title?: string;
};

function collectUrls(post: Record<string, unknown>): string[] {
  const urls: string[] = [];
  const push = (u?: string) => {
    if (u && !urls.includes(u)) urls.push(u);
  };
  push(String(post.full_picture || "") || undefined);

  const walk = (atts?: Att[]) => {
    if (!atts) return;
    for (const a of atts) {
      push(a.media?.image?.src);
      walk(a.subattachments?.data);
    }
  };

  const attachments = post.attachments as { data?: Att[] } | undefined;
  walk(attachments?.data);
  return urls.slice(0, MAX_IMAGES);
}

function isTinyOrMissing(filePath: string): boolean {
  if (!fs.existsSync(filePath)) return true;
  try {
    return fs.statSync(filePath).size < MIN_BYTES;
  } catch {
    return true;
  }
}

function updateFrontmatterImages(
  mdPath: string,
  coverImage: string,
  gallery: string[]
): void {
  const raw = fs.readFileSync(mdPath, "utf8");
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return;
  let fm = match[1];
  const body = match[2];

  if (/^coverImage:\s*.+$/m.test(fm)) {
    fm = fm.replace(/^coverImage:\s*.+$/m, `coverImage: "${coverImage}"`);
  } else {
    fm += `\ncoverImage: "${coverImage}"`;
  }

  // Replace gallery block
  fm = fm.replace(/\ngallery:\n(?:\s+-\s+.+\n?)*/m, "\n");
  if (gallery.length) {
    const g = ["gallery:", ...gallery.map((g) => `  - "${g}"`)].join("\n");
    fm = `${fm.trimEnd()}\n${g}`;
  }

  fs.writeFileSync(
    mdPath,
    `---\n${fm.trim()}\n---\n${body.startsWith("\n") ? body : `\n${body}`}`,
    "utf8"
  );
}

async function main() {
  const audit = JSON.parse(fs.readFileSync(AUDIT, "utf8")) as {
    issues: {
      file: string;
      facebookPostId: string;
      title: string;
      date: string;
    }[];
  };

  let repaired = 0;
  let cleared = 0;
  let stillBroken = 0;

  for (const issue of audit.issues) {
    const id = issue.facebookPostId;
    if (!id) continue;
    const dir = path.join(IMAGES, id);
    const mdPath = path.join(ROOT, issue.file);

    const fields = encodeURIComponent(
      "id,status_type,full_picture,attachments{media,type,subattachments,title}"
    );
    const apiUrl = `https://graph.facebook.com/${VER}/${id}?fields=${fields}&access_token=${TOKEN}`;
    const post = await getJson(apiUrl);
    const urls = collectUrls(post);

    if (urls.length > 0) {
      fs.mkdirSync(dir, { recursive: true });
      // remove old tiny files
      if (fs.existsSync(dir)) {
        for (const f of fs.readdirSync(dir)) {
          const p = path.join(dir, f);
          if (isTinyOrMissing(p)) {
            try {
              fs.unlinkSync(p);
            } catch {
              /* ignore */
            }
          }
        }
      }

      const local: string[] = [];
      for (let i = 0; i < urls.length; i++) {
        const n = String(i + 1).padStart(2, "0");
        const dest = path.join(dir, `${n}.jpg`);
        const ok = await download(urls[i], dest);
        if (ok) local.push(`/images/news/${id}/${n}.jpg`);
      }

      if (local.length > 0) {
        updateFrontmatterImages(mdPath, local[0], local.slice(1));
        repaired += 1;
        console.log(`REPAIRED ${issue.date} | ${issue.title.slice(0, 60)} (${local.length} imgs)`);
        continue;
      }
    }

    // Unavailable via Graph — clear corrupt files so UI can use fallback
    if (fs.existsSync(dir)) {
      for (const f of fs.readdirSync(dir)) {
        const p = path.join(dir, f);
        if (isTinyOrMissing(p)) {
          fs.unlinkSync(p);
          cleared += 1;
        }
      }
      // remove empty dir
      if (fs.readdirSync(dir).length === 0) {
        fs.rmdirSync(dir);
      }
    }

    // Point frontmatter at empty images so loader uses DEFAULT_NEWS_IMAGE
    // Keep coverImage key but set to empty / remove invalid paths
    if (fs.existsSync(mdPath)) {
      const raw = fs.readFileSync(mdPath, "utf8");
      const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
      if (match) {
        let fm = match[1];
        fm = fm.replace(/^coverImage:\s*.+$/m, `coverImage: ""`);
        fm = fm.replace(/\ngallery:\n(?:\s+-\s+.+\n?)*/m, "\n");
        fs.writeFileSync(
          mdPath,
          `---\n${fm.trim()}\n---\n${match[2].startsWith("\n") ? match[2] : `\n${match[2]}`}`,
          "utf8"
        );
      }
    }

    stillBroken += 1;
    console.log(
      `FALLBACK ${issue.date} | ${issue.title.slice(0, 60)} (Graph: ${(post as { status_type?: string }).status_type || "?"} — content unavailable)`
    );
  }

  console.log({ repaired, clearedCorruptFiles: cleared, fallbackPosts: stillBroken });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
