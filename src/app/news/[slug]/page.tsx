"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, UserRound, Tag, Newspaper } from "lucide-react";
import { fetchPublishedAnnouncements } from "@/lib/announcements";
import { getCategoryConfig } from "@/constants";
import type { Announcement } from "@/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-TN", { day: "numeric", month: "long", year: "numeric" });
}

export default function NewsArticlePage() {
  const params = useParams<{ slug: string }>();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { announcements } = await fetchPublishedAnnouncements();
      const found = announcements.find((a) => a.slug === params.slug) ?? null;
      if (active) {
        setAnnouncement(found);
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [params.slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-950 py-24 px-4">
        <div className="max-w-3xl mx-auto animate-pulse space-y-4">
          <div className="h-6 w-32 bg-white/5 rounded-full" />
          <div className="h-10 w-3/4 bg-white/5 rounded" />
          <div className="h-72 w-full bg-white/5 rounded-3xl" />
        </div>
      </main>
    );
  }

  if (!announcement) {
    return (
      <main className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-24">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
            <Newspaper size={26} className="text-gray-500" />
          </div>
          <h1 className="text-white font-semibold text-xl">Article introuvable</h1>
          <p className="text-gray-400 mt-2">Cette actualité n&apos;existe pas ou a été dépubliée.</p>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-gray-200 hover:bg-white/10 transition-all"
          >
            <ArrowLeft size={15} />
            Retour au News Center
          </Link>
        </div>
      </main>
    );
  }

  const config = getCategoryConfig(announcement.category);

  return (
    <main className="relative min-h-screen bg-gray-950">
      <section className="relative bg-[#0A2540] pt-20 pb-24 px-4">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={15} />
            Retour au News Center
          </Link>

          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
            style={{ backgroundColor: config.bg, color: config.color }}
          >
            <config.icon size={12} />
            {config.label}
          </span>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-5 leading-tight">
            {announcement.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mt-5 text-sm text-white/60">
            <span className="inline-flex items-center gap-1.5">
              <UserRound size={14} /> {announcement.author}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={14} /> {formatDate(announcement.publish_date)}
            </span>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 -mt-14 pb-24">
        {announcement.cover_image && (
          <div className="relative w-full h-64 sm:h-80 rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)] mb-10">
            <Image src={announcement.cover_image} alt={announcement.title} fill className="object-cover" />
          </div>
        )}

        <div
          className="rounded-3xl p-6 sm:p-10 shadow-[0_12px_35px_rgba(0,0,0,0.08)] prose-content"
          style={{ backgroundColor: "rgba(255,255,255,0.95)" }}
          dangerouslySetInnerHTML={{ __html: announcement.content }}
        />

        {announcement.images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
            {announcement.images.map((src, i) => (
              <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-white/10">
                <Image src={src} alt={`${announcement.title} ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        )}

        {announcement.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8">
            {announcement.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-gray-300"
              >
                <Tag size={11} />
                {tag}
              </span>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
