"use client";

import { motion } from "framer-motion";
import { Trophy, MessageSquare, BookOpen, TrendingUp, Activity, Bell } from "lucide-react";

const statsCards = [
  { label: "Résultats Publiés", value: "156", change: "+8%", icon: Trophy, color: "cyan" },
  { label: "Témoignages", value: "48", change: "+3", icon: MessageSquare, color: "blue" },
  { label: "Annonces", value: "12", change: "+2", icon: Bell, color: "sky" },
  { label: "Cours Actifs", value: "2", change: "BG1 & BG2", icon: BookOpen, color: "indigo" },
];

const recentActivity = [
  { action: "Témoignage soumis", name: "Sara Mansouri", time: "Il y a 15 min", type: "testimonial" },
  { action: "Résultat ajouté", name: "Mohamed Trabelsi — 18/20", time: "Il y a 1h", type: "result" },
  { action: "Annonce publiée", name: "Examens blancs", time: "Il y a 3h", type: "announcement" },
  { action: "Ressource ajoutée", name: "Chapitre 5 — PDF", time: "Il y a 5h", type: "resource" },
];

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white mb-2">Vue d&apos;ensemble</h1>
        <p className="text-gray-400 mb-8">Bienvenue sur le panneau d&apos;administration</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-sky-500/20 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 rounded-xl bg-sky-500/10 flex items-center justify-center">
                <stat.icon size={20} className="text-sky-400" />
              </div>
              <span className="flex items-center gap-1 text-green-400 text-xs font-medium">
                <TrendingUp size={12} />
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts placeholder + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 rounded-2xl bg-white/5 border border-white/10 p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Inscriptions mensuelles</h2>
          {/* Simple bar chart visualization */}
          <div className="flex items-end gap-2 h-48">
            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: 0.5 + i * 0.05, duration: 0.5 }}
                className="flex-1 rounded-t-lg bg-gradient-to-t from-sky-500/50 to-cyan-400/50 hover:from-sky-500/70 hover:to-cyan-400/70 transition-colors cursor-pointer relative group"
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {h} inscrits
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-gray-500 text-xs">
            <span>Jan</span><span>Fév</span><span>Mar</span><span>Avr</span>
            <span>Mai</span><span>Jun</span><span>Jul</span><span>Aoû</span>
            <span>Sep</span><span>Oct</span><span>Nov</span><span>Déc</span>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl bg-white/5 border border-white/10 p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity size={18} className="text-sky-400" />
            Activité récente
          </h2>
          <div className="space-y-4">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-sky-400 mt-2 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm">{item.action}</p>
                  <p className="text-gray-400 text-xs">{item.name}</p>
                  <p className="text-gray-500 text-xs mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
