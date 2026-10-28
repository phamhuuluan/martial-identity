/**
 * Shape checks for content/site/*.json.
 * Public pages and the admin commit path both use these parsers.
 */

export class ContentShapeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContentShapeError";
  }
}

export const NAV_PATHS = [
  "/",
  "/gioi-thieu",
  "/tap-luyen",
  "/hoat-dong",
  "/dia-diem",
  "/lien-he",
] as const;

export const THAI_TO_SU_HREF = "/gioi-thieu/thai-to-su";

function fail(path: string, message: string): never {
  throw new ContentShapeError(`${path}: ${message}`);
}

function rec(value: unknown, path: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    fail(path, "phải là object");
  }
  return value as Record<string, unknown>;
}

function str(obj: Record<string, unknown>, key: string, path: string): string {
  const value = obj[key];
  if (typeof value !== "string") fail(`${path}.${key}`, "phải là chuỗi");
  return value;
}

function nonEmpty(obj: Record<string, unknown>, key: string, path: string): string {
  const value = str(obj, key, path).trim();
  if (!value) fail(`${path}.${key}`, "không được để trống");
  return value;
}

function strList(value: unknown, path: string): string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    fail(path, "phải là danh sách chuỗi");
  }
  return value.map((item) => item.trim()).filter(Boolean);
}

function publicPath(obj: Record<string, unknown>, key: string, path: string): string {
  const value = nonEmpty(obj, key, path);
  if (!value.startsWith("/") || value.includes("..") || /\s/.test(value)) {
    fail(`${path}.${key}`, "phải là đường dẫn bắt đầu bằng /");
  }
  return value;
}

