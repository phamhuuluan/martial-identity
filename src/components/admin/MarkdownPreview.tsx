"use client";

import { useMemo } from "react";
import { ImageGallery, ImagePreview } from "./ImagePreview";

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return <span key={index}>{part}</span>;
  });
}

function bodyImages(body: string): string[] {
  const found: string[] = [];
  const re = /!\[[^\]]*\]\(([^)\s]+)\)|<img[^>]+src=["']([^"']+)["']/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(body)) !== null) {
    const src = (match[1] || match[2] || "").trim();
    if (src) found.push(src);
  }
  return found;
}

export function MarkdownPreview({
  title,
  summary,
  body,
  cover,
  gallery,
}: {
  title: string;
  summary: string;
  body: string;
  cover: string;
  gallery: string[];
}) {
  const inline = useMemo(() => bodyImages(body), [body]);
  const photos = [cover, ...gallery, ...inline].map((item) => item.trim()).filter(Boolean);

  return (
    <aside className="adm-preview-pane" aria-label="Xem trước bài viết">
      <h2>Xem trước</h2>
      <p className="adm-muted">Nội dung đang sửa, chưa cần lưu.</p>
      {title ? <p style={{ fontWeight: 600, margin: "12px 0 8px" }}>{title}</p> : null}
      {summary ? <p className="adm-muted">{summary}</p> : null}
      {photos.length > 0 ? (
        <div style={{ marginTop: 12 }}>
          <ImageGallery paths={photos} />
        </div>
      ) : (
        <div style={{ marginTop: 12 }}>
          <ImagePreview value="" frame="banner" />
        </div>
      )}
      <div className="adm-md" style={{ marginTop: 16 }}>
        {body.trim()
          ? body.split("\n").map((line, index) =>
              line.trim() ? <p key={index}>{renderInline(line)}</p> : <p key={index}>&nbsp;</p>
            )
          : <p className="adm-muted">Chưa có nội dung.</p>}
      </div>
    </aside>
  );
}
