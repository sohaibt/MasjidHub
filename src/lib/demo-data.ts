import type { SiteConfig, Announcement, MasjidEvent, DonationCampaign } from "./types";

/**
 * Demo data used when Google Sheets is not configured.
 * This allows the site to render with sample content for development and preview.
 */

export const demoConfig: SiteConfig = {
  masjid_name: { en: "Al-Noor Masjid", ar: "مسجد النور" },
  masjid_tagline: {
    en: "A home for the community",
    ar: "بيت للمجتمع",
  },
  address: {
    en: "123 Community Drive, Springfield, IL 62701",
    ar: "١٢٣ شارع المجتمع، سبرينغفيلد",
  },
  phone: "+1 (555) 123-4567",
  email: "info@alnoormasjid.org",
  whatsapp_number: "15551234567",
  volunteer_email: "volunteer@alnoormasjid.org",
  google_maps_embed_url:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.0!2d-89.65!3d39.78!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMznCsDQ2JzQ4LjAiTiA4OcKwMzknMDAuMCJX!5e0!3m2!1sen!2sus!4v1",
  hero_message: {
    en: "Ramadan Mubarak — May this blessed month bring you peace and blessings",
    ar: "رمضان مبارك — نسأل الله أن يجعل هذا الشهر المبارك مليئاً بالسلام والبركات",
  },
  facebook_url: "https://facebook.com",
  instagram_url: "https://instagram.com",
  twitter_url: "",
  youtube_url: "",
  jummah_time: { en: "1:00 PM", ar: "١:٠٠ ظهراً" },
  masjid_lat: "39.78",
  masjid_lng: "-89.65",
};

export const demoAnnouncements: Announcement[] = [
  {
    id: "1",
    date: "2025-03-01",
    title_en: "Ramadan Schedule Update",
    title_ar: "تحديث جدول رمضان",
    body_en:
      "Taraweeh prayers will begin at 9:30 PM nightly. Please join us for iftar at sunset. Dinner will be provided for the community every night during Ramadan.",
    body_ar:
      "ستبدأ صلاة التراويح في الساعة 9:30 مساءً كل ليلة. يرجى الانضمام إلينا للإفطار عند غروب الشمس. سيتم تقديم العشاء للمجتمع كل ليلة خلال شهر رمضان.",
    is_pinned: true,
    is_active: true,
  },
  {
    id: "2",
    date: "2025-02-28",
    title_en: "Weekend Islamic School Registration",
    title_ar: "تسجيل المدرسة الإسلامية في عطلة نهاية الأسبوع",
    body_en:
      "Registration for the Spring semester of our weekend Islamic school is now open. Classes are available for ages 5-16. Register by March 15th.",
    body_ar:
      "التسجيل لفصل الربيع في مدرستنا الإسلامية في عطلة نهاية الأسبوع مفتوح الآن. الفصول متاحة للأعمار من 5 إلى 16 سنة. سجل قبل 15 مارس.",
    is_pinned: false,
    is_active: true,
  },
  {
    id: "3",
    date: "2025-02-25",
    title_en: "Community Potluck This Saturday",
    title_ar: "وليمة مجتمعية هذا السبت",
    body_en:
      "Join us for a community potluck after Dhuhr prayer this Saturday. Bring a dish to share and enjoy fellowship with your neighbors.",
    body_ar:
      "انضموا إلينا لوليمة مجتمعية بعد صلاة الظهر هذا السبت. أحضروا طبقاً للمشاركة واستمتعوا بالأخوة مع جيرانكم.",
    is_pinned: false,
    is_active: true,
  },
];