function httpUrl(obj: Record<string, unknown>, key: string, path: string): string {
  const value = nonEmpty(obj, key, path);
  if (!/^https?:\/\//.test(value)) fail(`${path}.${key}`, "phải là URL http(s)");
  return value;
}

export type SiteContent = {
  name: string;
  nameUpper: string;
  federationLine: string;
  motto: string;
  title: string;
  tagline: string;
  description: string;
  logo: string;
  heroImage: string;
  heroFallback: string;
  introImage: string;
  memberTerm: {
    lower: string;
    title: string;
    ofSchool: string;
    ofSchoolTitle: string;
  };
  navItems: { label: string; href: (typeof NAV_PATHS)[number] }[];
};

export function parseSite(value: unknown): SiteContent {
  const obj = rec(value, "site");
  const member = rec(obj.memberTerm, "site.memberTerm");
  if (!Array.isArray(obj.navItems) || obj.navItems.length !== NAV_PATHS.length) {
    fail("site.navItems", `phải có đúng ${NAV_PATHS.length} mục`);
  }
  const navItems = obj.navItems.map((item, index) => {
    const row = rec(item, `site.navItems[${index}]`);
    const href = nonEmpty(row, "href", `site.navItems[${index}]`);
    if (href !== NAV_PATHS[index]) {
      fail(`site.navItems[${index}].href`, `phải là ${NAV_PATHS[index]}`);
    }
    return {
      label: nonEmpty(row, "label", `site.navItems[${index}]`),
      href: NAV_PATHS[index],
    };
  });
  return {
    name: nonEmpty(obj, "name", "site"),
    nameUpper: nonEmpty(obj, "nameUpper", "site"),
    federationLine: str(obj, "federationLine", "site"),
    motto: str(obj, "motto", "site"),
    title: nonEmpty(obj, "title", "site"),
    tagline: nonEmpty(obj, "tagline", "site"),
    description: nonEmpty(obj, "description", "site"),
    logo: publicPath(obj, "logo", "site"),
    heroImage: publicPath(obj, "heroImage", "site"),
    heroFallback: publicPath(obj, "heroFallback", "site"),
    introImage: publicPath(obj, "introImage", "site"),
    memberTerm: {
      lower: nonEmpty(member, "lower", "site.memberTerm"),
      title: nonEmpty(member, "title", "site.memberTerm"),
      ofSchool: nonEmpty(member, "ofSchool", "site.memberTerm"),
      ofSchoolTitle: nonEmpty(member, "ofSchoolTitle", "site.memberTerm"),
    },
    navItems,
  };
}

export type ToDinh = {
  templeName: string;
  address: string;
  fullAddress: string;
  mapEmbed: string;
  mapLink: string;
};

export type ContactHighlight = { region: string; address?: string };

export type ContactContent = {
  toDinh: ToDinh;
  officialSocialLinks: { name: string; href: string }[];
  contactDescription: string;
  contactHighlights: ContactHighlight[];
  operatingCountries: string[];
};

export function parseContact(value: unknown): ContactContent {
  const obj = rec(value, "contact");
  const toDinh = rec(obj.toDinh, "contact.toDinh");
  if (!Array.isArray(obj.officialSocialLinks)) {
    fail("contact.officialSocialLinks", "phải là danh sách");
  }
  if (!Array.isArray(obj.contactHighlights)) {
    fail("contact.contactHighlights", "phải là danh sách");
  }
  return {
    toDinh: {
      templeName: nonEmpty(toDinh, "templeName", "contact.toDinh"),
      address: nonEmpty(toDinh, "address", "contact.toDinh"),
      fullAddress: nonEmpty(toDinh, "fullAddress", "contact.toDinh"),
      mapEmbed: httpUrl(toDinh, "mapEmbed", "contact.toDinh"),
      mapLink: httpUrl(toDinh, "mapLink", "contact.toDinh"),
    },
    officialSocialLinks: obj.officialSocialLinks.map((item, index) => {
      const row = rec(item, `contact.officialSocialLinks[${index}]`);
      return {
        name: nonEmpty(row, "name", `contact.officialSocialLinks[${index}]`),
        href: httpUrl(row, "href", `contact.officialSocialLinks[${index}]`),
      };
    }),
    contactDescription: nonEmpty(obj, "contactDescription", "contact"),
    contactHighlights: obj.contactHighlights.map((item, index) => {
      const row = rec(item, `contact.contactHighlights[${index}]`);
      const address = row.address;
      const highlight: ContactHighlight = {
        region: nonEmpty(row, "region", `contact.contactHighlights[${index}]`),
      };
      if (typeof address === "string" && address.trim()) {
        highlight.address = address.trim();
      } else if (address !== undefined && typeof address !== "string") {
        fail(`contact.contactHighlights[${index}].address`, "phải là chuỗi");
      }
      return highlight;
    }),
    operatingCountries: strList(obj.operatingCountries, "contact.operatingCountries"),
  };
}

export type IntroContent = {
  thaiToSu: {
    number: string;
    title: string;
    body: string;
    image: string;
    lifeHref: typeof THAI_TO_SU_HREF;
    lifeLabel: string;
  };
  sangToSu: {
    number: string;
    title: string;
    image: string;
    fields: { label: string; value: string }[];
    positions: string[];
  };
  formation: {
    yearTitle: string;
    yearNumber: string;
    yearBody: string;
    toDinh: { number: string; title: string; body: string };
    nhanDuyen: { number: string; title: string; bullets: string[] };
    chuongMon: { number: string; title: string; body: string };
    truongBan: { number: string; title: string; body: string };
  };
  organization: { sectionTitle: string };
  logoMeaning: {
    sectionTitle: string;
    number: string;
    title: string;
    logo: string;
    paragraphs: string[];
    qualities: string[];
    closing: string;
    colors: { name: string; hex: string }[];
  };
};

function numbered(obj: Record<string, unknown>, path: string) {
  return {
    number: nonEmpty(obj, "number", path),
    title: nonEmpty(obj, "title", path),
  };
}

export function parseIntro(value: unknown): IntroContent {
  const obj = rec(value, "intro");
  const thai = rec(obj.thaiToSu, "intro.thaiToSu");
  const sang = rec(obj.sangToSu, "intro.sangToSu");
  const formation = rec(obj.formation, "intro.formation");
  const toDinh = rec(formation.toDinh, "intro.formation.toDinh");
  const nhan = rec(formation.nhanDuyen, "intro.formation.nhanDuyen");
  const chuong = rec(formation.chuongMon, "intro.formation.chuongMon");
  const truong = rec(formation.truongBan, "intro.formation.truongBan");
  const organization = rec(obj.organization, "intro.organization");
  const logo = rec(obj.logoMeaning, "intro.logoMeaning");
  const lifeHref = nonEmpty(thai, "lifeHref", "intro.thaiToSu");
  if (lifeHref !== THAI_TO_SU_HREF) {
    fail("intro.thaiToSu.lifeHref", `phải là ${THAI_TO_SU_HREF}`);
  }
  if (!Array.isArray(sang.fields)) fail("intro.sangToSu.fields", "phải là danh sách");
  if (!Array.isArray(logo.colors)) fail("intro.logoMeaning.colors", "phải là danh sách");
  return {
    thaiToSu: {
      ...numbered(thai, "intro.thaiToSu"),
      body: nonEmpty(thai, "body", "intro.thaiToSu"),
      image: publicPath(thai, "image", "intro.thaiToSu"),
      lifeHref: THAI_TO_SU_HREF,
      lifeLabel: nonEmpty(thai, "lifeLabel", "intro.thaiToSu"),
    },
    sangToSu: {
      ...numbered(sang, "intro.sangToSu"),
      image: publicPath(sang, "image", "intro.sangToSu"),
      fields: sang.fields.map((item, index) => {
        const row = rec(item, `intro.sangToSu.fields[${index}]`);
        return {
          label: nonEmpty(row, "label", `intro.sangToSu.fields[${index}]`),
          value: nonEmpty(row, "value", `intro.sangToSu.fields[${index}]`),
        };
      }),
      positions: strList(sang.positions, "intro.sangToSu.positions"),
    },
    formation: {
      yearTitle: nonEmpty(formation, "yearTitle", "intro.formation"),
      yearNumber: nonEmpty(formation, "yearNumber", "intro.formation"),
      yearBody: nonEmpty(formation, "yearBody", "intro.formation"),
      toDinh: {
        ...numbered(toDinh, "intro.formation.toDinh"),
        body: nonEmpty(toDinh, "body", "intro.formation.toDinh"),
      },
      nhanDuyen: {
        ...numbered(nhan, "intro.formation.nhanDuyen"),
        bullets: strList(nhan.bullets, "intro.formation.nhanDuyen.bullets"),
      },
      chuongMon: {
        ...numbered(chuong, "intro.formation.chuongMon"),
        body: nonEmpty(chuong, "body", "intro.formation.chuongMon"),
      },
      truongBan: {
        ...numbered(truong, "intro.formation.truongBan"),
        body: nonEmpty(truong, "body", "intro.formation.truongBan"),
      },
    },
    organization: {
      sectionTitle: nonEmpty(organization, "sectionTitle", "intro.organization"),
    },
    logoMeaning: {
      sectionTitle: nonEmpty(logo, "sectionTitle", "intro.logoMeaning"),
      number: nonEmpty(logo, "number", "intro.logoMeaning"),
      title: nonEmpty(logo, "title", "intro.logoMeaning"),
      logo: publicPath(logo, "logo", "intro.logoMeaning"),
      paragraphs: strList(logo.paragraphs, "intro.logoMeaning.paragraphs"),
      qualities: strList(logo.qualities, "intro.logoMeaning.qualities"),
      closing: nonEmpty(logo, "closing", "intro.logoMeaning"),
      colors: logo.colors.map((item, index) => {
        const row = rec(item, `intro.logoMeaning.colors[${index}]`);
        const hex = nonEmpty(row, "hex", `intro.logoMeaning.colors[${index}]`);
        if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) {
          fail(`intro.logoMeaning.colors[${index}].hex`, "phải là mã #RRGGBB");
        }
        return {
          name: nonEmpty(row, "name", `intro.logoMeaning.colors[${index}]`),
          hex,
        };
      }),
    },
  };
}

