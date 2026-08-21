import type { Language } from "./types";

/**
 * Pure helpers for the prayer-times bar in the hero.
 *
 * These are kept free of React and of `fetch` so the "which prayer is next"
 * logic can be reasoned about (and tested) on its own — it has more edge cases
 * than it first appears: Sunrise is not a prayer, the day wraps around to
 * tomorrow's Fajr after Isha, and the countdown has to run on the masjid's
 * clock rather than the visitor's.
 */

export const PRAYER_KEYS = [
  "Fajr",
  "Sunrise",
  "Dhuhr",
  "Asr",
  "Maghrib",
  "Isha",
] as const;

export type PrayerKey = (typeof PRAYER_KEYS)[number];

/**
 * Sunrise is shown in the times bar because it marks the end of Fajr, but it
 * is not a prayer and must never be offered as the "next prayer".
 */
export const NON_PRAYER_KEYS: readonly PrayerKey[] = ["Sunrise"];

export interface PrayerEntry {
  key: PrayerKey;
  /** "HH:MM" on a 24-hour clock, in the masjid's local time. */
  time: string;
}

export interface NextPrayer {
  key: PrayerKey;
  time: string;
  secondsUntil: number;
  /** True when the next prayer is tomorrow's Fajr (i.e. Isha has passed). */
  isTomorrow: boolean;
}

const SECONDS_PER_DAY = 86400;

/**
 * Aladhan returns timings as either "19:48" or "19:48 (EDT)" depending on the
 * endpoint and location, so drop anything after the clock time.
 */
export function parseTiming(raw: string | undefined): string {
  if (!raw) return "";
  const clock = raw.trim().split(" ")[0];
  return /^\d{1,2}:\d{2}$/.test(clock) ? clock : "";
}

/** Seconds since midnight for an "HH:MM" string, or null if unparseable. */
export function timeToSeconds(time: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 3600 + minutes * 60;
}

/**
 * Seconds since midnight *in the masjid's timezone*.
 *
 * Prayer times are computed for the masjid's coordinates, so a visitor in
 * another timezone must still see the countdown on the masjid's clock — using
 * the visitor's own clock would be off by the offset between them. Falls back
 * to the visitor's local time when no timezone is known or the runtime rejects
 * the identifier.
 */
export function secondsSinceMidnight(now: Date, timeZone?: string): number {
  if (timeZone) {
    try {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone,
        hourCycle: "h23",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).formatToParts(now);
      const read = (type: string) =>
        Number(parts.find((part) => part.type === type)?.value ?? NaN);
      const hours = read("hour");
      const minutes = read("minute");
      const seconds = read("second");
      if (![hours, minutes, seconds].some(Number.isNaN)) {
        // Some engines render midnight as hour 24 rather than 0.
        return (hours % 24) * 3600 + minutes * 60 + seconds;
      }
    } catch {
      // Unknown IANA zone — fall through to the visitor's clock.
    }
  }
  return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
}

/**
 * The next actual prayer after `nowSeconds`, wrapping to tomorrow's Fajr once
 * Isha has passed. `tomorrowFajr` keeps that wrap accurate across the seasons,
 * where Fajr can shift by a minute or more each day; when it is missing we
 * reuse today's Fajr, which is close enough to stay useful.
 */
export function findNextPrayer(
  entries: PrayerEntry[],
  nowSeconds: number,
  tomorrowFajr?: string
): NextPrayer | null {
  const upcoming = entries
    .filter((entry) => !NON_PRAYER_KEYS.includes(entry.key))
    .map((entry) => ({ entry, seconds: timeToSeconds(entry.time) }))
    .filter(
      (candidate): candidate is { entry: PrayerEntry; seconds: number } =>
        candidate.seconds !== null
    );

  if (upcoming.length === 0) return null;

  for (const { entry, seconds } of upcoming) {
    if (seconds > nowSeconds) {
      return {
        key: entry.key,
        time: entry.time,
        secondsUntil: seconds - nowSeconds,
        isTomorrow: false,
      };
    }
  }

  // Every prayer for today has passed — wrap to tomorrow's Fajr.
  const fajrEntry = upcoming.find((candidate) => candidate.entry.key === "Fajr");
  if (!fajrEntry) return null;
  const fajrTime = parseTiming(tomorrowFajr) || fajrEntry.entry.time;
  const fajrSeconds = timeToSeconds(fajrTime) ?? fajrEntry.seconds;

  return {
    key: "Fajr",
    time: fajrTime,
    secondsUntil: SECONDS_PER_DAY - nowSeconds + fajrSeconds,
    isTomorrow: true,
  };
}

const UNITS = {
  en: { hour: "h", minute: "m", second: "s" },
  ar: { hour: "س", minute: "د", second: "ث" },
} as const;

/**
 * Formats a countdown, tightening the resolution as the prayer approaches:
 * hours and minutes when far out, minutes and seconds within the hour, and
 * bare seconds in the final minute.
 */
export function formatCountdown(secondsUntil: number, lang: Language): string {
  const units = UNITS[lang] ?? UNITS.en;
  const total = Math.max(0, Math.floor(secondsUntil));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  if (hours > 0) return `${hours}${units.hour} ${minutes}${units.minute}`;
  if (minutes > 0) return `${minutes}${units.minute} ${seconds}${units.second}`;
  return `${seconds}${units.second}`;
}
