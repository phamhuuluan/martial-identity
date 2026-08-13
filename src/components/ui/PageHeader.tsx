import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  tone?: "light" | "dark" | "sand";
};

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
  tone = "light",
}: PageHeaderProps) {
  const surface =
    tone === "dark"
      ? "texture-dark text-ivory"
      : tone === "sand"
        ? "texture-sand"
        : "texture-paper";
  const eye =
    tone === "dark" ? "text-gold-soft/85" : "text-brown/55";
  const titleCls =
    tone === "dark" ? "text-ivory" : "text-brown-deep";
  const descCls =
    tone === "dark" ? "text-ivory/70" : "text-brown/70";

  return (
    <header className={`relative overflow-hidden ${surface}`}>
      <div className="grain absolute inset-0" aria-hidden />
      <div className="site-container relative pt-28 pb-10 md:pt-32 md:pb-12">
        <p className={`type-eyebrow ${eye}`}>{eyebrow}</p>
        <h1 className={`h1-page mt-3 ${titleCls}`}>{title}</h1>
        {description ? (
          <div className={`type-body measure mt-4 text-[0.95rem] md:text-base ${descCls}`}>
            {description}
          </div>
        ) : null}
        <div className="gold-rule mt-6" />
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </header>
  );
}
