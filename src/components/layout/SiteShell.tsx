import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/ui/Chrome";

export function SiteShell({
  children,
  showProgress = true,
}: {
  children: ReactNode;
  showProgress?: boolean;
}) {
  return (
    <>
      {showProgress ? <ScrollProgress /> : null}
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
