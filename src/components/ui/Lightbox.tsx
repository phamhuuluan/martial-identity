"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type TouchEvent,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";

export type GalleryImage = { src: string; alt: string };

type LightboxProps = {
  images: GalleryImage[];
  index: number;
  open: boolean;
  onClose: () => void;
  onIndexChange?: (index: number) => void;
};

export function Lightbox({
  images,
  index,
  open,
  onClose,
  onIndexChange,
}: LightboxProps) {
  const [zoom, setZoom] = useState(1);
  const [mounted, setMounted] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const count = images.length;
  const safeIndex = count ? ((index % count) + count) % count : 0;
  const current = count ? images[safeIndex] : null;

  useEffect(() => setMounted(true), []);

  const go = useCallback(
    (delta: number) => {
      if (count <= 1) return;
      const next = (safeIndex + delta + count) % count;
      onIndexChange?.(next);
      setZoom(1);
    },
    [count, onIndexChange, safeIndex]
  );

  useEffect(() => {
    if (!open) return;
    setZoom(1);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(4, z + 0.25));
      if (e.key === "-") setZoom((z) => Math.max(1, z - 0.25));
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, go]);

  const onTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.changedTouches[0]?.clientX ?? null;
  };

  const onTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current == null || zoom > 1) return;
    const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 50) return;
    go(dx < 0 ? 1 : -1);
  };

  if (!mounted || !open || !current) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={current.alt}
      className="fixed inset-0 z-[100] flex flex-col bg-brown-dark/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3 text-ivory">
        <p className="truncate text-sm opacity-80">
          {current.alt}
          {count > 1 ? (
            <span className="ml-2 opacity-60">
              {safeIndex + 1}/{count}
            </span>
          ) : null}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Thu nhỏ"
            className="rounded-full border border-gold/30 p-2 hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              setZoom((z) => Math.max(1, z - 0.25));
            }}
          >
            <ZoomOut size={18} />
          </button>
          <button
            type="button"
            aria-label="Phóng to"
            className="rounded-full border border-gold/30 p-2 hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              setZoom((z) => Math.min(4, z + 0.25));
            }}
          >
            <ZoomIn size={18} />
          </button>
          <button
            type="button"
            aria-label="Đặt lại zoom"
            className="rounded-full border border-gold/30 p-2 hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              setZoom(1);
            }}
          >
            <RotateCcw size={18} />
          </button>
          <button
            type="button"
            aria-label="Đóng"
            className="rounded-full border border-gold/30 p-2 hover:bg-white/10"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div
        className="relative flex flex-1 items-center"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {count > 1 ? (
          <button
            type="button"
            aria-label="Ảnh trước"
            className="absolute left-2 z-10 rounded-full border border-gold/30 bg-brown-dark/60 p-2 text-ivory hover:bg-white/10 md:left-4"
            onClick={() => go(-1)}
          >
            <ChevronLeft size={22} />
          </button>
        ) : null}

        <div className="relative flex-1 overflow-auto">
          <div
            className="flex min-h-full min-w-full items-center justify-center p-4 transition-transform duration-200"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "center center",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.src}
              alt={current.alt}
              className="max-h-[85vh] max-w-[92vw] object-contain shadow-2xl"
              draggable={false}
            />
          </div>
        </div>

        {count > 1 ? (
          <button
            type="button"
            aria-label="Ảnh sau"
            className="absolute right-2 z-10 rounded-full border border-gold/30 bg-brown-dark/60 p-2 text-ivory hover:bg-white/10 md:right-4"
            onClick={() => go(1)}
          >
            <ChevronRight size={22} />
          </button>
        ) : null}
      </div>
    </div>,
    document.body
  );
}

/** Single-image convenience wrapper kept for ZoomableImage. */
export function SingleLightbox({
  src,
  alt,
  open,
  onClose,
}: {
  src: string;
  alt: string;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Lightbox
      images={src ? [{ src, alt }] : []}
      index={0}
      open={open}
      onClose={onClose}
    />
  );
}

type ZoomableImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
  /** Default cover; use contain for tall diagrams / infographics */
  fit?: "cover" | "contain";
  children?: ReactNode;
};

export function ZoomableImage({
  src,
  alt,
  className,
  priority,
  sizes = "(max-width: 768px) 100vw, 80vw",
  width = 1600,
  height = 2200,
  fit = "cover",
}: ZoomableImageProps) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const fitCls = fit === "contain" ? "object-contain" : "object-cover";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`group relative block w-full overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${className ?? ""}`}
        aria-label={`Xem phóng to: ${alt}`}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          className={`h-auto w-full ${fitCls} transition duration-500 group-hover:scale-[1.02]`}
        />
        <span className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-brown-dark/70 px-3 py-1 text-xs text-ivory opacity-0 backdrop-blur transition group-hover:opacity-100">
          <ZoomIn size={14} /> Phóng to
        </span>
      </button>
      <SingleLightbox src={src} alt={alt} open={open} onClose={close} />
    </>
  );
}

/** Thumbnail grid that opens a navigable lightbox. */
export function ImageGallery({
  images,
  columns = "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
  aspect = "aspect-[4/3]",
  fit = "cover",
}: {
  images: GalleryImage[];
  columns?: string;
  aspect?: string;
  fit?: "cover" | "contain";
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  if (images.length === 0) return null;

  return (
    <>
      <div className={columns}>
        {images.map((img, i) => (
          <button
            key={`${img.src}-${i}`}
            type="button"
            className={`group relative ${aspect} w-full overflow-hidden rounded-sm border border-ivory/15 bg-black/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold`}
            onClick={() => {
              setIndex(i);
              setOpen(true);
            }}
            aria-label={`Xem phóng to: ${img.alt}`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className={`${fit === "contain" ? "object-contain" : "object-cover"} transition duration-500 group-hover:scale-105`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
            />
          </button>
        ))}
      </div>
      <Lightbox
        images={images}
        index={index}
        open={open}
        onClose={() => setOpen(false)}
        onIndexChange={setIndex}
      />
    </>
  );
}