export const demoEvents: MasjidEvent[] = [
  {
    id: "1",
    date: "2025-03-05",
    time: "6:15 PM",
    title_en: "Community Iftar",
    title_ar: "إفطار مجتمعي",
    description_en:
      "Join us for a community iftar dinner. All are welcome. Dinner will be served after Maghrib prayer.",
    description_ar:
      "انضموا إلينا لإفطار مجتمعي. الجميع مرحب بهم. سيتم تقديم العشاء بعد صلاة المغرب.",
    location_en: "Main Hall",
    location_ar: "القاعة الرئيسية",
    category: "iftar",
    volunteer_needed: true,
    volunteer_contact: "https://wa.me/15551234567",
  },
  {
    id: "2",
    date: "2025-03-07",
    time: "7:30 PM",
    title_en: "Friday Night Lecture: The Mercy of Allah",
    title_ar: "محاضرة ليلة الجمعة: رحمة الله",
    description_en:
      "Sheikh Ahmad will deliver a lecture on the mercy of Allah SWT. Q&A session to follow.",
    description_ar:
      "سيلقي الشيخ أحمد محاضرة عن رحمة الله سبحانه وتعالى. ستتبعها جلسة أسئلة وأجوبة.",
    location_en: "Prayer Hall",
    location_ar: "قاعة الصلاة",
    category: "lecture",
    volunteer_needed: false,
    volunteer_contact: "",
  },
  {
    id: "3",
    date: "2025-03-14",
    time: "1:00 PM",
    title_en: "Jummah Prayer",
    title_ar: "صلاة الجمعة",
    description_en: "Weekly Jummah prayer with Khutbah by Imam Hassan.",
    description_ar: "صلاة الجمعة الأسبوعية مع خطبة الإمام حسن.",
    location_en: "Main Musalla",
    location_ar: "المصلى الرئيسي",
    category: "prayer",
    volunteer_needed: false,
    volunteer_contact: "",
  },
  {
    id: "4",
    date: "2025-03-20",
    time: "6:00 PM",
    title_en: "Annual Fundraising Dinner",
    title_ar: "حفل العشاء السنوي لجمع التبرعات",
    description_en:
      "Annual fundraising dinner to support masjid operations and community programs. Tickets required.",
    description_ar:
      "حفل عشاء سنوي لجمع التبرعات لدعم عمليات المسجد والبرامج المجتمعية. التذاكر مطلوبة.",
    location_en: "Community Center",
    location_ar: "مركز المجتمع",
    category: "fundraiser",
    volunteer_needed: true,
    volunteer_contact: "volunteer@alnoormasjid.org",
  },
  {
    id: "5",
    date: "2025-03-22",
    time: "6:15 PM",
    title_en: "Sisters' Iftar Gathering",
    title_ar: "إفطار الأخوات",
    description_en: "A special iftar gathering for sisters. Childcare will be provided.",
    description_ar: "إفطار خاص للأخوات. سيتم توفير رعاية الأطفال.",
    location_en: "Sisters' Hall",
    location_ar: "قاعة الأخوات",
    category: "iftar",
    volunteer_needed: true,
    volunteer_contact: "https://wa.me/15551234567",
  },
];

export const demoDonations: DonationCampaign[] = [
  {
    id: "1",
    title_en: "Masjid Expansion Fund",
    title_ar: "صندوق توسعة المسجد",
    description_en:
      "Help us expand our prayer hall to accommodate our growing community. Every contribution brings us closer to our goal.",
    description_ar:
      "ساعدونا في توسيع قاعة الصلاة لاستيعاب مجتمعنا المتنامي. كل مساهمة تقربنا من هدفنا.",
    goal_amount: 50000,
    current_amount: 32500,
    currency: "USD",
    donate_link: "https://example.com/donate/expansion",
    is_active: true,
  },
  {
    id: "2",
    title_en: "Ramadan Food Drive",
    title_ar: "حملة طعام رمضان",
    description_en:
      "Provide iftar meals to families in need during the blessed month of Ramadan. $10 provides one family's iftar.",
    description_ar:
      "قدّموا وجبات إفطار للعائلات المحتاجة خلال شهر رمضان المبارك. 10 دولارات توفر إفطاراً لعائلة واحدة.",
    goal_amount: 10000,
    current_amount: 7800,
    currency: "USD",
    donate_link: "https://example.com/donate/food",
    is_active: true,
  },
  {
    id: "3",
    title_en: "General Sadaqah",
    title_ar: "صدقة عامة",
    description_en:
      "Support the daily operations of the masjid including utilities, maintenance, and community programs.",
    description_ar:
      "ادعموا العمليات اليومية للمسجد بما في ذلك المرافق والصيانة والبرامج المجتمعية.",
    goal_amount: 0,
    current_amount: 0,
    currency: "USD",
    donate_link: "https://example.com/donate/general",
    is_active: true,
  },
];
