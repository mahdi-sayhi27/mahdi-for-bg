"use client";

import { motion } from "framer-motion";
import { User, Mail, Camera } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white mb-6">Mon Profil</h1>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-8">
          {/* Avatar */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/10">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center text-white text-2xl font-bold">
                E
              </div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gray-800 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer">
                <Camera size={14} />
              </button>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Étudiant</h2>
              <p className="text-gray-400 text-sm">Niveau BG1</p>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Nom complet</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  defaultValue="Étudiant"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  defaultValue="etudiant@email.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Niveau</label>
              <select className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none transition-all appearance-none">
                <option value="BG1" className="bg-gray-900">BG1</option>
                <option value="BG2" className="bg-gray-900">BG2</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 text-white font-semibold hover:shadow-lg hover:shadow-sky-500/25 transition-all cursor-pointer"
            >
              Sauvegarder
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
