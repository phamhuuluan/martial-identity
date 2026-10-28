"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ChevronDown,
  Dumbbell,
  LayoutDashboard,
  MapPin,
  Menu,
  Newspaper,
  PanelLeftClose,
  PanelLeftOpen,
  PanelsTopLeft,
  Phone,
  Plus,
  RefreshCw,
  ScrollText,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { DirtyProvider } from "./dirty";

type StorageMode = "github" | "local" | "unconfigured";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  match: (pathname: string) => boolean;
};

type NavGroup = {
  id: string;
  label: string;
  items: NavItem[];
};

const GROUPS: NavGroup[] = [
  {
    id: "overview",
    label: "Tổng quan",
    items: [
      {
        href: "/admin",
        label: "Dashboard",
        icon: LayoutDashboard,
        match: (pathname) => pathname === "/admin",
      },
    ],
  },
  {
    id: "content",
    label: "Nội dung website",
    items: [
      {
        href: "/admin/trang",
        label: "Cấu hình trang web",
        icon: PanelsTopLeft,
        match: (pathname) => pathname.startsWith("/admin/trang"),
      },
      {
        href: "/admin/lien-he",
        label: "Thông tin liên hệ",
        icon: Phone,
        match: (pathname) => pathname.startsWith("/admin/lien-he"),
      },
      {
        href: "/admin/gioi-thieu",
        label: "Giới thiệu",
        icon: BookOpen,
        match: (pathname) => pathname.startsWith("/admin/gioi-thieu"),
      },
      {
        href: "/admin/ton-chi",
        label: "Tôn chỉ",
        icon: ScrollText,
        match: (pathname) => pathname.startsWith("/admin/ton-chi"),
      },
      {
        href: "/admin/thai-to-su",
        label: "Thái Tổ Sư",
        icon: UserRound,
        match: (pathname) => pathname.startsWith("/admin/thai-to-su"),
      },
      {
        href: "/admin/dia-diem",
        label: "Địa điểm",
        icon: MapPin,
        match: (pathname) => pathname.startsWith("/admin/dia-diem"),
      },
      {
        href: "/admin/tap-luyen",
        label: "Tập luyện",
        icon: Dumbbell,
        match: (pathname) => pathname.startsWith("/admin/tap-luyen"),
      },
    ],
  },
  {
    id: "news",
    label: "Quản lý hoạt động",
    items: [
      {
        href: "/admin/hoat-dong",
        label: "Danh sách bài viết",
        icon: Newspaper,
        match: (pathname) =>
          pathname === "/admin/hoat-dong" || pathname.startsWith("/admin/hoat-dong/sua"),
      },
      {
        href: "/admin/hoat-dong/moi",
        label: "Thêm bài viết",
        icon: Plus,
        match: (pathname) => pathname.startsWith("/admin/hoat-dong/moi"),
      },
    ],
  },
  {
    id: "sync",
    label: "Đồng bộ Fanpage",
    items: [
      {
        href: "/admin/dong-bo",
        label: "Đồng bộ Fanpage",
        icon: RefreshCw,
        match: (pathname) => pathname.startsWith("/admin/dong-bo"),
      },
    ],
  },
];

const CRUMBS: { test: (pathname: string) => boolean; title: string; trail: string[] }[] = [
  { test: (pathname) => pathname === "/admin", title: "Dashboard", trail: ["Tổng quan"] },
  { test: (pathname) => pathname.startsWith("/admin/trang"), title: "Cấu hình trang web", trail: ["Nội dung website"] },
  { test: (pathname) => pathname.startsWith("/admin/lien-he"), title: "Thông tin liên hệ", trail: ["Nội dung website"] },
  { test: (pathname) => pathname.startsWith("/admin/gioi-thieu"), title: "Giới thiệu", trail: ["Nội dung website"] },
  { test: (pathname) => pathname.startsWith("/admin/ton-chi"), title: "Tôn chỉ", trail: ["Nội dung website"] },
  { test: (pathname) => pathname.startsWith("/admin/thai-to-su"), title: "Thái Tổ Sư", trail: ["Nội dung website"] },
  { test: (pathname) => pathname.startsWith("/admin/dia-diem"), title: "Địa điểm", trail: ["Nội dung website"] },
  { test: (pathname) => pathname.startsWith("/admin/tap-luyen"), title: "Tập luyện", trail: ["Nội dung website"] },
  { test: (pathname) => pathname === "/admin/hoat-dong", title: "Danh sách bài viết", trail: ["Quản lý hoạt động"] },
  { test: (pathname) => pathname.startsWith("/admin/hoat-dong/moi"), title: "Thêm bài viết", trail: ["Quản lý hoạt động"] },
  { test: (pathname) => pathname.startsWith("/admin/hoat-dong/sua"), title: "Sửa bài viết", trail: ["Quản lý hoạt động"] },
  { test: (pathname) => pathname.startsWith("/admin/dong-bo"), title: "Đồng bộ Fanpage", trail: ["Đồng bộ Fanpage"] },
];

