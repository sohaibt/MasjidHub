import type { MetadataRoute } from "next";
import { masjidConfig } from "../../masjid.config";

/**
 * The site is a single page, so the sitemap is a single entry — but having one
 * (and the robots.txt alongside it) is what tells a crawler the site exists and
 * when it last changed.
 *
 * Next writes this out as a static sitemap.xml during `next build`, which works
 * with `output: "export"`.
 */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${masjidConfig.SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