export type PhilosophyContent = {
  philosophy: {
    number: string;
    title: string;
    factors: { label: string; body: string }[];
  };
  phuongCham: { number: string; title: string; body: string[] };
  sixOathsSection: { homeHeading: string; sectionTitle: string };
  sixOaths: string[];
  martialSpirit: { image: string; paragraphs: string[] };
};

export function parsePhilosophy(value: unknown): PhilosophyContent {
  const obj = rec(value, "philosophy");
  const philosophy = rec(obj.philosophy, "philosophy.philosophy");
  const phuong = rec(obj.phuongCham, "philosophy.phuongCham");
  const section = rec(obj.sixOathsSection, "philosophy.sixOathsSection");
  const spirit = rec(obj.martialSpirit, "philosophy.martialSpirit");
  if (!Array.isArray(philosophy.factors) || philosophy.factors.length === 0) {
    fail("philosophy.philosophy.factors", "cần ít nhất một yếu tố");
  }
  const sixOaths = strList(obj.sixOaths, "philosophy.sixOaths");
  if (sixOaths.length === 0) fail("philosophy.sixOaths", "cần ít nhất một lời thề");
  return {
    philosophy: {
      ...numbered(philosophy, "philosophy.philosophy"),
      factors: philosophy.factors.map((item, index) => {
        const row = rec(item, `philosophy.philosophy.factors[${index}]`);
        return {
          label: nonEmpty(row, "label", `philosophy.philosophy.factors[${index}]`),
          body: nonEmpty(row, "body", `philosophy.philosophy.factors[${index}]`),
        };
      }),
    },
    phuongCham: {
      ...numbered(phuong, "philosophy.phuongCham"),
      body: strList(phuong.body, "philosophy.phuongCham.body"),
    },
    sixOathsSection: {
      homeHeading: nonEmpty(section, "homeHeading", "philosophy.sixOathsSection"),
      sectionTitle: nonEmpty(section, "sectionTitle", "philosophy.sixOathsSection"),
    },
    sixOaths,
    martialSpirit: {
      image: publicPath(spirit, "image", "philosophy.martialSpirit"),
      paragraphs: strList(spirit.paragraphs, "philosophy.martialSpirit.paragraphs"),
    },
  };
}

