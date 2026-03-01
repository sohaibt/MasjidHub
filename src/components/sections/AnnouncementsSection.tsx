"use client";

import { useLanguage } from "@/lib/language-context";
import { t } from "@/lib/i18n";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Announcement } from "@/lib/types";

function formatDate(dateStr: string, lang: string): string {
  try {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function AnnouncementsSection({
  announcements,
}: {
  announcements: Announcement[];
}) {
  const { lang, isRTL } = useLanguage();

  if (announcements.length === 0) {
    return (
      <section id="announcements" className="py-16 bg-warmWhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center font-amiri">
            {t("announcements_title", lang)}
          </h2>
          <p className="text-center text-warmGray-500">
            {t("announcements_empty", lang)}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="announcements" className="py-16 bg-warmWhite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-primary mb-8 text-center font-amiri">
          {t("announcements_title", lang)}
        </h2>

        {/* Gold decorative line */}
        <div className="flex justify-center mb-10">
          <div className="w-24 h-1 bg-accent rounded-full" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {announcements.map((announcement) => {
            const title = isRTL
              ? announcement.title_ar || announcement.title_en
              : announcement.title_en;
            const body = isRTL
              ? announcement.body_ar || announcement.body_en
              : announcement.body_en;

            return (
              <Card
                key={announcement.id}
                className={
                  announcement.is_pinned
                    ? "border-accent-300 bg-accent-50/30"
                    : ""
                }
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      {announcement.is_pinned && (
                        <Badge variant="pinned" className="mb-2">
                          📌 {t("announcements_pinned", lang)}
                        </Badge>
                      )}
                      <CardTitle className="text-primary font-amiri">
                        {title}
                      </CardTitle>
                    </div>
                  </div>
                  <p className="text-xs text-warmGray-400 mt-1">
                    {formatDate(announcement.date, lang)}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-warmGray-500 text-sm leading-relaxed">
                    {body}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
