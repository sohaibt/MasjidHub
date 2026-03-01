"use client";

import { useLanguage } from "@/lib/language-context";
import { t } from "@/lib/i18n";
import { CrescentLogo } from "@/components/CrescentLogo";
import type { SiteConfig } from "@/lib/types";

export function Footer({ config }: { config: SiteConfig }) {
  const { lang, isRTL } = useLanguage();

  const masjidName = isRTL ? config.masjid_name.ar : config.masjid_name.en;
  const jummahTime = isRTL
    ? config.jummah_time.ar || config.jummah_time.en
    : config.jummah_time.en;

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Masjid info */}
          <div className="flex flex-col items-start gap-3">
            <div className="flex items-center gap-2">
              <CrescentLogo className="w-8 h-8 text-accent" />
              <span className="text-xl font-bold font-amiri">{masjidName}</span>
            </div>
            {config.masjid_tagline && (
              <p className="text-primary-200 text-sm">
                {isRTL
                  ? config.masjid_tagline.ar
                  : config.masjid_tagline.en}
              </p>
            )}
          </div>

          {/* Jummah info */}
          {jummahTime && (
            <div className="flex flex-col items-start gap-2">
              <h3 className="font-semibold text-accent">
                {t("footer_jummah", lang)}
              </h3>
              <p className="text-primary-200 text-sm">{jummahTime}</p>
            </div>
          )}

          {/* Open source credit */}
          <div className="flex flex-col items-start gap-2">
            <a
              href="https://github.com/sohaibt/MasjidHub"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-200 text-sm hover:text-accent transition-colors"
            >
              {t("footer_built_with", lang)}
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-primary-400/30 text-center">
          <p className="text-primary-200 text-xs">
            &copy; {new Date().getFullYear()} {masjidName}
          </p>
        </div>
      </div>
    </footer>
  );
}
