"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { locationStats, locations, scaleIntro, site, toDinh } from "@/data/content";
import { Reveal } from "@/components/ui/Reveal";

const regions = [
  { key: "south" as const, data: locations.south },
  { key: "central" as const, data: locations.central },
  { key: "north" as const, data: locations.north },
  { key: "overseas" as const, data: locations.overseas },
] as const;

type RegionKey = (typeof regions)[number]["key"];

type Dojo = {
  name: string;
  locations: readonly string[];
  schedule?: string;
};

const TO_DINH_NAME = "TỔ ĐÌNH";

function isToDinh(dojo: { name: string }): boolean {
  return dojo.name.trim().toLocaleUpperCase("vi-VN") === TO_DINH_NAME;
}

function getToDinh(): Dojo | undefined {
  return locations.south.dojos.find(isToDinh) as Dojo | undefined;
}

function matchesQuery(dojo: Dojo, q: string): boolean {
  if (!q) return true;
  const schedule = typeof dojo.schedule === "string" ? dojo.schedule : "";
  const hay = `${dojo.name} ${dojo.locations.join(" ")} ${schedule}`.toLowerCase();
  return hay.includes(q);
}

function cleanPlaceToken(token: string): string {
  return token
    .replace(/^(P\.|Phường|Xã|Thôn|Ấp|Tỉnh|TP\.|Thành phố)\s*/i, "")
    .trim();
}

function formatAddressLines(raw: string): {
  primary: string;
  secondary?: string;
} {
  const parts = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length <= 1) return { primary: raw };
  const primary = parts[0];
  const secondary = parts
    .slice(1)
    .map(cleanPlaceToken)
    .filter(Boolean)
    .join(" · ");
  return { primary, secondary: secondary || undefined };
}

