import type { Metadata } from "next";
import { getSiteData } from "@/lib/get-data";
import { MasjidHubApp } from "@/components/MasjidHubApp";

export async function generateMetadata(): Promise<Metadata> {
  const { config } = await getSiteData();
  const title = `${config.masjid_name.en} — Masjid Hub`;
  const description = `${config.masjid_tagline.en}. Prayer times, events, announcements, and donations for ${config.masjid_name.en}.`;

  return {
    title,
    description,
    openGraph: {
      type: "website",
      siteName: config.masjid_name.en,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function Home() {
  const data = await getSiteData();
  return <MasjidHubApp data={data} />;
}
