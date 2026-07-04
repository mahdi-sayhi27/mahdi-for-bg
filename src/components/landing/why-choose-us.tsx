"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  GraduationCap,
  BookOpen,
  Brain,
  Rocket,
  Users,
  Trophy,
} from "lucide-react";

const features = [
  {
    icon: GraduationCap,
    title: "Professeur Expert",
    desc: "Plus de 10 ans d'expérience dans l'enseignement des mathématiques.",
  },
  {
    icon: BookOpen,
    title: "Cours Modernes",
    desc: "Programme actualisé et méthodes d'enseignement innovantes.",
  },
  {
    icon: Brain,
    title: "Exercices Interactifs",
    desc: "Des exercices variés pour maîtriser chaque concept.",
  },
  {
    icon: Rocket,
    title: "Progrès Rapide",
    desc: "Des résultats visibles dès les premières semaines.",
  },
  {
    icon: Users,
    title: "Suivi Personnalisé",
    desc: "Un accompagnement adapté à chaque étudiant.",
  },
  {
    icon: Trophy,
    title: "Résultats Excellents",
    desc: "98% de taux de réussite chez nos étudiants.",
  },
];

export default function WhyChooseUs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="why-us" className="relative py-24 lg:py-32 px-4">
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
            Pourquoi Nous Choisir
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4 mb-4">
            L&apos;excellence au service de{" "}
            <span className="text-gradient">votre réussite</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Découvrez ce qui nous distingue
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{
                scale: 1.02,
                borderColor: "rgba(56, 189, 248, 0.3)",
              }}
              className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/[0.08] transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/5"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-sky-500/10 flex items-center justify-center mb-5 group-hover:bg-sky-500/20 transition-colors">
                <feature.icon className="w-7 h-7 text-sky-400" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">{feature.desc}</p>

              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-sky-500/5 via-transparent to-cyan-500/5" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
