"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { readManualResultats } from "@/lib/local-resultats";
import { createClientOrNull, hasValidSupabaseEnv } from "@/lib/supabase/client";
import { mergeById } from "@/lib/utils";
import type { Resultat } from "@/types";

const placeholderResultats: Resultat[] = [
  { id: "1", name: "Ahmed Ben Ali", note: "18/20", rang: "2ème / 32", section: "BG1", annee_universitaire: "2025 - 2026", created_at: "2025-01-01T00:00:00.000Z" },
  { id: "2", name: "Sara Mansouri", note: "19/20", rang: "1ère / 30", section: "BG2", annee_universitaire: "2025 - 2026", created_at: "2025-01-01T00:00:00.000Z" },
  { id: "3", name: "Mohamed Trabelsi", note: "17/20", rang: "5ème / 32", section: "BG1", annee_universitaire: "2025 - 2026", created_at: "2025-01-01T00:00:00.000Z" },
  { id: "4", name: "Yasmine Bouazizi", note: "18.5/20", rang: "3ème / 30", section: "BG2", annee_universitaire: "2025 - 2026", created_at: "2025-01-01T00:00:00.000Z" },
  { id: "5", name: "Karim Hammami", note: "16/20", rang: "8ème / 32", section: "BG1", annee_universitaire: "2025 - 2026", created_at: "2025-01-01T00:00:00.000Z" },
  { id: "6", name: "Ines Chaabane", note: "19.5/20", rang: "1ère / 30", section: "BG2", annee_universitaire: "2025 - 2026", created_at: "2025-01-01T00:00:00.000Z" },
];

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length < 2) return { prenom: parts[0] ?? "", nom: "" };
  return { prenom: parts[0], nom: parts.slice(1).join(" ") };
}

export default function ResultatsDetail() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const trackRef = useRef<HTMLDivElement>(null);
  const [resultats, setResultats] = useState<Resultat[]>(placeholderResultats);

  useEffect(() => {
    let active = true;

    (async () => {
      if (!hasValidSupabaseEnv()) {
        const manual = readManualResultats();
        if (active) setResultats(manual.length > 0 ? manual : placeholderResultats);
        return;
      }

      const supabase = createClientOrNull();
      if (!supabase) return;

      const { data, error } = await supabase
        .from("resultats")
        .select("id, name, note, rang, section, annee_universitaire, created_at")
        .order("created_at", { ascending: false });

      if (!active) return;

      if (error) {
        const manual = readManualResultats();
        setResultats(manual.length > 0 ? manual : placeholderResultats);
        return;
      }

      const manual = readManualResultats();
      const combined = mergeById(data ?? [], manual);
      setResultats(combined.length > 0 ? combined : placeholderResultats);
    })();

    return () => {
      active = false;
    };
  }, []);

  // Mobile: auto-scroll the carousel from left to right, pausing while the user interacts.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    let raf: number;
    let paused = false;
    let resumeTimeout: number;

    const step = () => {
      if (!paused && window.innerWidth < 1024) {
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (maxScroll > 0) {
          el.scrollLeft = el.scrollLeft >= maxScroll - 1 ? 0 : el.scrollLeft + 0.6;
        }
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    const pause = () => {
      paused = true;
      window.clearTimeout(resumeTimeout);
    };
    const scheduleResume = () => {
      resumeTimeout = window.setTimeout(() => {
        paused = false;
      }, 2500);
    };

    el.addEventListener("pointerdown", pause);
    el.addEventListener("pointerup", scheduleResume);
    el.addEventListener("pointerleave", scheduleResume);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resumeTimeout);
      el.removeEventListener("pointerdown", pause);
      el.removeEventListener("pointerup", scheduleResume);
      el.removeEventListener("pointerleave", scheduleResume);
    };
  }, []);

  const scrollByCard = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("[data-card]")?.clientWidth ?? 320;
    el.scrollBy({ left: direction * (cardWidth + 24), behavior: "smooth" });
  };

  return (
    <section className="relative py-16 lg:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-sky-400 text-sm font-semibold uppercase tracking-widest">
            Détails
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mt-4 mb-4">
            Classement <span className="text-gradient">détaillé</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Nom, prénom, note et rang de nos étudiants
          </p>
        </motion.div>

        <div className="relative">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="Précédent"
            className="hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 items-center justify-center rounded-full bg-[#29C8E6] text-white shadow-lg shadow-[#29C8E6]/30 hover:scale-105 transition-transform cursor-pointer"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="Suivant"
            className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 items-center justify-center rounded-full bg-[#29C8E6] text-white shadow-lg shadow-[#29C8E6]/30 hover:scale-105 transition-transform cursor-pointer"
          >
            <ChevronRight size={20} />
          </button>

          <div
            ref={trackRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto lg:snap-x lg:snap-mandatory premium-scroll-x pb-6 px-1 -mx-1"
          >
            {resultats.map((result, i) => {
              const { prenom, nom } = splitName(result.name);
              return (
                <motion.div
                  key={result.id}
                  data-card
                  initial={{ opacity: 0, x: 40 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative shrink-0 w-[200px] sm:w-[260px] lg:w-[300px] snap-center"
                >
                  <div
                    className="absolute inset-0 rounded-2xl bg-[#29C8E6] translate-x-[8px] translate-y-[8px] sm:translate-x-[14px] sm:translate-y-[14px]"
                    aria-hidden="true"
                  />

                  <div className="relative h-full rounded-2xl border-2 border-[#29C8E6] bg-[#F5F2F2] p-4 sm:p-6 shadow-[0_12px_35px_rgba(0,0,0,0.08)] transition-all duration-[350ms] ease-out hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(0,0,0,0.14)]">
                    <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-[#333333]">
                      <p><span className="text-[#8A8A8A]">Nom :</span> <span className="font-semibold">{nom || "—"}</span></p>
                      <p><span className="text-[#8A8A8A]">Prénom :</span> <span className="font-semibold">{prenom || "—"}</span></p>
                      <p><span className="text-[#8A8A8A]">Note :</span> <span className="font-bold text-[#F26A44]">{result.note}</span></p>
                      <p><span className="text-[#8A8A8A]">Rang :</span> <span className="font-semibold">{result.rang}</span></p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
