"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  x?: number;
  scale?: number;
  once?: boolean;
};

/**
 * Reveal — fade-in + slide-up animation on scroll.
 *
 * Always renders a <motion.div> on both server and client to avoid
 * hydration mismatch. When the user has prefers-reduced-motion enabled,
 * we skip the animation by setting duration: 0 so the element appears
 * instantly without changing the rendered element type.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 36,
  x = 0,
  scale = 1,
  once = true,
}: RevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y, x, scale: scale === 1 ? 0.98 : scale }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once, margin: "-12% 0px" }}
      transition={reduce ? { duration: 0 } : { duration: 0.85, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger — stagger-animates children on scroll.
 *
 * Always renders <motion.div> to avoid hydration mismatch.
 * With reduced motion, stagger delay is 0 so children appear instantly.
 */
export function Stagger({
  children,
  className,
  stagger = 0.1,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: reduce ? 0 : stagger },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 28, filter: "blur(4px)" },
        show: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.65, ease },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
