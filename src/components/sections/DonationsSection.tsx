"use client";

import { Heart, ExternalLink } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { t } from "@/lib/i18n";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { DonationCampaign } from "@/lib/types";

function formatCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

export function DonationsSection({
  donations,
}: {
  donations: DonationCampaign[];
}) {
  const { lang, isRTL } = useLanguage();

  if (donations.length === 0) {
    return (
      <section id="donate" className="py-16 bg-warmWhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center font-amiri">
            {t("donations_title", lang)}
          </h2>
          <p className="text-center text-warmGray-500">
            {t("donations_empty", lang)}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="donate" className="py-16 bg-warmWhite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-primary mb-8 text-center font-amiri">
          {t("donations_title", lang)}
        </h2>

        {/* Gold decorative line */}
        <div className="flex justify-center mb-10">
          <div className="w-24 h-1 bg-accent rounded-full" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {donations.map((donation) => {
            const title = isRTL
              ? donation.title_ar || donation.title_en
              : donation.title_en;
            const description = isRTL
              ? donation.description_ar || donation.description_en
              : donation.description_en;
            const hasGoal = donation.goal_amount > 0;
            const progress = hasGoal
              ? Math.min(
                  Math.round(
                    (donation.current_amount / donation.goal_amount) * 100
                  ),
                  100
                )
              : 0;

            return (
              <Card key={donation.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="w-5 h-5 text-accent" />
                    <CardTitle className="text-primary font-amiri">
                      {title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-warmGray-500 text-sm leading-relaxed mb-4">
                    {description}
                  </p>

                  {hasGoal && (
                    <div className="space-y-2">
                      <Progress value={progress} />
                      <div className="flex justify-between text-sm">
                        <span className="text-warmGray-500">
                          {t("donations_raised", lang)}:{" "}
                          <span className="font-semibold text-primary">
                            {formatCurrency(
                              donation.current_amount,
                              donation.currency
                            )}
                          </span>
                        </span>
                        <span className="text-warmGray-400">
                          {t("donations_goal", lang)}:{" "}
                          {formatCurrency(
                            donation.goal_amount,
                            donation.currency
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <a
                    href={donation.donate_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button variant="accent" className="w-full">
                      <Heart className="w-4 h-4 mr-2" />
                      {t("donations_donate_now", lang)}
                      <ExternalLink className="w-3 h-3 ml-2" />
                    </Button>
                  </a>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
