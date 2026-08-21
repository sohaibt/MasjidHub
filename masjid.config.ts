export const masjidConfig = {
  /** Google Sheet ID — the long string in the Google Sheets URL */
  SHEETS_ID: process.env.NEXT_PUBLIC_SHEETS_ID || "",

  /** Google Sheets API key — restricted by HTTP referrer */
  SHEETS_API_KEY: process.env.NEXT_PUBLIC_SHEETS_API_KEY || "",

  /** Default language: 'en' for English, 'ar' for Arabic */
  DEFAULT_LANGUAGE: "en" as "en" | "ar",

  /** Masjid coordinates for prayer times (lat/lng) */
  MASJID_COORDS: {
    lat: 21.4225,
    lng: 39.8262,
  },

  /**
   * Timezone for prayer time display (IANA timezone string).
   *
   * Only a fallback: the Aladhan API reports the zone for your coordinates and
   * that is preferred, since it is derived from your actual location.
   */
  TIMEZONE: "America/New_York",

  /**
   * Public URL of the deployed site, without a trailing slash.
   *
   * Used for sitemap.xml, robots.txt and the JSON-LD structured data that lets
   * search engines show your events as rich results. Set NEXT_PUBLIC_SITE_URL
   * in your deploy environment (Netlify sets URL automatically — you can map it
   * across) or edit the fallback here.
   */
  SITE_URL: (process.env.NEXT_PUBLIC_SITE_URL || "https://example.org").replace(
    /\/+$/,
    ""
  ),
};
