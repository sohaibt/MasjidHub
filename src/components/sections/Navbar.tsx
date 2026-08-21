"use client";

import { useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CrescentLogo } from "@/components/CrescentLogo";
import { useLanguage } from "@/lib/language-context";
import { useTheme } from "@/lib/theme-context";
import { t } from "@/lib/i18n";
import type { SiteConfig } from "@/lib/types";

const navLinks = [
  { key: "nav_home" as const, href: "#home" },
  { key: "nav_events" as const, href: "#events" },
  { key: "nav_announcements" as const, href: "#announcements" },
  { key: "nav_donate" as const, href: "#donate" },
  { key: "nav_contact" as const, href: "#contact" },
];

export function Navbar({ config }: { config: SiteConfig }) {
  const { lang, toggleLanguage, isRTL } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const masjidName = isRTL ? config.masjid_name.ar : config.masjid_name.en;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-sm border-b border-line shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and masjid name */}
          <a href="#home" className="flex items-center gap-2 group">
            <CrescentLogo className="w-8 h-8 text-brand transition-transform group-hover:scale-110" />
            <span className="text-lg font-bold text-brand hidden sm:block">
              {masjidName}
            </span>
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-muted hover:text-brand transition-colors rounded-lg hover:bg-brandSoft"
              >
                {t(link.key, lang)}
              </a>
            ))}
          </div>

          {/* Language toggle + mobile menu */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="font-bold min-w-[48px]"
            >
              {t("lang_toggle", lang)}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={t(
                theme === "dark" ? "theme_to_light" : "theme_to_dark",
                lang
              )}
              title={t(
                theme === "dark" ? "theme_to_light" : "theme_to_dark",
                lang
              )}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-line">
            <div className="flex flex-col gap-1 pt-2">
              {navLinks.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-muted hover:text-brand hover:bg-brandSoft rounded-lg transition-colors"
                >
                  {t(link.key, lang)}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
