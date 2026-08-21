import type { Metadata } from "next";
import { getSiteData } from "@/lib/get-data";
import { masjidConfig } from "../../masjid.config";
import { MasjidHubApp } from "@/components/MasjidHubApp";
import {
  buildStructuredData,
  serializeStructuredData,
} from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const { config } = await getSiteData();
  const title = `${config.masjid_name.en} — Masjid Hub`;
  const description = `${config.masjid_tagline.en}. Prayer times, events, announcements, and donations for ${config.masjid_name.en}.`;

  return {
    metadataBase: new URL(masjidConfig.SITE_URL),
    title,
    description,
    alternates: { canonical: "/" },
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

  // Emitted server-side so crawlers see it without executing any JavaScript.
  const structuredData = serializeStructuredData(
    buildStructuredData(data.config, data.events)
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />
      <MasjidHubApp data={data} />
    </>
  );
}
