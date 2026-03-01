import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Masjid Hub — Community Masjid Website",
  description:
    "A free, open-source website template for masjids. Manage events, announcements, volunteer signups, and donations — powered by Google Sheets.",
  keywords: ["masjid", "mosque", "islamic", "community", "events", "donations"],
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
