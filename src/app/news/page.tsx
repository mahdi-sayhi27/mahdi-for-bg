"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Newspaper, CalendarDays, UserRound, Pin } from "lucide-react";
import { fetchPublishedAnnouncements } from "@/lib/announcements";
import { getCategoryConfig } from "@/constants";
import { markAnnouncementsAsRead } from "@/lib/local-announcements";
import type { Announcement } from "@/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-TN", { day: "numeric", month: "long", year: "numeric" });
}

function CategoryBadge({ category }: { category: Announcement["category"] }) {
  const config = getCategoryConfig(category);
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
      style={{ backgroundColor: config.bg, color: config.color }}
    >
      <config.icon size={12} />
      {config.label}
    </span>
  );
}

function CardCover({ announcement }: { announcement: Announcement }) {
  const config = getCategoryConfig(announcement.category);
  if (announcement.cover_image) {
    return (
      <Image
        src={announcement.cover_image}
        alt={announcement.title}
        fill
        className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
      />
    );
  }
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: `linear-gradient(135deg, ${config.bg}, rgba(10,37,64,0.06))` }}
    >
      <config.icon size={36} style={{ color: config.color }} className="opacity-70" />
    </div>
  );
}

export default function NewsCenterPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    markAnnouncementsAsRead();
    let active = true;

    (async () => {
      const { announcements: data } = await fetchPublishedAnnouncements();
      if (active) {
        setAnnouncements(data);
        setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const featured = useMemo(
    () => announcements.find((a) => a.featured) ?? announcements[0] ?? null,
    [announcements]
  );

  return (
    <main className="relative min-h-screen">
      <section className="relative bg-[#ffffff] pt-20 pb-16 lg:pt-28 lg:pb-24 px-4 overflow-hidden min-h-screen">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-sky-100/60 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0A2540]/5 border border-[#0A2540]/10 text-sm text-[#0A2540]/70">
              <Newspaper size={14} />
              News Center
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A2540] mt-5">
              Actualités &amp; Annonces
            </h1>
            <p className="text-[#6b7280] mt-3 max-w-xl mx-auto">
              Toute l&apos;actualité de Maths Pour BG : événements, examens, plannings et opportunités.
            </p>
          </div>

          {loading ? (
            <div className="rounded-[28px] bg-[#f3f4f6] border border-[#e5e7eb] h-64 animate-pulse" />
          ) : featured ? (
            <Link
              href={`/news/${featured.slug}`}
              className="group grid grid-cols-1 md:grid-cols-2 gap-0 rounded-[28px] bg-[#ffffff] border border-[#f3f4f6] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.1)] hover:shadow-[0_25px_70px_rgba(0,0,0,0.16)] transition-all duration-500"
            >
              <div className="relative h-56 md:h-full min-h-[220px]">
                <CardCover announcement={featured} />
                {featured.pinned && (
                  <span className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-[#0A2540]/90 text-white text-xs font-medium px-3 py-1">
                    <Pin size={11} /> À la une
                  </span>
                )}
              </div>
              <div className="p-6 sm:p-8 flex flex-col justify-center">
                <CategoryBadge category={featured.category} />
                <h2 className="text-xl sm:text-2xl font-bold text-[#0A2540] mt-4 leading-snug group-hover:text-sky-600 transition-colors">
                  {featured.title}
                </h2>
                <p className="text-[#6b7280] mt-3 leading-relaxed line-clamp-3">{featured.description}</p>
                <div className="flex items-center gap-4 mt-5 text-xs text-[#9ca3af]">
                  <span className="inline-flex items-center gap-1.5">
                    <UserRound size={13} /> {featured.author}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays size={13} /> {formatDate(featured.publish_date)}
                  </span>
                </div>
              </div>
            </Link>
          ) : null}
        </div>
      </section>
    </main>
  );
}
