import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  tone?: "light" | "dark";
  size?: "md" | "lg" | "xl";
  children?: ReactNode;
  rule?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  tone = "light",
  size = "lg",
  rule = true,
}: SectionHeadingProps) {
  const alignCls =
    align === "center"
      ? "text-center mx-auto"
      : align === "right"
        ? "text-right ml-auto"
        : "text-left";
  const titleColor = tone === "dark" ? "text-ivory" : "text-brown-deep";
  const subColor = tone === "dark" ? "text-warm/80" : "text-brown/70";
  const eyeColor = tone === "dark" ? "text-gold-soft/90" : "text-brown/55";
  const titleCls =
    size === "xl" ? "h1-page" : size === "md" ? "h3-block" : "h2-section";

  return (
    <header className={`mb-8 max-w-3xl ${alignCls}`}>
      {eyebrow ? (
        <p className={`type-eyebrow mb-3 ${eyeColor}`}>{eyebrow}</p>
      ) : null}
      <h2 className={`${titleCls} ${titleColor}`}>{title}</h2>
      {subtitle ? (
        <p
          className={`type-body mt-4 max-w-2xl text-[0.95rem] md:text-base ${subColor} ${align === "center" ? "mx-auto" : ""}`}
        >
          {subtitle}
        </p>
      ) : null}
      {rule ? (
        <div
          className={`gold-rule mt-6 ${
            align === "center"
              ? "mx-auto"
              : align === "right"
                ? "ml-auto"
                : ""
          }`}
        />
      ) : null}
    </header>
  );
}

type SectionProps = {
  id?: string;
  className?: string;
  children: ReactNode;
  dark?: boolean;
  sand?: boolean;
  ink?: boolean;
  fullBleed?: boolean;
  noPad?: boolean;
  motif?: boolean;
};

export function Section({
  id,
  className,
  children,
  dark,
  sand,
  ink,
  fullBleed,
  noPad,
  motif,
}: SectionProps) {
  const surface = ink
    ? "texture-ink text-ivory"
    : dark
      ? "texture-dark text-ivory"
      : sand
        ? "texture-sand"
        : "texture-paper";

  const padCls = noPad
    ? ""
    : fullBleed
      ? "site-section px-5 md:px-8"
      : "site-container site-section";

  return (
    <section
      id={id}
      className={`relative scroll-mt-24 overflow-hidden ${surface} ${
        motif ? "motif-lotus" : ""
      } ${className ?? ""}`}
    >
      <div className="grain absolute inset-0" aria-hidden />
      <div className={`relative ${padCls}`}>{children}</div>
    </section>
  );
}

export function ChapterCurtain({
  id,
  eyebrow,
  title,
  dark = true,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  dark?: boolean;
}) {
  return (
    <section
      id={id}
      className={`relative flex min-h-[40vh] items-center justify-center overflow-hidden px-6 md:min-h-[48vh] ${
        dark ? "texture-ink text-ivory" : "texture-sand text-brown-deep"
      }`}
    >
      <div className="grain absolute inset-0" aria-hidden />
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        {eyebrow ? (
          <p className="type-eyebrow mb-4 text-gold-soft/80">{eyebrow}</p>
        ) : null}
        <h2 className="h1-page">{title}</h2>
        <div className="gold-rule mx-auto mt-7" />
      </div>
    </section>
  );
}
