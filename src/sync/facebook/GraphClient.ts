import type { SyncConfig } from "../config";
import type { FacebookPostReader } from "./FacebookPostReader";
import type {
  FacebookAttachment,
  FacebookPost,
  FacebookPostsResponse,
  NormalizedFacebookPost,
} from "./types";

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

export class FacebookGraphClient implements FacebookPostReader {
  readonly sourceName = "graph" as const;

  private readonly baseUrl: string;
  private readonly token: string;
  private readonly pageId: string;
  private readonly maxImages: number;

  constructor(config: SyncConfig) {
    this.baseUrl = `https://graph.facebook.com/${config.graphApiVersion}`;
    this.token = config.facebookAccessToken;
    this.pageId = config.facebookPageId;
    this.maxImages = config.maxImagesPerPost;
  }

  async fetchPostsSince(since: Date): Promise<NormalizedFacebookPost[]> {
    const sinceUnix = Math.floor(since.getTime() / 1000);
    const collected: NormalizedFacebookPost[] = [];
    let url: string | null = this.buildInitialUrl(sinceUnix);

    while (url) {
      const payload: FacebookPostsResponse =
        await this.getJson<FacebookPostsResponse>(url);
      if (payload.error) {
        throw new Error(
          `Facebook Graph API error: ${payload.error.message} (code ${payload.error.code ?? "?"})`
        );
      }

      for (const post of payload.data ?? []) {
        const created = new Date(post.created_time);
        if (created < since) continue;
        collected.push(this.normalize(post));
      }

      url = payload.paging?.next ?? null;
    }

    return collected;
  }

  private buildInitialUrl(sinceUnix: number): string {
    const params = new URLSearchParams({
      fields: POST_FIELDS,
      since: String(sinceUnix),
      limit: "50",
      access_token: this.token,
    });
    return `${this.baseUrl}/${this.pageId}/posts?${params.toString()}`;
  }

  private async getJson<T>(url: string): Promise<T> {
    const res = await fetch(url);
    const body = (await res.json()) as T & {
      error?: { message: string; code?: number };
    };
    if (!res.ok) {
      const message = body.error?.message ?? res.statusText;
      throw new Error(`Facebook HTTP ${res.status}: ${message}`);
    }
    return body;
  }

  private normalize(post: FacebookPost): NormalizedFacebookPost {
    const reactionsCount = post.reactions?.summary?.total_count ?? 0;
    const commentsCount = post.comments?.summary?.total_count ?? 0;
    const sharesCount = post.shares?.count ?? 0;
    const engagementScore =
      reactionsCount + commentsCount * 2 + sharesCount * 3;

    return {
      facebookPostId: post.id,
      message: (post.message ?? "").trim(),
      publishedAt: post.created_time,
      updatedAt: post.updated_time ?? post.created_time,
      facebookUrl:
        post.permalink_url ??
        `https://www.facebook.com/${post.id.replace("_", "/posts/")}`,
      remoteImages: this.extractImages(post),
      engagementScore,
      reactionsCount,
      commentsCount,
      sharesCount,
      statusType: post.status_type,
    };
  }

  /**
   * Real photo attachments only — never video thumbnails.
   */
  private extractImages(post: FacebookPost): string[] {
    const photos: string[] = [];
    const pushPhoto = (src?: string) => {
      if (!src || photos.includes(src)) return;
      if (photos.length >= this.maxImages) return;
      if (/\/t15\.5256-/.test(src) || /\/v\/t15\./.test(src)) return;
      photos.push(src);
    };

    const isVideoType = (type: string) => type.includes("video");
    const isPhotoType = (type: string) =>
      type.includes("photo") ||
      type.includes("album") ||
      type.includes("image") ||
      type === "multi_share";

    const walk = (attachments?: FacebookAttachment[]) => {
      if (!attachments) return;
      for (const att of attachments) {
        if (photos.length >= this.maxImages) return;
        const type = (att.type ?? "").toLowerCase();

        if (isVideoType(type)) {
          continue;
        }

        if (isPhotoType(type)) {
          pushPhoto(att.media?.image?.src);
          if (att.subattachments?.data) walk(att.subattachments.data);
          continue;
        }

        if (att.subattachments?.data) walk(att.subattachments.data);
      }
    };

    walk(post.attachments?.data);

    const status = (post.status_type ?? "").toLowerCase();
    const videoOnlyStatus =
      status === "added_video" || status === "shared_video";

    if (photos.length === 0 && post.full_picture && !videoOnlyStatus) {
      if (status === "added_photos" || !status) pushPhoto(post.full_picture);
    }

    return photos.slice(0, this.maxImages);
  }
}

export function monthsAgo(months: number, from = new Date()): Date {
  const d = new Date(from);
  d.setMonth(d.getMonth() - months);
  return d;
}
