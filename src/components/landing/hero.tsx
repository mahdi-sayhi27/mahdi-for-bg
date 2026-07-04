"use client";

import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, Users, BookOpenCheck, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import MeshGradient from "@/components/animations/mesh-gradient";
import dynamic from "next/dynamic";

// Dynamic import with ssr:false to prevent hydration mismatch from Math.random()
const FloatingParticles = dynamic(
  () => import("@/components/animations/floating-particles"),
  { ssr: false }
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.18 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative pt-14 pb-16 lg:pt-24 lg:pb-24 overflow-hidden"
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950" />
      <MeshGradient />
      <FloatingParticles />

      {/* Radial glow center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center"
      >
        <motion.div
          variants={itemVariants}
          className="mx-auto w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-[#ffffff] overflow-hidden shadow-2xl shadow-sky-500/10 mb-8"
        >
          <Image
            src="/logo.png"
            alt="Maths Pour BG"
            width={320}
            height={320}
            className="w-full h-full object-cover"
            priority
          />
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.05]"
        >
          <span className="text-white">Préparez</span>{" "}
          <span className="text-gradient">votre réussite</span>
          <br />
          <span className="text-white">en mathématiques.</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg text-gray-400 max-w-xl mx-auto mt-6 leading-relaxed"
        >
          Un parcours clair, exigeant et moderne pour les élèves BG1 et BG2,
          avec un suivi premium et une préparation structurée.
        </motion.p>

        <motion.p
          variants={itemVariants}
          className="text-sm uppercase tracking-[0.24em] text-sky-300/90 mt-4"
        >
          Admission en ligne - places limitées
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 max-w-xl mx-auto"
        >
          <Link
            href="/bg1"
            className="group flex flex-col items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-5 shadow-lg shadow-sky-500/20 hover:shadow-xl hover:shadow-sky-500/30 hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <GraduationCap size={18} className="text-white" />
            </div>
            <span className="text-xs uppercase tracking-[0.22em] text-white/80">BG1</span>
            <span className="text-lg font-semibold text-white inline-flex items-center gap-1">
              Première année
              <ArrowRight className="transition-transform group-hover:translate-x-1" size={16} />
            </span>
          </Link>

          <Link
            href="/bg2"
            className="group flex flex-col items-center gap-2 rounded-2xl border border-cyan-400/30 bg-white/5 px-4 py-5 shadow-lg shadow-black/20 hover:bg-white/[0.09] hover:border-cyan-300/60 hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-400/15 flex items-center justify-center">
              <GraduationCap size={18} className="text-cyan-300" />
            </div>
            <span className="text-xs uppercase tracking-[0.22em] text-cyan-300">BG2</span>
            <span className="text-lg font-semibold text-white inline-flex items-center gap-1">
              Deuxième année
              <ArrowRight className="transition-transform group-hover:translate-x-1" size={16} />
            </span>
          </Link>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="relative mt-10 max-w-xl mx-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 sm:p-8 text-left overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

          <h2 className="relative text-lg sm:text-xl font-semibold text-white text-center">
            Pourquoi nous rejoindre ?
          </h2>

          <div className="relative mt-6 space-y-5">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500/20 to-cyan-400/20 border border-sky-400/20 flex items-center justify-center">
                <Users size={20} className="text-sky-300" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm sm:text-base">
                  Professeurs expérimentés
                </h3>
                <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                  Un encadrement de qualité, pensé pour chaque élève de BG1 et BG2.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500/20 to-cyan-400/20 border border-sky-400/20 flex items-center justify-center">
                <BookOpenCheck size={20} className="text-sky-300" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm sm:text-base">
                  Méthode structurée
                </h3>
                <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                  Explications claires, exercices ciblés et corrections détaillées à chaque séance.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500/20 to-cyan-400/20 border border-sky-400/20 flex items-center justify-center">
                <TrendingUp size={20} className="text-sky-300" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm sm:text-base">
                  Progression rapide
                </h3>
                <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                  Un suivi personnalisé qui a déjà fait ses preuves pour aborder les examens en confiance.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
