"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, ArrowRight, Sparkles, Zap } from "lucide-react";
import { GOOGLE_FORMS } from "@/constants";

const courseFeatures = [
  "Cours complets de mathématiques",
  "Exercices progressifs",
  "Devoirs corrigés",
  "Suivi personnalisé",
  "Ressources PDF illimitées",
];

export default function Courses() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="courses" className="relative py-24 lg:py-32 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sky-400 text-sm font-semibold uppercase tracking-widest">
            Nos Cours
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4 mb-4">
            Choisissez <span className="text-gradient">votre niveau</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Des programmes adaptés pour BG1 et BG2
          </p>
        </motion.div>

        {/* Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* BG1 Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="group relative rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden hover:border-sky-500/30 transition-all duration-500 hover:shadow-xl hover:shadow-sky-500/10"
          >
            {/* Gradient accent bar */}
            <div className="h-1 bg-gradient-to-r from-sky-400 to-cyan-400" />

            <div className="p-8">
              {/* Badge */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-3xl font-bold text-white">BG1</h3>
                  <p className="text-gray-400 mt-1">Première année</p>
                </div>
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-medium">
                  <Sparkles size={12} />
                  Populaire
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {courseFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-sky-500/10 flex items-center justify-center shrink-0">
                      <Check size={12} className="text-sky-400" />
                    </div>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href={GOOGLE_FORMS.BG1}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 text-white font-semibold text-lg hover:shadow-lg hover:shadow-sky-500/25 transition-all duration-300 group/btn"
              >
                S&apos;inscrire maintenant
                <ArrowRight
                  size={18}
                  className="group-hover/btn:translate-x-1 transition-transform"
                />
              </a>
            </div>

            {/* Hover shimmer */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-br from-sky-500/5 via-transparent to-transparent" />
          </motion.div>

          {/* BG2 Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.35 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="group relative rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden hover:border-cyan-500/30 transition-all duration-500 hover:shadow-xl hover:shadow-cyan-500/10"
          >
            {/* Gradient accent bar */}
            <div className="h-1 bg-gradient-to-r from-cyan-400 to-blue-500" />

            <div className="p-8">
              {/* Badge */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-3xl font-bold text-white">BG2</h3>
                  <p className="text-gray-400 mt-1">Deuxième année</p>
                </div>
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-medium">
                  <Zap size={12} />
                  Avancé
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {courseFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0">
                      <Check size={12} className="text-cyan-400" />
                    </div>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href={GOOGLE_FORMS.BG2}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold text-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 group/btn"
              >
                S&apos;inscrire maintenant
                <ArrowRight
                  size={18}
                  className="group-hover/btn:translate-x-1 transition-transform"
                />
              </a>
            </div>

            {/* Hover shimmer */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
