import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#1B5E20",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Masjid Hub — Community Masjid Website",
  description:
    "A free, open-source website template for masjids. Manage events, announcements, volunteer signups, and donations — powered by Google Sheets.",
  keywords: ["masjid", "mosque", "islamic", "community", "events", "donations"],
  openGraph: {
    type: "website",
    siteName: "Masjid Hub",
    title: "Masjid Hub — Community Masjid Website",
    description:
      "A free, open-source website template for masjids. Manage events, announcements, volunteer signups, and donations — powered by Google Sheets.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Masjid Hub — Community Masjid Website",
    description:
      "A free, open-source website template for masjids. Manage events, announcements, volunteer signups, and donations — powered by Google Sheets.",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-inter antialiased bg-warmWhite text-gray-900">
        {children}
      </body>
    </html>
  );
}
