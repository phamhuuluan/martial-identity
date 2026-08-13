/**
 * Rank Facebook-synced photos for homepage section covers.
 * Text scoring is client-safe (no fs). File quality is applied by the data layer.
 */

export const SECTION_COVER_IDS = ["gioi-thieu", "vo-dao", "quy-mo"] as const;
export type SectionCoverId = (typeof SECTION_COVER_IDS)[number];

export interface CoverCandidateInput {
  postId: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  publishedAt: string;
  engagementScore: number;
  facebookUrl: string;
  imageSrc: string;
  imageIndex: number;
}

export interface ImageQuality {
  bytes: number;
  width: number;
  height: number;
  kind: "jpeg" | "png" | "webp" | "gif" | "unknown";
  extMismatch: boolean;
  stub: boolean;
  /** 0–1: texture of many figures (edge density), not darkness. */
  crowd: number;
  sceneryLikely: boolean;
  /** Fraction of dark pixels — high + tight crop often means a close-up, not a crowd. */
  darkRatio: number;
}

export interface ScoredCover {
  section: SectionCoverId;
  src: string;
  score: number;
  postId: string;
  title: string;
  facebookUrl: string;
  category: string;
  publishedAt: string;
  reasons: string[];
  width: number;
  height: number;
  bytes: number;
}

interface Cluster {
  id: string;
  weight: number;
  patterns: RegExp[];
}

interface Penalty {
  id: string;
  weight: number;
  test: (ctx: { text: string; title: string; category: string }) => boolean;
}

const VO_DAO_CLUSTERS: Cluster[] = [
  {
    id: "spirit",
    weight: 28,
    patterns: [
      /tinh\s*thần\s*võ\s*đạo/,
      /võ\s*đạo/,
      /rèn\s*đức/,
      /tu\s*tập/,
      /kỷ\s*luật/,
      /lời\s*thề/,
      /nhân\s*cách/,
      /đạo\s*đức/,
    ],
  },
  {
    id: "training",
    weight: 22,
    patterns: [
      /tập\s*luyện/,
      /rèn\s*luyện/,
      /luyện\s*tập/,
      /sân\s*tập/,
      /võ\s*phục/,
      /huấn\s*luyện/,
      /miệt\s*mài/,
      /thăng\s*cấp\s*đai/,
      /kỳ\s*thi\s*thăng/,
    ],
  },
  {
    id: "collective",
    weight: 26,
    patterns: [
      /đoàn\s*kết/,
      /đồng\s*lòng/,
      /huynh\s*đệ/,
      /tập\s*thể/,
      /toàn\s*thể\s*(võ|môn)\s*sinh/,
      /võ\s*sinh.{0,12}môn\s*sinh/,
      /môn\s*sinh.{0,12}võ\s*sinh/,
      /nhiều\s*con\s*người/,
      /đồng\s*hành/,
    ],
  },
  {
    id: "service",
    weight: 18,
    patterns: [
      /phụng\s*sự/,
      /thiện\s*nguyện/,
      /giúp\s*đời/,
      /từ\s*tế/,
      /sẻ\s*chia/,
      /cộng\s*đồng/,
    ],
  },
  {
    id: "community-life",
    weight: 14,
    patterns: [
      /sinh\s*hoạt/,
      /võ\s*đường/,
      /tổng\s*kết/,
      /tri\s*ân/,
      /tất\s*niên/,
    ],
  },
];

