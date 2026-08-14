import {
  LEGACY_NEWS_CATEGORIES,
  NEWS_CATEGORIES,
  mapToDisplayCategory,
  type NewsCategory,
} from "../domain/news";

/**
 * Phân loại bài Fanpage theo nhóm nội dung phát hiện từ dữ liệu thực tế.
 *
 * Nhóm hiện có (sau phân tích title + body 6 tháng gần nhất):
 * competitions | charity | ceremonies | beltexams | performances | training | activities
 *
 * Bản chất bài viết trước; khi đa tín hiệu mới dùng thứ tự ưu tiên:
 * beltexams → competitions → charity → ceremonies → performances → training → activities
 */

export const NEWS_CONTENT_CATEGORIES = NEWS_CATEGORIES;
export const LEGACY_CONTENT_CATEGORIES = LEGACY_NEWS_CATEGORIES;
export type ContentCategory = NewsCategory;
export type LegacyContentCategory = (typeof LEGACY_NEWS_CATEGORIES)[number];
export type AnyContentCategory = ContentCategory | LegacyContentCategory;
export { mapToDisplayCategory };

export interface ClassifyResult {
  category: ContentCategory;
  keywords: string[];
  reason: string;
  /** true khi có xung đột tín hiệu hoặc chỉ tín hiệu yếu */
  uncertain: boolean;
}

function firstLine(text: string): string {
  return (text || "").trim().split(/\n/)[0] || "";
}

function collectMatches(re: RegExp, text: string, out: string[]): void {
  const flags = re.flags.includes("g") ? re.flags : `${re.flags}g`;
  const global = new RegExp(re.source, flags);
  let m: RegExpExecArray | null;
  while ((m = global.exec(text)) !== null) {
    const hit = m[0]?.trim();
    if (hit && !out.includes(hit)) out.push(hit);
    if (m.index === global.lastIndex) global.lastIndex += 1;
  }
}

/** Kỳ thi thăng đai / sát hạch nội bộ. */
const BELT_RE =
  /nâng\s*[–\-]?\s*đổi\s*đai|nâng\s*đai|đổi\s*đai|thăng\s*cấp\s*đai|thăng\s*đai|thi\s*lên\s*đai|kỳ\s*thi\s*(nâng|thăng|đổi)|kì\s*thi\s*(nâng|thăng|đổi)|thi\s*thăng\s*cấp|sát\s*hạch(\s*đai)?/i;

/**
 * Kính mừng Đại lễ / nghi lễ Phật giáo (không khớp "lễ" / "đại lễ" võ thuật đơn thuần).
 */
const CEREMONY_RE =
  /kính\s*mừng\s*(đại\s*)?lễ|đại\s*lễ\s*(phật(\s*đản)?|vu\s*lan)|phật\s*đản|vu\s*lan|thành\s*đạo|đức\s*phật\s+thành\s*đạo|kính\s*mừng\s+ngày\s+đức\s*phật|an\s*cư(\s*kiết\s*hạ)?|kiết\s*hạ|tự\s*tứ|đại\s*giới\s*đàn|lễ\s*hội\s*phật|tưởng\s*niệm\s+bồ\s*tát|bồ\s*tát\s+thích\s*quảng\s*đức|cuộc\s*đời\s+đức\s*phật|luật\s*nhân\s*quả|nghi\s*lễ\s*(phật|tâm\s*linh)|phật\s*lịch/i;

const STRONG_CEREMONY_TITLE_RE =
  /kính\s*mừng\s*(đại\s*)?lễ|phật\s*đản|vu\s*lan|đức\s*phật\s+thành\s*đạo|kính\s*mừng\s+ngày\s+đức\s*phật|an\s*cư|tự\s*tứ|đại\s*giới\s*đàn|tưởng\s*niệm\s+bồ\s*tát|bồ\s*tát\s+thích\s*quảng\s*đức|cuộc\s*đời\s+đức\s*phật|luật\s*nhân\s*quả|phật\s*lịch/i;