export type Dojo = {
  name: string;
  locations: string[];
  schedule?: string;
};

export type RegionBlock = { region: string; dojos: Dojo[] };

export type LocationsContent = {
  scaleIntro: { sectionTitle: string; image: string; body: string };
  locations: {
    overseas: RegionBlock;
    north: RegionBlock;
    central: RegionBlock;
    south: RegionBlock;
  };
};

const REGION_KEYS = ["overseas", "north", "central", "south"] as const;

function parseDojo(value: unknown, path: string): Dojo {
  const row = rec(value, path);
  const locations = strList(row.locations, `${path}.locations`);
  if (locations.length === 0) fail(`${path}.locations`, "cần ít nhất một địa chỉ");
  const dojo: Dojo = {
    name: nonEmpty(row, "name", path),
    locations,
  };
  if (typeof row.schedule === "string" && row.schedule.trim()) {
    dojo.schedule = row.schedule.trim();
  } else if (row.schedule !== undefined && typeof row.schedule !== "string") {
    fail(`${path}.schedule`, "phải là chuỗi");
  }
  return dojo;
}

function parseRegion(value: unknown, path: string): RegionBlock {
  const row = rec(value, path);
  if (!Array.isArray(row.dojos)) fail(`${path}.dojos`, "phải là danh sách");
  return {
    region: nonEmpty(row, "region", path),
    dojos: row.dojos.map((item, index) => parseDojo(item, `${path}.dojos[${index}]`)),
  };
}

