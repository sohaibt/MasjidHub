import { masjidConfig } from "../../masjid.config";
import type {
  SiteConfig,
  Announcement,
  MasjidEvent,
  DonationCampaign,
} from "./types";

const SHEETS_BASE_URL = "https://sheets.googleapis.com/v4/spreadsheets";

/**
 * Fetches data from a specific tab in the Google Sheet.
 * Returns an array of objects where each object represents a row,
 * with keys from the header row.
 */
async function fetchSheet(tabName: string): Promise<Record<string, string>[]> {
  const { SHEETS_ID, SHEETS_API_KEY } = masjidConfig;

  if (!SHEETS_ID || !SHEETS_API_KEY) {
    console.warn(
      `Missing Google Sheets configuration. Using demo data for "${tabName}".`
    );
    return [];
  }

  const url = `${SHEETS_BASE_URL}/${SHEETS_ID}/values/${encodeURIComponent(
    tabName
  )}?key=${SHEETS_API_KEY}`;

  try {
    const res = await fetch(url, { next: { revalidate: 0 } });

    if (!res.ok) {
      console.error(
        `Failed to fetch sheet "${tabName}": ${res.status} ${res.statusText}`
      );
      return [];
    }

    const data = await res.json();
    const rows: string[][] = data.values || [];

    if (rows.length < 2) return [];

    const headers = rows[0].map((h: string) => h.trim().toLowerCase());
    return rows.slice(1).map((row: string[]) => {
      const obj: Record<string, string> = {};
      headers.forEach((header: string, i: number) => {
        obj[header] = row[i] || "";
      });
      return obj;
    });
  } catch (error) {
    console.error(`Error fetching sheet "${tabName}":`, error);
    return [];
  }
}

function parseBool(value: string): boolean {
  return value?.toUpperCase() === "TRUE";
}

/**
 * Fetches and parses the Config tab into a SiteConfig object.
 */
export async function fetchConfig(): Promise<SiteConfig> {
  const rows = await fetchSheet("Config");

  const config: Record<string, { en: string; ar: string }> = {};
  for (const row of rows) {
    config[row.key] = {
      en: row.value_en || row.value || "",
      ar: row.value_ar || row.value || "",
    };
  }

  const get = (key: string) => config[key] || { en: "", ar: "" };
  const getVal = (key: string) => get(key).en;

  return {
    masjid_name: get("masjid_name"),
    masjid_tagline: get("masjid_tagline"),
    address: get("address"),
    phone: getVal("phone"),
    email: getVal("email"),
    whatsapp_number: getVal("whatsapp_number"),
    volunteer_email: getVal("volunteer_email"),
    google_maps_embed_url: getVal("google_maps_embed_url"),
    hero_message: get("hero_message"),
    facebook_url: getVal("facebook_url"),
    instagram_url: getVal("instagram_url"),
    twitter_url: getVal("twitter_url"),
    youtube_url: getVal("youtube_url"),
    jummah_time: get("jummah_time"),
    masjid_lat: getVal("masjid_lat"),
    masjid_lng: getVal("masjid_lng"),
  };
}

/**
 * Fetches and parses the Announcements tab.
 * Returns only active announcements, sorted with pinned first, then by date descending.
 * Limited to 10 most recent.
 */
export async function fetchAnnouncements(): Promise<Announcement[]> {
  const rows = await fetchSheet("Announcements");

  const announcements: Announcement[] = rows
    .map((row) => ({
      id: row.id || "",
      date: row.date || "",
      title_en: row.title_en || "",
      title_ar: row.title_ar || "",
      body_en: row.body_en || "",
      body_ar: row.body_ar || "",
      is_pinned: parseBool(row.is_pinned),
      is_active: parseBool(row.is_active),
    }))
    .filter((a) => a.is_active);

  // Sort: pinned first, then by date descending
  announcements.sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return announcements.slice(0, 10);
}

/**
 * Fetches and parses the Events tab.
 * Returns all events sorted by date ascending.
 */
export async function fetchEvents(): Promise<MasjidEvent[]> {
  const rows = await fetchSheet("Events");

  const events: MasjidEvent[] = rows.map((row) => ({
    id: row.id || "",
    date: row.date || "",
    time: row.time || "",
    title_en: row.title_en || "",
    title_ar: row.title_ar || "",
    description_en: row.description_en || "",
    description_ar: row.description_ar || "",
    location_en: row.location_en || "",
    location_ar: row.location_ar || "",
    category: (row.category as MasjidEvent["category"]) || "other",
    volunteer_needed: parseBool(row.volunteer_needed),
    volunteer_contact: row.volunteer_contact || "",
  }));

  events.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return events;
}

/**
 * Fetches and parses the Donations tab.
 * Returns only active donation campaigns.
 */
export async function fetchDonations(): Promise<DonationCampaign[]> {
  const rows = await fetchSheet("Donations");

  return rows
    .map((row) => ({
      id: row.id || "",
      title_en: row.title_en || "",
      title_ar: row.title_ar || "",
      description_en: row.description_en || "",
      description_ar: row.description_ar || "",
      goal_amount: parseFloat(row.goal_amount) || 0,
      current_amount: parseFloat(row.current_amount) || 0,
      currency: row.currency || "USD",
      donate_link: row.donate_link || "",
      is_active: parseBool(row.is_active),
    }))
    .filter((d) => d.is_active);
}
