import {
  fetchConfig,
  fetchAnnouncements,
  fetchEvents,
  fetchDonations,
} from "./sheets";
import {
  demoConfig,
  demoAnnouncements,
  demoEvents,
  demoDonations,
} from "./demo-data";
import type { SiteConfig, Announcement, MasjidEvent, DonationCampaign } from "./types";

export interface SiteData {
  config: SiteConfig;
  announcements: Announcement[];
  events: MasjidEvent[];
  donations: DonationCampaign[];
}

/**
 * Fetches all site data from Google Sheets.
 * Falls back to demo data if Sheets is not configured.
 */
export async function getSiteData(): Promise<SiteData> {
  const sheetsConfigured =
    process.env.NEXT_PUBLIC_SHEETS_ID &&
    process.env.NEXT_PUBLIC_SHEETS_ID !== "your_google_sheet_id_here" &&
    process.env.NEXT_PUBLIC_SHEETS_API_KEY &&
    process.env.NEXT_PUBLIC_SHEETS_API_KEY !== "your_google_sheets_api_key_here";

  if (!sheetsConfigured) {
    return {
      config: demoConfig,
      announcements: demoAnnouncements,
      events: demoEvents,
      donations: demoDonations,
    };
  }

  const [config, announcements, events, donations] = await Promise.all([
    fetchConfig(),
    fetchAnnouncements(),
    fetchEvents(),
    fetchDonations(),
  ]);

  return {
    config: config.masjid_name.en ? config : demoConfig,
    announcements: announcements.length > 0 ? announcements : demoAnnouncements,
    events: events.length > 0 ? events : demoEvents,
    donations: donations.length > 0 ? donations : demoDonations,
  };
}
