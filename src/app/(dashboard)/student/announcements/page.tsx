"use client";

import { motion } from "framer-motion";
import { Bell } from "lucide-react";

const announcements = [
  { title: "Nouveau cours disponible", content: "Le chapitre 5 est maintenant disponible.", date: "30 Juin 2024", priority: "high" as const },
  { title: "Devoirs de la semaine", content: "Exercices du chapitre 4 à rendre.", date: "29 Juin 2024", priority: "medium" as const },
  { title: "Examens blancs", content: "Les examens blancs commencent la semaine prochaine.", date: "27 Juin 2024", priority: "low" as const },
];

export default function AnnouncementsPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white mb-6">Annonces</h1>
        <div className="space-y-4">
          {announcements.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    a.priority === "high" ? "bg-red-500/10" : a.priority === "medium" ? "bg-yellow-500/10" : "bg-green-500/10"
                  }`}>
                    <Bell size={18} className={
                      a.priority === "high" ? "text-red-400" : a.priority === "medium" ? "text-yellow-400" : "text-green-400"
                    } />
                  </div>
                  <h3 className="text-white font-semibold">{a.title}</h3>
                </div>
                <span className="text-gray-500 text-xs">{a.date}</span>
              </div>
              <p className="text-gray-400 text-sm ml-[52px]">{a.content}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