/** Tri ân / nghĩa trang — fallback activities trừ khi tiêu đề rõ thiện nguyện. */
const MEMORIAL_RE =
  /thăm\s*viếng\s*nghĩa\s*trang|viếng\s*nghĩa\s*trang|nghĩa\s*trang\s*liệt\s*sĩ|dâng\s*hương|tri\s*ân\s+(anh\s*hùng\s*)?liệt\s*sĩ|hướng\s*về\s*ngày\s*27\s*\/\s*7|ngày\s*thương\s*binh|thương\s*binh\s*liệt\s*sĩ|ngày\s*tri\s*ân|tri\s*ân\s*ngày\s*quân\s*đội|ngày\s*nhà\s*giáo|20\s*\/\s*11/i;

const CHARITY_RE =
  /thiện\s*nguyện|từ\s*thiện|công\s*tác\s*xã\s*hội|hoạt\s*động\s*xã\s*hội|phụng\s*sự\s*cộng\s*đồng|an\s*sinh(\s*xã\s*hội)?|trao\s*quà|tặng\s*quà|phát\s*quà|góp\s*quà|quyên\s*góp|gây\s*quỹ|cứu\s*trợ|ủng\s*hộ\s*(đồng\s*bào|hoàn\s*cảnh|người|trẻ\s*em|bệnh\s*nhân)|hỗ\s*trợ\s*(đồng\s*bào|hoàn\s*cảnh|sinh\s*viên|người\s*già|trẻ\s*em)|hoàn\s*cảnh\s*khó\s*khăn|người\s*khó\s*khăn|trẻ\s*em\s*(nghèo|mồ\s*côi|khó\s*khăn)|nhà\s*tình(\s*thương)?|sửa\s*chữa\s*nhà|làm\s*cầu|đắp\s*đường|làm\s*đường|trồng\s*cây|bảo\s*vệ\s*môi\s*trường|dọn\s*vệ\s*sinh|thu\s*gom\s*rác|nhặt\s*rác|hành\s*động\s*xanh|hiến\s*máu|khám\s*bệnh|phát\s*thuốc|cơm\s*từ\s*thiện|học\s*bổng|gieo\s*điều\s*tử\s*tế|mái\s*ấm|khuyết\s*tật|tặng\s*tranh\s*đạo\s*đức/i;

const INTERNAL_NON_CHARITY_RE =
  /chào\s*mừng.*(algeria|anh\s*em)|phật\s*quang\s*quyền\s*algeria|thư\s*chúc\s*tết|chúc\s*tết\s*xuân|tất\s*niên|tổng\s*kết\s*(cuối\s*năm|hoạt\s*động|câu\s*lạc\s*bộ)|lễ\s*tổng\s*kết|về\s*chung\s*một\s*mái\s*nhà|về\s*tổ\s*đình/i;

const CHARITY_FALSE_POSITIVE_RE =
  /trao\s*(huy\s*chương|giải|thưởng|bằng|chứng\s*nhận)|lễ\s*trao\s*giải|trao\s*thưởng|huy\s*chương/i;

const NAMED_TOURNAMENT_RE =
  /võ\s*việt\s*đất\s*phương\s*nam|đài\s*võ(\s*đất\s*phương\s*nam)?|cúp\s*hoàng\s*đế\s*quang\s*trung|giải\s*cúp\s*nghệ\s*an|cúp\s*nghệ\s*an|festival\s*võ\s*thuật\s*quốc\s*tế(\s*hà\s*nội)?|imac\s*20\d{2}|liên\s*hoan\s*(quốc\s*tế\s*)?võ(\s*cổ\s*truyền)?|giải\s*võ\s*(cổ\s*truyền|thuật)|giải\s*vô\s*địch(\s*trẻ)?|giải\s*thể\s*thao\s*học\s*sinh|giải\s*tths|hội\s*thi\s*thể\s*dục\s*thể\s*thao|đại\s*hội\s*(tdtt|thể\s*dục\s*thể\s*thao)|hội\s*khỏe\s*phù\s*đổng|giải\s*vocotruyen|võ\s*nhạc/i;

const TOURNAMENT_RE =
  /giải\s*đấu|giải\s*võ|giải\s*vô\s*địch|giải\s*cúp|giải\s*mở\s*rộng|giải\s*quốc\s*gia|giải\s*quốc\s*tế|giải\s+(võ|vô\s*địch|mở\s*rộng|thể\s*thao|giao\s*lưu|các\s*câu\s*lạc\s*bộ|học\s*sinh|sinh\s*viên|trẻ|năng\s*khiếu)|cúp\s+(vô\s*địch|quốc\s*gia|mở\s*rộng|hoàng\s*đế)|tham\s*gia\s*giải|tham\s*dự\s*giải|thi\s*đấu(\s*võ\s*thuật)?|tranh\s*tài|đối\s*kháng|tranh\s*cúp|rước\s*cúp|chung\s*kết|bán\s*kết|vòng\s*loại|điều\s*lệ\s*giải|championship|tournament|competition|sea\s*games|asiad/i;

