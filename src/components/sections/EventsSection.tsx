"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, MapPin, Clock, Users } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { t, getCategoryLabel, getCategoryBadgeVariant } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { MasjidEvent, SiteConfig } from "@/lib/types";

const categoryFilters = [
  { key: "all", i18n: "events_all" as const },
  { key: "prayer", i18n: "events_prayers" as const },
  { key: "iftar", i18n: "events_iftars" as const },
  { key: "lecture", i18n: "events_lectures" as const },
  { key: "fundraiser", i18n: "events_fundraisers" as const },
];

function formatDate(dateStr: string, lang: string): string {
  try {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function getVolunteerLink(
  event: MasjidEvent,
  config: SiteConfig,
  lang: string
): string {
  const contact = event.volunteer_contact || "";
  const eventTitle = lang === "ar" ? event.title_ar : event.title_en;
  const message =
    lang === "ar"
      ? `أود التطوع لحدث ${eventTitle}`
      : `I'd like to volunteer for ${eventTitle}`;

  // If it's a WhatsApp link already
  if (contact.startsWith("https://wa.me")) {
    return `${contact}?text=${encodeURIComponent(message)}`;
  }

  // If it's an email
  if (contact.includes("@")) {
    return `mailto:${contact}?subject=${encodeURIComponent(
      `Volunteer: ${eventTitle}`
    )}&body=${encodeURIComponent(message)}`;
  }

  // Fall back to config WhatsApp number
  if (config.whatsapp_number) {
    return `https://wa.me/${config.whatsapp_number}?text=${encodeURIComponent(message)}`;
  }

  // Fall back to volunteer email
  if (config.volunteer_email) {
    return `mailto:${config.volunteer_email}?subject=${encodeURIComponent(
      `Volunteer: ${eventTitle}`
    )}&body=${encodeURIComponent(message)}`;
  }

  return "#";
}

function Calendar({
  events,
  lang,
}: {
  events: MasjidEvent[];
  lang: string;
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const eventDates = useMemo(() => {
    const dates = new Set<string>();
    events.forEach((e) => {
      const d = new Date(e.date + "T00:00:00");
      if (d.getMonth() === month && d.getFullYear() === year) {
        dates.add(d.getDate().toString());
      }
    });
    return dates;
  }, [events, month, year]);

  const monthKey = `month_${month}` as Parameters<typeof t>[0];
  const monthName = t(monthKey, lang as "en" | "ar");

  const dayKeys = [
    "day_sun", "day_mon", "day_tue", "day_wed",
    "day_thu", "day_fri", "day_sat",
  ] as const;

  const today = new Date();
  const isCurrentMonth =
    today.getMonth() === month && today.getFullYear() === year;

  return (
    <div className="bg-white rounded-xl border border-warmGray-200 shadow-sm p-4 md:p-6">
      {/* Calendar header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
          aria-label={t("calendar_prev", lang as "en" | "ar")}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h3 className="text-lg font-semibold text-primary font-amiri">
          {monthName} {year}
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
          aria-label={t("calendar_next", lang as "en" | "ar")}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayKeys.map((dk) => (
          <div
            key={dk}
            className="text-center text-xs font-medium text-warmGray-400 py-1"
          >
            {t(dk, lang as "en" | "ar")}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells before first day */}
        {Array.from({ length: firstDayOfMonth }, (_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const hasEvent = eventDates.has(day.toString());
          const isToday = isCurrentMonth && today.getDate() === day;

          return (
            <div
              key={day}
              className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm relative
                ${isToday ? "bg-primary text-white font-bold" : ""}
                ${hasEvent && !isToday ? "bg-primary-50 text-primary font-medium" : ""}
                ${!hasEvent && !isToday ? "text-warmGray-500 hover:bg-warmGray-100" : ""}
              `}
            >
              {day}
              {hasEvent && (
                <div
                  className={`w-1.5 h-1.5 rounded-full absolute bottom-1 ${
                    isToday ? "bg-accent" : "bg-primary"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function EventsSection({
  events,
  config,
}: {
  events: MasjidEvent[];
  config: SiteConfig;
}) {
  const { lang, isRTL } = useLanguage();
  const [filter, setFilter] = useState("all");

  const filteredEvents = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const upcoming = events.filter(
      (e) => new Date(e.date + "T00:00:00") >= now
    );
    if (filter === "all") return upcoming;
    return upcoming.filter((e) => e.category === filter);
  }, [events, filter]);

  return (
    <section id="events" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-primary mb-8 text-center font-amiri">
          {t("events_title", lang)}
        </h2>

        {/* Gold decorative line */}
        <div className="flex justify-center mb-10">
          <div className="w-24 h-1 bg-accent rounded-full" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-1">
            <Calendar events={events} lang={lang} />
          </div>

          {/* Events list */}
          <div className="lg:col-span-2">
            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categoryFilters.map((cf) => (
                <Button
                  key={cf.key}
                  variant={filter === cf.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(cf.key)}
                >
                  {t(cf.i18n, lang)}
                </Button>
              ))}
            </div>

            <h3 className="text-lg font-semibold text-primary mb-4">
              {t("events_upcoming", lang)}
            </h3>

            {filteredEvents.length === 0 ? (
              <p className="text-warmGray-500 text-center py-8">
                {t("events_empty", lang)}
              </p>
            ) : (
              <div className="space-y-4">
                {filteredEvents.map((event) => {
                  const title = isRTL
                    ? event.title_ar || event.title_en
                    : event.title_en;
                  const description = isRTL
                    ? event.description_ar || event.description_en
                    : event.description_en;
                  const location = isRTL
                    ? event.location_ar || event.location_en
                    : event.location_en;

                  return (
                    <Card key={event.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge
                                variant={getCategoryBadgeVariant(event.category)}
                              >
                                {getCategoryLabel(event.category, lang)}
                              </Badge>
                              {event.volunteer_needed && (
                                <Badge variant="accent">
                                  <Users className="w-3 h-3 mr-1" />
                                  {t("events_volunteer", lang).split(" ")[0]}
                                </Badge>
                              )}
                            </div>
                            <CardTitle className="text-primary font-amiri">
                              {title}
                            </CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="flex flex-wrap gap-4 text-sm text-warmGray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDate(event.date, lang)} • {event.time}
                          </span>
                          {location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {location}
                            </span>
                          )}
                        </div>
                        <p className="text-warmGray-500 text-sm leading-relaxed">
                          {description}
                        </p>
                      </CardContent>
                      {event.volunteer_needed && (
                        <CardFooter>
                          <a
                            href={getVolunteerLink(event, config, lang)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="whatsapp" size="sm">
                              <Users className="w-4 h-4 mr-2" />
                              {t("events_volunteer", lang)}
                            </Button>
                          </a>
                        </CardFooter>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
