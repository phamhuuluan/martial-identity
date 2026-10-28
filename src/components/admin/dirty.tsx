"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "./dialog";

const DirtyContext = createContext<((value: boolean) => void) | null>(null);

export function DirtyProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [dirty, setDirtyState] = useState(false);
  const [leaveHref, setLeaveHref] = useState<string | null>(null);
  const setDirty = useCallback((value: boolean) => {
    setDirtyState(value);
  }, []);

  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!dirty) return;
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      event.preventDefault();
      event.stopPropagation();
      setLeaveHref(`${url.pathname}${url.search}${url.hash}`);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [dirty]);

  return (
    <DirtyContext.Provider value={setDirty}>
      {children}
      <ConfirmDialog
        open={leaveHref !== null}
        title="Thay đổi chưa lưu"
        body="Rời trang sẽ bỏ các chỉnh sửa chưa lưu trên màn hình này."
        confirmLabel="Rời trang"
        cancelLabel="Ở lại"
        danger
        onCancel={() => setLeaveHref(null)}
        onConfirm={() => {
          const href = leaveHref;
          setLeaveHref(null);
          setDirtyState(false);
          if (href) router.push(href);
        }}
      />
    </DirtyContext.Provider>
  );
}

export function useUnsavedGuard(isDirty: boolean) {
  const setDirty = useContext(DirtyContext);
  useEffect(() => {
    if (!setDirty) return;
    setDirty(isDirty);
    return () => setDirty(false);
  }, [setDirty, isDirty]);
}
