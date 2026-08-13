"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { navItems, site } from "@/data/content";

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname() || "/";
  const solid = scrolled || open || pathname !== "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition duration-300 ${
        solid
          ? "bg-brown-dark/92 text-ivory shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-md"
          : "bg-transparent text-ivory"
      }`}
    >
      <div className="site-container flex items-center justify-between gap-4 py-3 md:py-3.5">
        <Link href="/" className="group flex items-center gap-2.5">
          <Image
            src={site.logo}
            alt={`Logo ${site.name}`}
            width={40}
            height={40}
            className="h-9 w-9 rounded-full object-cover ring-1 ring-gold/40 md:h-10 md:w-10"
            priority
          />
          <span className="type-display text-base md:text-lg">
            {site.nameUpper}
          </span>
        </Link>

        <nav
          className="hidden items-center gap-0.5 lg:flex"
          aria-label="Điều hướng chính"
        >
          {navItems.map((item) => {
            const isActive = isActivePath(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`type-label relative px-3 py-2 text-[0.8125rem] transition ${
                  isActive ? "text-gold-soft" : "text-ivory/70 hover:text-ivory"
                }`}
              >
                {item.label}
                <span
                  className={`absolute inset-x-3 -bottom-0.5 h-px origin-left bg-gold/80 transition ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="inline-flex border border-ivory/25 p-2 transition hover:bg-white/5 lg:hidden"
          aria-label={open ? "Đóng menu" : "Mở menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open ? (
        <nav
          className="max-h-[70vh] overflow-y-auto border-t border-gold/15 bg-brown-dark/98 px-5 py-5 backdrop-blur-xl lg:hidden"
          aria-label="Menu di động"
        >
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = isActivePath(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block border-b border-ivory/5 py-3.5 text-base ${
                      isActive ? "text-gold-soft" : "text-ivory/90"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
