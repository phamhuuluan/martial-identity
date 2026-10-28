import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Đăng nhập",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="adm-muted">Đang mở trang đăng nhập…</p>}>
      <LoginForm configured={Boolean(process.env.ADMIN_PASSWORD?.trim())} />
    </Suspense>
  );
}
