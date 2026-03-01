"use client";

import { LanguageProvider } from "@/lib/language-context";
import { Navbar } from "@/components/sections/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { AnnouncementsSection } from "@/components/sections/AnnouncementsSection";
import { EventsSection } from "@/components/sections/EventsSection";
import { DonationsSection } from "@/components/sections/DonationsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { Footer } from "@/components/sections/Footer";
import type { SiteData } from "@/lib/get-data";

export function MasjidHubApp({ data }: { data: SiteData }) {
  return (
    <LanguageProvider>
      <Navbar config={data.config} />
      <main>
        <HeroSection config={data.config} />
        <AnnouncementsSection announcements={data.announcements} />
        <EventsSection events={data.events} config={data.config} />
        <DonationsSection donations={data.donations} />
        <ContactSection config={data.config} />
      </main>
      <Footer config={data.config} />
    </LanguageProvider>
  );
}
