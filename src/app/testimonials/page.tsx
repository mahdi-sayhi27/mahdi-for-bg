"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ImageOff } from "lucide-react";
import { motion } from "framer-motion";
import { PLACEHOLDER_TESTIMONIALS } from "@/constants";
import { readManualTestimonials } from "@/lib/local-testimonials";
import { createClientOrNull, hasValidSupabaseEnv } from "@/lib/supabase/client";
import type { Testimonial } from "@/types";

export default function TestimonialsGalleryPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(PLACEHOLDER_TESTIMONIALS);
  const [loading, setLoading] = useState(true);
  const [supabaseUnavailable, setSupabaseUnavailable] = useState(false);

  useEffect(() => {
    const loadTestimonials = async () => {
      if (!hasValidSupabaseEnv()) {
        setSupabaseUnavailable(true);
        const manualTestimonials = readManualTestimonials();
        setTestimonials(manualTestimonials.length > 0 ? manualTestimonials : PLACEHOLDER_TESTIMONIALS);
        setLoading(false);
        return;
      }

      const supabase = createClientOrNull();
      if (!supabase) {
        setSupabaseUnavailable(true);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("testimonials")
        .select("id, student_name, photo_url, rating, comment, specialty, approved, created_at")
        .eq("approved", true)
        .order("created_at", { ascending: false });

      if (error || !data) {
        setSupabaseUnavailable(true);
        const manualTestimonials = readManualTestimonials();
        setTestimonials(manualTestimonials.length > 0 ? manualTestimonials : PLACEHOLDER_TESTIMONIALS);
        setLoading(false);
        return;
      }

      setTestimonials(data);
      setLoading(false);
    };

    void loadTestimonials();
  }, []);

  return (
    <main className="relative overflow-hidden py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-200 transition-colors hover:bg-white/10"
        >
          <ArrowLeft size={16} />
          Retour
        </Link>

        <div className="mt-8 text-center max-w-3xl mx-auto">
          <span className="text-sky-400 text-sm font-semibold uppercase tracking-widest">Photo Gallery</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4 mb-4">
            Galerie
          </h1>
          <p className="text-gray-400 text-lg">Les moments et résultats de nos étudiants, en images.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
          {testimonials.map((t, i) => (
            <motion.article
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.04 }}
              className="group mb-5 break-inside-avoid rounded-3xl border border-white/10 bg-white/5 shadow-xl shadow-black/20 overflow-hidden hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-300"
            >
              <div className="relative w-full min-h-52 bg-gray-900/70">
                {t.photo_url ? (
                  <Image
                    src={t.photo_url}
                    alt="Galerie"
                    width={900}
                    height={1200}
                    className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                ) : (
                  <div className="h-56 flex items-center justify-center text-gray-500">
                    <ImageOff size={24} />
                  </div>
                )}
              </div>
            </motion.article>
          ))}
        </div>

        {!loading && testimonials.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-gray-300">
            Aucun témoignage approuvé pour le moment.
          </div>
        )}

        {!loading && supabaseUnavailable && (
          <div className="mt-4 rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-5 text-center text-yellow-200">
            Mode local activé. Les témoignages saisis manuellement s’affichent dans ce navigateur tant que Supabase n’est pas configuré.
          </div>
        )}
      </div>
    </main>
  );
}