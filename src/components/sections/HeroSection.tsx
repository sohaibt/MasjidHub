"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { t } from "@/lib/i18n";
import type { SiteConfig } from "@/lib/types";
import { CrescentLogo } from "@/components/CrescentLogo";

interface PrayerTime {
  name: string;
  time: string;
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

export function HeroSection({ config }: { config: SiteConfig }) {
  const { lang, isRTL } = useLanguage();
  const [hijriDate, setHijriDate] = useState("");
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [prayerLoading, setPrayerLoading] = useState(true);

  const masjidName = isRTL ? config.masjid_name.ar : config.masjid_name.en;
  const heroMessage = isRTL ? config.hero_message.ar : config.hero_message.en;

  useEffect(() => {
    setHijriDate(lang === "ar" ? getHijriDateArabic() : getHijriDate());
  }, [lang]);

  useEffect(() => {
    async function loadPrayerTimes() {
      try {
        const lat = config.masjid_lat || "39.78";
        const lng = config.masjid_lng || "-89.65";
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, "0");
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const yyyy = today.getFullYear();

        const res = await fetch(
          `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${lat}&longitude=${lng}&method=2`
        );
        const data = await res.json();

        if (data.code === 200) {
          const timings = data.data.timings;
          const prayerKeys = [
            { key: "Fajr", i18n: "prayer_fajr" as const },
            { key: "Sunrise", i18n: "prayer_sunrise" as const },
            { key: "Dhuhr", i18n: "prayer_dhuhr" as const },
            { key: "Asr", i18n: "prayer_asr" as const },
            { key: "Maghrib", i18n: "prayer_maghrib" as const },
            { key: "Isha", i18n: "prayer_isha" as const },
          ];

          setPrayerTimes(
            prayerKeys.map((p) => ({
              name: t(p.i18n, lang),
              time: timings[p.key]?.replace(" (EDT)", "").replace(" (EST)", "").split(" ")[0] || "",
            }))
          );
        }
      } catch (error) {
        console.error("Failed to load prayer times:", error);
      } finally {
        setPrayerLoading(false);
      }
    }
    loadPrayerTimes();
  }, [config.masjid_lat, config.masjid_lng, lang]);

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

            {/* Hijri date */}
            {hijriDate && (
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 text-white/90 text-sm">
                <span>☪</span>
                <span>{hijriDate}</span>
              </div>
            )}
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
      <div className="bg-warmWhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h2 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4 text-center">
            {t("hero_prayer_times", lang)}
          </h2>
          {prayerLoading ? (
            <div className="flex justify-center">
              <div className="flex gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-20 h-12 bg-warmGray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-3 md:gap-6">
              {prayerTimes.map((prayer) => (
                <div
                  key={prayer.name}
                  className="flex flex-col items-center bg-white rounded-lg px-4 py-2 shadow-sm border border-warmGray-200 min-w-[80px]"
                >
                  <span className="text-xs text-warmGray-500 font-medium">
                    {prayer.name}
                  </span>
                  <span className="text-sm font-bold text-primary">
                    {prayer.time}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
