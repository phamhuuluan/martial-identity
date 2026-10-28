import Link from "next/link";
import { NEWS_CATEGORY_LABELS, type NewsCategory } from "@/domain/news";
import { listNewsIndex } from "@/lib/admin/newsIndex";

const PAGE_SIZE = 40;

export default async function NewsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q = "", page = "1" } = await searchParams;
  const query = q.trim();
  const current = Math.max(1, Number.parseInt(page, 10) || 1);
  const items = await listNewsIndex(query);
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const safePage = Math.min(current, totalPages);
  const slice = items.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const hrefFor = (nextPage: number) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (nextPage > 1) params.set("page", String(nextPage));
    const search = params.toString();
    return search ? `/admin/hoat-dong?${search}` : "/admin/hoat-dong";
  };
  const from = items.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const to = Math.min(safePage * PAGE_SIZE, items.length);

  return (
    <div>
      <div className="adm-toolbar" style={{ justifyContent: "space-between" }}>
        <p className="adm-muted" style={{ margin: 0 }}>
          {items.length === 0 ? "Không có bài." : `${from}–${to} / ${items.length} bài`}
          {" · "}tìm theo tên file
        </p>
        <Link href="/admin/hoat-dong/moi" className="btn btn-primary">
          Thêm bài
        </Link>
      </div>
      <form className="adm-toolbar" action="/admin/hoat-dong">
        <input
          className="adm-input"
          name="q"
          defaultValue={query}
          placeholder="Tìm trong tên file"
          aria-label="Tìm bài viết"
        />
        <button className="btn btn-outline" type="submit">
          Tìm
        </button>
      </form>
      <ul className="adm-list">
        {slice.map((item) => (
          <li key={item.path}>
            <Link href={`/admin/hoat-dong/sua?path=${encodeURIComponent(item.path)}`} className="adm-row">
              <span className="adm-muted">{item.date}</span>
              <span>{item.name.replace(/\.md$/, "")}</span>
              <span className="adm-muted">
                {NEWS_CATEGORY_LABELS[item.category as NewsCategory] ?? item.category}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {slice.length === 0 ? <p className="adm-note" style={{ marginTop: 16 }}>Không có bài khớp.</p> : null}
      {totalPages > 1 ? (
        <div className="adm-pager">
          {safePage > 1 ? <Link href={hrefFor(safePage - 1)}>Trang trước</Link> : null}
          <span>
            {safePage} / {totalPages}
          </span>
          {safePage < totalPages ? <Link href={hrefFor(safePage + 1)}>Trang sau</Link> : null}
        </div>
      ) : null}
    </div>
  );
}
