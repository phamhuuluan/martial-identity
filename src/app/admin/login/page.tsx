import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Đăng nhập",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const nextPath = next?.startsWith("/admin") && !next.startsWith("//") ? next : "/admin";
  return (
    <LoginForm configured={Boolean(process.env.ADMIN_PASSWORD?.trim())} nextPath={nextPath} />
  );
}
