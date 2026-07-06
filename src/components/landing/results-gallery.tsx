"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { readManualResults } from "@/lib/local-results";
import { createClientOrNull, hasValidSupabaseEnv } from "@/lib/supabase/client";
import { mergeById } from "@/lib/utils";
import type { Result } from "@/types";

const placeholderResults: Result[] = [
  {
    id: "1",
    student_name: "Ahmed Ben Ali",
    specialty: "BG1",
    score: "18/20",
    description:
      "Grâce à Maths Pour BG, j'ai vraiment repris confiance en moi en mathématiques. Le suivi personnalisé m'a permis de combler mes lacunes dès le premier trimestre, et les exercices proposés étaient toujours adaptés à mon niveau. J'ai obtenu 18/20 au contrôle de synthèse, un résultat que je n'aurais jamais imaginé possible en début d'année. Je recommande vivement cette plateforme à tous les élèves de BG1 qui veulent progresser sérieusement.",
    screenshot_url: "",
    created_at: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    student_name: "Sara Mansouri",
    specialty: "BG2",
    score: "19/20",
    description:
      "Une expérience exceptionnelle du début à la fin. Les cours sont structurés, clairs et surtout très bien rythmés, ce qui m'a permis de rester motivée toute l'année. Je suis passée première de ma classe en mathématiques après seulement deux trimestres de suivi. La méthode de travail proposée est vraiment différente de ce que j'avais l'habitude de voir, et elle porte ses fruits rapidement.",
    screenshot_url: "",
    created_at: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "3",
    student_name: "Mohamed Trabelsi",
    specialty: "BG1",
    score: "17/20",
    description:
      "J'étais moyen en maths depuis le collège et je pensais que ça ne changerait jamais. Avec un accompagnement régulier et des explications claires à chaque séance, j'ai progressé de façon constante tout au long du deuxième trimestre. Le fait de pouvoir revenir sur les notions mal comprises sans jugement a fait toute la différence pour moi.",
    screenshot_url: "",
    created_at: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "4",
    student_name: "Yasmine Bouazizi",
    specialty: "BG2",
    score: "18.5/20",
    description:
      "Le bac blanc était pour moi une source de stress énorme, mais la préparation intensive proposée par Maths Pour BG m'a permis d'aborder l'épreuve avec beaucoup plus de sérénité. Le résultat a dépassé toutes mes attentes. Les fiches de méthode et les corrections détaillées ont été des outils précieux pendant toute ma révision.",
    screenshot_url: "",
    created_at: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "5",
    student_name: "Karim Hammami",
    specialty: "BG1",
    score: "16/20",
    description:
      "Ce que j'apprécie le plus, c'est la régularité du suivi tout au long de l'année scolaire. Chaque séance s'appuie sur la précédente, ce qui donne une vraie sensation de progression continue plutôt que des révisions ponctuelles. Mon niveau s'est amélioré petit à petit, sans jamais me sentir dépassé par le programme.",
    screenshot_url: "",
    created_at: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "6",
    student_name: "Ines Chaabane",
    specialty: "BG2",
    score: "19.5/20",
    description:
      "Meilleure note de toute la promotion cette année, et je le dois clairement à la qualité de l'encadrement reçu. Les explications sont précises, les exemples toujours pertinents, et surtout on sent que le professeur s'investit réellement dans la réussite de chaque étudiant. Une préparation sérieuse pour un résultat à la hauteur des efforts fournis.",
    screenshot_url: "",
    created_at: "2025-01-01T00:00:00.000Z",
  },
];

export default function ResultsGallery() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const trackRef = useRef<HTMLDivElement>(null);
  const [results, setResults] = useState<Result[]>(placeholderResults);

  useEffect(() => {
    let active = true;

    (async () => {
      if (!hasValidSupabaseEnv()) {
        const manual = readManualResults();
        if (active) setResults(manual.length > 0 ? manual : placeholderResults);
        return;
      }

      const supabase = createClientOrNull();
      if (!supabase) return;

      const { data, error } = await supabase
        .from("results")
        .select("id, student_name, specialty, score, screenshot_url, description, created_at")
        .order("created_at", { ascending: false });

      if (!active) return;

      if (error) {
        const manual = readManualResults();
        setResults(manual.length > 0 ? manual : placeholderResults);
        return;
      }

      // Merge in anything saved only to the local fallback (e.g. an admin write
      // Supabase RLS rejected because there's no real authenticated admin session yet).
      const manual = readManualResults();
      const combined = mergeById(data ?? [], manual);
      setResults(combined.length > 0 ? combined : placeholderResults);
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
    const cardWidth = el.querySelector("[data-card]")?.clientWidth ?? 360;
    el.scrollBy({ left: direction * (cardWidth + 32), behavior: "smooth" });
  };

  return (
    <section id="temoignages" className="relative py-24 lg:py-32 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sky-400 text-sm font-semibold uppercase tracking-widest">
            Témoignages
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4 mb-4">
            La preuve par les{" "}
            <span className="text-gradient">témoignages</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Les succès de nos étudiants parlent d&apos;eux-mêmes
          </p>
        </motion.div>

        {/* Results — horizontal scroll carousel */}
        <div className="relative">
          {/* Desktop arrow controls */}
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
            className="flex gap-4 sm:gap-6 lg:gap-8 overflow-x-auto lg:snap-x lg:snap-mandatory premium-scroll-x pb-6 px-1 -mx-1"
          >
            {results.map((result, i) => (
              <motion.div
                key={result.id}
                data-card
                initial={{ opacity: 0, x: 40 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative shrink-0 w-[220px] sm:w-[300px] lg:w-[360px] snap-center"
              >
                {/* Offset stacked-paper rectangle */}
                <div
                  className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-[#29C8E6] translate-x-[10px] translate-y-[10px] sm:translate-x-[18px] sm:translate-y-[18px]"
                  aria-hidden="true"
                />

                {/* Card */}
                <div className="relative h-full rounded-2xl sm:rounded-3xl border-2 border-[#29C8E6] bg-[#F5F2F2] p-4 sm:p-6 lg:p-8 shadow-[0_12px_35px_rgba(0,0,0,0.08)] transition-all duration-[350ms] ease-out hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(0,0,0,0.14)]">
                  <h3 className="text-lg sm:text-2xl lg:text-[36px] font-bold leading-tight text-[#222222]">
                    {result.student_name}
                  </h3>
                  <p className="mt-1 sm:mt-2 text-xs sm:text-sm lg:text-base text-[#8A8A8A]">
                    Recommande ⭐ Maths Pour BG
                  </p>
                  <p className="mt-1 sm:mt-3 text-base sm:text-xl lg:text-[26px] font-bold text-[#F26A44]">
                    Note : {result.score}
                  </p>

                  <div className="mt-2 sm:mt-4 lg:mt-6 h-20 sm:h-32 lg:h-44 overflow-y-auto overflow-x-hidden pr-2 premium-scroll">
                    <p className="text-xs sm:text-base lg:text-[20px] leading-[1.5] sm:leading-[1.7] lg:leading-[1.8] text-[#333333]">
                      {result.description}
                    </p>
                  </div>

                  <div className="mt-2 sm:mt-4 lg:mt-6 inline-flex items-center gap-2 rounded-full bg-[#29C8E6]/15 px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-medium text-[#1A9DB8]">
                    {result.specialty}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
