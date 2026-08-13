import Link from "next/link";
import { SiteShell } from "@/components/layout/SiteShell";
import { site } from "@/data/content";

export default function NotFound() {
  return (
    <SiteShell>
      <section className="relative overflow-hidden texture-paper">
        <div className="grain absolute inset-0" aria-hidden />
        <div className="relative mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center px-5 py-28 md:px-8">
          <p className="type-eyebrow text-gold">404</p>
          <h1 className="type-display mt-4 text-4xl font-semibold text-brown-deep md:text-5xl">
            Không tìm thấy trang
          </h1>
          <p className="type-body mt-6 text-brown/70">
            Đường dẫn không tồn tại hoặc hoạt động đã được gỡ. Quay lại trang chủ
            hoặc nhật ký hoạt động của {site.name}.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/"
              className="type-label rounded-sm bg-brown-deep px-6 py-3 text-sm font-semibold text-ivory"
            >
              Trang chủ
            </Link>
            <Link
              href="/hoat-dong"
              className="type-label rounded-sm border border-brown/20 px-6 py-3 text-sm text-brown-deep"
            >
              Hoạt động
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
