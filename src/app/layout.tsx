import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { operatingCountries, site } from "@/data/content";
import { HydrationErrorSuppressor } from "@/components/HydrationErrorSuppressor";
import { NavigationProgress } from "@/components/layout/NavigationProgress";

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["vietnamese", "latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["vietnamese", "latin", "latin-ext"],
  weight: ["400", "600"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://phatquangquyen.vn"),
  title: {
    default: site.title,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "Phật Quang Quyền",
    "Võ cổ truyền Việt Nam",
    "Thiền Tôn Phật Quang",
    "Thích Chân Quang",
    "võ đạo",
    "môn phái",
  ],
  authors: [{ name: "Phật Quang Quyền" }],
  openGraph: {
    title: site.title,
    description: site.description,
    type: "website",
    locale: "vi_VN",
    siteName: site.name,
    images: [
      {
        url: site.logo,
        width: 1024,
        height: 1024,
        alt: site.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: [site.logo],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48", type: "image/x-icon" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#3a2418",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsOrganization",
  name: site.name,
  alternateName: site.nameUpper,
  description: site.description,
  sport: "Traditional Vietnamese Martial Arts",
  areaServed: [...operatingCountries],
  logo: site.logo,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <HydrationErrorSuppressor />
      </head>
      <body
        className={`${beVietnam.variable} ${cormorant.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NavigationProgress>{children}</NavigationProgress>
      </body>
    </html>
  );
}
