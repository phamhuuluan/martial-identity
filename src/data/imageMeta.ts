import fs from "node:fs";
import path from "node:path";
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
 * Header-only dimensions. Do not use `sharp` here: Next.js already loads
 * sharp for `/_next/image`, and calling it again from the App Router
 * request path (thousands of news stills) throws
 * `RangeError: Maximum call stack size exceeded` as an unhandledRejection
 * and hangs the page render.
 */
function readDimensions(
  buf: Buffer
): { width: number; height: number; format: string } | null {
  if (buf.length < 16) return null;

  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
    if (buf.length < 24) return null;
    return {
      width: buf.readUInt32BE(16),
      height: buf.readUInt32BE(20),
      format: "png",
    };
  }

  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38) {
    return {
      width: buf.readUInt16LE(6),
      height: buf.readUInt16LE(8),
      format: "gif",
    };
  }

  if (
    buf.toString("ascii", 0, 4) === "RIFF" &&
    buf.toString("ascii", 8, 12) === "WEBP"
  ) {
    const kind = buf.toString("ascii", 12, 16);
    if (kind === "VP8X" && buf.length >= 30) {
      return {
        width: 1 + buf.readUIntLE(24, 3),
        height: 1 + buf.readUIntLE(27, 3),
        format: "webp",
      };
    }
    if (kind === "VP8 " && buf.length >= 30) {
      return {
        width: buf.readUInt16LE(26) & 0x3fff,
        height: buf.readUInt16LE(28) & 0x3fff,
        format: "webp",
      };
    }
    if (kind === "VP8L" && buf.length >= 25) {
      const bits = buf.readUInt32LE(21);
      return {
        width: (bits & 0x3fff) + 1,
        height: ((bits >> 14) & 0x3fff) + 1,
        format: "webp",
      };
    }
    return null;
  }

  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 < buf.length) {
      if (buf[offset] !== 0xff) break;
      const marker = buf[offset + 1];
      if (marker === 0xda) break;
      const len = buf.readUInt16BE(offset + 2);
      if (len < 2) break;
      if (
        (marker >= 0xc0 && marker <= 0xc3) ||
        (marker >= 0xc5 && marker <= 0xc7) ||
        (marker >= 0xc9 && marker <= 0xcb) ||
        (marker >= 0xcd && marker <= 0xcf)
      ) {
        return {
          height: buf.readUInt16BE(offset + 5),
          width: buf.readUInt16BE(offset + 7),
          format: "jpeg",
        };
      }
      offset += 2 + len;
    }
  }

  return null;
}

/** Layout proxy for crowd/scenery when pixels are not decoded. */
function layoutCrowd(width: number, height: number, bytes: number): {
  crowd: number;
  sceneryLikely: boolean;
  darkRatio: number;
} {
  const ratio = width / Math.max(height, 1);
  const large = bytes >= 80_000 && width >= 800;
  let crowd = 0.32;
  if (ratio >= 1.45 && large) crowd = 0.5;
  else if (ratio >= 1.15) crowd = 0.4;
  else if (ratio < 0.8) crowd = 0.24;
  return { crowd, sceneryLikely: false, darkRatio: 0.4 };
}

async function inspectLocalImage(
  absPath: string
): Promise<ImageQuality | null> {
  try {
    const st = await fs.promises.stat(absPath);
    const bytes = st.size;
    if (bytes < 24) return null;
    const fh = await fs.promises.open(absPath, "r");
    const buf = Buffer.alloc(Math.min(bytes, 16 * 1024));
    const { bytesRead: n } = await fh.read(buf, 0, buf.length, 0);
    await fh.close();
    const dim = readDimensions(buf.subarray(0, n));
    if (!dim) return null;

    const width = dim.width;
    const height = dim.height;
    const kind = kindFrom(dim.format);
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
      ? { crowd: 0, sceneryLikely: true, darkRatio: 0 }
      : layoutCrowd(width, height, bytes);

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
