"use client";

import { useState } from "react";
import { pageRenders } from "@/data/gallery";
import { Reveal } from "@/components/ui/Reveal";
import { ZoomableImage } from "@/components/ui/Lightbox";

export function CatalogueArchive() {
  const [open, setOpen] = useState(false);

  return (
    <section
      id="catalogue-goc"
      className="relative overflow-hidden texture-paper"
    >
      <div className="grain absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20 lg:px-12">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="type-eyebrow text-gold">
                Nguồn gốc
              </p>
              <h2 className="type-display mt-3 text-3xl font-semibold text-brown-deep md:text-5xl">
                Toàn bộ trang catalogue
              </h2>
              <p className="type-body mt-4 max-w-xl text-brown/70">
                40 trang sổ tay giới thiệu (27/02/2023) — hiển thị nguyên bản,
                hỗ trợ phóng to.
              </p>
            </div>
            <button
              type="button"
              className="rounded-sm border border-brown/25 px-6 py-3 text-sm font-medium text-brown-deep transition hover:border-gold hover:bg-brown-deep hover:text-ivory"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
            >
              {open ? "Thu gọn kho trang gốc" : "Mở kho trang gốc (40 trang)"}
            </button>
          </div>
        </Reveal>

        {open ? (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pageRenders.map((p) => (
              <figure
                key={p.page}
                className="lift overflow-hidden rounded-sm border border-brown/10 bg-ivory"
              >
                <ZoomableImage
                  src={p.src}
                  alt={p.alt}
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <figcaption className="type-label bg-beige/70 px-3 py-2.5 text-center text-xs text-brown/65">
                  Trang {p.page}
                </figcaption>
              </figure>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
