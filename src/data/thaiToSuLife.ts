/**
 * Cuộc đời Thái Tổ Sư — Tôn giả La Hầu La.
 * Source: docs/07_Ton_Gia_La_Hau_La.md, stored in content/site/thai-to-su-life.json.
 */
import lifeJson from "../../content/site/thai-to-su-life.json";
import {
  parseThaiToSuLife,
  type LifeBlock,
  type LifeChapter,
} from "./siteSchema";

export type { LifeBlock, LifeChapter };

const life = parseThaiToSuLife(lifeJson);

export const thaiToSuLifeMeta = life.meta;
export const thaiToSuChapters: readonly LifeChapter[] = life.chapters;
export const thaiToSuMerits = life.merits;
export const thaiToSuVerse = life.verse;

export const thaiToSuNav = [
  ...thaiToSuChapters.map((chapter) => ({
    id: chapter.id,
    number: chapter.number,
    title: chapter.title,
  })),
  {
    id: thaiToSuMerits.id,
    number: thaiToSuMerits.number,
    title: thaiToSuMerits.title,
  },
  {
    id: thaiToSuVerse.id,
    number: thaiToSuVerse.number,
    title: thaiToSuVerse.title,
  },
];