/** Biểu diễn / tiết mục / khai mạc festival (không phải thi đấu). */
const PERFORMANCE_RE =
  /biểu\s*diễn|tiết\s*mục|tổng\s*duyệt|tập\s*duyệt|sân\s*khấu|võ\s*nhạc|gian\s*hàng(\s*triển\s*lãm)?|triển\s*lãm|trailer\s*festival|khai\s*mạc\s*(festival|liên\s*hoan)|đêm\s*khai\s*mạc/i;

/** Huấn luyện / tập luyện (chưa phải thi đấu). */
const TRAINING_RE =
  /tập\s*huấn|buổi\s*tập(\s*huấn)?|huấn\s*luyện|miệt\s*mài\s*tập|luyện\s*tập|tập\s*luyện|chuẩn\s*bị\s*(cho\s*)?(giải|cúp|liên\s*hoan|festival)/i;

const PERFORMANCE_OR_EVENT_RE =
  /biểu\s*diễn|festival|sự\s*kiện|tổng\s*duyệt|tập\s*duyệt|gian\s*hàng|triển\s*lãm|giao\s*lưu/i;

const TRAINING_PREP_RE =
  /tập\s*luyện|chuẩn\s*bị\s*(cho\s*)?(giải|cúp|liên\s*hoan)|miệt\s*mài\s*tập|luyện\s*tập\s*chuẩn\s*bị/i;

const NON_TOURNAMENT_ACTIVITY_RE =
  /tập\s*huấn|thi\s*phân\s*(hạng|cấp)\s*trọng\s*tài|hội\s*nghị|hội\s*thảo|họp\s*chuyên\s*môn|công\s*văn|nghị\s*quyết|hợp\s*tác\s*phát\s*triển|đại\s*hội\s*đại\s*biểu|tái\s*đắc\s*cử|logo\s*liên\s*đoàn|chào\s*mừng.*(algeria|anh\s*em)|về\s*chung\s*một\s*mái\s*nhà|thư\s*chúc\s*tết|tất\s*niên|tổng\s*kết\s*(hoạt\s*động|cuối\s*năm)|algeria|sinh\s*hoạt(\s*clb)?|võ\s*đường|môn\s*sinh|thông\s*báo|huấn\s*luyện|đào\s*tạo/i;

const COMPETE_VERB_RE =
  /thi\s*đấu|tranh\s*tài|đối\s*kháng|tham\s*gia\s*(thi\s*đấu|giải)|tham\s*dự\s*(thi\s*đấu|giải)|giành\s*(huy\s*chương|giải)|đạt\s*(huy\s*chương|giải|thành\s*tích)|huy\s*chương|quán\s*quân|á\s*quân|chung\s*kết|bán\s*kết|vòng\s*loại|xuất\s*quân/i;

const MARTIAL_FESTIVAL_RE =
  /lễ\s*hội\s*võ|đại\s*lễ\s*khai\s*mạc|khai\s*mạc\s*(liên\s*hoan|festival|lễ\s*hội)|võ\s*việt\s*đất\s*phương\s*nam|đài\s*võ|festival\s*võ/i;

const STRONG_CHARITY_TITLE_RE =
  /thiện\s*nguyện|từ\s*thiện|trao\s*quà|tặng\s*quà|phát\s*quà|quyên\s*góp|cứu\s*trợ|trồng\s*cây|hành\s*động\s*xanh|nhặt\s*rác|hiến\s*máu|học\s*bổng|gieo\s*điều\s*tử\s*tế|hoàn\s*cảnh\s*khó\s*khăn|công\s*tác\s*xã\s*hội|hoạt\s*động\s*xã\s*hội|tặng\s*tranh\s*đạo\s*đức/i;

function isBeltExam(text: string): boolean {
  return BELT_RE.test(text);
}

function isCeremonySignal(text: string): boolean {
  return CEREMONY_RE.test(text);
}

function isMemorial(text: string): boolean {
  return MEMORIAL_RE.test(text);
}

