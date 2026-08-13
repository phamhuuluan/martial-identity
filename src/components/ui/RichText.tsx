import type { ReactNode } from "react";

/**
 * Lightweight Markdown-ish renderer for Fanpage/body content.
 * Preserves structure without pulling in a full MD dependency.
 */

function isFacebookUrl(url: string): boolean {
  return /(?:facebook|fb)\.com/i.test(url);
}

function stripFacebookUrls(text: string): string {
  return text
    .replace(/https?:\/\/(?:www\.)?(?:facebook|fb)\.com\/[^\s)<\]"']+/gi, "")
    .replace(/\[([^\]]*)\]\(\s*\)/g, "$1")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function renderInline(
  text: string,
  hideFacebookUrls: boolean
): ReactNode[] {
  const nodes: ReactNode[] = [];
  // bold **...**, links [label](url), bare http(s)
  const re =
    /(\*\*([^*]+)\*\*|\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)|(https?:\/\/[^\s<]+))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      const chunk = text.slice(last, m.index);
      nodes.push(hideFacebookUrls ? stripFacebookUrls(chunk) : chunk);
    }
    if (m[2]) {
      nodes.push(<strong key={key++}>{m[2]}</strong>);
    } else if (m[3] && m[4]) {
      if (hideFacebookUrls && isFacebookUrl(m[4])) {
        if (m[3].trim()) nodes.push(m[3]);
      } else {
        nodes.push(
          <a
            key={key++}
            href={m[4]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold underline-offset-2 hover:underline"
          >
            {m[3]}
          </a>
        );
      }
    } else if (m[5]) {
      if (!(hideFacebookUrls && isFacebookUrl(m[5]))) {
        nodes.push(
          <a
            key={key++}
            href={m[5]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold underline-offset-2 hover:underline"
          >
            {m[5]}
          </a>
        );
      }
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) {
    const chunk = text.slice(last);
    nodes.push(hideFacebookUrls ? stripFacebookUrls(chunk) : chunk);
  }
  return nodes;
}

function isListItem(line: string): boolean {
  return /^\s*([-*•]|\d+[.)])\s+/.test(line);
}

function stripListMarker(line: string): string {
  return line.replace(/^\s*([-*•]|\d+[.)])\s+/, "");
}

function isQuote(line: string): boolean {
  return /^\s*>\s?/.test(line);
}

function isHeading(line: string): boolean {
  return /^\s{0,3}#{1,6}\s+\S/.test(line);
}

function headingLevel(line: string): number {
  const m = line.match(/^\s{0,3}(#{1,6})\s+/);
  return m ? m[1].length : 2;
}

function stripHeading(line: string): string {
  return line.replace(/^\s{0,3}#{1,6}\s+/, "");
}

function isMdImage(line: string): boolean {
  return /^\s*!\[/.test(line) || /^\s*</.test(line);
}

function isFacebookOnlyBlock(block: string): boolean {
  const stripped = stripFacebookUrls(block).replace(/\s+/g, "");
  return stripped.length === 0 && /(?:facebook|fb)\.com/i.test(block);
}

export function RichText({
  content,
  className,
  hideFacebookUrls = false,
}: {
  content: string;
  className?: string;
  /** Hide Facebook permalinks in article UI (Facebook is data source only). */
  hideFacebookUrls?: boolean;
}) {
  const raw = content.replace(/\r\n/g, "\n").trim();
  if (!raw) return null;

  // Prefer paragraph blocks; also handle single-newline runs as soft breaks.
  const blocks = raw
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean)
    .filter((b) => !(hideFacebookUrls && isFacebookOnlyBlock(b)));

  const elements: ReactNode[] = [];
  const inline = (text: string) => renderInline(text, hideFacebookUrls);

  blocks.forEach((block, bi) => {
    if (isMdImage(block)) return;

    const lines = block.split("\n").map((l) => l.trimEnd());

    // Entire block is a list
    if (lines.every((l) => !l.trim() || isListItem(l))) {
      const items = lines.filter((l) => l.trim()).map(stripListMarker);
      const ordered = /^\s*\d+[.)]\s+/.test(lines.find((l) => l.trim()) ?? "");
      const ListTag = ordered ? "ol" : "ul";
      elements.push(
        <ListTag
          key={`list-${bi}`}
          className={`type-body space-y-2 pl-5 text-base text-brown-deep/90 md:text-lg ${
            ordered ? "list-decimal" : "list-disc"
          }`}
        >
          {items.map((item, i) => (
            <li key={i}>{inline(item)}</li>
          ))}
        </ListTag>
      );
      return;
    }

    // Entire block is a quote
    if (lines.every((l) => !l.trim() || isQuote(l))) {
      const text = lines
        .filter((l) => l.trim())
        .map((l) => l.replace(/^\s*>\s?/, ""))
        .join(" ");
      elements.push(
        <blockquote
          key={`q-${bi}`}
          className="type-quote border-l-2 border-gold/50 pl-5 text-xl text-brown-deep/85 md:text-2xl"
        >
          {inline(text)}
        </blockquote>
      );
      return;
    }

    // Heading (single-line block)
    if (lines.length === 1 && isHeading(lines[0])) {
      const level = Math.min(headingLevel(lines[0]), 3);
      const text = stripHeading(lines[0]);
      const cls =
        level <= 1
          ? "type-display text-2xl font-semibold text-brown-deep md:text-3xl"
          : level === 2
            ? "type-display text-xl font-semibold text-brown-deep md:text-2xl"
            : "type-display text-lg font-semibold text-brown-deep md:text-xl";
      if (level <= 1) {
        elements.push(
          <h2 key={`h-${bi}`} className={cls}>
            {inline(text)}
          </h2>
        );
      } else if (level === 2) {
        elements.push(
          <h3 key={`h-${bi}`} className={cls}>
            {inline(text)}
          </h3>
        );
      } else {
        elements.push(
          <h4 key={`h-${bi}`} className={cls}>
            {inline(text)}
          </h4>
        );
      }
      return;
    }

    // Mixed / paragraph with soft line breaks
    const parts: ReactNode[] = [];
    lines.forEach((line, li) => {
      const t = line.trim();
      if (!t || isMdImage(t)) return;
      if (hideFacebookUrls && isFacebookOnlyBlock(t)) return;
      if (li > 0 && parts.length) parts.push(<br key={`br-${bi}-${li}`} />);
      if (isHeading(t)) {
        parts.push(
          <span key={`hs-${bi}-${li}`} className="font-semibold">
            {inline(stripHeading(t))}
          </span>
        );
      } else if (isListItem(t)) {
        parts.push(
          <span key={`li-${bi}-${li}`}>• {inline(stripListMarker(t))}</span>
        );
      } else {
        parts.push(
          <span key={`t-${bi}-${li}`}>
            {inline(t.replace(/^\s*>\s?/, ""))}
          </span>
        );
      }
    });

    if (parts.length === 0) return;

    elements.push(
      <p
        key={`p-${bi}`}
        className="type-body text-base text-brown-deep/90 md:text-lg"
      >
        {parts}
      </p>
    );
  });

  if (elements.length === 0) return null;

  return (
    <div className={`space-y-6 ${className ?? ""}`}>{elements}</div>
  );
}