function formatSchedule(raw: string): {
  time?: string;
  days?: string;
  lines?: string[];
} {
  const simple = raw.match(
    /^(\d{1,2}:\d{2}\s*[–-]\s*\d{1,2}:\d{2})\s*,\s*(.+)$/u
  );
  if (simple) {
    const days = simple[2]
      .replace(/\s*&\s*/g, " · ")
      .replace(/,\s*/g, " · ")
      .replace(/\s+/g, " ")
      .trim();
    return { time: simple[1].replace(/-/g, "–"), days };
  }

  const lines = raw
    .split(/\s*;\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (lines.length > 1) return { lines };
  return { lines: [raw] };
}

function featuredToDinhCopy(dojo: Dojo): {
  label: string;
  temple: string;
  address: string;
} {
  return {
    label: dojo.name,
    temple: toDinh.templeName,
    address: toDinh.address,
  };
}

function DojoDirectoryRow({
  dojo,
  index,
}: {
  dojo: Dojo;
  index: number;
}) {
  const ordinal = String(index).padStart(2, "0");
  const schedule =
    typeof dojo.schedule === "string" ? formatSchedule(dojo.schedule) : null;

  return (
    <article className="directory-row group">
      <div className="directory-row-grid">
        <div className="directory-index type-eyebrow text-brown/40 transition-colors duration-300 group-hover:text-gold">
          {ordinal}
        </div>

        <div className="directory-main min-w-0">
          <h3 className="type-display text-[1.05rem] font-semibold tracking-wide text-brown-deep uppercase transition-colors duration-300 group-hover:text-ink md:text-xl">
            {dojo.name}
          </h3>
          <ul className="mt-2.5 space-y-2.5 md:mt-3">
            {dojo.locations.map((loc, locIndex) => {
              const { primary, secondary } = formatAddressLines(loc);
              return (
                <li
                  key={`${dojo.name}-${loc}-${locIndex}`}
                  className="type-body text-sm text-brown-deep/80 md:text-[0.95rem]"
                >
                  <p className="leading-snug">{primary}</p>
                  {secondary ? (
                    <p className="mt-0.5 text-[0.8125rem] text-brown/55 md:text-sm">
                      {secondary}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>

          {schedule ? (
            <div className="directory-schedule-mobile mt-4 border-t border-brown/10 pt-3 md:hidden">
              <ScheduleBlock schedule={schedule} />
            </div>
          ) : null}
        </div>

        <div className="directory-schedule-desktop hidden md:block">
          {schedule ? <ScheduleBlock schedule={schedule} align="end" /> : null}
        </div>

        <span
          className="directory-arrow type-eyebrow pointer-events-none text-gold"
          aria-hidden
        >
          →
        </span>
      </div>
    </article>
  );
}

function ScheduleBlock({
  schedule,
  align = "start",
}: {
  schedule: ReturnType<typeof formatSchedule>;
  align?: "start" | "end";
}) {
  const alignClass = align === "end" ? "text-right" : "text-left";
  if (schedule.time) {
    return (
      <div className={`type-body ${alignClass}`}>
        <p className="text-sm font-medium tabular-nums tracking-wide text-brown-deep/85 md:text-[0.95rem]">
          {schedule.time}
        </p>
        {schedule.days ? (
          <p className="mt-1 text-[0.8125rem] text-brown/50 md:text-sm">
            {schedule.days}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className={`type-body space-y-1 ${alignClass}`}>
      {(schedule.lines ?? []).map((line) => (
        <p
          key={line}
          className="text-[0.8125rem] leading-snug text-brown/55 md:text-sm"
        >
          {line}
        </p>
      ))}
    </div>
  );
}

export function Locations({
  coverImage,
  showBanner = true,
}: {
  coverImage?: string;
  showBanner?: boolean;
}) {
  const [activeKey, setActiveKey] = useState<RegionKey>("south");
  const [query, setQuery] = useState("");
  const current = regions.find((r) => r.key === activeKey) ?? regions[0];
  const panelRef = useRef<HTMLDivElement>(null);
  const skipScrollRef = useRef(true);

  const normalizedQuery = query.trim().toLowerCase();
  const toDinh = useMemo(() => getToDinh(), []);
  const toDinhMatches = useMemo(
    () => (toDinh ? matchesQuery(toDinh, normalizedQuery) : false),
    [toDinh, normalizedQuery]
  );
  const showFeaturedToDinh = Boolean(toDinh && toDinhMatches);

  const filteredDojos = useMemo(() => {
    return (current.data.dojos as readonly Dojo[])
      .filter((dojo) => !isToDinh(dojo))
      .filter((dojo) => matchesQuery(dojo, normalizedQuery));
  }, [current.data.dojos, normalizedQuery]);

  const matchCounts = useMemo(() => {
    const counts: Record<RegionKey, number> = {
      south: 0,
      central: 0,
      north: 0,
      overseas: 0,
    };
    for (const r of regions) {
      counts[r.key] = r.data.dojos.filter((d) =>
        matchesQuery(d as Dojo, normalizedQuery)
      ).length;
    }
    return counts;
  }, [normalizedQuery]);

  const totalMatches = useMemo(
    () => Object.values(matchCounts).reduce((a, b) => a + b, 0),
    [matchCounts]
  );

  useEffect(() => {
    if (skipScrollRef.current) {
      skipScrollRef.current = false;
      return;
    }
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [activeKey]);

  return (
    <section
      id="quy-mo"
      className="relative scroll-mt-24 overflow-hidden texture-paper"
    >
      <div className="grain absolute inset-0" aria-hidden />

      {showBanner ? (
        <div className="relative h-[32vh] min-h-[200px] w-full overflow-hidden clip-diagonal md:h-[40vh]">
          <Image
            src={coverImage || scaleIntro.image || site.heroFallback}
            alt="Quy mô hoạt động môn phái"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brown-dark via-brown-dark/45 to-brown-dark/20" />
          <div className="absolute inset-0 flex items-end">
            <div className="site-container relative w-full pb-10 md:pb-12">
              <Reveal>
                <p className="type-eyebrow text-gold-soft/85">
                  {locationStats.total} CLB / điểm tập
                </p>
                <h1 className="h1-page mt-2 max-w-3xl text-ivory">
                  {scaleIntro.sectionTitle}
                </h1>
              </Reveal>
            </div>
          </div>
        </div>
      ) : null}

      <div className="site-container site-section relative">
        <Reveal>
          <p className="type-body measure text-[0.95rem] text-brown-deep/85 md:text-base">
            {scaleIntro.body}
          </p>
        </Reveal>

        <div className="control-panel mt-8">
          <label className="relative block max-w-xl">
            <span className="sr-only">Tìm CLB hoặc địa chỉ</span>
            <Search
              size={16}
              className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-brown/40"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm theo tên CLB hoặc địa chỉ…"
              className="field-input"
            />
          </label>

          <div
            role="tablist"
            aria-label="Khu vực hoạt động"
            className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4"
          >
            {regions.map((r) => {
              const count = normalizedQuery
                ? matchCounts[r.key]
                : r.data.dojos.length;
              return (
                <button
                  key={r.key}
                  type="button"
                  role="tab"
                  aria-selected={activeKey === r.key}
                  aria-controls={`locations-panel-${r.key}`}
                  id={`locations-tab-${r.key}`}
                  onClick={() => setActiveKey(r.key)}
                  className={`chip text-left ${
                    activeKey === r.key ? "chip-active" : "chip-idle"
                  }`}
                >
                  <span className="block leading-snug">{r.data.region}</span>
                  <span
                    className={`mt-0.5 block text-[11px] ${
                      activeKey === r.key ? "text-ivory/70" : "text-brown/45"
                    }`}
                  >
                    {count} địa điểm
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {normalizedQuery ? (
          <p className="mt-5 text-sm text-brown/50" aria-live="polite">
            {filteredDojos.length +
              (activeKey === "south" && toDinhMatches ? 1 : 0)}{" "}
            kết quả tại {current.data.region}
            {totalMatches !==
            filteredDojos.length +
              (activeKey === "south" && toDinhMatches ? 1 : 0)
              ? ` · ${totalMatches} trên toàn hệ thống`
              : ""}
            {` · “${query.trim()}”`}
          </p>
        ) : null}

        {showFeaturedToDinh && toDinh ? (
          <FeaturedToDinh dojo={toDinh} />
        ) : null}

        <div
          role="tabpanel"
          id={`locations-panel-${current.key}`}
          aria-labelledby={`locations-tab-${current.key}`}
          className="mt-10 scroll-mt-28 md:mt-12"
          ref={panelRef}
        >
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-brown/15 pb-4">
            <h2 className="h3-block text-brown-deep">{current.data.region}</h2>
            <p className="type-eyebrow text-brown/45">
              {filteredDojos.length} địa điểm
            </p>
          </div>

          {filteredDojos.length === 0 ? (
            showFeaturedToDinh && activeKey === "south" ? null : (
              <div className="mt-6 space-y-2 text-brown/55">
                <p>Không tìm thấy CLB phù hợp trong {current.data.region}.</p>
                {normalizedQuery && totalMatches > 0 ? (
                  <p className="text-sm">
                    Có {totalMatches} kết quả ở miền khác — thử chọn tab còn số
                    liệu.
                  </p>
                ) : null}
              </div>
            )
          ) : (
            <div className="mt-1">
              {filteredDojos.map((dojo, index) => (
                <DojoDirectoryRow
                  key={dojo.name}
                  dojo={dojo}
                  index={index + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function FeaturedToDinh({ dojo }: { dojo: Dojo }) {
  const copy = featuredToDinhCopy(dojo);

  return (
    <aside className="featured-origin mt-10 md:mt-12" aria-label="Tổ đình">
      <div className="featured-origin-inner">
        <p className="type-eyebrow text-gold">{copy.label}</p>
        <h2 className="type-display mt-4 text-[clamp(1.75rem,4vw,2.75rem)] font-semibold tracking-wide text-brown-deep uppercase">
          {copy.temple}
        </h2>
        <p className="type-body mt-4 max-w-xl text-base leading-relaxed text-brown-deep/75 md:text-lg">
          {copy.address}
        </p>
      </div>
    </aside>
  );
}