function hasCharitySignal(text: string): boolean {
  return CHARITY_RE.test(text);
}

function hasTournamentSignal(text: string): boolean {
  return TOURNAMENT_RE.test(text) || NAMED_TOURNAMENT_RE.test(text);
}

function isPrimarilyBeltExam(title: string, body: string): boolean {
  if (isBeltExam(title)) return true;
  // Thân bài rõ kỳ thi đai, tiêu đề không phải giải đấu
  if (isBeltExam(body) && !COMPETE_VERB_RE.test(title) && !hasTournamentSignal(title)) {
    return true;
  }
  return false;
}

function isPrimarilyCeremony(title: string, body: string): boolean {
  const full = `${title}\n${body}`;
  if (MARTIAL_FESTIVAL_RE.test(title) && !STRONG_CEREMONY_TITLE_RE.test(title)) {
    return false;
  }
  if (STRONG_CEREMONY_TITLE_RE.test(title)) return true;
  if (
    isCeremonySignal(title) &&
    !hasTournamentSignal(title) &&
    !COMPETE_VERB_RE.test(title)
  ) {
    return true;
  }
  if (
    STRONG_CEREMONY_TITLE_RE.test(body) &&
    !COMPETE_VERB_RE.test(title) &&
    !MARTIAL_FESTIVAL_RE.test(title) &&
    !STRONG_CHARITY_TITLE_RE.test(title)
  ) {
    return isCeremonySignal(full);
  }
  return false;
}

function isPrimarilyCharity(title: string, body: string): boolean {
  if (/biểu\s*diễn/i.test(title) && !STRONG_CHARITY_TITLE_RE.test(title)) {
    return false;
  }
  if (INTERNAL_NON_CHARITY_RE.test(title) && !STRONG_CHARITY_TITLE_RE.test(title)) {
    return false;
  }
  if (CHARITY_FALSE_POSITIVE_RE.test(title)) return false;
  if (isPrimarilyCeremony(title, body)) return false;
  if (isMemorial(title)) return STRONG_CHARITY_TITLE_RE.test(title);
  if (STRONG_CHARITY_TITLE_RE.test(title) || hasCharitySignal(title)) return true;
  if (!hasCharitySignal(body)) return false;
  if (
    COMPETE_VERB_RE.test(title) ||
    NAMED_TOURNAMENT_RE.test(title) ||
    hasTournamentSignal(title)
  ) {
    return false;
  }
  const bodyWithoutMotto = body.replace(/phụng\s*sự\s*cộng\s*đồng/gi, "");
  if (
    !STRONG_CHARITY_TITLE_RE.test(bodyWithoutMotto) &&
    !hasCharitySignal(bodyWithoutMotto)
  ) {
    return false;
  }
  if (/kỷ\s*niệm|lễ\s*hội|khởi\s*nghĩa|biểu\s*diễn/i.test(title)) {
    if (
      !/thiện\s*nguyện|từ\s*thiện|trao\s*quà|trồng\s*cây|học\s*bổng|hành\s*động\s*xanh/i.test(
        body
      )
    ) {
      return false;
    }
  }
  if (
    /trao\s*(huy\s*chương|giải|thưởng)/i.test(body) &&
    !/hoàn\s*cảnh|khó\s*khăn|thiện\s*nguyện|từ\s*thiện|trẻ\s*em|người\s*già|bệnh\s*nhân/i.test(
      body
    )
  ) {
    return false;
  }
  return STRONG_CHARITY_TITLE_RE.test(body) || hasCharitySignal(body);
}

