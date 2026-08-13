import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import type { ImageQuality } from "@/domain/sectionCovers";

function extOf(src: string): string {
  return path.extname(src).toLowerCase().replace(".", "");
}

function kindFrom(format: string | undefined): ImageQuality["kind"] {
  if (format === "jpeg") return "jpeg";
  if (format === "png") return "png";
  if (format === "webp") return "webp";
  if (format === "gif") return "gif";
  return "unknown";
}

/**
 * Downsample and estimate whether the frame is a crowd of people
 * (dark uniforms, high texture) vs a statue/landscape (bright, smooth).
 */
async function visualCrowd(absPath: string): Promise<{
  crowd: number;
  sceneryLikely: boolean;
  edge: number;
  darkRatio: number;
}> {
  try {
    const { data, info } = await sharp(absPath)
      .resize(96, 54, { fit: "cover" })
      .greyscale()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const w = info.width;
    const h = info.height;
    const n = w * h;
    if (n === 0) {
      return { crowd: 0, sceneryLikely: true, edge: 0, darkRatio: 0 };
    }

    let dark = 0;
    let bright = 0;
    let edge = 0;
    for (let i = 0; i < n; i += 1) {
      const v = data[i];
      if (v < 95) dark += 1;
      if (v > 200) bright += 1;
    }
    for (let y = 0; y < h - 1; y += 1) {
      for (let x = 0; x < w - 1; x += 1) {
        const i = y * w + x;
        edge += Math.abs(data[i] - data[i + 1]) + Math.abs(data[i] - data[i + w]);
      }
    }
    edge /= (w - 1) * (h - 1) * 2;
    const darkRatio = dark / n;
    const brightRatio = bright / n;
    // Texture of many figures — not "how dark is the frame".
    const crowd = Math.max(0, Math.min(1, (edge - 11) / 10));
    const sceneryLikely = brightRatio > 0.32 && edge < 13;
    return { crowd, sceneryLikely, edge, darkRatio };
  } catch {
    return { crowd: 0, sceneryLikely: false, edge: 0, darkRatio: 0 };
  }
}

export async function inspectLocalImage(
  absPath: string
): Promise<ImageQuality | null> {
  try {
    const img = sharp(absPath);
    const meta = await img.metadata();
    const bytes = fs.statSync(absPath).size;
    const width = meta.width ?? 0;
    const height = meta.height ?? 0;
    const kind = kindFrom(meta.format);
    const ext = extOf(absPath);
    const extMismatch =
      (kind === "png" && (ext === "jpg" || ext === "jpeg")) ||
      (kind === "jpeg" && ext === "png") ||
      (kind === "webp" && ext !== "webp");
    const stub =
      bytes < 200 ||
      width <= 8 ||
      height <= 8 ||
      (kind === "png" && bytes < 400 && width <= 16);

    const vis = stub
      ? { crowd: 0, sceneryLikely: true, edge: 0, darkRatio: 0 }
      : await visualCrowd(absPath);

    return {
      bytes,
      width,
      height,
      kind,
      extMismatch,
      stub,
      crowd: vis.crowd,
      sceneryLikely: vis.sceneryLikely,
      darkRatio: vis.darkRatio,
    };
  } catch {
    return null;
  }
}

export async function inspectPublicImage(
  src: string
): Promise<ImageQuality | null> {
  if (!src.startsWith("/")) return null;
  const abs = path.join(process.cwd(), "public", src.replace(/^\//, ""));
  return inspectLocalImage(abs);
}
