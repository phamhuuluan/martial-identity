import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  tone?: "light" | "dark";
  size?: "md" | "lg" | "xl";
  children?: ReactNode;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  tone = "light",
  size = "lg",
}: SectionHeadingProps) {
  const alignCls =
    align === "center"
      ? "text-center mx-auto"
      : align === "right"
        ? "text-right ml-auto"
        : "text-left";
  const titleColor = tone === "dark" ? "text-ivory" : "text-brown-deep";
  const subColor = tone === "dark" ? "text-warm/85" : "text-brown/75";
  const eyeColor = tone === "dark" ? "text-gold-soft" : "text-gold";
  const titleSize =
    size === "xl"
      ? "text-4xl md:text-6xl lg:text-7xl"
      : size === "md"
        ? "text-2xl md:text-4xl"
        : "text-3xl md:text-5xl";

  return (
    <header className={`mb-10 max-w-4xl ${alignCls}`}>
      {eyebrow ? (
        <p className={`type-eyebrow mb-4 ${eyeColor}`}>{eyebrow}</p>
      ) : null}
      <h2
        className={`type-display font-semibold ${titleSize} ${titleColor}`}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={`type-body mt-5 max-w-2xl text-base md:text-lg ${subColor} ${align === "center" ? "mx-auto" : ""}`}
        >
          {subtitle}
        </p>
      ) : null}
      <div
        className={`gold-rule mt-7 ${
          align === "center" ? "mx-auto w-28" : align === "right" ? "ml-auto w-20" : "w-20"
        }`}
      />
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

  return (
    <section
      id={id}
      className={`relative scroll-mt-24 overflow-hidden ${surface} ${
        motif ? "motif-lotus" : ""
      } ${className ?? ""}`}
    >
      <div className="grain absolute inset-0" aria-hidden />
      <div
        className={`relative ${
          noPad ? "" : "px-5 py-20 md:px-8 md:py-28 lg:px-12"
        } ${fullBleed ? "" : "mx-auto max-w-7xl"}`}
      >
        {children}
      </div>
    </section>
  );
}

/** Full-viewport chapter curtain */
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
      className={`relative flex min-h-[70vh] items-center justify-center overflow-hidden px-6 md:min-h-[80vh] ${
        dark ? "texture-ink text-ivory" : "texture-sand text-brown-deep"
      }`}
    >
      <div className="grain absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 45%, rgba(201,162,39,0.18), transparent 55%)",
        }}
        aria-hidden
      />
      <div className="relative z-10 mx-auto max-w-5xl text-center">
        {eyebrow ? (
          <p className="type-eyebrow mb-6 text-gold-soft">{eyebrow}</p>
        ) : null}
        <h2 className="type-display text-4xl font-semibold md:text-6xl lg:text-7xl">
          {title}
        </h2>
        <div className="gold-rule mx-auto mt-10 w-32" />
      </div>
    </section>
  );
}