const QUY_MO_CLUSTERS: Cluster[] = [
  {
    id: "network",
    weight: 26,
    patterns: [
      /võ\s*đường/,
      /câu\s*lạc\s*bộ|\bclb\b/,
      /tổng\s*đường/,
      /tổ\s*đình/,
      /nhiều\s*(clb|câu\s*lạc\s*bộ|võ\s*đường|đơn\s*vị)/,
      /các\s*(clb|câu\s*lạc\s*bộ|võ\s*đường|đơn\s*vị)/,
    ],
  },
  {
    id: "crowd",
    weight: 30,
    patterns: [
      /hàng\s*(trăm|nghìn|ngàn)/,
      /đông\s*(đảo|nghịt|người|vui)/,
      /toàn\s*thể/,
      /đội\s*ngũ/,
      /nhiều\s*võ\s*sinh/,
      /võ\s*sinh.{0,20}(đông|tập\s*trung|tham\s*gia)/,
      /nhiều\s*con\s*người/,
      /hơn\s*\d{2,4}\s*(vận\s*động\s*viên|võ\s*sinh|đơn\s*vị|đoàn)/,
      /\d{2,4}\s*(võ\s*sinh|môn\s*sinh|vận\s*động\s*viên|đơn\s*vị|đoàn)/,
    ],
  },
  {
    id: "large-event",
    weight: 22,
    patterns: [
      /liên\s*hoan/,
      /festival/,
      /khai\s*mạc/,
      /biểu\s*diễn/,
      /đồng\s*diễn/,
      /quy\s*mô/,
      /toàn\s*cảnh/,
      /quốc\s*tế/,
      /toàn\s*quốc/,
    ],
  },
  {
    id: "geography",
    weight: 16,
    patterns: [
      /miền\s*(bắc|trung|nam)/,
      /nhật\s*bản|đài\s*loan|singapore|algeria/,
      /nhiều\s*(tỉnh|thành|địa\s*phương)/,
      /cả\s*nước/,
    ],
  },
];

const GIOI_THIEU_CLUSTERS: Cluster[] = [
  {
    id: "identity",
    weight: 28,
    patterns: [
      /phật\s*quang\s*quyền/,
      /môn\s*phái/,
      /võ\s*đường/,
      /môn\s*sinh/,
      /võ\s*sinh/,
      /võ\s*cổ\s*truyền/,
    ],
  },
  {
    id: "lineage",
    weight: 18,
    patterns: [
      /chưởng\s*môn/,
      /sáng\s*tổ/,
      /thái\s*tổ/,
      /tổ\s*đình/,
      /thầy\s*tổ/,
      /thích\s*chân\s*quang/,
      /thích\s*nghiêm\s*giám/,
    ],
  },
  {
    id: "signature-activity",
    weight: 22,
    patterns: [
      /biểu\s*diễn/,
      /tập\s*luyện/,
      /tập\s*thể/,
      /võ\s*phục/,
      /đồng\s*phục/,
      /khai\s*mạc/,
      /liên\s*hoan/,
    ],
  },
  {
    id: "representative",
    weight: 16,
    patterns: [
      /hình\s*ảnh\s*(các\s*)?(võ|môn)\s*sinh/,
      /khoảnh\s*khắc/,
      /đại\s*diện/,
      /bản\s*sắc/,
      /tinh\s*hoa/,
    ],
  },
];