function isPrimarilyTournament(title: string, body: string): boolean {
  if (isPrimarilyBeltExam(title, body)) return false;
  if (isPrimarilyCeremony(title, body)) return false;
  if (/tập\s*huấn/i.test(title)) return false;

  if (
    /tất\s*niên|tổng\s*kết\s*(cuối\s*năm|hoạt\s*động|năm)|thư\s*chúc\s*tết|chào\s*mừng.*(algeria|anh\s*em)|họp\s*chuyên\s*môn|hội\s*nghị|tái\s*đắc\s*cử/i.test(
      title
    ) &&
    !/giải\s+|cúp\s+|thi\s*đấu|tranh\s*tài|đối\s*kháng/i.test(title)
  ) {
    return false;
  }
  if (NON_TOURNAMENT_ACTIVITY_RE.test(title) && !COMPETE_VERB_RE.test(title)) {
    if (
      /họp\s*chuyên\s*môn|tập\s*huấn|hội\s*nghị|tái\s*đắc\s*cử|tất\s*niên|algeria/i.test(
        title
      )
    ) {
      return false;
    }
  }

  // Biểu diễn / festival khai mạc thuần → không phải giải đấu
  if (PERFORMANCE_RE.test(title) && !COMPETE_VERB_RE.test(title)) {
    if (/biểu\s*diễn|tổng\s*duyệt|tập\s*duyệt|tiết\s*mục|trailer|gian\s*hàng/i.test(title)) {
      return false;
    }
    if (
      /khai\s*mạc\s*(festival|liên\s*hoan)/i.test(title) &&
      !COMPETE_VERB_RE.test(body)
    ) {
      return false;
    }
  }

  if (
    TRAINING_PREP_RE.test(title) &&
    !COMPETE_VERB_RE.test(title) &&
    !/tham\s*(gia|dự)\s*giải/i.test(title)
  ) {
    return false;
  }

  if (
    COMPETE_VERB_RE.test(title) ||
    NAMED_TOURNAMENT_RE.test(title) ||
    TOURNAMENT_RE.test(title)
  ) {
    if (/liên\s*hoan|đài\s*võ|võ\s*việt|festival/i.test(title)) {
      if (
        COMPETE_VERB_RE.test(title) ||
        COMPETE_VERB_RE.test(body) ||
        /trao\s*giải|thành\s*tích|huy\s*chương|chung\s*kết|bán\s*kết/i.test(
          `${title}\n${body}`
        )
      ) {
        return true;
      }
      if (
        /khai\s*mạc|biểu\s*diễn|tổng\s*duyệt|kỉ?\s*niệm/i.test(title) &&
        !COMPETE_VERB_RE.test(title)
      ) {
        return false;
      }
    }
    return true;
  }

  if (
    (TOURNAMENT_RE.test(body) || NAMED_TOURNAMENT_RE.test(body)) &&
    COMPETE_VERB_RE.test(body) &&
    !PERFORMANCE_OR_EVENT_RE.test(title) &&
    !TRAINING_PREP_RE.test(title) &&
    !NON_TOURNAMENT_ACTIVITY_RE.test(title)
  ) {
    return true;
  }

  if (
    /chúc\s*mừng|thành\s*tích|huy\s*chương|đạt\s*giải|giành\s*giải/i.test(
      `${title}\n${body}`
    ) &&
    (NAMED_TOURNAMENT_RE.test(`${title}\n${body}`) ||
      TOURNAMENT_RE.test(`${title}\n${body}`) ||
      /đại\s*hội\s*(tdtt|thể\s*dục)/i.test(`${title}\n${body}`))
  ) {
    return true;
  }

  if (
    /^(thanh\s*long|song\s*tuyết|lão\s*mai|thần\s*đồng|kim\s*long|căn\s*bản\s*công|quyền\s*tự\s*chọn|đối\s*luyện)/i.test(
      title
    ) &&
    /(đv|đơn\s*vị|vđv|nam|nữ|\b[fph]\b|tdtt)/i.test(title)
  ) {
    return true;
  }

  return false;
}

function isPrimarilyPerformance(title: string, body: string): boolean {
  if (isPrimarilyBeltExam(title, body)) return false;
  if (isPrimarilyCeremony(title, body)) return false;
  if (isPrimarilyTournament(title, body)) return false;

  if (PERFORMANCE_RE.test(title)) return true;

  // Thân bài biểu diễn rõ, tiêu đề festival/khai mạc không thi đấu
  if (
    PERFORMANCE_RE.test(body) &&
    /festival|liên\s*hoan|khai\s*mạc|biểu\s*diễn/i.test(title) &&
    !COMPETE_VERB_RE.test(title)
  ) {
    return true;
  }
  return false;
}

function isPrimarilyTraining(title: string, body: string): boolean {
  if (isPrimarilyBeltExam(title, body)) return false;
  if (isPrimarilyTournament(title, body)) return false;
  if (isPrimarilyPerformance(title, body)) return false;
  if (isPrimarilyCeremony(title, body)) return false;
  if (isPrimarilyCharity(title, body)) return false;

  if (TRAINING_RE.test(title)) return true;
  if (TRAINING_PREP_RE.test(title) && !COMPETE_VERB_RE.test(title)) return true;

  // Buổi tập huấn rõ trong thân + tiêu đề không phủ định
  if (
    /tập\s*huấn|buổi\s*tập/i.test(body) &&
    /tập\s*huấn|huấn\s*luyện|võ\s*sư|hlv/i.test(title)
  ) {
    return true;
  }
  return false;
}