export function parseLocations(value: unknown): LocationsContent {
  const obj = rec(value, "locations");
  const scale = rec(obj.scaleIntro, "locations.scaleIntro");
  const regions = rec(obj.locations, "locations.locations");
  return {
    scaleIntro: {
      sectionTitle: nonEmpty(scale, "sectionTitle", "locations.scaleIntro"),
      image: publicPath(scale, "image", "locations.scaleIntro"),
      body: nonEmpty(scale, "body", "locations.scaleIntro"),
    },
    locations: {
      overseas: parseRegion(regions.overseas, "locations.locations.overseas"),
      north: parseRegion(regions.north, "locations.locations.north"),
      central: parseRegion(regions.central, "locations.locations.central"),
      south: parseRegion(regions.south, "locations.locations.south"),
    },
  };
}

export { REGION_KEYS };

export type TrainingContent = {
  beltSystem: {
    sectionTitle: string;
    chartTitle: string;
    charts: { label: string; src: string }[];
    note: string;
  };
  curriculum: {
    title: string;
    subtitle: string;
    pdf: string;
    pages: { label: string; images: string[] }[];
  };
};

export function parseTraining(value: unknown): TrainingContent {
  const obj = rec(value, "training");
  const belt = rec(obj.beltSystem, "training.beltSystem");
  const curriculum = rec(obj.curriculum, "training.curriculum");
  if (!Array.isArray(belt.charts) || belt.charts.length === 0) {
    fail("training.beltSystem.charts", "cần ít nhất một bảng đai");
  }
  if (!Array.isArray(curriculum.pages)) {
    fail("training.curriculum.pages", "phải là danh sách");
  }
  return {
    beltSystem: {
      sectionTitle: nonEmpty(belt, "sectionTitle", "training.beltSystem"),
      chartTitle: nonEmpty(belt, "chartTitle", "training.beltSystem"),
      charts: belt.charts.map((item, index) => {
        const row = rec(item, `training.beltSystem.charts[${index}]`);
        return {
          label: nonEmpty(row, "label", `training.beltSystem.charts[${index}]`),
          src: publicPath(row, "src", `training.beltSystem.charts[${index}]`),
        };
      }),
      note: nonEmpty(belt, "note", "training.beltSystem"),
    },
    curriculum: {
      title: nonEmpty(curriculum, "title", "training.curriculum"),
      subtitle: nonEmpty(curriculum, "subtitle", "training.curriculum"),
      pdf: publicPath(curriculum, "pdf", "training.curriculum"),
      pages: curriculum.pages.map((item, index) => {
        const row = rec(item, `training.curriculum.pages[${index}]`);
        const images = strList(row.images, `training.curriculum.pages[${index}].images`);
        if (images.some((image) => !image.startsWith("/") || image.includes(".."))) {
          fail(`training.curriculum.pages[${index}].images`, "mỗi ảnh phải là đường dẫn /...");
        }
        return {
          label: nonEmpty(row, "label", `training.curriculum.pages[${index}]`),
          images,
        };
      }),
    },
  };
}

export type LifeBlock =
  | { kind: "prose"; text: string }
  | { kind: "speech"; text: string }
  | { kind: "list"; items: string[] };

export type LifeChapter = {
  id: string;
  number: string;
  title: string;
  blocks: LifeBlock[];
};

export type ThaiToSuLifeContent = {
  meta: {
    eyebrow: string;
    title: string;
    pali: string;
    epithet: string;
    series: string;
    editor: string;
    dedication: string;
    image: string;
    imageAlt: string;
  };
  chapters: LifeChapter[];
  merits: {
    id: string;
    number: string;
    title: string;
    lead: string;
    items: string[];
  };
  verse: { id: string; number: string; title: string; lines: string[] };
};

