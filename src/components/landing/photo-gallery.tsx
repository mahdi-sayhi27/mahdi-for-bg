"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ImageOff, ArrowRight } from "lucide-react";
import { PLACEHOLDER_TESTIMONIALS } from "@/constants";
import { readManualTestimonials } from "@/lib/local-testimonials";
import { createClientOrNull, hasValidSupabaseEnv } from "@/lib/supabase/client";
import { mergeById } from "@/lib/utils";
import type { Testimonial } from "@/types";

export default function PhotoGallery() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [photos, setPhotos] = useState<Testimonial[]>(PLACEHOLDER_TESTIMONIALS.slice(0, 4));

  useEffect(() => {
    let active = true;

    (async () => {
      if (!hasValidSupabaseEnv()) {
        const manual = readManualTestimonials().filter((t) => t.approved);
        if (active) setPhotos(manual.length > 0 ? manual.slice(0, 4) : PLACEHOLDER_TESTIMONIALS.slice(0, 4));
        return;
      }

      const supabase = createClientOrNull();
      if (!supabase) return;

      const { data, error } = await supabase
        .from("testimonials")
        .select("id, student_name, photo_url, rating, comment, specialty, approved, created_at")
        .eq("approved", true)
        .order("created_at", { ascending: false })
        .limit(4);

      if (!active) return;

      if (error) {
        const manual = readManualTestimonials().filter((t) => t.approved);
        setPhotos(manual.length > 0 ? manual.slice(0, 4) : PLACEHOLDER_TESTIMONIALS.slice(0, 4));
        return;
      }

      const manual = readManualTestimonials().filter((t) => t.approved);
      const combined = mergeById(data ?? [], manual).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
      setPhotos(combined.length > 0 ? combined.slice(0, 4) : PLACEHOLDER_TESTIMONIALS.slice(0, 4));
    })();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="galerie" className="relative py-24 lg:py-32 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sky-400 text-sm font-semibold uppercase tracking-widest">
            Galerie
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4 mb-4">
            Nos <span className="text-gradient">moments</span> en images
          </h2>
          <p className="text-gray-400 text-lg">
            Un aperçu de la galerie photo de nos étudiants
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {photos.map((photo, i) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="group relative aspect-[4/3] rounded-2xl border border-white/10 bg-white/5 overflow-hidden shadow-lg shadow-black/20 hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-300"
            >
              {photo.photo_url ? (
                <Image
                  src={photo.photo_url}
                  alt="Galerie"
                  fill
                  className="object-cover group-hover:scale-[1.05] transition-transform duration-500"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-500">
                  <ImageOff size={22} />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <Link
            href="/testimonials"
            className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-6 py-3 text-sm font-medium text-sky-400 hover:bg-sky-500/20 transition-all"
          >
            Voir toute la galerie
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
