"use client";

import { motion } from "framer-motion";
import { User, Mail, Lock, Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white mb-6">Paramètres</h1>

        {/* Profile */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-8 mb-6">
          <h2 className="text-lg font-semibold text-white mb-6">Profil administrateur</h2>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div><label className="text-sm text-gray-400 mb-2 block">Nom</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="text" defaultValue="Admin" className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none transition-all" />
              </div>
            </div>
            <div><label className="text-sm text-gray-400 mb-2 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="email" defaultValue="admin@mathspourbg.tn" className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none transition-all" />
              </div>
            </div>
            <button type="submit" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 text-white font-semibold hover:shadow-lg hover:shadow-sky-500/25 transition-all cursor-pointer">
              <Save size={16} /> Sauvegarder
            </button>
          </form>
        </div>

        {/* Password */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-8">
          <h2 className="text-lg font-semibold text-white mb-6">Changer le mot de passe</h2>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div><label className="text-sm text-gray-400 mb-2 block">Mot de passe actuel</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="password" className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none transition-all" />
              </div>
            </div>
            <div><label className="text-sm text-gray-400 mb-2 block">Nouveau mot de passe</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="password" className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none transition-all" />
              </div>
            </div>
            <button type="submit" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all cursor-pointer">
              <Lock size={16} /> Mettre à jour
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
