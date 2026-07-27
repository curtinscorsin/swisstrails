import type { Metadata, Viewport } from "next";
import { MockBanner } from "@/components/shared/mock-banner";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://app.swiss-trails.com"),
  title: {
    default: "Swiss Trails",
    template: "%s | Swiss Trails",
  },
  description: "A carefully verified collection of Swiss hikes with official sources, route data and current advisories.",
  openGraph: {
    type: "website",
    locale: "en_CH",
    url: "https://app.swiss-trails.com",
    siteName: "Swiss Trails",
    title: "Swiss Trails — Your wildest weekends, found",
    description: "Explore source-backed Swiss hikes and build your next adventure.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Swiss Trails — Your wildest weekends, found" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Swiss Trails — Your wildest weekends, found",
    description: "Explore source-backed Swiss hikes with transparent route notes.",
    images: ["/og.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  // "black-translucent" makes web content render behind the iOS status bar in
  // a standalone PWA (combined with viewport-fit=cover) — so the map can reach
  // the top edge. Top UI must respect env(safe-area-inset-top).
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Swiss Trails",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0D0A",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-trail-950 text-fg antialiased">
        {children}
        <MockBanner />
      </body>
    </html>
  );
}
