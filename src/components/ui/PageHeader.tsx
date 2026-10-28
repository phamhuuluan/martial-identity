import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  tone?: "light" | "dark" | "sand";
  /** Asymmetric title | description for editorial pages */
  layout?: "stack" | "split";
  meta?: ReactNode;
  back?: { href: string; label: string };
};

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
  tone = "light",
  layout = "stack",
  meta,
  back,
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
  const split = layout === "split";

  return (
    <header className={`relative overflow-hidden ${surface}`}>
      <div className="grain absolute inset-0" aria-hidden />
      <div className="site-container relative pt-28 pb-12 md:pt-32 md:pb-16">
        {back ? (
          <Link
            href={back.href}
            className={`type-label mb-6 inline-flex items-center gap-2 text-sm transition ${
              tone === "dark"
                ? "text-ivory/60 hover:text-ivory"
                : "text-brown/55 hover:text-brown-deep"
            }`}
          >
            <ArrowLeft size={15} strokeWidth={1.5} />
            {back.label}
          </Link>
        ) : null}
        {split ? (
          <div className="grid gap-8 md:grid-cols-12 md:gap-10 md:items-end">
            <div className="md:col-span-7">
              <p className={`type-eyebrow ${eye}`}>{eyebrow}</p>
              <h1
                className={`mt-3 font-display font-semibold tracking-[-0.02em] ${titleCls} text-[clamp(2.25rem,5.5vw,3.5rem)] leading-[1.05]`}
              >
                {title}
              </h1>
              <div className="gold-rule mt-7 w-20 md:w-28" />
            </div>
            <div className="md:col-span-5 md:border-l md:border-brown/15 md:pl-8 lg:pl-10">
              {description ? (
                <div
                  className={`type-body max-w-sm text-[0.95rem] md:text-base ${descCls}`}
                >
                  {description}
                </div>
              ) : null}
              {meta ? <div className="mt-6">{meta}</div> : null}
            </div>
          </div>
        ) : (
          <>
            <p className={`type-eyebrow ${eye}`}>{eyebrow}</p>
            <h1 className={`h1-page mt-3 ${titleCls}`}>{title}</h1>
            {description ? (
              <div
                className={`type-body measure mt-4 text-[0.95rem] md:text-base ${descCls}`}
              >
                {description}
              </div>
            ) : null}
            <div className="gold-rule mt-6" />
            {meta ? <div className="mt-6">{meta}</div> : null}
          </>
        )}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </header>
  );
}
