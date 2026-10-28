import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { storageMode } from "@/lib/admin/github";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Quản trị",
  robots: { index: false, follow: false },
};

export default function AdminPanelLayout({ children }: { children: ReactNode }) {
  let mode: "github" | "local" | "unconfigured" = "unconfigured";
  let modeError = "";
  try {
    mode = storageMode();
  } catch (error) {
    modeError = error instanceof Error ? error.message : "Chưa cấu hình lưu trữ";
  }

  return (
    <AdminShell
      mode={mode}
      modeError={modeError}
      repo={process.env.GITHUB_REPO?.trim() || "phamhuuluan/martial-identity"}
      branch={process.env.GITHUB_BRANCH?.trim() || "main"}
    >
      {children}
    </AdminShell>
  );
}
