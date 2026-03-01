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

  /** Timezone for prayer time display (IANA timezone string) */
  TIMEZONE: "America/New_York",
};
