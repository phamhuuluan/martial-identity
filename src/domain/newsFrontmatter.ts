/** Minimal YAML subset shared by the public reader and the admin writer. */

export function parseSimpleYaml(src: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const lines = src.split(/\r?\n/);
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!kv) {
      i += 1;
      continue;
    }
    const key = kv[1];
    const rest = kv[2].trim();
    if (rest === "" || rest === "|" || rest === ">") {
      const list: string[] = [];
      i += 1;
      while (i < lines.length) {
        const item = lines[i].match(/^\s+-\s+(.*)$/);
        if (!item) break;
        list.push(stripQuotes(item[1].trim()));
        i += 1;
      }
      result[key] = list;
      continue;
    }
    if (rest.startsWith("[")) {
      result[key] = parseInlineList(rest);
      i += 1;
      continue;
    }
    result[key] = coerceScalar(stripQuotes(rest));
    i += 1;
  }
  return result;
}

function parseInlineList(raw: string): string[] {
  const inner = raw.replace(/^\[/, "").replace(/\]$/, "");
  if (!inner.trim()) return [];
  return inner.split(",").map((part) => stripQuotes(part.trim()));
}

function stripQuotes(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

function coerceScalar(value: string): string | number | boolean {
  if (value === "true") return true;
  if (value === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  return value;
}
