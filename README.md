# Masjid Hub

A free, open-source website template that any masjid can set up in under an hour. Manage events, announcements, volunteer signups, and donations — all powered by a simple Google Sheet. No coding required after initial setup.

<!-- [Live Demo](https://masjidhub-demo.netlify.app) -->

## Features

- **Google Sheets CMS** — Update your site by editing a Google Sheet. No database, no backend, no server.
- **Bilingual (Arabic + English)** — Full RTL support with one-click language toggle
- **Prayer Times** — Auto-fetched daily prayer times via the Aladhan API
- **Hijri Calendar** — Current Hijri date displayed prominently
- **Events Calendar** — Monthly calendar view with category filters (prayers, iftars, lectures, fundraisers)
- **Announcements** — Pinned/regular announcements with easy show/hide toggle
- **Donation Campaigns** — Progress bars, goals, and direct links to payment pages
- **Volunteer Signups** — WhatsApp/email links with pre-filled messages (no forms, no data handling)
- **Contact & Location** — Google Maps embed, phone, email, WhatsApp, social links
- **Islamic Design** — Warm green & gold palette with geometric patterns and Amiri Arabic font
- **Fully Static** — Exports as plain HTML/CSS/JS. Deploy anywhere for free.
- **Mobile Responsive** — Looks great on all screen sizes

## Screenshots

<!-- Add screenshots here -->

## How Each Feature Works

This section explains every feature in detail, including how it works under the hood and exactly which Google Sheet fields control it. For the full Google Sheet setup walkthrough, see [`sheets-template/README.md`](./sheets-template/README.md).

---

### Google Sheets CMS

**What it does:** Your Google Sheet is the entire backend — no database, no server, no admin panel. You edit the spreadsheet and your site updates on the next build.

**How it works:** The site reads data from the Google Sheets API v4 at build time (when you deploy). It does **not** fetch live data from the sheet on every page visit. After you edit your Google Sheet, you must trigger a rebuild on Netlify for changes to appear on the live site.

**Google Sheet structure:** Create a single Google Sheet with exactly **4 tabs** (named exactly as shown):

| Tab | Purpose |
|-----|---------|
| `Config` | Masjid name, contact info, social links, coordinates, hero message |
| `Announcements` | News and announcements for your community |
| `Events` | Upcoming events, classes, and programs |
| `Donations` | Fundraising campaigns and donation links |

**Important:** The sheet must be published to the web (**File → Share → Publish to web**) and shared as "Anyone with the link can view" for the API to access it.

---

### Prayer Times

**What it does:** Displays the six daily prayer times (Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha) in the hero section, automatically calculated for your masjid's location.

**How it works:** Prayer times are fetched **client-side** (in the visitor's browser) each day from the [Aladhan API](https://aladhan.com/prayer-times-api) using the ISNA calculation method (method=2). The times are based on your masjid's latitude and longitude — **not** the visitor's location. No manual updating is needed; times are always current.

**Google Sheet configuration:** In the **Config** tab, set these rows:

| key | value_en | value_ar |
|-----|----------|----------|
| `masjid_lat` | Your masjid's latitude (e.g., `33.7490`) | _(leave blank)_ |
| `masjid_lng` | Your masjid's longitude (e.g., `-84.3880`) | _(leave blank)_ |

You can also set the timezone in `masjid.config.ts`:

```ts
TIMEZONE: "America/New_York",  // IANA timezone string
```

**How to find your coordinates:** Search your masjid on Google Maps, right-click the pin, and copy the latitude/longitude values.

---

### Hijri Date

**What it does:** Displays the current Islamic (Hijri) date in the hero section badge, e.g., "8 Ramadan 1447 AH".

**How it works:** Calculated entirely client-side using the browser's built-in `Intl.DateTimeFormat` API with the `islamic-umalqura` calendar. Switches between English and Arabic formatting based on the current language. No configuration needed — it works automatically.

---

### Hero Section

**What it does:** The top banner of the site displaying your masjid name, a welcome message, the Hijri date badge, and the daily prayer times strip.

**Google Sheet configuration:** In the **Config** tab:

| key | value_en | value_ar |
|-----|----------|----------|
| `masjid_name` | Your Masjid Name | اسم المسجد |
| `masjid_tagline` | Your tagline | الشعار |
| `hero_message` | Welcome to our community | مرحباً بكم في مجتمعنا |
| `jummah_time` | `1:00 PM` | `١:٠٠ ظهراً` |

---

### Announcements

**What it does:** Displays news cards for your community. Announcements can be pinned to appear first with a highlighted badge, or hidden without deleting them.

**How it works:** Only announcements with `is_active` set to `TRUE` are shown. Pinned announcements (`is_pinned: TRUE`) are sorted to the top and displayed with a gold "Pinned" badge and a highlighted card border. All text supports bilingual content — if an Arabic translation is missing, the English version is used as a fallback.

**Google Sheet configuration:** In the **Announcements** tab, use these columns:

| Column | Required | Description |
|--------|----------|-------------|
| `id` | Yes | Unique number (1, 2, 3, ...) |
| `date` | Yes | Date in `YYYY-MM-DD` format (e.g., `2025-03-15`) |
| `title_en` | Yes | Announcement title in English |
| `title_ar` | No | Announcement title in Arabic |
| `body_en` | Yes | Full announcement text in English |
| `body_ar` | No | Full announcement text in Arabic |
| `is_pinned` | Yes | `TRUE` to pin to the top, `FALSE` for normal |
| `is_active` | Yes | `TRUE` to show, `FALSE` to hide |

**Tips:**
- To hide an old announcement, set `is_active` to `FALSE` instead of deleting the row
- Only one or two announcements should be pinned at a time for best visual results
- The date is displayed in localized format (e.g., "March 15, 2025" in English, "١٥ مارس ٢٠٢٥" in Arabic)

---

### Events & Calendar

**What it does:** Shows a monthly calendar view alongside a filterable list of upcoming events. Events can be filtered by category (prayers, iftars, lectures, fundraisers).

**How it works:** The calendar highlights days that have events with a colored dot. Only **future events** are displayed — past events are automatically hidden based on today's date. Events are filterable by category using tabs above the list. Each event card shows the date, time, location, description, and category badge.

**Google Sheet configuration:** In the **Events** tab, use these columns:

| Column | Required | Description |
|--------|----------|-------------|
| `id` | Yes | Unique number (1, 2, 3, ...) |
| `date` | Yes | Date in `YYYY-MM-DD` format (e.g., `2025-04-01`) |
| `time` | Yes | Time as text (e.g., `7:30 PM` or `٧:٣٠ مساءً`) |
| `title_en` | Yes | Event title in English |
| `title_ar` | No | Event title in Arabic |
| `description_en` | Yes | Event description in English |
| `description_ar` | No | Event description in Arabic |
| `location_en` | No | Location in English (e.g., "Main Hall") |
| `location_ar` | No | Location in Arabic |
| `category` | Yes | One of: `prayer`, `iftar`, `lecture`, `fundraiser`, `other` |
| `volunteer_needed` | Yes | `TRUE` or `FALSE` (see Volunteer Signups below) |
| `volunteer_contact` | No | WhatsApp link or email (see Volunteer Signups below) |

**Tips:**
- Past events disappear automatically — no need to delete old rows
- The calendar navigates month-by-month and shows dots on days with events
- If `category` doesn't match one of the five values above, the event won't appear in filtered views

---

### Volunteer Signups

**What it does:** Adds a "Volunteer" button to events that need volunteers. The button opens WhatsApp or email with a pre-filled message — no forms, no data collection, no privacy concerns.

**How it works:** When `volunteer_needed` is `TRUE` on an event, a green "Volunteer" button appears on the event card. When clicked, the button:

1. Checks the event's `volunteer_contact` column first
2. If it's a WhatsApp link (starts with `https://wa.me`), opens WhatsApp with a pre-filled message like _"I'd like to volunteer for [Event Name]"_
3. If it's an email address (contains `@`), opens a `mailto:` link with a pre-filled subject and body
4. If `volunteer_contact` is empty, falls back to the global `whatsapp_number` from the Config tab
5. If that's also empty, falls back to the global `volunteer_email` from the Config tab

The pre-filled message is automatically translated based on the current language (English or Arabic).

**Google Sheet configuration:** On each event row in the **Events** tab:

| Column | Value |
|--------|-------|
| `volunteer_needed` | `TRUE` to show the volunteer button |
| `volunteer_contact` | A WhatsApp link like `https://wa.me/15551234567`, an email like `volunteers@yourmasjid.org`, or leave blank to use the global fallback |

Global fallbacks in the **Config** tab:

| key | value_en |
|-----|----------|
| `whatsapp_number` | `15551234567` (digits only, with country code, no + or spaces) |
| `volunteer_email` | `volunteer@yourmasjid.org` |

---

### Donation Campaigns

**What it does:** Displays fundraising campaign cards with optional progress bars and "Donate Now" buttons that link to your external payment page.

**How it works:** Each active donation campaign is shown as a card. The "Donate Now" button opens your external payment link (PayPal, bank page, GoFundMe, etc.) in a new tab — **no payment processing happens on the site itself**. If a `goal_amount` is set (greater than 0), a progress bar shows `current_amount / goal_amount`. If `goal_amount` is `0`, the campaign displays as an open-ended donation with no progress bar. You manually update `current_amount` in the sheet as donations come in.

**Google Sheet configuration:** In the **Donations** tab, use these columns:

| Column | Required | Description |
|--------|----------|-------------|
| `id` | Yes | Unique number (1, 2, 3, ...) |
| `title_en` | Yes | Campaign title in English |
| `title_ar` | No | Campaign title in Arabic |
| `description_en` | Yes | Campaign description in English |
| `description_ar` | No | Campaign description in Arabic |
| `goal_amount` | Yes | Target amount as a number (e.g., `50000`). Set to `0` for open-ended donations (no progress bar). |
| `current_amount` | Yes | Amount raised so far (e.g., `12500`). Update this manually as donations come in. |
| `currency` | Yes | Three-letter currency code (e.g., `USD`, `GBP`, `SAR`, `AED`) |
| `donate_link` | Yes | Full URL to your payment page (e.g., `https://www.paypal.com/donate?hosted_button_id=XXXXX`) |
| `is_active` | Yes | `TRUE` to show, `FALSE` to hide |

**Tips:**
- Amounts are formatted with the currency symbol automatically (e.g., `$50,000`)
- The progress bar caps at 100% even if `current_amount` exceeds `goal_amount`
- Set `is_active` to `FALSE` to hide completed campaigns instead of deleting the row

---

### Contact & Location

**What it does:** Shows your masjid's contact information, a WhatsApp button, social media links, and an embedded Google Map.

**How it works:** All contact info is pulled from the Config tab. The Google Maps embed uses an iframe with the URL you provide. Social media icons only appear if you provide a URL — leave the value blank to hide any icon.

**Google Sheet configuration:** In the **Config** tab, set these rows:

| key | value_en | value_ar |
|-----|----------|----------|
| `address` | `123 Main St, City, State 12345` | `العنوان بالعربية` |
| `phone` | `+1 (555) 123-4567` | `+1 (555) 123-4567` |
| `email` | `info@yourmasjid.org` | `info@yourmasjid.org` |
| `whatsapp_number` | `15551234567` | `15551234567` |
| `google_maps_embed_url` | Your embed URL (see below) | _(leave blank)_ |
| `facebook_url` | `https://facebook.com/yourmasjid` | _(leave blank)_ |
| `instagram_url` | `https://instagram.com/yourmasjid` | _(leave blank)_ |
| `twitter_url` | _(leave blank to hide)_ | _(leave blank)_ |
| `youtube_url` | _(leave blank to hide)_ | _(leave blank)_ |

**How to get a Google Maps embed URL:**
1. Go to [Google Maps](https://maps.google.com) and search for your masjid
2. Click **Share → Embed a map**
3. Copy the `src="..."` URL from the iframe code (the URL only, not the full HTML)

---

### Bilingual Support (Arabic + English)

**What it does:** One-click language toggle in the navbar switches the entire site between English and Arabic, including full right-to-left (RTL) layout support.

**How it works:** A language toggle button in the navbar switches between English ("EN") and Arabic ("عربي"). When Arabic is selected:
- The entire page layout flips to right-to-left (RTL)
- All content fields switch to their `_ar` column values
- UI labels (buttons, headings, filters) switch to Arabic translations
- Prayer time names switch to Arabic
- Dates display in Arabic format with Arabic numerals

If an Arabic translation is missing for any content field, the English value is used as a fallback.

**Google Sheet configuration:** Every content column comes in pairs:
- `title_en` / `title_ar`
- `body_en` / `body_ar`
- `description_en` / `description_ar`
- `location_en` / `location_ar`

Arabic columns are **optional** — if you only need English, you can leave all `_ar` columns blank and the site will work fine in English only.

**Default language:** Set in `masjid.config.ts`:

```ts
DEFAULT_LANGUAGE: "en",  // "en" for English, "ar" for Arabic
```

---

## Prerequisites

- [Node.js](https://nodejs.org) 18 or later
- A Google account (for Google Sheets + API key)
- A [Netlify](https://netlify.com) account (free tier) for hosting

## Quick Start

### 1. Copy the Google Sheet Template

Follow the step-by-step guide in [`sheets-template/README.md`](./sheets-template/README.md) to:
- Create a Google Sheet with 4 tabs (Config, Announcements, Events, Donations)
- Publish the sheet and get an API key
- Fill in your masjid's information

### 2. Clone and Configure

```bash
git clone https://github.com/sohaibt/MasjidHub.git
cd MasjidHub
npm install
```

Copy the environment file and add your Google Sheets credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_SHEETS_API_KEY=your_google_sheets_api_key
NEXT_PUBLIC_SHEETS_ID=your_google_sheet_id
```

### 3. Customize (Optional)

Edit `masjid.config.ts` to set:
- Default language (`en` or `ar`)
- Masjid coordinates (for prayer times)
- Timezone

Edit `tailwind.config.ts` to change colors if desired.

### 4. Build and Preview

```bash
npm run dev        # Local development at http://localhost:3000
npm run build      # Build static export to /out folder
```

### 5. Deploy to Netlify

**Option A: Drag & Drop (easiest)**
1. Run `npm run build`
2. Go to [Netlify Drop](https://app.netlify.com/drop)
3. Drag the `/out` folder onto the page
4. Your site is live!

**Option B: Git-based deploy**
1. Push your repo to GitHub
2. Connect it to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `out`
5. Add environment variables in Netlify dashboard

## Updating Your Site Content

1. Edit your Google Sheet (add events, announcements, update donation amounts, etc.)
2. Trigger a rebuild on Netlify:
   - Manual: Click **"Trigger deploy"** in Netlify dashboard
   - Automatic: Set up a [build hook](https://docs.netlify.com/configure-builds/build-hooks/) with a daily cron job

## Customizing Colors

The default colors can be changed in `tailwind.config.ts`:

| Color | Default | Purpose |
|-------|---------|---------|
| Primary | `#1B5E20` (Deep Green) | Main brand color |
| Accent | `#C9A84C` (Warm Gold) | Highlights and CTAs |
| Background | `#FAF7F2` (Warm Off-White) | Page background |

## Project Structure

```
MasjidHub/
├── masjid.config.ts          # Site configuration
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Main page (server component)
│   │   └── globals.css        # Global styles + Islamic pattern
│   ├── components/
│   │   ├── MasjidHubApp.tsx   # Main client component
│   │   ├── CrescentLogo.tsx   # SVG crescent + star logo
│   │   ├── ui/                # Reusable UI components
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── progress.tsx
│   │   └── sections/          # Page sections
│   │       ├── Navbar.tsx
│   │       ├── HeroSection.tsx
│   │       ├── AnnouncementsSection.tsx
│   │       ├── EventsSection.tsx
│   │       ├── DonationsSection.tsx
│   │       ├── ContactSection.tsx
│   │       └── Footer.tsx
│   └── lib/
│       ├── sheets.ts          # Google Sheets API integration
│       ├── i18n.ts            # Translations (EN + AR)
│       ├── types.ts           # TypeScript types
│       ├── get-data.ts        # Data fetching with demo fallback
│       ├── demo-data.ts       # Demo data for development
│       ├── language-context.tsx # Language/RTL context provider
│       └── utils.ts           # Utility functions
├── sheets-template/
│   ├── sheet-data.json        # Example sheet data structure
│   └── README.md              # Google Sheet setup guide
├── .env.example               # Environment variables template
└── tailwind.config.ts         # Tailwind + design tokens
```

## Tech Stack

- **Next.js 14** — Static site generation with `output: 'export'`
- **Tailwind CSS** — Utility-first styling with RTL support
- **shadcn/ui** — Accessible UI components
- **Google Sheets API v4** — Content management via spreadsheet
- **Aladhan API** — Prayer times
- **Lucide Icons** — Beautiful open-source icons

## Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Ideas for Contributions

- Additional language support (Urdu, Turkish, Malay, etc.)
- Dark mode
- More prayer time calculation methods
- Improved accessibility
- Additional donation platform integrations

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## بالعربية

**Masjid Hub** هو قالب موقع إلكتروني مجاني ومفتوح المصدر يمكن لأي مسجد إعداده في أقل من ساعة. يدير الفعاليات والإعلانات وتسجيل المتطوعين والتبرعات — كل ذلك من خلال جدول بيانات Google بسيط.

### المميزات

- إدارة المحتوى عبر Google Sheets — لا حاجة لقاعدة بيانات أو خادم
- دعم كامل للغة العربية مع واجهة RTL
- مواقيت الصلاة اليومية تلقائياً
- التاريخ الهجري
- تقويم الفعاليات مع تصنيفات
- حملات التبرعات مع شريط التقدم
- تسجيل المتطوعين عبر واتساب
- تصميم إسلامي دافئ

للبدء، اتبع تعليمات الإعداد أعلاه أو راجع دليل إعداد Google Sheet في مجلد `sheets-template`.
