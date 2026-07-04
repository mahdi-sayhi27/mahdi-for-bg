"use client";

import { motion } from "framer-motion";
import { FileText, Download } from "lucide-react";

const resources = [
  { title: "Chapitre 1 — Les fonctions", type: "pdf", course: "BG1", size: "2.4 MB" },
  { title: "Exercices — Suites numériques", type: "exercise", course: "BG1", size: "1.1 MB" },
  { title: "Chapitre 3 — Dérivation", type: "pdf", course: "BG2", size: "3.2 MB" },
  { title: "Devoir 2 — Probabilités", type: "homework", course: "BG2", size: "0.8 MB" },
  { title: "Chapitre 4 — Intégrales", type: "pdf", course: "BG2", size: "2.9 MB" },
];

export default function ResourcesPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white mb-6">Ressources</h1>
        <div className="space-y-3">
          {resources.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center justify-between p-5 rounded-xl bg-white/5 border border-white/10 hover:border-sky-500/20 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-sky-500/10 flex items-center justify-center">
                  <FileText size={20} className="text-sky-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm">{r.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sky-400 text-xs">{r.course}</span>
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-500 text-xs">{r.size}</span>
                  </div>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500/10 text-sky-400 text-sm font-medium hover:bg-sky-500/20 transition-colors cursor-pointer">
                <Download size={14} />
                <span className="hidden sm:inline">Télécharger</span>
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
