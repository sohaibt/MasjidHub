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
