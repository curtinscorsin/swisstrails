import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://swiss-trails.com"),
  title: {
    default: "Swiss Trails — Discover Switzerland's Hidden Gems",
    template: "%s | Swiss Trails",
  },
  description:
    "A source-checked guide to Swiss places with authentic photographs, precise map references and transparent visitor information.",
  keywords: [
    "Switzerland hiking",
    "hidden lakes Switzerland",
    "Swiss viewpoints",
    "weekend trips Switzerland",
    "nature Switzerland",
    "Swiss adventures",
    "hidden gems Switzerland",
  ],
  authors: [{ name: "Swiss Trails" }],
  creator: "Swiss Trails",
  openGraph: {
    type: "website",
    locale: "en_CH",
    url: "https://swiss-trails.com",
    siteName: "Swiss Trails",
    title: "Swiss Trails — Your Best Summer, Already Planned",
    description:
      "A deliberately small, source-checked guide to Swiss places with authentic photographs and transparent visitor information.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Swiss Trails — Your wildest weekends, found" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Swiss Trails — Your Best Summer, Already Planned",
    description: "Source-checked Swiss places with authentic photographs and transparent visitor information.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
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
      </body>
    </html>
  );
}
