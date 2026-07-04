"use client";

import { motion } from "framer-motion";
import { BookOpen, CheckCircle2 } from "lucide-react";

export default function RegistrationPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white mb-6">Mon inscription</h1>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-8">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
            <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Inscrit</h2>
              <p className="text-gray-400 text-sm">Votre inscription est confirmée</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-white/5">
              <span className="text-gray-400 text-sm">Cours</span>
              <span className="flex items-center gap-2 text-white font-medium">
                <BookOpen size={16} className="text-sky-400" /> BG1
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-white/5">
              <span className="text-gray-400 text-sm">Statut</span>
              <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium">Approuvé</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-white/5">
              <span className="text-gray-400 text-sm">Date d&apos;inscription</span>
              <span className="text-white text-sm">15 Septembre 2024</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
