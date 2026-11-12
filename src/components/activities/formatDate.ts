export function formatNewsDate(
  iso: string,
  month: "2-digit" | "long" = "2-digit"
): string {
  if (!iso || iso.startsWith("1970")) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso.slice(0, 10);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month,
    year: "numeric",
  });
}