function parseBlock(value: unknown, path: string): LifeBlock {
  const row = rec(value, path);
  const kind = nonEmpty(row, "kind", path);
  if (kind === "list") {
    return { kind: "list", items: strList(row.items, `${path}.items`) };
  }
  if (kind === "prose" || kind === "speech") {
    return { kind, text: nonEmpty(row, "text", path) };
  }
  fail(`${path}.kind`, "phải là prose, speech hoặc list");
}

function slugId(obj: Record<string, unknown>, path: string): string {
  const id = nonEmpty(obj, "id", path);
  if (!/^[a-z0-9-]+$/.test(id)) fail(`${path}.id`, "chỉ gồm chữ thường, số và dấu gạch");
  return id;
}

export function parseThaiToSuLife(value: unknown): ThaiToSuLifeContent {
  const obj = rec(value, "life");
  const meta = rec(obj.meta, "life.meta");
  const merits = rec(obj.merits, "life.merits");
  const verse = rec(obj.verse, "life.verse");
  if (!Array.isArray(obj.chapters) || obj.chapters.length === 0) {
    fail("life.chapters", "cần ít nhất một chương");
  }
  const chapters = obj.chapters.map((item, index) => {
    const row = rec(item, `life.chapters[${index}]`);
    if (!Array.isArray(row.blocks) || row.blocks.length === 0) {
      fail(`life.chapters[${index}].blocks`, "cần ít nhất một đoạn");
    }
    return {
      id: slugId(row, `life.chapters[${index}]`),
      number: nonEmpty(row, "number", `life.chapters[${index}]`),
      title: nonEmpty(row, "title", `life.chapters[${index}]`),
      blocks: row.blocks.map((block, blockIndex) =>
        parseBlock(block, `life.chapters[${index}].blocks[${blockIndex}]`)
      ),
    };
  });
  const ids = new Set<string>();
  for (const chapter of chapters) {
    if (ids.has(chapter.id)) fail(`life.chapters`, `trùng id ${chapter.id}`);
    ids.add(chapter.id);
  }
  const meritsId = slugId(merits, "life.merits");
  const verseId = slugId(verse, "life.verse");
  if (ids.has(meritsId) || ids.has(verseId) || meritsId === verseId) {
    fail("life", "id chương, ý nghĩa và thơ không được trùng");
  }
  return {
    meta: {
      eyebrow: nonEmpty(meta, "eyebrow", "life.meta"),
      title: nonEmpty(meta, "title", "life.meta"),
      pali: nonEmpty(meta, "pali", "life.meta"),
      epithet: nonEmpty(meta, "epithet", "life.meta"),
      series: nonEmpty(meta, "series", "life.meta"),
      editor: nonEmpty(meta, "editor", "life.meta"),
      dedication: nonEmpty(meta, "dedication", "life.meta"),
      image: publicPath(meta, "image", "life.meta"),
      imageAlt: nonEmpty(meta, "imageAlt", "life.meta"),
    },
    chapters,
    merits: {
      id: meritsId,
      number: nonEmpty(merits, "number", "life.merits"),
      title: nonEmpty(merits, "title", "life.merits"),
      lead: nonEmpty(merits, "lead", "life.merits"),
      items: strList(merits.items, "life.merits.items"),
    },
    verse: {
      id: verseId,
      number: nonEmpty(verse, "number", "life.verse"),
      title: nonEmpty(verse, "title", "life.verse"),
      lines: strList(verse.lines, "life.verse.lines"),
    },
  };
}

export const SITE_FILE_PARSERS = {
  "content/site/site.json": parseSite,
  "content/site/contact.json": parseContact,
  "content/site/intro.json": parseIntro,
  "content/site/philosophy.json": parsePhilosophy,
  "content/site/locations.json": parseLocations,
  "content/site/training.json": parseTraining,
  "content/site/thai-to-su-life.json": parseThaiToSuLife,
} as const;

export type SiteFilePath = keyof typeof SITE_FILE_PARSERS;
