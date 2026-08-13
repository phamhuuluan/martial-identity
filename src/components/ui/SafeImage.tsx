"use client";

import Image from "next/image";
import { useState } from "react";
import type { ComponentProps } from "react";

type ImageProps = ComponentProps<typeof Image>;

/**
 * Next.js Image wrapper with safe error handling.
 * - If the image fails to load: hides the <img> (no broken icon).
 * - Optionally shows a styled placeholder instead.
 * - Never breaks the surrounding layout.
 */
export function SafeImage({
  fallback = true,
  className,
  alt = "",
  ...props
}: ImageProps & { fallback?: boolean }) {
  const [errored, setErrored] = useState(false);

  if (errored && fallback) {
    return (
      <span
        className={`flex items-center justify-center bg-brown-dark/20 ${className ?? ""}`}
        aria-hidden
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <rect width="48" height="48" rx="4" fill="currentColor" opacity="0.1" />
          <path
            d="M8 36L16 24L22 32L30 20L40 36H8Z"
            fill="currentColor"
            opacity="0.25"
          />
          <circle cx="18" cy="18" r="4" fill="currentColor" opacity="0.25" />
        </svg>
      </span>
    );
  }

  return (
    <Image
      {...props}
      alt={alt}
      className={errored ? "opacity-0" : className}
      onError={() => setErrored(true)}
    />
  );
}
