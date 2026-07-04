"use client";

import { motion } from "framer-motion";
import { BarChart3, Users, TrendingUp, PieChart } from "lucide-react";

const months = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];
const barData = [35, 55, 40, 70, 50, 85, 60, 78, 55, 90, 68, 82];

export default function AnalyticsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white mb-6">Analytique</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Visiteurs ce mois", value: "2,847", icon: Users, change: "+18%" },
            { label: "Taux de conversion", value: "12.5%", icon: TrendingUp, change: "+2.1%" },
            { label: "Nouvelles inscriptions", value: "64", icon: BarChart3, change: "+24%" },
            { label: "Taux de rétention", value: "94%", icon: PieChart, change: "+1%" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center"><s.icon size={18} className="text-sky-400" /></div>
                <span className="text-green-400 text-xs font-medium">{s.change}</span>
              </div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-gray-400 text-sm mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Inscriptions par mois</h2>
            <div className="flex items-end gap-3 h-48">
              {barData.map((h, i) => (
                <motion.div key={`bar-${i}`} initial={{ height: 0 }} animate={{ height: `${h}%` }}
                  transition={{ delay: 0.5 + i * 0.05, duration: 0.5 }}
                  className="flex-1 rounded-t-lg bg-gradient-to-t from-sky-500/40 to-cyan-400/40 hover:from-sky-500/60 hover:to-cyan-400/60 transition-colors cursor-pointer relative group"
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {h} inscrits
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-gray-500 text-[10px]">
              {months.map((m, i) => <span key={`month-${i}`}>{m}</span>)}
            </div>
          </motion.div>

          {/* Course Distribution */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Répartition par cours</h2>
            <div className="flex items-center justify-center gap-8">
              <div className="relative w-40 h-40">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#38bdf8" strokeWidth="3" strokeDasharray="58 42" strokeLinecap="round" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#22d3ee" strokeWidth="3" strokeDasharray="42 58" strokeDashoffset="-58" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">524</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-sky-400" /><span className="text-gray-300 text-sm">BG1 — 58%</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-cyan-400" /><span className="text-gray-300 text-sm">BG2 — 42%</span></div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
