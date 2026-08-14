import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  contactDescription,
  contactHighlights,
  officialSocialLinks,
  toDinh,
} from "@/data/content";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";

const [toDinhHighlight, ...networkLocations] = contactHighlights;

const networkColumnSplit = Math.ceil(networkLocations.length / 2);
const networkColumns = [
  networkLocations.slice(0, networkColumnSplit),
  networkLocations.slice(networkColumnSplit),
] as const;

const officialSocial = officialSocialLinks.map((item) => ({
  ...item,
  icon:
    item.name === "TikTok"
      ? TikTokIcon
      : item.name === "YouTube"
        ? YouTubeIcon
        : FacebookIcon,
}));

/** Compact contact strip for Home hub. */
export function HomeContact() {
  return (
    <section className="relative scroll-mt-24 overflow-hidden texture-dark">
      <div className="grain absolute inset-0" aria-hidden />
      <div className="site-container site-section relative">
        <Reveal className="max-w-xl">
          <p className="type-eyebrow text-ivory/45">Liên hệ</p>
          <h2 className="h2-section mt-3 text-ivory">Bắt đầu từ Tổ Đình</h2>
          <p className="type-body mt-4 text-[0.95rem] text-ivory/65">
            {toDinhHighlight.address}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/lien-he" className="btn btn-accent">
              Thông tin liên hệ
            </Link>
            <Link href="/dia-diem" className="btn btn-ghost text-ivory">
              Xem địa điểm
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <>
      <PageHeader
        eyebrow="Liên hệ"
        title="Liên hệ"
        description={contactDescription}
        tone="sand"
        layout="split"
        meta={
          <p className="type-eyebrow text-brown/40">
            <span className="tabular-nums text-brown-deep/70">
              {String(contactHighlights.length).padStart(2, "0")}
            </span>
            <span className="mx-2 text-brown/25">·</span>
            địa điểm đại diện
          </p>
        }
      />

      <section
        id="lien-he"
        className="relative scroll-mt-24 overflow-hidden texture-paper"
      >
        <div className="grain absolute inset-0" aria-hidden />
        <div className="site-container site-section relative">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="type-eyebrow text-brown/55">Hệ thống</p>
                <h2 className="h2-section mt-3 text-brown-deep">Địa điểm</h2>
              </div>
              <div className="gold-rule mb-1.5 hidden w-16 sm:block" />
            </div>
            <div className="gold-rule mt-6 sm:hidden" />
          </Reveal>

          <Reveal className="mt-12 md:mt-14">
            <aside className="contact-featured" aria-label="Tổ Đình">
              <div className="contact-featured-inner">
                <h3 className="contact-featured-title">{toDinhHighlight.region}</h3>
                {toDinhHighlight.address ? (
                  <p className="type-body mt-5 max-w-md text-[0.95rem] leading-relaxed text-brown-deep/70 md:mt-6 md:text-base">
                    {toDinhHighlight.address}
                  </p>
                ) : null}
              </div>
            </aside>
          </Reveal>

          <div className="contact-network mt-8 md:mt-10">
            {networkColumns.map((column, colIndex) => (
              <div key={colIndex} className="contact-network-col">
                <Stagger stagger={0.03}>
                  {column.map((loc, index) => {
                    const displayIndex =
                      colIndex === 0 ? index + 1 : index + networkColumnSplit + 1;
                    return (
                      <StaggerItem key={loc.region}>
                        <article className="contact-network-row group">
                          <span className="contact-network-index type-eyebrow">
                            {String(displayIndex).padStart(2, "0")}
                          </span>
                          <h3 className="contact-network-name">{loc.region}</h3>
                        </article>
                      </StaggerItem>
                    );
                  })}
                </Stagger>
              </div>
            ))}
          </div>

          <Reveal delay={0.06}>
            <Link
              href="/dia-diem"
              className="contact-cta type-label group mt-12 inline-flex items-center gap-2.5 text-sm font-semibold text-brown/70 md:mt-14"
            >
              Xem tất cả địa điểm
              <ArrowRight
                size={15}
                className="transition duration-300 group-hover:translate-x-1"
              />
            </Link>
          </Reveal>

          <Reveal className="contact-map-feature mt-16 md:mt-20">
            <div className="contact-map-copy">
              <div>
                <p className="type-eyebrow text-brown/55">Điểm đến</p>
                <h3 className="h3-block mt-3 text-brown-deep">Bản đồ Tổ Đình</h3>
                <p className="type-body mt-5 max-w-xs text-sm leading-relaxed text-brown/65 md:text-[0.95rem]">
                  {toDinh.fullAddress}
                </p>
              </div>
              <a
                href={toDinh.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-cta type-label group mt-8 inline-flex items-center gap-2.5 text-sm font-semibold text-brown/75 md:mt-0"
              >
                Mở trên Google Maps
                <ArrowRight
                  size={15}
                  className="transition duration-300 group-hover:translate-x-1"
                />
              </a>
            </div>

            <div className="contact-map-frame group/map">
              <iframe
                title={`Bản đồ Tổ Đình — ${toDinh.templeName}`}
                src={toDinh.mapEmbed}
                className="absolute inset-0 h-full w-full border-0 transition duration-700 group-hover/map:scale-[1.015]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden texture-dark">
        <div className="grain absolute inset-0" aria-hidden />
        <div className="site-container relative py-14 md:py-16">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="type-eyebrow text-gold-soft/80">Kết nối</p>
                <h2 className="h2-section mt-3 text-ivory">
                  Mạng xã hội chính thức
                </h2>
              </div>
              <div className="gold-rule mb-1.5 hidden w-16 bg-gold-soft/60 sm:block" />
            </div>
            <div className="gold-rule mt-6 bg-gold-soft/60 sm:hidden" />
          </Reveal>

          <Stagger className="contact-social mt-10 md:mt-12" stagger={0.05}>
            {officialSocial.map((item) => {
              const Icon = item.icon;
              return (
                <StaggerItem key={item.name}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-social-item group"
                  >
                    <span className="contact-social-icon">
                      <Icon />
                    </span>
                    <span className="contact-social-name">{item.name}</span>
                    <span className="contact-social-arrow" aria-hidden>
                      →
                    </span>
                  </a>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>
    </>
  );
}

function TikTokIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={18}
      height={18}
      fill="currentColor"
      aria-hidden
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.18 8.18 0 0 0 4.76 1.52V6.79a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={18}
      height={18}
      fill="currentColor"
      aria-hidden
    >
      <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14C4.5 20.5 12 20.5 12 20.5s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={18}
      height={18}
      fill="currentColor"
      aria-hidden
    >
      <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14C17.17 2.09 15.92 2 14.79 2 11.92 2 10 3.82 10 7.29V9.5H7.5v4H10V22h4v-8.5z" />
    </svg>
  );
}
