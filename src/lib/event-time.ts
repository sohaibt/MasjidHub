/**
 * Parsing for the free-text date and time fields that come out of the Google
 * Sheet, shared by the .ics export and the JSON-LD structured data so both
 * agree on when an event starts.
 */

export interface EventMoment {
  year: number;
  month: number; // 1-12
  day: number;
  hours: number; // 0-23
  minutes: number;
  /** False when the sheet's time cell was blank or unparseable. */
  hasTime: boolean;
}

/** Default length for an event, since the sheet has no end-time column. */
export const DEFAULT_EVENT_MINUTES = 60;

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
// "6:15 PM", "6 PM", "18:15", "1:00pm" — the sheet is hand-edited, so accept
// the shapes a person actually types.
const TIME_PATTERN = /^(\d{1,2})(?::(\d{2}))?\s*([AaPp])\.?[Mm]\.?$|^(\d{1,2}):(\d{2})$/;

export function parseEventDateTime(
  dateStr: string,
  timeStr: string
): EventMoment | null {
  const dateMatch = DATE_PATTERN.exec((dateStr || "").trim());
  if (!dateMatch) return null;

  const year = Number(dateMatch[1]);
  const month = Number(dateMatch[2]);
  const day = Number(dateMatch[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  const base: EventMoment = { year, month, day, hours: 0, minutes: 0, hasTime: false };

  const timeMatch = TIME_PATTERN.exec((timeStr || "").trim());
  if (!timeMatch) return base;

  let hours: number;
  let minutes: number;

  if (timeMatch[3]) {
    // 12-hour form with a meridiem.
    hours = Number(timeMatch[1]);
    minutes = Number(timeMatch[2] ?? "0");
    if (hours < 1 || hours > 12) return base;
    const isPM = timeMatch[3].toLowerCase() === "p";
    if (hours === 12) hours = isPM ? 12 : 0;
    else if (isPM) hours += 12;
  } else {
    // 24-hour form.
    hours = Number(timeMatch[4]);
    minutes = Number(timeMatch[5]);
    if (hours > 23) return base;
  }

  if (minutes > 59) return base;
  return { ...base, hours, minutes, hasTime: true };
}

/** Adds minutes to a moment, rolling the calendar over correctly. */
export function addMinutes(moment: EventMoment, minutes: number): EventMoment {
  const date = new Date(
    moment.year,
    moment.month - 1,
    moment.day,
    moment.hours,
    moment.minutes + minutes
  );
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hours: date.getHours(),
    minutes: date.getMinutes(),
    hasTime: moment.hasTime,
  };
}

const pad = (value: number, width = 2) => String(value).padStart(width, "0");

/** "20260824T181500" — a floating local time, per RFC 5545. */
export function toIcsDateTime(moment: EventMoment): string {
  return (
    `${pad(moment.year, 4)}${pad(moment.month)}${pad(moment.day)}` +
    `T${pad(moment.hours)}${pad(moment.minutes)}00`
  );
}

/** "20260824" — for all-day events. */
export function toIcsDate(moment: EventMoment): string {
  return `${pad(moment.year, 4)}${pad(moment.month)}${pad(moment.day)}`;
}

/**
 * "2026-08-24T18:15" or "2026-08-24" — schema.org accepts a local ISO 8601
 * value, which is what a masjid event actually is.
 */
export function toIsoLocal(moment: EventMoment): string {
  const date = `${pad(moment.year, 4)}-${pad(moment.month)}-${pad(moment.day)}`;
  return moment.hasTime ? `${date}T${pad(moment.hours)}:${pad(moment.minutes)}` : date;
}