const CATEGORY_REASONS: Record<ContentCategory, string> = {
  competitions: "Nội dung chính là tham gia giải đấu / thi đấu / thành tích tại giải",
  charity: "Nội dung chính là thiện nguyện / hỗ trợ cộng đồng / môi trường",
  ceremonies: "Nội dung chính là kính mừng Đại lễ / nghi lễ Phật giáo",
  beltexams: "Nội dung chính là kỳ thi thăng đai / nâng đai / sát hạch",
  performances: "Nội dung chính là biểu diễn / tiết mục / khai mạc festival",
  training: "Nội dung chính là huấn luyện / tập luyện / tập huấn",
  activities: "Không thuộc nhóm cụ thể — xếp hoạt động khác",
};

/**
 * Phân loại chi tiết (dùng cho report + reclassify).
 */
export function classifyPostDetailed(text: string): ClassifyResult {
  const m = text || "";
  const trimmed = m.trim();
  const title = firstLine(trimmed);
  const body = trimmed.slice(title.length).trim();
  const keywords: string[] = [];

  collectMatches(CHARITY_RE, trimmed, keywords);
  collectMatches(TOURNAMENT_RE, trimmed, keywords);
  collectMatches(NAMED_TOURNAMENT_RE, trimmed, keywords);
  collectMatches(BELT_RE, trimmed, keywords);
  collectMatches(CEREMONY_RE, trimmed, keywords);
  collectMatches(PERFORMANCE_RE, trimmed, keywords);
  collectMatches(TRAINING_RE, trimmed, keywords);

  const belt = isPrimarilyBeltExam(title, body || trimmed);
  const tournament = isPrimarilyTournament(title, body || trimmed);
  const charity = isPrimarilyCharity(title, body || trimmed);
  const ceremony = isPrimarilyCeremony(title, body || trimmed);
  const performance = isPrimarilyPerformance(title, body || trimmed);
  const training = isPrimarilyTraining(title, body || trimmed);
  const memorial = isMemorial(title) || isMemorial(trimmed);

  const signals = [
    belt ? "beltexams" : null,
    tournament ? "competitions" : null,
    charity ? "charity" : null,
    ceremony ? "ceremonies" : null,
    performance ? "performances" : null,
    training ? "training" : null,
  ].filter(Boolean) as ContentCategory[];

  if (signals.length === 1) {
    const category = signals[0];
    return {
      category,
      keywords,
      reason: CATEGORY_REASONS[category],
      uncertain: false,
    };
  }

  if (signals.length > 1) {
    const priority: ContentCategory[] = [
      "beltexams",
      "competitions",
      "charity",
      "ceremonies",
      "performances",
      "training",
    ];
    const category = priority.find((c) => signals.includes(c))!;
    return {
      category,
      keywords,
      reason: `Đa tín hiệu (${signals.join(", ")}) — ưu tiên ${category} theo thứ tự phân loại`,
      uncertain: true,
    };
  }

  let reason = CATEGORY_REASONS.activities;
  let uncertain = false;

  if (memorial && !charity) {
    reason = "Tri ân / nghĩa trang / kỷ niệm — hoạt động khác";
  } else if (PERFORMANCE_OR_EVENT_RE.test(title) && !tournament) {
    reason = "Sự kiện / giao lưu không đủ dấu hiệu nhóm cụ thể";
    uncertain = hasTournamentSignal(trimmed);
  } else if (NON_TOURNAMENT_ACTIVITY_RE.test(trimmed)) {
    reason = "Sinh hoạt / thông báo / hoạt động nội bộ";
  } else if (keywords.length > 1) {
    uncertain = true;
    reason = "Xung đột từ khóa — không đủ ngữ cảnh rõ, mặc định hoạt động khác";
  }

  return {
    category: "activities",
    keywords,
    reason,
    uncertain,
  };
}

export function classifyPost(text: string): ContentCategory {
  return classifyPostDetailed(text).category;
}
