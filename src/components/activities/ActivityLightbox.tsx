"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { Lightbox, type GalleryImage } from "@/components/ui/Lightbox";

const OpenGallery = createContext<(index: number) => void>(() => {});

export function ActivityLightbox({
  images,
  children,
}: {
  images: GalleryImage[];
  children: ReactNode;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const open = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  return (
    <OpenGallery.Provider value={open}>
      {children}
      <Lightbox
        images={images}
        index={lightboxIndex ?? 0}
        open={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={setLightboxIndex}
      />
    </OpenGallery.Provider>
  );
}

export function GalleryOpenButton({
  index,
  className,
  label,
  children,
}: {
  index: number;
  className: string;
  label: string;
  children: ReactNode;
}) {
  const open = useContext(OpenGallery);
  return (
    <button
      type="button"
      className={className}
      aria-label={label}
      onClick={() => open(index)}
    >
      {children}
    </button>
  );
}
