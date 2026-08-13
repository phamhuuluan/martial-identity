import { getAllNews } from "@/data/news";
import { inspectPublicImage } from "@/data/imageMeta";
import {
  SECTION_COVER_IDS,
  assignUniqueSectionCovers,
  scoreCoverCandidate,
  type ScoredCover,
  type SectionCoverId,
} from "@/domain/sectionCovers";

export interface SectionCoverPick {
  section: SectionCoverId;
  src: string;
  alt: string;
  postId: string;
  title: string;
  facebookUrl: string;
  category: string;
  publishedAt: string;
  score: number;
  reasons: string[];
  width: number;
  height: number;
  bytes: number;
}

async function rankAll(): Promise<Record<SectionCoverId, ScoredCover[]>> {
  const ranked: Record<SectionCoverId, ScoredCover[]> = {
    "gioi-thieu": [],
    "vo-dao": [],
    "quy-mo": [],
  };

  const seenQuality = new Map<
    string,
    Awaited<ReturnType<typeof inspectPublicImage>>
  >();

  for (const post of getAllNews()) {
    if (!post.images.length) continue;
    for (let i = 0; i < post.images.length; i += 1) {
      const src = post.images[i];
      let quality = seenQuality.get(src);
      if (quality === undefined) {
        quality = await inspectPublicImage(src);
        seenQuality.set(src, quality);
      }
      if (!quality) continue;

      const input = {
        postId: post.id,
        title: post.title,
        summary: post.summary,
        content: post.content,
        category: post.category,
        tags: post.tags,
        publishedAt: post.publishedAt,
        engagementScore: post.engagementScore,
        facebookUrl: post.facebookUrl,
        imageSrc: src,
        imageIndex: i,
      };

      for (const section of SECTION_COVER_IDS) {
        const scored = scoreCoverCandidate(section, input, quality);
        if (scored) ranked[section].push(scored);
      }
    }
  }

  for (const section of SECTION_COVER_IDS) {
    ranked[section].sort((a, b) => b.score - a.score);
  }
  return ranked;
}

function toPick(section: SectionCoverId, c: ScoredCover): SectionCoverPick {
  return {
    section,
    src: c.src,
    alt:
      section === "vo-dao"
        ? `${c.title} — tinh thần võ đạo`
        : section === "quy-mo"
          ? `${c.title} — quy mô hoạt động`
          : `${c.title} — Phật Quang Quyền`,
    postId: c.postId,
    title: c.title,
    facebookUrl: c.facebookUrl,
    category: c.category,
    publishedAt: c.publishedAt,
    score: c.score,
    reasons: c.reasons,
    width: c.width,
    height: c.height,
    bytes: c.bytes,
  };
}

let cached: Promise<Record<SectionCoverId, SectionCoverPick | null>> | null =
  null;

/** Build-time / server-only. One unique Facebook photo per section. */
export function selectHomepageSectionCovers(): Promise<
  Record<SectionCoverId, SectionCoverPick | null>
> {
  if (!cached) {
    cached = rankAll().then((ranked) => {
      const assigned = assignUniqueSectionCovers(ranked);
      return {
        "gioi-thieu": assigned["gioi-thieu"]
          ? toPick("gioi-thieu", assigned["gioi-thieu"])
          : null,
        "vo-dao": assigned["vo-dao"]
          ? toPick("vo-dao", assigned["vo-dao"])
          : null,
        "quy-mo": assigned["quy-mo"]
          ? toPick("quy-mo", assigned["quy-mo"])
          : null,
      };
    });
  }
  return cached;
}

/** For audits / scripts — ranking before unique assignment. */
export async function rankHomepageSectionCovers(limit = 8) {
  const ranked = await rankAll();
  const assigned = assignUniqueSectionCovers(ranked);
  return {
    ranked,
    assigned,
    top: {
      "gioi-thieu": ranked["gioi-thieu"].slice(0, limit),
      "vo-dao": ranked["vo-dao"].slice(0, limit),
      "quy-mo": ranked["quy-mo"].slice(0, limit),
    },
  };
}
