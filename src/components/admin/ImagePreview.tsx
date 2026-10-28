"use client";

import { useEffect, useState, useRef } from "react";

export type PreviewFrame = "logo" | "portrait" | "banner" | "wide" | "thumb";

type Resolved = { kind: "empty" } | { kind: "invalid"; message: string } | { kind: "src"; src: string };

export function resolveImageSrc(value: string): Resolved {
  const trimmed = value.trim();
  if (!trimmed) return { kind: "empty" };
  if (trimmed.startsWith("blob:")) return { kind: "src", src: trimmed };
  if (trimmed.startsWith("/") && !trimmed.includes("..") && !/\s/.test(trimmed)) {
    return { kind: "src", src: trimmed };
  }
  try {
    const url = new URL(trimmed);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return { kind: "src", src: trimmed };
    }
  } catch {
    /* not a URL */
  }
  return {
    kind: "invalid",
    message: "Đường dẫn không hợp lệ. Dùng đường dẫn bắt đầu bằng / hoặc URL http(s).",
  };
}

export function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="adm-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Xem ảnh lớn"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <figure className="adm-lightbox-figure">
        <button type="button" className="btn btn-outline" onClick={onClose}>
          Đóng
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" />
      </figure>
    </div>
  );
}

function Frame({ src, frame }: { src: string; frame: PreviewFrame }) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [open, setOpen] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img?.complete) return;
    setStatus(img.naturalWidth > 0 ? "ready" : "error");
  }, [src]);

  return (
    <>
      <div className={`adm-preview is-${frame}${status === "error" ? " is-error" : ""}${status === "ready" ? " is-ready" : ""}`}>
        {status === "loading" ? <p className="adm-preview-state">Đang tải ảnh…</p> : null}
        {status === "error" ? (
          <p className="adm-preview-state">Không tải được ảnh. Sửa đường dẫn rồi thử lại.</p>
        ) : null}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={src}
          alt=""
          style={{ opacity: status === "ready" ? 1 : 0 }}
          className={status === "ready" ? undefined : "is-pending"}
          onLoad={() => setStatus("ready")}
          onError={() => setStatus("error")}
        />
        {status === "ready" ? (
          <button
            type="button"
            className="adm-preview-btn"
            style={{ position: "absolute", inset: 0, background: "transparent" }}
            onClick={() => setOpen(true)}
            aria-label="Xem ảnh lớn"
          />
        ) : null}
      </div>
      {open ? <Lightbox src={src} onClose={() => setOpen(false)} /> : null}
    </>
  );
}

export function ImagePreview({
  value,
  frame = "wide",
}: {
  value: string;
  frame?: PreviewFrame;
}) {
  const resolved = resolveImageSrc(value);
  if (resolved.kind === "empty") {
    return (
      <div className={`adm-preview is-${frame}`}>
        <p className="adm-preview-state">Chưa có ảnh. Nhập đường dẫn hoặc tải file.</p>
      </div>
    );
  }
  if (resolved.kind === "invalid") {
    return (
      <div className={`adm-preview is-${frame} is-error`}>
        <p className="adm-preview-state">{resolved.message}</p>
      </div>
    );
  }
  return <Frame key={resolved.src} src={resolved.src} frame={frame} />;
}

export function ImageGallery({ paths }: { paths: string[] }) {
  const items = paths.map((path) => path.trim()).filter(Boolean);
  if (items.length === 0) {
    return <ImagePreview value="" frame="wide" />;
  }
  return (
    <ul className="adm-gallery">
      {items.map((src, index) => (
        <li key={`${src}-${index}`} className="adm-gallery-item">
          <ImagePreview value={src} frame="thumb" />
        </li>
      ))}
    </ul>
  );
}
