"use client";

import { ProgressProvider } from "@bprogress/next/app";
import type { ReactNode } from "react";

export function NavigationProgress({ children }: { children: ReactNode }) {
  return (
    <ProgressProvider
      height="2.5px"
      color="#b8962e"
      delay={0}
      startPosition={0.22}
      stopDelay={180}
      startOnLoad
      options={{
        showSpinner: false,
        trickle: true,
        trickleSpeed: 110,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        speed: 380,
        minimum: 0.12,
      }}
    >
      {children}
    </ProgressProvider>
  );
}
