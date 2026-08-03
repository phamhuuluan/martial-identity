"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { navItems, site } from "@/data/content";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = navItems.map((n) => n.href.replace("#", ""));
    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActive(`#${visible[0].target.id}`);
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0.05, 0.2, 0.4] }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition duration-400 ${
        scrolled || open
          ? "bg-brown-dark/90 text-ivory shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          : "bg-transparent text-ivory"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 md:px-8 md:py-4">
        <Link href="#hero" className="group flex items-center gap-3">
          <Image
            src={site.logo}
            alt={`Logo ${site.name}`}
            width={44}
            height={44}
            className="h-10 w-10 rounded-full object-cover ring-1 ring-gold/50 transition group-hover:ring-gold md:h-11 md:w-11"
            priority
          />
          <span className="type-display text-lg md:text-xl">
            {site.nameUpper}
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Điều hướng chính"
        >
          {navItems.map((item) => {
            const isActive = active === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`type-label relative px-3 py-2 text-sm transition ${
                  isActive ? "text-gold-soft" : "text-ivory/75 hover:text-ivory"
                }`}
              >
                {item.label}
                <span
                  className={`absolute inset-x-3 -bottom-0.5 h-px origin-left bg-gold transition ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </a>
            );
          })}
        </nav>

        <button
          type="button"
          className="inline-flex rounded-full border border-gold/40 p-2.5 transition hover:bg-white/5 lg:hidden"
          aria-label={open ? "Đóng menu" : "Mở menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open ? (
        <nav
          className="max-h-[70vh] overflow-y-auto border-t border-gold/15 bg-brown-dark/98 px-5 py-5 backdrop-blur-xl lg:hidden"
          aria-label="Menu di động"
        >
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="block border-b border-ivory/5 py-3.5 text-base text-ivory/90"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
