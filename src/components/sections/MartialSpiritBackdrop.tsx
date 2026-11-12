"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function MartialSpiritBackdrop({
  image,
  alt,
  children,
}: {
  image: string;
  alt: string;
  children: ReactNode;
}) {
  const spiritRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: spiritRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section
      id="vo-dao"
      ref={spiritRef}
      className="relative min-h-[70svh] scroll-mt-24 overflow-hidden md:min-h-[78svh]"
    >
      <motion.div style={{ y: bgY }} className="absolute inset-[-8%]">
        <Image
          src={image}
          alt={alt}
          fill
          className="object-cover object-[center_60%]"
          sizes="100vw"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-brown-dark via-brown-dark/78 to-brown-dark/35" />
      <div className="relative z-10 flex min-h-[70svh] items-center md:min-h-[78svh]">
        {children}
      </div>
    </section>
  );
}
