import { masjidConfig } from "../../masjid.config";
import { parseEventDateTime, addMinutes, toIsoLocal, DEFAULT_EVENT_MINUTES } from "./event-time";
import type { MasjidEvent, SiteConfig } from "./types";

/**
 * Builds the schema.org JSON-LD that lets search engines understand the site:
 * what the masjid is, where it is, and which events are coming up. Google uses
 * this to show events with their date and location directly in results.
 *
 * Everything is emitted from the server component at build time so crawlers see
 * it in the HTML without running any JavaScript.
 */

/** Anything JSON-serializable; the graph shape is dictated by schema.org. */
type JsonLdValue = string | number | boolean | JsonLdNode | JsonLdValue[];
interface JsonLdNode {
  [key: string]: JsonLdValue | undefined;
}

function socialLinks(config: SiteConfig): string[] {
  return [
    config.facebook_url,
    config.instagram_url,
    config.twitter_url,
    config.youtube_url,
  ].filter((url): url is string => Boolean(url && url.trim()));
}

function placeNode(config: SiteConfig, siteUrl: string): JsonLdNode {
  const geo =
    config.masjid_lat && config.masjid_lng
      ? {
          "@type": "GeoCoordinates",
          latitude: config.masjid_lat,
          longitude: config.masjid_lng,
        }
      : undefined;

  const sameAs = socialLinks(config);

  return {
    "@type": "Mosque",
    "@id": `${siteUrl}/#masjid`,
    name: config.masjid_name.en,
    alternateName: config.masjid_name.ar || undefined,
    description: config.masjid_tagline.en || undefined,
    url: siteUrl,
    address: config.address.en
      ? { "@type": "PostalAddress", streetAddress: config.address.en }
      : undefined,
    telephone: config.phone || undefined,
    email: config.email || undefined,
    geo,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  };
}

function eventNode(
  event: MasjidEvent,
  config: SiteConfig,
  siteUrl: string
): JsonLdNode | null {
  const start = parseEventDateTime(event.date, event.time);
  if (!start) return null;

  const end = start.hasTime ? addMinutes(start, DEFAULT_EVENT_MINUTES) : null;

  return {
    "@type": "Event",
    "@id": `${siteUrl}/#event-${event.id}`,
    name: event.title_en || event.title_ar,
    description: event.description_en || event.description_ar || undefined,
    startDate: toIsoLocal(start),
    endDate: end ? toIsoLocal(end) : undefined,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.location_en || config.masjid_name.en,
      address: config.address.en
        ? { "@type": "PostalAddress", streetAddress: config.address.en }
        : undefined,
    },
    organizer: { "@id": `${siteUrl}/#masjid` },
    isAccessibleForFree: true,
  };
}

/**
 * The full `@graph` for the homepage: the masjid itself, the website, and each
 * upcoming event.
 *
 * Past events are excluded — Google flags structured data for events that have
 * already happened, and they are not rendered on the page either.
 */
export function buildStructuredData(
  config: SiteConfig,
  events: MasjidEvent[],
  options: { now?: Date; siteUrl?: string } = {}
): JsonLdNode {
  const siteUrl = options.siteUrl ?? masjidConfig.SITE_URL;
  const now = options.now ?? new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const upcoming = events.filter((event) => {
    const moment = parseEventDateTime(event.date, event.time);
    if (!moment) return false;
    return new Date(moment.year, moment.month - 1, moment.day) >= today;
  });

  const graph: JsonLdNode[] = [
    placeNode(config, siteUrl),
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: config.masjid_name.en,
      inLanguage: ["en", "ar"],
      publisher: { "@id": `${siteUrl}/#masjid` },
    },
    ...upcoming
      .map((event) => eventNode(event, config, siteUrl))
      .filter((node): node is JsonLdNode => node !== null),
  ];

  return { "@context": "https://schema.org", "@graph": graph };
}

/**
 * Serializes the graph for embedding in a <script> tag.
 *
 * `<` is escaped so a stray "</script>" inside sheet-authored content cannot
 * close the tag early — the sheet is trusted-ish, but it is still user input
 * being interpolated into HTML.
 */
export function serializeStructuredData(data: JsonLdNode): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
