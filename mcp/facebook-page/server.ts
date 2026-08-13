/**
 * Facebook Page MCP Server (project-local)
 *
 * Exposes Fanpage read tools over MCP stdio for:
 * - Cursor IDE
 * - Optional npm run fetch:facebook (raw dump only; Cursor Agent does AI)
 *
 * Env (loaded from project .env automatically):
 *   FACEBOOK_PAGE_ID / FB_PAGE_ID
 *   FACEBOOK_ACCESS_TOKEN / FB_PAGE_ACCESS_TOKEN
 *   FACEBOOK_GRAPH_VERSION (default v21.0)
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "../..");

loadEnv({ path: path.join(projectRoot, ".env") });
loadEnv({ path: path.join(projectRoot, ".env.local") });

const PAGE_ID =
  process.env.FACEBOOK_PAGE_ID?.trim() ||
  process.env.FB_PAGE_ID?.trim() ||
  "";
const ACCESS_TOKEN =
  process.env.FACEBOOK_ACCESS_TOKEN?.trim() ||
  process.env.FB_PAGE_ACCESS_TOKEN?.trim() ||
  "";
const GRAPH_VERSION = process.env.FACEBOOK_GRAPH_VERSION?.trim() || "v21.0";

const POST_FIELDS = [
  "id",
  "message",
  "story",
  "created_time",
  "updated_time",
  "permalink_url",
  "full_picture",
  "status_type",
  "shares",
  "reactions.summary(true).limit(0)",
  "comments.summary(true).limit(0)",
  // .limit(100) — Graph defaults to ~12; higher limits often get rejected
  "attachments{media,type,url,target,subattachments.limit(100){media,type,url,target}}",
].join(",");

interface GraphAttachment {
  type?: string;
  media?: { image?: { src?: string } };
  subattachments?: { data?: GraphAttachment[] };
}

interface GraphPost {
  id: string;
  message?: string;
  created_time: string;
  updated_time?: string;
  permalink_url?: string;
  full_picture?: string;
  status_type?: string;
  shares?: { count?: number };
  reactions?: { summary?: { total_count?: number } };
  comments?: { summary?: { total_count?: number } };
  attachments?: { data?: GraphAttachment[] };
}

function requireCredentials(): void {
  if (!PAGE_ID || !ACCESS_TOKEN) {
    throw new Error(
      "Missing FACEBOOK_PAGE_ID / FACEBOOK_ACCESS_TOKEN (or FB_PAGE_* aliases) for Facebook MCP"
    );
  }
}

async function graphGet<T>(apiPath: string, params: Record<string, string>): Promise<T> {
  requireCredentials();
  const qs = new URLSearchParams({ ...params, access_token: ACCESS_TOKEN });
  const url = `https://graph.facebook.com/${GRAPH_VERSION}${apiPath}?${qs}`;
  const res = await fetch(url);
  const body = (await res.json()) as T & {
    error?: { message: string; code?: number };
  };
  if (!res.ok || body.error) {
    throw new Error(
      body.error?.message ?? `Facebook HTTP ${res.status}: ${res.statusText}`
    );
  }
  return body;
}

function isVideoAttachmentType(type: string): boolean {
  return type.includes("video");
}

function isPhotoAttachmentType(type: string): boolean {
  return (
    type.includes("photo") ||
    type.includes("album") ||
    type.includes("image") ||
    type === "multi_share"
  );
}

/**
 * Real photo attachments only — never video thumbnails.
 * Video-only posts are skipped upstream (skill: chỉ bài viết ảnh).
 */
function extractPhotoImages(post: GraphPost, maxImages: number): string[] {
  const photos: string[] = [];
  const pushPhoto = (src?: string) => {
    if (!src || photos.includes(src)) return;
    if (photos.length >= maxImages) return;
    // Facebook video thumbnails live under t15.* — never treat as photos
    if (/\/t15\.5256-/.test(src) || /\/v\/t15\./.test(src)) return;
    photos.push(src);
  };

  const walk = (attachments?: GraphAttachment[]) => {
    if (!attachments) return;
    for (const att of attachments) {
      if (photos.length >= maxImages) return;
      const type = (att.type ?? "").toLowerCase();

      // Skip video nodes entirely (do not take thumbnails)
      if (isVideoAttachmentType(type)) {
        continue;
      }

      if (isPhotoAttachmentType(type)) {
        pushPhoto(att.media?.image?.src);
        walk(att.subattachments?.data);
        continue;
      }

      walk(att.subattachments?.data);
    }
  };

  walk(post.attachments?.data);

  const status = (post.status_type ?? "").toLowerCase();
  const videoOnlyStatus =
    status === "added_video" || status === "shared_video";

  // full_picture only for photo / share posts — never for video
  if (photos.length === 0 && post.full_picture && !videoOnlyStatus) {
    if (
      status === "added_photos" ||
      status === "shared_story" ||
      status === "mobile_status_update" ||
      status === "shared_link" ||
      !status
    ) {
      pushPhoto(post.full_picture);
    }
  }

  // Share / link preview images (not video)
  if (photos.length === 0 && !videoOnlyStatus) {
    const walkShare = (attachments?: GraphAttachment[]) => {
      if (!attachments) return;
      for (const att of attachments) {
        const type = (att.type ?? "").toLowerCase();
        if (type === "share" || type === "link" || type.includes("share")) {
          pushPhoto(att.media?.image?.src);
        }
        walkShare(att.subattachments?.data);
      }
    };
    walkShare(post.attachments?.data);
  }

  return photos.slice(0, maxImages);
}

