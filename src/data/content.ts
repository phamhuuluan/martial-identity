/**
 * Site content loaded from content/site/*.json.
 * Text source: so_tay_gioi_thieu_27_02_2023.pdf. Do not rewrite in code.
 */
import contactJson from "../../content/site/contact.json";
import introJson from "../../content/site/intro.json";
import locationsJson from "../../content/site/locations.json";
import philosophyJson from "../../content/site/philosophy.json";
import siteJson from "../../content/site/site.json";
import trainingJson from "../../content/site/training.json";
import {
  parseContact,
  parseIntro,
  parseLocations,
  parsePhilosophy,
  parseSite,
  parseTraining,
  type Dojo,
} from "./siteSchema";

const siteFile = parseSite(siteJson);
const contactFile = parseContact(contactJson);
const introFile = parseIntro(introJson);
const philosophyFile = parsePhilosophy(philosophyJson);
const locationsFile = parseLocations(locationsJson);
const trainingFile = parseTraining(trainingJson);

const TO_DINH_NAME = "TỔ ĐÌNH";

function isToDinhName(name: string): boolean {
  return name.trim().toLocaleUpperCase("vi-VN") === TO_DINH_NAME;
}

export const site = {
  name: siteFile.name,
  nameUpper: siteFile.nameUpper,
  federationLine: siteFile.federationLine,
  motto: siteFile.motto,
  title: siteFile.title,
  tagline: siteFile.tagline,
  description: siteFile.description,
  logo: siteFile.logo,
  heroImage: siteFile.heroImage,
  heroFallback: siteFile.heroFallback,
  introImage: siteFile.introImage,
};

export const memberTerm = siteFile.memberTerm;
export const navItems = siteFile.navItems;

export const toDinh = contactFile.toDinh;
export const officialSocialLinks = contactFile.officialSocialLinks;
export const contactDescription = contactFile.contactDescription;
export const operatingCountries = contactFile.operatingCountries;

/** Tổ Đình address on the contact strip follows the canonical full address. */
export const contactHighlights = contactFile.contactHighlights.map((item) =>
  item.region.trim() === "Tổ Đình"
    ? { ...item, address: toDinh.fullAddress }
    : item
);

export const sixOathsSection = philosophyFile.sixOathsSection;
export const thaiToSu = introFile.thaiToSu;
export const sangToSu = introFile.sangToSu;

export const formation = {
  ...introFile.formation,
  toDinh: {
    ...introFile.formation.toDinh,
    body: toDinh.fullAddress,
  },
};

export const organization = introFile.organization;
export const logoMeaning = introFile.logoMeaning;
export const philosophy = philosophyFile.philosophy;
export const phuongCham = philosophyFile.phuongCham;
export const sixOaths = philosophyFile.sixOaths;
export const martialSpirit = philosophyFile.martialSpirit;
export const scaleIntro = locationsFile.scaleIntro;

function bindToDinhDojo(dojos: Dojo[]): Dojo[] {
  return dojos.map((dojo) =>
    isToDinhName(dojo.name)
      ? { ...dojo, locations: [toDinh.fullAddress, ...dojo.locations.slice(1)] }
      : dojo
  );
}

export const locations = {
  overseas: locationsFile.locations.overseas,
  north: locationsFile.locations.north,
  central: locationsFile.locations.central,
  south: {
    ...locationsFile.locations.south,
    dojos: bindToDinhDojo(locationsFile.locations.south.dojos),
  },
};

export const beltSystem = trainingFile.beltSystem;
export const curriculum = trainingFile.curriculum;

/** Totals derived from `locations` — keep in sync when adding CLBs. */
export function countAllLocations(): number {
  return (
    locations.south.dojos.length +
    locations.central.dojos.length +
    locations.north.dojos.length +
    locations.overseas.dojos.length
  );
}

export const locationStats = {
  total: countAllLocations(),
  south: locations.south.dojos.length,
  central: locations.central.dojos.length,
  north: locations.north.dojos.length,
  overseas: locations.overseas.dojos.length,
};
