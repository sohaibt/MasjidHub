import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1B5E20" },
    { media: "(prefers-color-scheme: dark)", color: "#10140F" },
  ],
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
        {/*
          Applies the stored theme before first paint so a dark-mode visitor
          never sees a white flash. Kept as a raw inline script because React
          state would run too late. The storage key matches THEME_STORAGE_KEY
          in theme-context.tsx.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem("masjidhub-theme");var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d){document.documentElement.classList.add("dark")}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="font-inter antialiased bg-canvas text-content">
        {children}
      </body>
    </html>
  );
}
