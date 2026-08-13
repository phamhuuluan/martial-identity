"use client";

import { useState } from "react";

/**
 * Returns an onError handler that hides the img element if it fails to load.
 * Prevents broken image icons from appearing in the UI.
 */
export function useSafeImageError(): (
  e: React.SyntheticEvent<HTMLImageElement>
) => void {
  return (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    // Hide the broken image; let the surrounding container handle styling
    img.style.display = "none";
  };
}

/**
 * Returns [src, onError] — if src fails to load, switches to fallback.
 * Falls back to hiding the image if no fallback provided.
 */
export function useSafeImage(
  initialSrc: string,
  fallbackSrc?: string
): [string, (e: React.SyntheticEvent<HTMLImageElement>) => void] {
  const [src, setSrc] = useState(initialSrc);

  const onError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (fallbackSrc && src !== fallbackSrc) {
      setSrc(fallbackSrc);
    } else {
      // No fallback — hide the element to avoid broken icon
      e.currentTarget.style.display = "none";
    }
  };

  return [src, onError];
}
