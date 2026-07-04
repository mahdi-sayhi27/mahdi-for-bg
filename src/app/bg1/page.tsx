"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, CircleHelp, FileText, GraduationCap } from "lucide-react";
import { GOOGLE_FORMS, STATS } from "@/constants";
import AnimatedCounter from "@/components/animations/animated-counter";
import MeshGradient from "@/components/animations/mesh-gradient";
import dynamic from "next/dynamic";

const FloatingParticles = dynamic(
  () => import("@/components/animations/floating-particles"),
  { ssr: false }
);

const programme = [
  {
    semester: "Premier semestre",
    items: [
      "Outils 1 – Vocabulaire de la logique et des ensembles",
      "Outils 2 – Nombres",
      "Outils 3 – Trigonométrie",
      "Outils 4 – Méthodes de calcul",
      "Outils 5 – Vocabulaire des applications",
      "Outils 6 – Dénombrement",
      "Analyse 1 – Suites usuelles",
      "Analyse 2 – Fonctions usuelles",
      "Analyse 3 – Dérivées et primitives",
      "Analyse 4 – Équations différentielles linéaires à coefficients constants",
      "Algèbre linéaire 1 – Systèmes linéaires",
      "Algèbre linéaire 2 – Matrices et déterminants",
      "Géométrie 1",
      "Algèbre – Polynômes",
      "Statistique 1 – Statistique descriptive",
      "Analyse 5 – Suites réelles",
    ],
  },
  {
    semester: "Second semestre",
    items: [
      "Probabilités 1 – Concepts de base des probabilités",
      "Analyse 6 – Limites, continuité",
      "Analyse 7 – Dérivation",
      "Analyse 8 – Développements limités et études de fonctions",
      "Algèbre linéaire 3 – Espaces vectoriels et sous-espaces vectoriels",
      "Algèbre linéaire 4 – Applications linéaires et matrices",
      "Analyse 9 – Intégration",
      "Analyse 10 – Équations différentielles",
      "Analyse 11 – Fonctions réelles de deux variables réelles",
      "Probabilités 2 – Variables aléatoires finies",
    ],
  },
];

const description =
  "BG1 met l’accent sur la clarté, la méthode et la régularité afin d’installer des réflexes durables et une progression sereine, pour bien démarrer l’année en mathématiques.";

type PanelKey = "programme" | "description" | null;

export default function BG1Page() {
  const [active, setActive] = useState<PanelKey>(null);
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-50px" });

  const toggle = (panel: PanelKey) => setActive((current) => (current === panel ? null : panel));

  return (
    <main className="relative min-h-[85vh] overflow-hidden flex items-center py-16 lg:py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950" />
      <MeshGradient />
      <FloatingParticles />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300"
        >
          <CircleHelp size={14} className="text-sky-400" />
          Programme BG1
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-5 text-white leading-tight"
        >
          Une base <span className="text-gradient">solide</span> pour bien démarrer.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="mt-10 grid grid-cols-2 gap-4 max-w-md mx-auto"
        >
          <button
            type="button"
            onClick={() => toggle("programme")}
            className={`group flex flex-col items-center gap-2 rounded-2xl border px-4 py-6 transition-all duration-300 cursor-pointer ${
              active === "programme"
                ? "bg-gradient-to-r from-sky-500 to-cyan-400 border-transparent shadow-lg shadow-sky-500/25"
                : "bg-white/5 border-white/10 hover:border-sky-400/40 hover:bg-white/[0.08]"
            }`}
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${active === "programme" ? "bg-white/20" : "bg-sky-500/10"}`}>
              <BookOpen size={20} className={active === "programme" ? "text-white" : "text-sky-400"} />
            </div>
            <span className={`font-semibold ${active === "programme" ? "text-white" : "text-gray-200"}`}>
              Programme
            </span>
          </button>

          <button
            type="button"
            onClick={() => toggle("description")}
            className={`group flex flex-col items-center gap-2 rounded-2xl border px-4 py-6 transition-all duration-300 cursor-pointer ${
              active === "description"
                ? "bg-gradient-to-r from-sky-500 to-cyan-400 border-transparent shadow-lg shadow-sky-500/25"
                : "bg-white/5 border-white/10 hover:border-sky-400/40 hover:bg-white/[0.08]"
            }`}
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${active === "description" ? "bg-white/20" : "bg-sky-500/10"}`}>
              <FileText size={20} className={active === "description" ? "text-white" : "text-sky-400"} />
            </div>
            <span className={`font-semibold ${active === "description" ? "text-white" : "text-gray-200"}`}>
              Description
            </span>
          </button>

          <Link
            href={GOOGLE_FORMS.BG1}
            target="_blank"
            rel="noopener noreferrer"
            className="col-span-2 group flex items-center justify-center gap-2 rounded-2xl border border-cyan-400/30 bg-white/5 px-4 py-6 font-semibold text-white hover:bg-white/[0.08] hover:border-cyan-300/60 transition-all duration-300"
          >
            <div className="w-11 h-11 rounded-xl bg-cyan-400/15 flex items-center justify-center">
              <GraduationCap size={20} className="text-cyan-300" />
            </div>
            Inscription
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <AnimatePresence mode="wait">
          {active && (
            <motion.div
              key={active}
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div
                className={`mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-7 text-left mx-auto ${
                  active === "programme" ? "max-w-2xl" : "max-w-md"
                }`}
              >
                {active === "programme" ? (
                  <div className="grid gap-6 max-h-[60vh] overflow-y-auto pr-2 premium-scroll">
                    {programme.map((section) => (
                      <div key={section.semester}>
                        <p className="text-xs font-semibold uppercase tracking-widest text-sky-400 mb-3">
                          {section.semester}
                        </p>
                        <div className="grid gap-2.5">
                          {section.items.map((item) => (
                            <div key={item} className="flex items-start gap-3">
                              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-sky-400" />
                              <p className="text-gray-200 text-sm sm:text-base">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{description}</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={statsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-3xl mx-auto border-t border-white/10 pt-10"
        >
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center ${i < STATS.length - 1 ? "lg:border-r lg:border-white/10" : ""}`}
            >
              <div className="text-2xl sm:text-3xl font-bold text-gradient">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
