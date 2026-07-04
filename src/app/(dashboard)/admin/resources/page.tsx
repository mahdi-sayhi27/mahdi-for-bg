"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, FileText, Trash2, Upload, X } from "lucide-react";

const initial = [
  { id: "1", title: "Chapitre 1 — Les fonctions", type: "pdf", course: "BG1" },
  { id: "2", title: "Exercices — Suites numériques", type: "exercise", course: "BG1" },
  { id: "3", title: "Chapitre 3 — Dérivation", type: "pdf", course: "BG2" },
  { id: "4", title: "Devoir 2 — Probabilités", type: "homework", course: "BG2" },
];

export default function ResourcesPage() {
  const [resources, setResources] = useState(initial);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Ressources</h1>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 text-white font-medium text-sm hover:shadow-lg hover:shadow-sky-500/25 transition-all cursor-pointer">
            <Plus size={16} /> Uploader
          </button>
        </div>

        <div className="space-y-3">
          {resources.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="flex items-center justify-between p-5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-sky-500/10 flex items-center justify-center"><FileText size={20} className="text-sky-400" /></div>
                <div>
                  <h3 className="text-white font-medium text-sm">{r.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sky-400 text-xs">{r.course}</span>
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-500 text-xs capitalize">{r.type}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setResources(resources.filter((x) => x.id !== r.id))}
                className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all cursor-pointer"><Trash2 size={14} /></button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Uploader une ressource</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white cursor-pointer"><X size={20} /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setShowModal(false); }} className="space-y-4">
              <div><label className="text-sm text-gray-400 mb-2 block">Titre</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none transition-all" /></div>
              <div><label className="text-sm text-gray-400 mb-2 block">Type</label>
                <select className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none appearance-none">
                  <option value="pdf" className="bg-gray-900">PDF</option>
                  <option value="exercise" className="bg-gray-900">Exercice</option>
                  <option value="homework" className="bg-gray-900">Devoir</option>
                </select></div>
              <div><label className="text-sm text-gray-400 mb-2 block">Cours</label>
                <select className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none appearance-none">
                  <option value="BG1" className="bg-gray-900">BG1</option>
                  <option value="BG2" className="bg-gray-900">BG2</option>
                </select></div>
              <div><label className="text-sm text-gray-400 mb-2 block">Fichier</label>
                <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-sky-500/30 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Cliquer pour uploader</p>
                </div></div>
              <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 text-white font-semibold cursor-pointer">Uploader</button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
