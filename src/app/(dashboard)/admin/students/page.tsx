"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Edit, Trash2, X } from "lucide-react";

const initialStudents = [
  { id: "1", name: "Ahmed Ben Ali", email: "ahmed@email.com", specialty: "BG1", status: "active" },
  { id: "2", name: "Sara Mansouri", email: "sara@email.com", specialty: "BG2", status: "active" },
  { id: "3", name: "Mohamed Trabelsi", email: "mohamed@email.com", specialty: "BG1", status: "active" },
  { id: "4", name: "Yasmine Bouazizi", email: "yasmine@email.com", specialty: "BG2", status: "pending" },
  { id: "5", name: "Karim Hammami", email: "karim@email.com", specialty: "BG1", status: "active" },
];

export default function StudentsPage() {
  const [students, setStudents] = useState(initialStudents);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<typeof initialStudents[0] | null>(null);

  const filtered = students.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setStudents(students.filter((s) => s.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-white">Étudiants</h1>
          <button
            onClick={() => { setEditingStudent(null); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 text-white font-medium text-sm hover:shadow-lg hover:shadow-sky-500/25 transition-all cursor-pointer"
          >
            <Plus size={16} /> Ajouter
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un étudiant..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-sky-500 outline-none transition-all"
          />
        </div>

        {/* Table */}
        <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Nom</th>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Email</th>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Niveau</th>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Statut</th>
                  <th className="text-right text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((student) => (
                  <tr key={student.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold">
                          {student.name.charAt(0)}
                        </div>
                        <span className="text-white font-medium text-sm">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{student.email}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-medium">{student.specialty}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        student.status === "active" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
                      }`}>
                        {student.status === "active" ? "Actif" : "En attente"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { setEditingStudent(student); setShowModal(true); }}
                          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer">
                          <Edit size={14} />
                        </button>
                        <button onClick={() => handleDelete(student.id)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all cursor-pointer">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingStudent ? "Modifier l'étudiant" : "Ajouter un étudiant"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setShowModal(false); }} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Nom</label>
                <input type="text" defaultValue={editingStudent?.name || ""}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none transition-all" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Email</label>
                <input type="email" defaultValue={editingStudent?.email || ""}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none transition-all" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Niveau</label>
                <select defaultValue={editingStudent?.specialty || "BG1"}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none appearance-none">
                  <option value="BG1" className="bg-gray-900">BG1</option>
                  <option value="BG2" className="bg-gray-900">BG2</option>
                </select>
              </div>
              <button type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 text-white font-semibold hover:shadow-lg hover:shadow-sky-500/25 transition-all cursor-pointer">
                {editingStudent ? "Sauvegarder" : "Ajouter"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