function pageMeta(pathname: string) {
  return CRUMBS.find((item) => item.test(pathname)) ?? { title: "Quản trị", trail: [] };
}

function LogoutButton() {
  return (
    <button
      type="button"
      className="btn btn-outline"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        window.location.href = "/admin/login";
      }}
    >
      Đăng xuất
    </button>
  );
}

export function AdminShell({
  mode,
  modeError,
  repo,
  branch,
  children,
}: {
  mode: StorageMode;
  modeError: string;
  repo: string;
  branch: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    overview: true,
    content: true,
    news: true,
    sync: true,
  });

  useEffect(() => {
    try {
      if (localStorage.getItem("pqq-admin-sidebar") === "1") setCollapsed(true);
      const stored = localStorage.getItem("pqq-admin-groups");
      if (stored) {
        const parsed = JSON.parse(stored) as Record<string, boolean>;
        setOpenGroups((current) => ({ ...current, ...parsed }));
      }
    } catch {
      /* keep defaults */
    }
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const meta = pageMeta(pathname);

  function toggleGroup(id: string) {
    setOpenGroups((current) => {
      const next = { ...current, [id]: !current[id] };
      try {
        localStorage.setItem("pqq-admin-groups", JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  function toggleCollapsed() {
    setCollapsed((current) => {
      const next = !current;
      try {
        localStorage.setItem("pqq-admin-sidebar", next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  return (
    <DirtyProvider>
      <div className={`admin-shell${collapsed ? " is-collapsed" : ""}`}>
        <button
          type="button"
          className={`adm-backdrop${mobileOpen ? " is-visible" : ""}`}
          aria-label="Đóng menu"
          onClick={() => setMobileOpen(false)}
        />
        <aside className={`admin-sidebar${mobileOpen ? " is-mobile-open" : ""}`} aria-label="Menu quản trị">
          <div className="adm-brand">
            <span className="adm-brand-mark">QT</span>
            <span className="adm-brand-text">
              <strong>Quản trị</strong>
              <span>Phật Quang Quyền</span>
            </span>
            <button
              type="button"
              className="adm-icon-btn adm-menu-btn"
              style={{ marginLeft: "auto" }}
              aria-label="Đóng menu"
              onClick={() => setMobileOpen(false)}
            >
              <X size={18} />
            </button>
          </div>
          <nav className="adm-nav">
            {GROUPS.map((group) => {
              const open = openGroups[group.id] !== false;
              return (
                <div key={group.id} className="adm-group">
                  <button
                    type="button"
                    className="adm-group-toggle"
                    aria-expanded={open}
                    onClick={() => toggleGroup(group.id)}
                  >
                    <span>{group.label}</span>
                    <ChevronDown className="adm-chevron" size={14} />
                  </button>
                  <div className="adm-group-items" hidden={!open}>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const active = item.match(pathname);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          data-tip={item.label}
                          className={`adm-nav-link${active ? " is-active" : ""}`}
                          aria-current={active ? "page" : undefined}
                        >
                          <Icon className="adm-nav-ico" size={18} aria-hidden />
                          <span className="adm-nav-label">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>
          <div className="adm-side-foot">
            <button
              type="button"
              className="adm-icon-btn adm-collapse-btn"
              data-tip={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
              aria-label={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
              onClick={toggleCollapsed}
            >
              {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
              <span className="adm-collapse-label">{collapsed ? "Mở rộng" : "Thu gọn"}</span>
            </button>
          </div>
        </aside>
        <div className="adm-main">
          <header className="adm-header">
            <button
              type="button"
              className="adm-icon-btn adm-menu-btn"
              aria-label="Mở menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={18} />
            </button>
            <div className="adm-heading">
              <nav className="adm-crumbs" aria-label="Đường dẫn">
                <Link href="/admin">Quản trị</Link>
                {meta.trail.map((item) => (
                  <span key={item}>/ {item}</span>
                ))}
              </nav>
              <h1>{meta.title}</h1>
            </div>
            <div className="adm-header-actions">
              <p className="adm-account">
                <strong>Đã đăng nhập</strong>
                <span>Phiên mật khẩu, không có tên tài khoản</span>
              </p>
              <LogoutButton />
            </div>
          </header>
          {mode === "local" ? (
            <p className="adm-banner is-warning">
              Thiếu GITHUB_ADMIN_TOKEN. Nút Lưu chỉ ghi trên máy này, chưa commit lên GitHub.
              Website công khai chưa đổi.
            </p>
          ) : null}
          {mode === "github" ? (
            <p className="adm-banner">
              Lưu tạo commit trên {repo}, nhánh {branch}. Website công khai đổi sau khi host build xong.
            </p>
          ) : null}
          {mode === "unconfigured" ? <p className="adm-banner is-warning">{modeError}</p> : null}
          <div className="adm-content">{mode === "unconfigured" ? null : children}</div>
        </div>
      </div>
    </DirtyProvider>
  );
}
