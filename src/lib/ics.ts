import type { Language, MasjidEvent } from "./types";
import {
  DEFAULT_EVENT_MINUTES,
  addMinutes,
  parseEventDateTime,
  toIcsDate,
  toIcsDateTime,
} from "./event-time";

/**
 * Builds RFC 5545 calendar files for events, so a visitor can save one to
 * Apple Calendar, Google Calendar or Outlook instead of trying to remember it.
 *
 * Everything here is generated in the browser — the site is a static export
 * with no server to ask for a file.
 */

/**
 * Escapes the reserved characters in a text value: backslash, semicolon and
 * comma are escaped, and real newlines become the literal `\n` sequence.
 */
export function escapeIcsText(value: string): string {
  return (value || "")
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r\n|\r|\n/g, "\\n");
}

/**
 * Folds a content line to 75 octets, continuing with a leading space.
 *
 * The limit is in octets rather than characters, which matters here because
 * Arabic titles and descriptions are multi-byte in UTF-8 — folding by string
 * length would produce over-long lines and can split a character in half.
 */
export function foldIcsLine(line: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(line);
  if (bytes.length <= 75) return line;

  const parts: string[] = [];
  let current = "";
  let currentBytes = 0;
  // The continuation space costs an octet, so subsequent lines fit 74.
  let limit = 75;

  for (const char of line) {
    const size = encoder.encode(char).length;
    if (currentBytes + size > limit) {
      parts.push(current);
      current = "";
      currentBytes = 0;
      limit = 74;
    }
    current += char;
    currentBytes += size;
  }
  if (current) parts.push(current);

  return parts.join("\r\n ");
}

function stamp(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
  );
}

export interface IcsOptions {
  /** Used for the calendar name and as the event's organizer. */
  masjidName: string;
  /** Generation time; injected so the output can be asserted in tests. */
  now?: Date;
  /** Domain for the UID's right-hand side. */
  uidDomain?: string;
}

/**
 * Serializes one event as a complete .ics document.
 *
 * Times are written as floating local times (no timezone and no trailing Z):
 * a masjid event happens at 6:15pm where the masjid is, and that is how a
 * calendar client should show it regardless of where the visitor imports it.
 */
export function buildEventIcs(
  event: MasjidEvent,
  lang: Language,
  options: IcsOptions
): string | null {
  const start = parseEventDateTime(event.date, event.time);
  if (!start) return null;

  const isArabic = lang === "ar";
  const title = (isArabic ? event.title_ar || event.title_en : event.title_en) || "Event";
  const description = isArabic
    ? event.description_ar || event.description_en
    : event.description_en;
  const location = isArabic
    ? event.location_ar || event.location_en
    : event.location_en;

  const now = options.now ?? new Date();
  const domain = options.uidDomain || "masjidhub.local";

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Masjid Hub//Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeIcsText(options.masjidName)}`,
    "BEGIN:VEVENT",
    // Stable across re-exports, so re-importing updates the entry rather than
    // creating a duplicate.
    `UID:masjidhub-${escapeIcsText(event.id)}-${toIcsDate(start)}@${domain}`,
    `DTSTAMP:${stamp(now)}`,
  ];

  if (start.hasTime) {
    const end = addMinutes(start, DEFAULT_EVENT_MINUTES);
    lines.push(`DTSTART:${toIcsDateTime(start)}`);
    lines.push(`DTEND:${toIcsDateTime(end)}`);
  } else {
    // No usable time in the sheet — record it as an all-day event. DTEND is
    // exclusive for DATE values, so it is the following day.
    const end = addMinutes({ ...start, hours: 0, minutes: 0 }, 24 * 60);
    lines.push(`DTSTART;VALUE=DATE:${toIcsDate(start)}`);
    lines.push(`DTEND;VALUE=DATE:${toIcsDate(end)}`);
  }

  lines.push(`SUMMARY:${escapeIcsText(title)}`);
  if (description) lines.push(`DESCRIPTION:${escapeIcsText(description)}`);
  if (location) lines.push(`LOCATION:${escapeIcsText(location)}`);
  if (options.masjidName) {
    lines.push(`ORGANIZER;CN=${escapeIcsText(options.masjidName)}:MAILTO:noreply@${domain}`);
  }
  lines.push("END:VEVENT", "END:VCALENDAR");

  // RFC 5545 requires CRLF line endings.
  return lines.map(foldIcsLine).join("\r\n") + "\r\n";
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    // Filename-unsafe characters, plus the punctuation that makes for an ugly
    // download name. Letters — including non-Latin ones — are left alone.
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1f\x7f/\\:*?"<>|;,.!'()[\]{}]+/g, " ")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");
}

/** Does this slug carry anything a browser will keep in a download name? */
function hasLatinText(slug: string): boolean {
  return /[a-z0-9]/.test(slug);
}

/**
 * A safe, readable filename for the downloaded calendar file.
 *
 * Browsers sanitize bidirectional characters out of the `download` attribute —
 * an anti-spoofing measure, since an RTL override can disguise a file's real
 * extension — and Chromium falls back to the generic name "download" for a
 * wholly Arabic one. So when the localized title yields nothing a browser will
 * keep, fall back to the English title for the filename only; the event inside
 * the file stays in the visitor's language either way.
 */
export function icsFileName(event: MasjidEvent, lang: Language): string {
  const isArabic = lang === "ar";
  const localized = (isArabic ? event.title_ar || event.title_en : event.title_en) || "";

  let slug = slugify(localized);
  if (!hasLatinText(slug)) slug = slugify(event.title_en || "");
  if (!hasLatinText(slug)) slug = "event";

  return `${slug}-${event.date}.ics`;
}

/** Triggers the browser download for an event's calendar file. */
export function downloadEventIcs(
  event: MasjidEvent,
  lang: Language,
  options: IcsOptions
): void {
  const ics = buildEventIcs(event, lang, options);
  if (!ics) return;

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = icsFileName(event, lang);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Give the click a tick to start before revoking the URL.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
