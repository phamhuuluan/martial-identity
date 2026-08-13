import type { SyncConfig } from "../config";
import type { NormalizedFacebookPost } from "../facebook/types";

const REJECT_PATTERNS: RegExp[] = [
  /\bcheck[\s-]?in\b/i,
  /\bchecked in\b/i,
  /\blivestream\b/i,
  /\blive stream\b/i,
  /\bđang phát trực tiếp\b/i,
  /\bsinh nhật\b/i,
  /\bhappy birthday\b/i,
  /\bstory\b/i,
];

const STATUS_REJECT = new Set([
  "created_note",
  "created_event",
  "wall_post",
  /** Video / reel posts — skill: chỉ đồng bộ bài ảnh */
  "added_video",
  "shared_video",
]);

function isVideoPost(post: NormalizedFacebookPost): boolean {
  const status = (post.statusType ?? "").toLowerCase();
  if (STATUS_REJECT.has(status)) return true;
  const url = post.facebookUrl ?? "";
  if (/\/videos\//i.test(url) || /\/reel\//i.test(url) || /\/watch\//i.test(url)) {
    return true;
  }
  return false;
}

/**
 * Drop check-ins, livestreams, birthdays, stories, video/reel posts,
 * very short posts, and posts without ≥1 real photo.
 * Never accept video thumbnails as photos.
 */
export class PostFilter {
  constructor(private readonly config: SyncConfig) {}

  filter(posts: NormalizedFacebookPost[]): NormalizedFacebookPost[] {
    return posts.filter((post) => this.isEligible(post));
  }

  isEligible(post: NormalizedFacebookPost): boolean {
    if (!post.message || post.message.length < this.config.minMessageLength) {
      return false;
    }

    if (isVideoPost(post)) {
      return false;
    }

    const haystack = `${post.message}\n${post.statusType ?? ""}`;
    if (REJECT_PATTERNS.some((re) => re.test(haystack))) {
      return false;
    }

    if (/^[^.]{0,40}$/.test(post.message) && post.remoteImages.length === 0) {
      return false;
    }

    // Need at least one real photo (video thumbnails must already be stripped)
    if (!post.remoteImages || post.remoteImages.length === 0) {
      return false;
    }

    return true;
  }
}
