import Link from "next/link";
import { navItems, site } from "@/data/content";

const FOOTER_BLURB =
  "Võ cổ truyền Việt Nam — rèn luyện thân tâm, phụng sự Đạo pháp và dân tộc.";

const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="site-footer relative text-ivory">
      <div className="site-container relative py-14 md:py-16">
        <div className="max-w-xl">
          <p className="font-display text-[1.65rem] font-semibold tracking-[-0.012em] text-ivory md:text-[1.85rem]">
            {site.nameUpper}
          </p>
          <p className="type-body mt-4 text-[0.9375rem] leading-relaxed text-ivory/55">
            {FOOTER_BLURB}
          </p>
        </div>

        <div className="mt-10 border-t border-ivory/[0.08] pt-8">
          <p className="type-eyebrow text-ivory/35">Điều hướng</p>
          <nav
            aria-label="Điều hướng chân trang"
            className="mt-4 flex flex-wrap gap-x-1 gap-y-2 text-[0.9375rem] text-ivory/60"
          >
            {navItems.map((item, index) => (
              <span key={item.href} className="inline-flex items-center">
                {index > 0 ? (
                  <span className="mx-2.5 text-ivory/20" aria-hidden>
                    ·
                  </span>
                ) : null}
                <Link
                  href={item.href}
                  className="transition-colors hover:text-ivory"
                >
                  {item.label}
                </Link>
              </span>
            ))}
          </nav>
        </div>

        <div className="mt-10 border-t border-ivory/[0.08] pt-6">
          <p className="text-xs tracking-wide text-ivory/35">
            © {CURRENT_YEAR} {site.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
