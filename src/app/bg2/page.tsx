"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileText,
  GraduationCap,
} from "lucide-react";
import { GOOGLE_FORMS, STATS } from "@/constants";
import AnimatedCounter from "@/components/animations/animated-counter";
import MeshGradient from "@/components/animations/mesh-gradient";
import dynamic from "next/dynamic";

const FloatingParticles = dynamic(
  () => import("@/components/animations/floating-particles"),
  { ssr: false }
);

const programme = [
  "Révisions – Suites",
  "Analyse 12 – Séries réelles",
  "Probabilités 3 – Notion de probabilité, concepts de base des probabilités et des variables aléatoires",
  "Révisions – Systèmes linéaires, matrices et déterminants",
  "Algèbre linéaire 3 – Espaces vectoriels",
  "Révisions – Intégrales",
  "Analyse 13 – Intégrales généralisées",
  "Probabilités 4 – Variables aléatoires à densité",
  "Algèbre linéaire 4 – Applications linéaires et matrices",
  "Probabilités 5 – Variables aléatoires réelles discrètes",
  "Probabilités 6 – Couples de variables aléatoires discrètes",
  "Algèbre linéaire 5 – Éléments propres : Valeurs propres, vecteurs propres… Polynôme caractéristique, Diagonalisation…",
  "Révisions – Géométrie euclidienne",
  "Géométrie 2 – Produit scalaire dans Rn, Projection orthogonale…",
  "Statistique 2 – Théorèmes limites et statistique inférentielle",
];

const description =
  "BG2 combine consolidation, exercices ciblés et montée en performance pour viser une maîtrise plus avancée des mathématiques, avec un rythme de travail soutenu et des résultats mesurables.";

const remarque =
  "Il est recommandé d’avoir suivi le programme BG1 ou de disposer de bases solides avant de rejoindre BG2, afin de profiter pleinement du rythme accéléré des séances.";

type PanelKey = "programme" | "description" | "remarque" | null;

export default function BG2Page() {
  const [active, setActive] = useState<PanelKey>(null);
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-50px" });

  const toggle = (panel: PanelKey) => setActive((current) => (current === panel ? null : panel));

  return (
    <main className="relative min-h-[85vh] overflow-hidden flex items-center py-16 lg:py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950" />
      <MeshGradient />
      <FloatingParticles />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300"
        >
          <FileText size={14} className="text-cyan-400" />
          Programme BG2
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-5 text-white leading-tight"
        >
          Une préparation <span className="text-gradient">stratégique</span> pour aller plus loin.
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
                : "bg-white/5 border-white/10 hover:border-cyan-400/40 hover:bg-white/[0.08]"
            }`}
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${active === "programme" ? "bg-white/20" : "bg-cyan-500/10"}`}>
              <BookOpen size={20} className={active === "programme" ? "text-white" : "text-cyan-400"} />
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
                : "bg-white/5 border-white/10 hover:border-cyan-400/40 hover:bg-white/[0.08]"
            }`}
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${active === "description" ? "bg-white/20" : "bg-cyan-500/10"}`}>
              <FileText size={20} className={active === "description" ? "text-white" : "text-cyan-400"} />
            </div>
            <span className={`font-semibold ${active === "description" ? "text-white" : "text-gray-200"}`}>
              Description
            </span>
          </button>

          <button
            type="button"
            onClick={() => toggle("remarque")}
            className={`group flex flex-col items-center gap-2 rounded-2xl border px-4 py-6 transition-all duration-300 cursor-pointer ${
              active === "remarque"
                ? "bg-gradient-to-r from-sky-500 to-cyan-400 border-transparent shadow-lg shadow-sky-500/25"
                : "bg-white/5 border-white/10 hover:border-cyan-400/40 hover:bg-white/[0.08]"
            }`}
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${active === "remarque" ? "bg-white/20" : "bg-cyan-500/10"}`}>
              <AlertTriangle size={20} className={active === "remarque" ? "text-white" : "text-cyan-400"} />
            </div>
            <span className={`font-semibold ${active === "remarque" ? "text-white" : "text-gray-200"}`}>
              Remarque
            </span>
          </button>

          <Link
            href={GOOGLE_FORMS.BG2}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-2 rounded-2xl border border-cyan-400/30 bg-white/5 px-4 py-6 font-semibold text-white hover:bg-white/[0.08] hover:border-cyan-300/60 transition-all duration-300"
          >
            <div className="w-11 h-11 rounded-xl bg-cyan-400/15 flex items-center justify-center">
              <GraduationCap size={20} className="text-cyan-300" />
            </div>
            <span className="inline-flex items-center gap-1">
              Inscription
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </span>
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
                {active === "programme" && (
                  <div className="grid gap-2.5 max-h-[60vh] overflow-y-auto pr-2 premium-scroll">
                    {programme.map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-cyan-400" />
                        <p className="text-gray-200 text-sm sm:text-base">{item}</p>
                      </div>
                    ))}
                  </div>
                )}
                {active === "description" && (
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{description}</p>
                )}
                {active === "remarque" && (
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={18} className="mt-0.5 shrink-0 text-orange-400" />
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{remarque}</p>
                  </div>
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
