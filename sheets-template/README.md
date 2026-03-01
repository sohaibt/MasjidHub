# Google Sheet Setup Guide

This guide walks you through setting up the Google Sheet that powers your Masjid Hub website.

## Step 1: Create the Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Name it **"Masjid Hub Data"** (or any name you prefer)
3. Create **4 tabs** (sheets) at the bottom, named exactly:
   - `Config`
   - `Announcements`
   - `Events`
   - `Donations`

## Step 2: Set Up Each Tab

### Config Tab

Add these columns in Row 1: `key` | `value_en` | `value_ar`

Then add the following rows (one per line):

| key | value_en | value_ar |
|-----|----------|----------|
| masjid_name | Your Masjid Name | اسم المسجد |
| masjid_tagline | Your tagline | الشعار |
| address | 123 Main St, City, State ZIP | العنوان بالعربية |
| phone | +1 (555) 123-4567 | +1 (555) 123-4567 |
| email | info@yourmasjid.org | info@yourmasjid.org |
| whatsapp_number | 15551234567 | 15551234567 |
| volunteer_email | volunteer@yourmasjid.org | volunteer@yourmasjid.org |
| google_maps_embed_url | (your Google Maps embed URL) | |
| hero_message | Welcome message | رسالة الترحيب |
| facebook_url | https://facebook.com/yourmasjid | |
| instagram_url | https://instagram.com/yourmasjid | |
| twitter_url | | |
| youtube_url | | |
| jummah_time | 1:00 PM | ١:٠٠ ظهراً |
| masjid_lat | 39.78 | |
| masjid_lng | -89.65 | |

### Announcements Tab

Columns: `id` | `date` | `title_en` | `title_ar` | `body_en` | `body_ar` | `is_pinned` | `is_active`

- **id**: A unique number (1, 2, 3, ...)
- **date**: Format as YYYY-MM-DD (e.g., 2025-03-15)
- **is_pinned**: TRUE or FALSE — pinned announcements show at the top
- **is_active**: TRUE or FALSE — set to FALSE to hide old announcements

### Events Tab

Columns: `id` | `date` | `time` | `title_en` | `title_ar` | `description_en` | `description_ar` | `location_en` | `location_ar` | `category` | `volunteer_needed` | `volunteer_contact`

- **category**: Must be one of: `prayer`, `iftar`, `lecture`, `fundraiser`, `other`
- **volunteer_needed**: TRUE or FALSE
- **volunteer_contact**: A WhatsApp link (https://wa.me/NUMBER) or email address

### Donations Tab

Columns: `id` | `title_en` | `title_ar` | `description_en` | `description_ar` | `goal_amount` | `current_amount` | `currency` | `donate_link` | `is_active`

- **goal_amount**: Set to 0 for open donations (no progress bar)
- **donate_link**: External link to your payment page (PayPal, bank, etc.)

## Step 3: Publish the Sheet

1. In Google Sheets, go to **File → Share → Publish to web**
2. Select **"Entire Document"** and **"Web page"**
3. Click **Publish**
4. Also click **Share** (top right) and set it to **"Anyone with the link can view"**

## Step 4: Get Your API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or use an existing one)
3. Enable the **Google Sheets API**:
   - Go to **APIs & Services → Library**
   - Search for "Google Sheets API"
   - Click **Enable**
4. Create an API key:
   - Go to **APIs & Services → Credentials**
   - Click **Create Credentials → API Key**
   - Copy the key
5. (Recommended) Restrict the API key:
   - Click on the key to edit it
   - Under **Application restrictions**, select **HTTP referrers**
   - Add your domain (e.g., `https://yourmasjid.netlify.app/*`)
   - Under **API restrictions**, select **Restrict key** and choose **Google Sheets API**

## Step 5: Get Your Sheet ID

Your Sheet ID is the long string in the Google Sheets URL:

```
https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_IS_HERE/edit
```

## Step 6: Configure the Site

Add your Sheet ID and API key to the `.env.local` file:

```
NEXT_PUBLIC_SHEETS_API_KEY=your_api_key_here
NEXT_PUBLIC_SHEETS_ID=your_sheet_id_here
```

## Updating Content

After updating your Google Sheet:
- If using Netlify: trigger a rebuild (click "Deploy" in Netlify dashboard)
- You can set up a daily auto-rebuild using a Netlify build hook + a cron service

## Reference Data

See `sheet-data.json` in this folder for a complete example of the data structure.
