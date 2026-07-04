"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { STATS } from "@/constants";
import AnimatedCounter from "@/components/animations/animated-counter";

export default function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section
      id="stats"
      ref={ref}
      className="relative py-20 px-4 border-y border-white/5 overflow-hidden"
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 via-transparent to-cyan-500/5 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`text-center ${
                i < STATS.length - 1
                  ? "md:border-r md:border-white/10"
                  : ""
              }`}
            >
              <motion.div
                className="relative mx-auto mb-4 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center"
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3,
                }}
              >
                <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-500/20 to-cyan-400/20 animate-pulse" />
                <span className="relative flex items-center justify-center w-full h-full rounded-2xl bg-gradient-to-br from-sky-500/15 to-cyan-400/15 border border-sky-400/20">
                  <stat.icon size={26} className="text-sky-300" />
                </span>
              </motion.div>

              <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-gradient mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-gray-400 text-base sm:text-lg">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
