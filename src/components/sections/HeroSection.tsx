"use client";

import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { t, type TranslationKey } from "@/lib/i18n";
import type { SiteConfig } from "@/lib/types";
import { CrescentLogo } from "@/components/CrescentLogo";
import { masjidConfig } from "../../../masjid.config";
import {
  PRAYER_KEYS,
  findNextPrayer,
  formatCountdown,
  parseTiming,
  secondsSinceMidnight,
  type PrayerEntry,
  type PrayerKey,
} from "@/lib/prayer-times";

const PRAYER_LABEL_KEYS: Record<PrayerKey, TranslationKey> = {
  Fajr: "prayer_fajr",
  Sunrise: "prayer_sunrise",
  Dhuhr: "prayer_dhuhr",
  Asr: "prayer_asr",
  Maghrib: "prayer_maghrib",
  Isha: "prayer_isha",
};

interface PrayerSchedule {
  entries: PrayerEntry[];
  tomorrowFajr: string;
  /** IANA zone for the masjid: the API's, else `masjidConfig.TIMEZONE`. */
  timeZone?: string;
}

function getHijriDate(): string {
  // Use Intl API for Hijri calendar
  try {
    const formatter = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return formatter.format(new Date());
  } catch {
    return "";
  }
}

function getHijriDateArabic(): string {
  try {
    const formatter = new Intl.DateTimeFormat("ar-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return formatter.format(new Date());
  } catch {
    return "";
  }
}

function formatApiDate(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}-${mm}-${date.getFullYear()}`;
}

export function HeroSection({ config }: { config: SiteConfig }) {
  const { lang, isRTL } = useLanguage();
  const [hijriDate, setHijriDate] = useState("");
  const [schedule, setSchedule] = useState<PrayerSchedule | null>(null);
  const [prayerLoading, setPrayerLoading] = useState(true);
  // Seconds since midnight on the masjid's clock. Null until the first tick so
  // the server-rendered markup and the first client render agree.
  const [nowSeconds, setNowSeconds] = useState<number | null>(null);

  const masjidName = isRTL ? config.masjid_name.ar : config.masjid_name.en;
  const heroMessage = isRTL ? config.hero_message.ar : config.hero_message.en;
  const jummahTime = isRTL
    ? config.jummah_time.ar || config.jummah_time.en
    : config.jummah_time.en;

  useEffect(() => {
    setHijriDate(lang === "ar" ? getHijriDateArabic() : getHijriDate());
  }, [lang]);

  useEffect(() => {
    let cancelled = false;

    async function loadPrayerTimes() {
      try {
        const lat = config.masjid_lat || "39.78";
        const lng = config.masjid_lng || "-89.65";
        const query = `latitude=${lat}&longitude=${lng}&method=2`;
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Tomorrow's timings are only needed for the post-Isha countdown, so a
        // failure there must not cost us today's times.
        const [todayRes, tomorrowRes] = await Promise.all([
          fetch(`https://api.aladhan.com/v1/timings/${formatApiDate(today)}?${query}`),
          fetch(`https://api.aladhan.com/v1/timings/${formatApiDate(tomorrow)}?${query}`).catch(
            () => null
          ),
        ]);

        const todayData = await todayRes.json();
        if (todayData.code !== 200) return;

        const timings = todayData.data.timings;
        const entries: PrayerEntry[] = PRAYER_KEYS.map((key) => ({
          key,
          time: parseTiming(timings[key]),
        })).filter((entry) => entry.time !== "");

        let tomorrowFajr = "";
        if (tomorrowRes?.ok) {
          try {
            const tomorrowData = await tomorrowRes.json();
            if (tomorrowData.code === 200) {
              tomorrowFajr = parseTiming(tomorrowData.data.timings.Fajr);
            }
          } catch {
            // Keep today's times; the wrap falls back to today's Fajr.
          }
        }

        if (cancelled) return;
        setSchedule({
          entries,
          tomorrowFajr,
          // Aladhan derives the zone from the masjid's own coordinates, so
          // prefer it over the configured value, which ships with a default
          // that will not match most forks.
          timeZone: todayData.data.meta?.timezone || masjidConfig.TIMEZONE || undefined,
        });
      } catch (error) {
        console.error("Failed to load prayer times:", error);
      } finally {
        if (!cancelled) setPrayerLoading(false);
      }
    }

    loadPrayerTimes();
    return () => {
      cancelled = true;
    };
    // Prayer names are localized at render time, so a language switch must not
    // refetch the schedule.
  }, [config.masjid_lat, config.masjid_lng]);

  // Drive the countdown once the schedule is in hand.
  useEffect(() => {
    if (!schedule) return;
    const tick = () =>
      setNowSeconds(secondsSinceMidnight(new Date(), schedule.timeZone));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [schedule]);

  const nextPrayer = useMemo(() => {
    if (!schedule || nowSeconds === null) return null;
    return findNextPrayer(schedule.entries, nowSeconds, schedule.tomorrowFajr);
  }, [schedule, nowSeconds]);

  const countdown = nextPrayer
    ? nextPrayer.secondsUntil <= 0
      ? t("hero_prayer_now", lang)
      : t("hero_prayer_in", lang).replace(
          "{time}",
          formatCountdown(nextPrayer.secondsUntil, lang)
        )
    : "";

  return (
    <section id="home" className="relative pt-16">
      {/* Islamic pattern background */}
      <div className="islamic-pattern relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="text-center">
            {/* Crescent decoration */}
            <CrescentLogo className="w-16 h-16 text-accent mx-auto mb-6 opacity-90" />

            {/* Masjid name */}
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-amiri">
              {masjidName}
            </h1>

            {/* Hero message */}
            {heroMessage && (
              <p className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto mb-6 font-amiri">
                {heroMessage}
              </p>
            )}

            {/* Hijri date & Jummah badge */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {hijriDate && (
                <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 text-white/90 text-sm">
                  <span>☪</span>
                  <span>{hijriDate}</span>
                </div>
              )}
              {jummahTime && (
                <div className="inline-flex items-center gap-2 bg-accent/90 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-semibold shadow-lg">
                  <span>{t("footer_jummah", lang)}</span>
                  <span className="border-l border-white/40 pl-2">{jummahTime}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="#FAF7F2" />
          </svg>
        </div>
      </div>

      {/* Prayer times bar */}
      <div className="bg-canvas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h2 className="text-sm font-semibold text-brand uppercase tracking-wider mb-4 text-center">
            {t("hero_prayer_times", lang)}
          </h2>

          {/* Next prayer callout */}
          {nextPrayer && (
            <div className="flex justify-center mb-4">
              <div className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-brandSolid text-white rounded-xl px-5 py-3 shadow-md">
                <span className="text-[11px] uppercase tracking-wider text-white/70">
                  {t("hero_next_prayer", lang)}
                </span>
                <span className="text-base font-bold">
                  {t(PRAYER_LABEL_KEYS[nextPrayer.key], lang)}
                </span>
                <span className="text-base font-semibold text-accent" dir="ltr">
                  {nextPrayer.time}
                </span>
                {nextPrayer.isTomorrow && (
                  <span className="text-xs text-white/70">
                    {t("hero_prayer_tomorrow", lang)}
                  </span>
                )}
                <span className="text-sm font-medium text-white/90 border-s border-white/25 ps-3">
                  {countdown}
                </span>
              </div>
            </div>
          )}

          {prayerLoading ? (
            <div className="flex justify-center">
              <div className="flex gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-20 h-12 bg-surfaceAlt rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
          ) : !schedule || schedule.entries.length === 0 ? (
            <p className="text-center text-sm text-muted">
              {t("hero_prayer_unavailable", lang)}
            </p>
          ) : (
            <div className="flex flex-wrap justify-center gap-3 md:gap-6">
              {schedule.entries.map((entry) => {
                // Only highlight today's next prayer — once it has wrapped to
                // tomorrow's Fajr, marking the Fajr tile would misread as though
                // it were still ahead of us today.
                const isNext =
                  nextPrayer?.key === entry.key && !nextPrayer.isTomorrow;
                return (
                  <div
                    key={entry.key}
                    aria-current={isNext ? "true" : undefined}
                    className={`flex flex-col items-center rounded-lg px-4 py-2 min-w-[80px] transition-colors ${
                      isNext
                        ? "bg-brandSolid/5 border-2 border-brand shadow-sm"
                        : "bg-surface border border-line shadow-sm"
                    }`}
                  >
                    <span
                      className={`text-xs font-medium ${
                        isNext ? "text-brand" : "text-muted"
                      }`}
                    >
                      {t(PRAYER_LABEL_KEYS[entry.key], lang)}
                    </span>
                    <span className="text-sm font-bold text-brand" dir="ltr">
                      {entry.time}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
