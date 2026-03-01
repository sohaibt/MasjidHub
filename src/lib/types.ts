export interface ConfigItem {
  key: string;
  value_en: string;
  value_ar: string;
}

export interface SiteConfig {
  masjid_name: { en: string; ar: string };
  masjid_tagline: { en: string; ar: string };
  address: { en: string; ar: string };
  phone: string;
  email: string;
  whatsapp_number: string;
  volunteer_email: string;
  google_maps_embed_url: string;
  hero_message: { en: string; ar: string };
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  youtube_url: string;
  jummah_time: { en: string; ar: string };
  masjid_lat: string;
  masjid_lng: string;
}

export interface Announcement {
  id: string;
  date: string;
  title_en: string;
  title_ar: string;
  body_en: string;
  body_ar: string;
  is_pinned: boolean;
  is_active: boolean;
}

export interface MasjidEvent {
  id: string;
  date: string;
  time: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  location_en: string;
  location_ar: string;
  category: "prayer" | "iftar" | "lecture" | "fundraiser" | "other";
  volunteer_needed: boolean;
  volunteer_contact: string;
}

export interface DonationCampaign {
  id: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  goal_amount: number;
  current_amount: number;
  currency: string;
  donate_link: string;
  is_active: boolean;
}

export type Language = "en" | "ar";
