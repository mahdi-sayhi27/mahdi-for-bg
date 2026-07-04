"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Download, Eye, FileText, Sparkles, X } from "lucide-react";
import { fetchAllEmploi } from "@/lib/emploi";
import { EMPLOI_CLASSES, EMPLOI_DEPARTMENTS, EMPLOI_SEMESTERS } from "@/constants";
import type { Emploi } from "@/types";

const NEW_THRESHOLD_DAYS = 7;

function isNew(createdAt: string) {
  const days = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
  return days <= NEW_THRESHOLD_DAYS;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-TN", { day: "numeric", month: "long", year: "numeric" });
}

export default function EmploiPage() {
  const [entries, setEntries] = useState<Emploi[]>([]);
  const [loading, setLoading] = useState(true);
  const [classFilter, setClassFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [semesterFilter, setSemesterFilter] = useState<string>("all");
  const [previewing, setPreviewing] = useState<Emploi | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { emploi } = await fetchAllEmploi();
      if (active) {
        setEntries(emploi.filter((e) => !e.archived));
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    return entries.filter(
      (e) =>
        (classFilter === "all" || e.class_name === classFilter) &&
        (departmentFilter === "all" || e.department === departmentFilter) &&
        (semesterFilter === "all" || e.semester === semesterFilter)
    );
  }, [entries, classFilter, departmentFilter, semesterFilter]);

  return (
    <main className="relative min-h-screen">
      <section className="relative bg-[#0A2540] pt-20 pb-16 lg:pt-28 lg:pb-20 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto relative text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-sm text-white/80">
            <CalendarDays size={14} />
            Emploi du temps
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-5">
            Consultez votre emploi du temps
          </h1>
          <p className="text-white/60 mt-3 max-w-xl mx-auto">
            Retrouvez et téléchargez les plannings hebdomadaires pour BG1 et BG2.
          </p>
        </div>
      </section>

      <section className="relative bg-gray-950 py-14 lg:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-10">
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-200 outline-none focus:border-sky-500/40 cursor-pointer"
            >
              <option value="all" className="bg-gray-900">Toutes les classes</option>
              {EMPLOI_CLASSES.map((c) => (
                <option key={c} value={c} className="bg-gray-900">{c}</option>
              ))}
            </select>

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-200 outline-none focus:border-sky-500/40 cursor-pointer"
            >
              <option value="all" className="bg-gray-900">Tous les départements</option>
              {EMPLOI_DEPARTMENTS.map((d) => (
                <option key={d} value={d} className="bg-gray-900">{d}</option>
              ))}
            </select>

            <select
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              className="px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-200 outline-none focus:border-sky-500/40 cursor-pointer"
            >
              <option value="all" className="bg-gray-900">Tous les semestres</option>
              {EMPLOI_SEMESTERS.map((s) => (
                <option key={s} value={s} className="bg-gray-900">{s}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-3xl bg-white/90 h-56 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                <FileText size={26} className="text-gray-500" />
              </div>
              <h3 className="text-white font-semibold text-lg">Aucun emploi du temps disponible</h3>
              <p className="text-gray-400 mt-2">Revenez bientôt, les plannings seront ajoutés prochainement.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((entry) => (
                <div
                  key={entry.id}
                  className="relative rounded-3xl bg-white/95 border border-black/5 p-6 shadow-[0_12px_35px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.14)] hover:-translate-y-1 transition-all duration-300"
                >
                  {isNew(entry.created_at) && (
                    <span className="absolute -top-2.5 -right-2.5 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 text-white text-[11px] font-semibold px-2.5 py-1 shadow-lg shadow-sky-500/30">
                      <Sparkles size={10} /> Nouveau
                    </span>
                  )}

                  <div className="w-12 h-12 rounded-2xl bg-[#0A2540]/10 flex items-center justify-center mb-4">
                    <FileText size={22} className="text-[#0A2540]" />
                  </div>

                  <h3 className="font-bold text-[#222222] text-lg leading-snug">{entry.title}</h3>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#29C8E6]/15 text-[#1A9DB8]">
                      {entry.class_name}
                    </span>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                      {entry.department}
                    </span>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                      {entry.semester}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 mt-3">Mis à jour le {formatDate(entry.created_at)}</p>

                  <div className="flex gap-2 mt-5">
                    <button
                      onClick={() => setPreviewing(entry)}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#0A2540] text-white text-sm font-medium py-2.5 hover:bg-[#0d2f52] transition-colors cursor-pointer"
                    >
                      <Eye size={14} />
                      Aperçu
                    </button>
                    <a
                      href={entry.pdf_url}
                      download
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-[#0A2540]/20 text-[#0A2540] text-sm font-medium py-2.5 hover:bg-[#0A2540]/5 transition-colors"
                    >
                      <Download size={14} />
                      Télécharger
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PDF preview modal */}
      <AnimatePresence>
        {previewing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setPreviewing(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-4xl h-[85vh] overflow-hidden relative flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-3 border-b border-black/5">
                <p className="font-semibold text-[#0A2540] truncate pr-4">{previewing.title}</p>
                <button
                  onClick={() => setPreviewing(null)}
                  className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer shrink-0"
                >
                  <X size={20} />
                </button>
              </div>
              <iframe src={previewing.pdf_url} className="flex-1 w-full" title={previewing.title} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
