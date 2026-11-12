export const ADMIN_GROUPS = [
  { id: "overview", label: "Tổng quan" },
  { id: "content", label: "Nội dung website" },
  { id: "news", label: "Quản lý hoạt động" },
  { id: "sync", label: "Đồng bộ Fanpage" },
] as const;

export type AdminGroupId = (typeof ADMIN_GROUPS)[number]["id"];

export type AdminSlug =
  | ""
  | "trang"
  | "lien-he"
  | "gioi-thieu"
  | "ton-chi"
  | "thai-to-su"
  | "dia-diem"
  | "tap-luyen"
  | "hoat-dong"
  | "hoat-dong/moi"
  | "hoat-dong/sua"
  | "dong-bo";

type NavMatch = "exact" | "prefix" | "news-list";

export type AdminRoute = {
  slug: AdminSlug;
  href: string;
  groupId: AdminGroupId;
  navLabel: string;
  crumbTitle: string;
  crumbTrail: string[];
  crumbExact: boolean;
  nav: boolean;
  navMatch: NavMatch;
  dashboardTitle?: string;
  dashboardDetail?: string;
};

export const ADMIN_ROUTES: readonly AdminRoute[] = [
  {
    slug: "",
    href: "/admin",
    groupId: "overview",
    navLabel: "Dashboard",
    crumbTitle: "Dashboard",
    crumbTrail: ["Tổng quan"],
    crumbExact: true,
    nav: true,
    navMatch: "exact",
  },
  {
    slug: "trang",
    href: "/admin/trang",
    groupId: "content",
    navLabel: "Cấu hình trang web",
    crumbTitle: "Cấu hình trang web",
    crumbTrail: ["Nội dung website"],
    crumbExact: false,
    nav: true,
    navMatch: "prefix",
    dashboardTitle: "Cấu hình trang web",
    dashboardDetail: "Tên, ảnh, menu",
  },
  {
    slug: "lien-he",
    href: "/admin/lien-he",
    groupId: "content",
    navLabel: "Thông tin liên hệ",
    crumbTitle: "Thông tin liên hệ",
    crumbTrail: ["Nội dung website"],
    crumbExact: false,
    nav: true,
    navMatch: "prefix",
    dashboardTitle: "Thông tin liên hệ",
    dashboardDetail: "Tổ Đình, mạng xã hội",
  },
  {
    slug: "gioi-thieu",
    href: "/admin/gioi-thieu",
    groupId: "content",
    navLabel: "Giới thiệu",
    crumbTitle: "Giới thiệu",
    crumbTrail: ["Nội dung website"],
    crumbExact: false,
    nav: true,
    navMatch: "prefix",
    dashboardTitle: "Giới thiệu",
    dashboardDetail: "Thành lập, biểu tượng",
  },
  {
    slug: "ton-chi",
    href: "/admin/ton-chi",
    groupId: "content",
    navLabel: "Tôn chỉ",
    crumbTitle: "Tôn chỉ",
    crumbTrail: ["Nội dung website"],
    crumbExact: false,
    nav: true,
    navMatch: "prefix",
    dashboardTitle: "Tôn chỉ",
    dashboardDetail: "Lời thề, võ đạo",
  },
  {
    slug: "thai-to-su",
    href: "/admin/thai-to-su",
    groupId: "content",
    navLabel: "Thái Tổ Sư",
    crumbTitle: "Thái Tổ Sư",
    crumbTrail: ["Nội dung website"],
    crumbExact: false,
    nav: true,
    navMatch: "prefix",
    dashboardTitle: "Thái Tổ Sư",
    dashboardDetail: "Tiểu sử từng chương",
  },
  {
    slug: "dia-diem",
    href: "/admin/dia-diem",
    groupId: "content",
    navLabel: "Địa điểm",
    crumbTitle: "Địa điểm",
    crumbTrail: ["Nội dung website"],
    crumbExact: false,
    nav: true,
    navMatch: "prefix",
    dashboardTitle: "Địa điểm",
    dashboardDetail: "Câu lạc bộ theo miền",
  },
  {
    slug: "tap-luyen",
    href: "/admin/tap-luyen",
    groupId: "content",
    navLabel: "Tập luyện",
    crumbTitle: "Tập luyện",
    crumbTrail: ["Nội dung website"],
    crumbExact: false,
    nav: true,
    navMatch: "prefix",
    dashboardTitle: "Tập luyện",
    dashboardDetail: "Đai và giáo trình",
  },
  {
    slug: "hoat-dong",
    href: "/admin/hoat-dong",
    groupId: "news",
    navLabel: "Danh sách bài viết",
    crumbTitle: "Danh sách bài viết",
    crumbTrail: ["Quản lý hoạt động"],
    crumbExact: true,
    nav: true,
    navMatch: "news-list",
    dashboardTitle: "Hoạt động",
    dashboardDetail: "Danh sách bài Markdown",
  },
  {
    slug: "hoat-dong/moi",
    href: "/admin/hoat-dong/moi",
    groupId: "news",
    navLabel: "Thêm bài viết",
    crumbTitle: "Thêm bài viết",
    crumbTrail: ["Quản lý hoạt động"],
    crumbExact: false,
    nav: true,
    navMatch: "prefix",
  },
  {
    slug: "hoat-dong/sua",
    href: "/admin/hoat-dong/sua",
    groupId: "news",
    navLabel: "Sửa bài viết",
    crumbTitle: "Sửa bài viết",
    crumbTrail: ["Quản lý hoạt động"],
    crumbExact: false,
    nav: false,
    navMatch: "prefix",
  },
  {
    slug: "dong-bo",
    href: "/admin/dong-bo",
    groupId: "sync",
    navLabel: "Đồng bộ Fanpage",
    crumbTitle: "Đồng bộ Fanpage",
    crumbTrail: ["Đồng bộ Fanpage"],
    crumbExact: false,
    nav: true,
    navMatch: "prefix",
    dashboardTitle: "Đồng bộ Fanpage",
    dashboardDetail: "Kích hoạt workflow hiện có",
  },
];

const SLUGS = new Set<string>(ADMIN_ROUTES.map((route) => route.slug));

export function isAdminSlug(slug: string): slug is AdminSlug {
  return SLUGS.has(slug);
}

export function adminCrumb(pathname: string): { title: string; trail: string[] } {
  const route = ADMIN_ROUTES.find((item) =>
    item.crumbExact ? pathname === item.href : pathname.startsWith(item.href)
  );
  if (!route) return { title: "Quản trị", trail: [] };
  return { title: route.crumbTitle, trail: route.crumbTrail };
}

export function adminNavActive(route: AdminRoute, pathname: string): boolean {
  if (route.navMatch === "exact") return pathname === route.href;
  if (route.navMatch === "news-list") {
    return (
      pathname === "/admin/hoat-dong" ||
      pathname.startsWith("/admin/hoat-dong/sua")
    );
  }
  return pathname.startsWith(route.href);
}

export function adminDashboardCards(): { href: string; title: string; detail: string }[] {
  return ADMIN_ROUTES.flatMap((route) =>
    route.dashboardTitle && route.dashboardDetail
      ? [{ href: route.href, title: route.dashboardTitle, detail: route.dashboardDetail }]
      : []
  );
}
