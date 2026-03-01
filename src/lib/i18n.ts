import type { Language } from "./types";

export const translations = {
  // Navigation
  nav_home: { en: "Home", ar: "الرئيسية" },
  nav_events: { en: "Events", ar: "الفعاليات" },
  nav_announcements: { en: "Announcements", ar: "الإعلانات" },
  nav_donate: { en: "Donate", ar: "تبرع" },
  nav_contact: { en: "Contact", ar: "تواصل معنا" },

  // Hero
  hero_hijri_date: { en: "Hijri Date", ar: "التاريخ الهجري" },
  hero_prayer_times: { en: "Prayer Times", ar: "مواقيت الصلاة" },

  // Prayer names
  prayer_fajr: { en: "Fajr", ar: "الفجر" },
  prayer_sunrise: { en: "Sunrise", ar: "الشروق" },
  prayer_dhuhr: { en: "Dhuhr", ar: "الظهر" },
  prayer_asr: { en: "Asr", ar: "العصر" },
  prayer_maghrib: { en: "Maghrib", ar: "المغرب" },
  prayer_isha: { en: "Isha", ar: "العشاء" },

  // Announcements
  announcements_title: { en: "Announcements", ar: "الإعلانات" },
  announcements_pinned: { en: "Important", ar: "مهم" },
  announcements_empty: {
    en: "No announcements at this time.",
    ar: "لا توجد إعلانات حالياً.",
  },

  // Events
  events_title: { en: "Events", ar: "الفعاليات" },
  events_upcoming: { en: "Upcoming Events", ar: "الفعاليات القادمة" },
  events_volunteer: { en: "Volunteer for this event", ar: "تطوع لهذا الحدث" },
  events_empty: {
    en: "No upcoming events at this time.",
    ar: "لا توجد فعاليات قادمة حالياً.",
  },
  events_all: { en: "All", ar: "الكل" },
  events_prayers: { en: "Prayers", ar: "الصلوات" },
  events_iftars: { en: "Iftars", ar: "الإفطار" },
  events_lectures: { en: "Lectures", ar: "المحاضرات" },
  events_fundraisers: { en: "Fundraisers", ar: "جمع التبرعات" },

  // Calendar
  calendar_prev: { en: "Previous", ar: "السابق" },
  calendar_next: { en: "Next", ar: "التالي" },

  // Month names
  month_0: { en: "January", ar: "يناير" },
  month_1: { en: "February", ar: "فبراير" },
  month_2: { en: "March", ar: "مارس" },
  month_3: { en: "April", ar: "أبريل" },
  month_4: { en: "May", ar: "مايو" },
  month_5: { en: "June", ar: "يونيو" },
  month_6: { en: "July", ar: "يوليو" },
  month_7: { en: "August", ar: "أغسطس" },
  month_8: { en: "September", ar: "سبتمبر" },
  month_9: { en: "October", ar: "أكتوبر" },
  month_10: { en: "November", ar: "نوفمبر" },
  month_11: { en: "December", ar: "ديسمبر" },

  // Day abbreviations
  day_sun: { en: "Sun", ar: "أحد" },
  day_mon: { en: "Mon", ar: "إثن" },
  day_tue: { en: "Tue", ar: "ثلا" },
  day_wed: { en: "Wed", ar: "أرب" },
  day_thu: { en: "Thu", ar: "خمي" },
  day_fri: { en: "Fri", ar: "جمع" },
  day_sat: { en: "Sat", ar: "سبت" },

  // Donations
  donations_title: { en: "Donate", ar: "تبرع" },
  donations_goal: { en: "Goal", ar: "الهدف" },
  donations_raised: { en: "Raised", ar: "تم جمع" },
  donations_donate_now: { en: "Donate Now", ar: "تبرع الآن" },
  donations_empty: {
    en: "No active donation campaigns.",
    ar: "لا توجد حملات تبرع نشطة.",
  },

  // Contact
  contact_title: { en: "Contact & Location", ar: "تواصل معنا والموقع" },
  contact_phone: { en: "Phone", ar: "الهاتف" },
  contact_email: { en: "Email", ar: "البريد الإلكتروني" },
  contact_address: { en: "Address", ar: "العنوان" },
  contact_whatsapp: { en: "Chat on WhatsApp", ar: "تواصل عبر واتساب" },

  // Footer
  footer_built_with: {
    en: "Built with Masjid Hub — free & open source",
    ar: "تم البناء باستخدام Masjid Hub — مجاني ومفتوح المصدر",
  },
  footer_jummah: { en: "Jummah Prayer", ar: "صلاة الجمعة" },

  // Volunteer WhatsApp message
  volunteer_message: {
    en: "I'd like to volunteer for {event}",
    ar: "أود التطوع لحدث {event}",
  },

  // Category labels
  category_prayer: { en: "Prayer", ar: "صلاة" },
  category_iftar: { en: "Iftar", ar: "إفطار" },
  category_lecture: { en: "Lecture", ar: "محاضرة" },
  category_fundraiser: { en: "Fundraiser", ar: "جمع تبرعات" },
  category_other: { en: "Event", ar: "حدث" },

  // Language toggle
  lang_toggle: { en: "ع", ar: "EN" },
} as const;

export type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, lang: Language): string {
  return translations[key]?.[lang] || translations[key]?.en || key;
}

export function getCategoryLabel(
  category: string,
  lang: Language
): string {
  const key = `category_${category}` as TranslationKey;
  return translations[key]?.[lang] || category;
}

export function getCategoryBadgeVariant(
  category: string
): "prayer" | "iftar" | "lecture" | "fundraiser" | "other" {
  const validCategories = ["prayer", "iftar", "lecture", "fundraiser", "other"];
  return validCategories.includes(category)
    ? (category as "prayer" | "iftar" | "lecture" | "fundraiser" | "other")
    : "other";
}
