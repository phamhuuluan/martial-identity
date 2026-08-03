"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

type LightboxProps = {
  src: string;
  alt: string;
  open: boolean;
  onClose: () => void;
};

export function Lightbox({ src, alt, open, onClose }: LightboxProps) {
  const [zoom, setZoom] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    setZoom(1);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(4, z + 0.25));
      if (e.key === "-") setZoom((z) => Math.max(1, z - 0.25));
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      className="fixed inset-0 z-[100] flex flex-col bg-brown-dark/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3 text-ivory">
        <p className="truncate text-sm opacity-80">{alt}</p>
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
        className="relative flex-1 overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex min-h-full min-w-full items-center justify-center p-4 transition-transform duration-200"
          style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="max-h-[85vh] max-w-[92vw] object-contain shadow-2xl"
            draggable={false}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}

type ZoomableImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  children?: ReactNode;
};

export function ZoomableImage({
  src,
  alt,
  className,
  priority,
  sizes = "(max-width: 768px) 100vw, 80vw",
}: ZoomableImageProps) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

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
          width={1600}
          height={2200}
          sizes={sizes}
          priority={priority}
          className="h-auto w-full object-cover transition duration-500 group-hover:scale-[1.02]"
        />
        <span className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-brown-dark/70 px-3 py-1 text-xs text-ivory opacity-0 backdrop-blur transition group-hover:opacity-100">
          <ZoomIn size={14} /> Phóng to
        </span>
      </button>
      <Lightbox src={src} alt={alt} open={open} onClose={close} />
    </>
  );
}
