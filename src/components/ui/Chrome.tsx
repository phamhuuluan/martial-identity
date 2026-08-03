"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { navItems } from "@/data/content";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-gold via-gold-soft to-gold"
      style={{ scaleX }}
      aria-hidden
    />
  );
}

export function DotNav() {
  const [active, setActive] = useState<string>(navItems[0]?.href ?? "");

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
      { rootMargin: "-35% 0px -45% 0px", threshold: [0.1, 0.25, 0.5] }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className="pointer-events-none fixed top-1/2 right-4 z-40 hidden -translate-y-1/2 flex-col gap-3 xl:flex"
      aria-label="Chỉ báo phần"
    >
      {navItems.map((item) => {
        const isActive = active === item.href;
        return (
          <a
            key={item.href}
            href={item.href}
            className="pointer-events-auto group relative flex items-center justify-end gap-3"
            aria-label={item.label}
            aria-current={isActive ? "true" : undefined}
          >
            <span
              className={`type-eyebrow translate-x-2 text-[10px] text-gold-soft opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100 ${
                isActive ? "translate-x-0 opacity-100" : ""
              }`}
            >
              {item.label}
            </span>
            <span
              className={`block rounded-full border transition ${
                isActive
                  ? "h-2.5 w-2.5 border-gold bg-gold shadow-[0_0_12px_rgba(201,162,39,0.7)]"
                  : "h-2 w-2 border-brown/40 bg-brown/20 hover:border-gold"
              }`}
            />
          </a>
        );
      })}
    </nav>
  );
}
