"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

export function StickyPortrait({
  id,
  number,
  title,
  body,
  image,
  cta,
}: {
  id: string;
  number: string;
  title: string;
  body: ReactNode;
  image: string;
  cta?: { href: string; label: string };
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section
      id={id}
      ref={ref}
      className="relative scroll-mt-24 overflow-hidden texture-paper"
    >
      <div className="grain absolute inset-0" aria-hidden />
      <div className="relative mx-auto grid max-w-[72rem] lg:grid-cols-12">
        <div className="relative lg:col-span-5">
          <div className="lg:sticky lg:top-0 lg:h-[85vh]">
            <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden bg-[#ebe3d4] sm:max-w-lg lg:mx-0 lg:aspect-auto lg:h-full lg:max-w-none">
              <motion.div
                style={{ y: imgY }}
                className="absolute inset-0 lg:inset-[-4%]"
              >
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-contain object-center lg:object-cover"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  priority
                />
              </motion.div>
            </div>
          </div>
        </div>

        <div className="flex items-center px-5 py-10 md:px-8 md:py-16 lg:col-span-7 lg:px-12">
          <Reveal>
            <p className="type-eyebrow text-brown/50">{number}</p>
            <h3 className="h2-section mt-2 text-brown-deep">{title}</h3>
            <div className="gold-rule my-5" />
            <div className="prose-body measure text-brown-deep/90">{body}</div>
            {cta ? (
              <Link href={cta.href} className="btn btn-outline mt-8">
                {cta.label}
                <ArrowRight size={15} strokeWidth={1.5} />
              </Link>
            ) : null}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
