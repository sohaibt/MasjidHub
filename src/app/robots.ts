import type { MetadataRoute } from "next";
import { masjidConfig } from "../../masjid.config";

/** Generated as a static robots.txt at build time. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${masjidConfig.SITE_URL}/sitemap.xml`,
    host: masjidConfig.SITE_URL,
  };
}