function postHasVideo(post: GraphPost): boolean {
  const status = (post.status_type ?? "").toLowerCase();
  if (status === "added_video" || status === "shared_video") return true;

  const walk = (attachments?: GraphAttachment[]): boolean => {
    if (!attachments) return false;
    for (const att of attachments) {
      const type = (att.type ?? "").toLowerCase();
      if (isVideoAttachmentType(type)) return true;
      if (walk(att.subattachments?.data)) return true;
    }
    return false;
  };
  return walk(post.attachments?.data);
}

function normalizePost(post: GraphPost, maxImages: number) {
  const reactionsCount = post.reactions?.summary?.total_count ?? 0;
  const commentsCount = post.comments?.summary?.total_count ?? 0;
  const sharesCount = post.shares?.count ?? 0;
  const photoImages = extractPhotoImages(post, maxImages);
  const hasVideo = postHasVideo(post);
  return {
    facebookPostId: post.id,
    id: post.id,
    message: (post.message ?? "").trim(),
    publishedAt: post.created_time,
    created_time: post.created_time,
    updatedAt: post.updated_time ?? post.created_time,
    updated_time: post.updated_time ?? post.created_time,
    facebookUrl:
      post.permalink_url ??
      `https://www.facebook.com/${post.id.replace("_", "/posts/")}`,
    permalink_url: post.permalink_url,
    /** Real photos only (no video thumbnails). */
    remoteImages: photoImages,
    images: photoImages,
    hasVideo,
    hasPhotos: photoImages.length > 0,
    engagementScore: reactionsCount + commentsCount * 2 + sharesCount * 3,
    reactionsCount,
    commentsCount,
    sharesCount,
    statusType: post.status_type,
    status_type: post.status_type,
  };
}

async function fetchPostsSince(options: {
  pageId: string;
  sinceIso: string;
  maxImages: number;
}) {
  const sinceUnix = Math.floor(new Date(options.sinceIso).getTime() / 1000);
  const collected: ReturnType<typeof normalizePost>[] = [];
  let after: string | undefined;

  for (;;) {
    const params: Record<string, string> = {
      fields: POST_FIELDS,
      since: String(sinceUnix),
      limit: "50",
    };
    if (after) params.after = after;

    const payload = await graphGet<{
      data?: GraphPost[];
      paging?: { cursors?: { after?: string }; next?: string };
    }>(`/${options.pageId}/posts`, params);

    for (const post of payload.data ?? []) {
      if (new Date(post.created_time) < new Date(options.sinceIso)) continue;
      collected.push(normalizePost(post, options.maxImages));
    }

    after = payload.paging?.cursors?.after;
    if (!payload.paging?.next || !after) break;
  }

  return collected;
}

function textResult(data: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
  };
}

const server = new McpServer({
  name: "phat-quang-quyen-facebook-page",
  version: "1.0.0",
});

server.tool(
  "get_page_info",
  "Get Facebook Fanpage metadata (name, id, category, about, cover).",
  {
    pageId: z
      .string()
      .optional()
      .describe("Page ID. Defaults to FACEBOOK_PAGE_ID / FB_PAGE_ID."),
  },
  async ({ pageId }) => {
    const id = pageId?.trim() || PAGE_ID;
    const info = await graphGet<Record<string, unknown>>(`/${id}`, {
      fields: "id,name,category,about,fan_count,followers_count,link,cover",
    });
    return textResult(info);
  }
);

server.tool(
  "get_page_posts",
  "List Fanpage posts in a lookback window with message and real photo images only (no video thumbnails), engagement.",
  {
    pageId: z.string().optional().describe("Page ID override"),
    since: z
      .string()
      .optional()
      .describe("ISO date — only posts on/after this time"),
    lookbackMonths: z
      .number()
      .int()
      .min(1)
      .max(24)
      .optional()
      .describe("If since omitted, look back N months (default 6)"),
    maxImages: z
      .number()
      .int()
      .min(1)
      .max(100)
      .optional()
      .describe(
        "Max real photos per post (default 100; video thumbnails never included)"
      ),
  },
  async (args) => {
    const id = args.pageId?.trim() || PAGE_ID;
    const months = args.lookbackMonths ?? 6;
    const sinceDate = args.since
      ? new Date(args.since)
      : (() => {
          const d = new Date();
          d.setMonth(d.getMonth() - months);
          return d;
        })();
    const maxImages = args.maxImages ?? 100;
    const posts = await fetchPostsSince({
      pageId: id,
      sinceIso: sinceDate.toISOString(),
      maxImages,
    });
    return textResult({
      pageId: id,
      since: sinceDate.toISOString(),
      count: posts.length,
      posts,
    });
  }
);

server.tool(
  "get_published_posts",
  "Alias of get_page_posts for compatibility with facebook-pages-mcp naming.",
  {
    page_id: z.string().optional(),
    limit: z.number().int().min(1).max(100).optional(),
    after: z.string().optional(),
  },
  async (args) => {
    const id = args.page_id?.trim() || PAGE_ID;
    const since = new Date();
    since.setMonth(since.getMonth() - 4);
    const posts = await fetchPostsSince({
      pageId: id,
      sinceIso: since.toISOString(),
      maxImages: 100,
    });
    const limited = posts.slice(0, args.limit ?? 25);
    return textResult({ posts: limited, has_more: posts.length > limited.length });
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