const SHARED_PENALTIES: Penalty[] = [
  {
    id: "link-only",
    weight: 40,
    test: ({ title, text }) =>
      /https?:\/\//.test(title) ||
      /^(theo\s+qdnd|https?:)/i.test(title.trim()) ||
      (text.length < 80 && /https?:\/\//.test(text)),
  },
  {
    id: "document",
    weight: 32,
    test: ({ title, text }) =>
      /điều\s*lệ|thông\s*báo|công\s*văn|kế\s*hoạch\s*hoạt\s*động|tin\s*nóng\s*cho/i.test(
        title
      ) || /điều\s*lệ\s*giải/.test(text),
  },
  {
    id: "shared-press",
    weight: 24,
    test: ({ text }) =>
      /theo\s+qdnd|nhandan|báo\s+nghệ\s+an|nguồn:\s*báo/i.test(text),
  },
];

const SECTION_PENALTIES: Record<SectionCoverId, Penalty[]> = {
  "vo-dao": [
    {
      id: "solo-medal",
      weight: 28,
      test: ({ title, text, category }) =>
        category === "competitions" &&
        /(huy\s*chương|hcv|vô\s*địch|quán\s*quân|chúc\s*mừng)/i.test(title) &&
        !/(tập\s*thể|võ\s*sinh|môn\s*sinh|đoàn\s*kết|võ\s*đạo|huynh\s*đệ)/i.test(
          text
        ),
    },
    {
      id: "pure-bout",
      weight: 18,
      test: ({ text, category }) =>
        category === "competitions" &&
        /(đối\s*kháng|chung\s*kết|bán\s*kết|ngày\s*thi\s*đấu)/i.test(text) &&
        !/(võ\s*đạo|đoàn\s*kết|rèn\s*luyện|tập\s*thể|huynh\s*đệ|thiện\s*nguyện)/i.test(
          text
        ),
    },
  ],
  "quy-mo": [
    {
      id: "solo-athlete",
      weight: 30,
      test: ({ title, text }) =>
        /(vđv|vận\s*động\s*viên)\s+[A-ZÀ-Ỹ]/.test(title) ||
        (/(hcv|huy\s*chương\s*vàng)/i.test(title) &&
          !/(đoàn|nhiều|các\s*võ|tập\s*thể|clb|võ\s*đường|liên\s*hoan)/i.test(
            text
          )),
    },
    {
      id: "small-notice",
      weight: 22,
      test: ({ title }) => /tuyển\s*tình\s*nguyện|điều\s*lệ/i.test(title),
    },
  ],
  "gioi-thieu": [
    {
      id: "too-narrow",
      weight: 20,
      test: ({ title, text }) =>
        /điều\s*lệ|thông\s*báo|kính\s*mừng\s+ngày\s+đức\s*phật|luật\s*nhân\s*quả/i.test(
          title
        ) ||
        (/trồng\s*cây|nhặt\s*rác/.test(text) &&
          !/(võ\s*sinh|môn\s*phái|võ\s*đường|võ\s*phục)/i.test(text)),
    },
    {
      id: "single-club-trivia",
      weight: 12,
      test: ({ title, text }) =>
        /an\s*toàn\s*điện|kể\s*chuyện/.test(title) &&
        !/võ\s*đường|môn\s*phái|võ\s*sinh/.test(text),
    },
    {
      id: "too-specific-overseas",
      weight: 26,
      test: ({ text }) =>
        /(nhật\s*bản|aichi|daiyuin|đài\s*loan|singapore)/i.test(text) &&
        !/(hàng\s*(trăm|nghìn)|nhiều\s*(clb|võ\s*đường|đơn\s*vị)|liên\s*hoan|festival|toàn\s*thể)/i.test(
          text
        ),
    },
    {
      id: "generic-festival-floor",
      weight: 22,
      test: ({ text }) =>
        /(lễ\s*hội\s*võ\s*việt|đất\s*phương\s*nam|liên\s*hoan\s*quốc\s*tế|festival\s*võ\s*thuật)/i.test(
          text
        ) && !/(môn\s*phái|tổ\s*đình|võ\s*đường\s+(thắng|pháp|hồng|viên)\s*quang)/i.test(text),
    },
  ],
};

const CATEGORY_BONUS: Record<
  SectionCoverId,
  Partial<Record<string, number>>
> = {
  "vo-dao": {
    activities: 8,
    ceremonies: 12,
    beltexams: 10,
    training: 9,
    performances: 6,
    charity: 8,
    competitions: -6,
  },
  "quy-mo": {
    competitions: 6,
    performances: 5,
    activities: 8,
    training: 4,
    charity: 2,
    ceremonies: 2,
  },
  "gioi-thieu": {
    activities: 10,
    ceremonies: 8,
    performances: 6,
    beltexams: 5,
    competitions: 4,
    charity: 2,
  },
};

function normalize(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

function hashtagText(content: string, tags: string[]): string {
  const fromBody = [...content.matchAll(/#[^\s#]+/g)].map((m) => m[0]);
  return [...fromBody, ...tags.map((t) => `#${t}`)].join(" ");
}

function clusterScore(
  text: string,
  clusters: Cluster[]
): { score: number; hitIds: string[] } {
  let score = 0;
  const hitIds: string[] = [];
  for (const cluster of clusters) {
    let hits = 0;
    for (const p of cluster.patterns) {
      if (p.test(text)) hits += 1;
    }
    if (hits === 0) continue;
    hitIds.push(cluster.id);
    // Diminishing returns inside a cluster — keyword spam does not win.
    const strength = Math.min(hits, 3);
    score += cluster.weight * (0.55 + 0.45 * (strength / 3));
  }
  return { score, hitIds };
}

function applyPenalties(
  section: SectionCoverId,
  ctx: { text: string; title: string; category: string }
): { penalty: number; ids: string[] } {
  let penalty = 0;
  const ids: string[] = [];
  for (const p of [...SHARED_PENALTIES, ...SECTION_PENALTIES[section]]) {
    if (p.test(ctx)) {
      penalty += p.weight;
      ids.push(p.id);
    }
  }
  return { penalty, ids };
}

/** Landscape group scenes beat tall solo portraits for full-bleed covers. */
function imageFitScore(
  section: SectionCoverId,
  q: ImageQuality
): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;
  const area = q.width * q.height;
  const ratio = q.width / Math.max(q.height, 1);

  if (q.bytes >= 180_000) {
    score += 18;
    reasons.push("file lớn / chi tiết cao");
  } else if (q.bytes >= 80_000) {
    score += 12;
    reasons.push("file đủ chất lượng");
  } else if (q.bytes >= 25_000) {
    score += 4;
  }

  if (q.width >= 1200 && q.height >= 800) {
    score += 14;
    reasons.push(`${q.width}×${q.height}`);
  } else if (q.width >= 800 && q.height >= 600) {
    score += 8;
    reasons.push(`${q.width}×${q.height}`);
  } else {
    score -= 8;
    reasons.push(`kích thước thấp ${q.width}×${q.height}`);
  }

  if (section === "quy-mo") {
    if (ratio >= 1.25) {
      score += 16;
      reasons.push("khung ngang — phù hợp toàn cảnh");
    } else if (ratio < 0.85) {
      score -= 14;
      reasons.push("khung dọc — kém phù hợp quy mô");
    }
  } else if (section === "vo-dao") {
    if (ratio >= 1.15) {
      score += 12;
      reasons.push("khung ngang — cảnh tập thể");
    } else if (ratio < 0.8) {
      score -= 8;
      reasons.push("khung dọc — dễ là chân dung đơn");
    }
  } else if (ratio >= 0.7 && ratio <= 1.6) {
    score += 8;
    reasons.push("tỷ lệ ổn cho cột giới thiệu");
    if (area >= 1_200_000) score += 6;
  }

  if (q.sceneryLikely) {
    const hit = section === "quy-mo" ? 36 : 28;
    score -= hit;
    reasons.push("ảnh nghi là tượng/phong cảnh, ít võ sinh");
  } else if (q.crowd >= 0.45) {
    const bonus = section === "quy-mo" ? 20 : 16;
    score += bonus;
    reasons.push(`kết cấu đám đông ${(q.crowd * 100).toFixed(0)}%`);
  } else if (q.crowd >= 0.28) {
    score += 8;
    reasons.push(`có nhiều chi tiết người ${(q.crowd * 100).toFixed(0)}%`);
  } else {
    score -= 10;
    reasons.push("ít kết cấu võ sinh trong ảnh");
  }

  // Close-up of a handful of people filling the frame ≠ quy mô / ảnh đại diện.
  if (q.darkRatio > 0.55 && ratio < 1.45) {
    const hit = section === "vo-dao" ? 8 : 20;
    score -= hit;
    reasons.push("khung chặt / ít người — kém đại diện");
  }
  if (ratio >= 1.7) {
    score += section === "gioi-thieu" ? 10 : 14;
    reasons.push("khung panorama — nhóm rộng");
  }

  return { score, reasons };
}

export function isRejectQuality(q: ImageQuality): boolean {
  if (q.stub) return true;
  if (q.extMismatch) return true;
  if (q.kind === "unknown") return true;
  if (q.bytes < 8_000) return true;
  if (q.width < 400 || q.height < 400) return true;
  if (q.width <= 8 || q.height <= 8) return true;
  return false;
}

/**
 * Semantic + quality score for one (post, image) against one section.
 * Returns null when the pair is not eligible (too weak or bad file).
 */
export function scoreCoverCandidate(
  section: SectionCoverId,
  item: CoverCandidateInput,
  quality: ImageQuality
): ScoredCover | null {
  if (isRejectQuality(quality)) return null;
  // All three covers need people in frame — skip statue/sky shots even if text matches.
  if (quality.sceneryLikely && quality.crowd < 0.28) return null;
  if (section === "quy-mo" && quality.crowd < 0.22) return null;

  const body = normalize(
    [item.title, item.summary, item.content, hashtagText(item.content, item.tags)].join(
      "\n"
    )
  );
  const title = item.title;
  const clusters =
    section === "vo-dao"
      ? VO_DAO_CLUSTERS
      : section === "quy-mo"
        ? QUY_MO_CLUSTERS
        : GIOI_THIEU_CLUSTERS;

  const { score: semantic, hitIds } = clusterScore(body, clusters);
  const distinctClusters = hitIds.length;

  // Keyword spam in one cluster is not enough — need meaning across facets.
  const strongPhrase =
    section === "vo-dao"
      ? /tinh\s*thần\s*võ\s*đạo|rèn\s*đức|huynh\s*đệ/.test(body)
      : section === "quy-mo"
        ? /hàng\s*(trăm|nghìn|ngàn)|nhiều\s*(clb|câu\s*lạc\s*bộ|võ\s*đường|đơn\s*vị)|liên\s*hoan|festival/.test(
            body
          )
        : /phật\s*quang\s*quyền|môn\s*phái|võ\s*đường/.test(body);

  if (distinctClusters < 2 && !strongPhrase) return null;
  if (semantic < 22) return null;

  const { penalty, ids: penaltyIds } = applyPenalties(section, {
    text: body,
    title,
    category: item.category,
  });

  const catBonus = CATEGORY_BONUS[section][item.category] ?? 0;
  const engagementBonus = Math.min(12, Math.log10(item.engagementScore + 1) * 6);
  const recencyBonus = item.publishedAt.startsWith("2026") ? 4 : 0;
  const schoolBonus =
    section === "gioi-thieu" &&
    /môn\s*phái|tổ\s*đình|võ\s*đường/.test(item.title)
      ? 14
      : 0;
  const { score: fit, reasons: fitReasons } = imageFitScore(
    section,
    quality
  );

  const score =
    semantic +
    catBonus +
    engagementBonus +
    recencyBonus +
    schoolBonus +
    fit -
    penalty;

  if (score < 36) return null;

  const reasons: string[] = [
    `cụm ngữ nghĩa: ${hitIds.join(", ") || "—"}`,
    `điểm nội dung ${Math.round(semantic)}`,
  ];
  if (catBonus) reasons.push(`category ${item.category} ${catBonus > 0 ? "+" : ""}${catBonus}`);
  if (schoolBonus) reasons.push("tiêu đề gắn môn phái / võ đường / tổ đình");
  if (penaltyIds.length) reasons.push(`phạt: ${penaltyIds.join(", ")}`);
  reasons.push(...fitReasons);

  return {
    section,
    src: item.imageSrc,
    score,
    postId: item.postId,
    title: item.title,
    facebookUrl: item.facebookUrl,
    category: item.category,
    publishedAt: item.publishedAt,
    reasons,
    width: quality.width,
    height: quality.height,
    bytes: quality.bytes,
  };
}

/** Assign one unique image per section, maximizing score without reuse. */
export function assignUniqueSectionCovers(
  ranked: Record<SectionCoverId, ScoredCover[]>
): Record<SectionCoverId, ScoredCover | null> {
  const remaining = new Set<SectionCoverId>(SECTION_COVER_IDS);
  const used = new Set<string>();
  const picks = {
    "gioi-thieu": null,
    "vo-dao": null,
    "quy-mo": null,
  } as Record<SectionCoverId, ScoredCover | null>;

  while (remaining.size) {
    let best: { section: SectionCoverId; cand: ScoredCover } | null = null;
    for (const section of remaining) {
      const cand = ranked[section].find((c) => !used.has(c.src));
      if (!cand) continue;
      if (!best || cand.score > best.cand.score) {
        best = { section, cand };
      }
    }
    if (!best) break;
    picks[best.section] = best.cand;
    used.add(best.cand.src);
    remaining.delete(best.section);
  }

  return picks;
}
