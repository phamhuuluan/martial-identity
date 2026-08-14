import Link from "next/link";
import { navItems, site } from "@/data/content";

const FOOTER_BLURB =
  "Võ cổ truyền Việt Nam — rèn luyện thân tâm, phụng sự Đạo pháp và dân tộc.";

const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="site-footer relative text-ivory">
      <div className="site-container relative py-14 md:py-16">
        <div className="grid gap-12 md:grid-cols-12 md:items-end md:gap-14">
          <div className="md:col-span-7">
            <p className="font-display text-[1.75rem] font-semibold tracking-[-0.014em] text-ivory md:text-[2rem]">
              {site.nameUpper}
            </p>
            <div className="gold-rule mt-5 bg-gold/45" />
            <p className="type-body mt-5 max-w-md text-[0.9375rem] leading-relaxed text-ivory/50">
              {FOOTER_BLURB}
            </p>
          </div>

          <nav
            aria-label="Điều hướng chân trang"
            className="md:col-span-5 md:justify-self-end"
          >
            <p className="type-eyebrow text-ivory/35">Điều hướng</p>
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2.5 text-[0.9375rem] text-ivory/55 md:justify-end">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="underline-offset-[5px] transition-colors hover:text-ivory hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 border-t border-ivory/[0.08] pt-6">
          <p className="text-xs tracking-wide text-ivory/30">
            © {CURRENT_YEAR} {site.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
