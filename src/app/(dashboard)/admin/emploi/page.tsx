"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Upload,
  Archive,
  ArchiveRestore,
  FileText,
  CalendarDays,
} from "lucide-react";
import { createClientOrNull, hasValidSupabaseEnv } from "@/lib/supabase/client";
import { fetchAllEmploi } from "@/lib/emploi";
import { createManualEmploi, updateManualEmploi } from "@/lib/local-emploi";
import { EMPLOI_CLASSES, EMPLOI_DEPARTMENTS, EMPLOI_SEMESTERS } from "@/constants";
import type { Emploi } from "@/types";

type FormState = {
  title: string;
  class_name: string;
  department: string;
  semester: string;
};

const initialForm: FormState = {
  title: "",
  class_name: EMPLOI_CLASSES[0],
  department: EMPLOI_DEPARTMENTS[0],
  semester: EMPLOI_SEMESTERS[0],
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-TN", { day: "numeric", month: "long", year: "numeric" });
}

export default function AdminEmploiPage() {
  const supabase = useMemo(() => createClientOrNull(), []);
  const [supabaseUnavailable, setSupabaseUnavailable] = useState(!hasValidSupabaseEnv());
  const [entries, setEntries] = useState<Emploi[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Emploi | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  const refresh = useCallback(async () => {
    const { emploi, supabaseUnavailable: unavailable } = await fetchAllEmploi();
    setEntries(emploi);
    setSupabaseUnavailable(unavailable);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void refresh(), 0);
    return () => window.clearTimeout(timer);
  }, [refresh]);

  const resetModal = () => {
    setForm(initialForm);
    setPdfFile(null);
    setEditing(null);
  };

  const openAdd = () => {
    resetModal();
    setShowModal(true);
  };

  const openEdit = (entry: Emploi) => {
    setEditing(entry);
    setForm({
      title: entry.title,
      class_name: entry.class_name,
      department: entry.department,
      semester: entry.semester,
    });
    setPdfFile(null);
    setShowModal(true);
  };

  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
      reader.onerror = () => reject(new Error("Impossible de lire le fichier sélectionné."));
      reader.readAsDataURL(file);
    });

  const uploadPdf = async (file: File) => {
    if (!supabase) throw new Error("Supabase indisponible");
    const filePath = `emploi/${Date.now()}-${Math.random().toString(36).slice(2)}.pdf`;
    const { error } = await supabase.storage.from("emploi").upload(filePath, file, { upsert: false });
    if (error) throw new Error(error.message);
    const { data } = supabase.storage.from("emploi").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editing && !pdfFile) {
      window.alert("Veuillez sélectionner un fichier PDF.");
      return;
    }

    setSaving(true);

    try {
      const pdfUrl = pdfFile ? (supabase ? await uploadPdf(pdfFile) : await readFileAsDataUrl(pdfFile)) : editing?.pdf_url ?? "";

      const payload = {
        title: form.title.trim(),
        class_name: form.class_name,
        department: form.department,
        semester: form.semester,
        pdf_url: pdfUrl,
        archived: editing?.archived ?? false,
      };

      if (supabase) {
        try {
          if (editing) {
            const { error } = await supabase.from("emploi").update(payload).eq("id", editing.id);
            if (error) throw new Error(error.message);
          } else {
            const { error } = await supabase.from("emploi").insert(payload);
            if (error) throw new Error(error.message);
          }

          await refresh();
          setShowModal(false);
          resetModal();
          return;
        } catch (remoteError) {
          console.error(remoteError);
          setSupabaseUnavailable(true);
        }
      }

      const saved = updateManualEmploi((current) => {
        const entry = createManualEmploi({
          ...payload,
          id: editing?.id,
          created_at: editing?.created_at,
        });

        if (editing) {
          const exists = current.some((item) => item.id === editing.id);
          if (exists) {
            return current.map((item) => (item.id === editing.id ? entry : item));
          }
        }

        return [entry, ...current];
      });

      setEntries(saved);
      setShowModal(false);
      resetModal();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleArchive = async (entry: Emploi) => {
    if (!supabase) {
      setEntries(updateManualEmploi((current) => current.map((i) => (i.id === entry.id ? { ...i, archived: !entry.archived } : i))));
      return;
    }

    const { error } = await supabase.from("emploi").update({ archived: !entry.archived }).eq("id", entry.id);
    if (error) {
      setEntries(updateManualEmploi((current) => current.map((i) => (i.id === entry.id ? { ...i, archived: !entry.archived } : i))));
      setSupabaseUnavailable(true);
      return;
    }
    await refresh();
  };

  const handleDelete = async (id: string) => {
    if (!supabase) {
      setEntries(updateManualEmploi((current) => current.filter((i) => i.id !== id)));
      return;
    }

    const { error } = await supabase.from("emploi").delete().eq("id", id);
    if (error) {
      setEntries(updateManualEmploi((current) => current.filter((i) => i.id !== id)));
      setSupabaseUnavailable(true);
      return;
    }
    await refresh();
  };

  const visibleEntries = entries.filter((e) => e.archived === showArchived);

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-white">Emploi du temps</h1>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 text-white font-medium text-sm hover:shadow-lg hover:shadow-sky-500/25 transition-all cursor-pointer"
          >
            <Plus size={16} /> Nouveau planning
          </button>
        </div>

        {supabaseUnavailable && (
          <div className="mb-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-yellow-100">
            Mode local activé. Les plannings sont enregistrés dans ce navigateur tant que Supabase n&apos;est pas configuré.
          </div>
        )}

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setShowArchived(false)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
              !showArchived ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5"
            }`}
          >
            Actifs
          </button>
          <button
            onClick={() => setShowArchived(true)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
              showArchived ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5"
            }`}
          >
            Archivés
          </button>
        </div>

        {loading && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-gray-300">
            Chargement...
          </div>
        )}

        {!loading && visibleEntries.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
            <FileText size={28} className="mx-auto text-gray-500 mb-3" />
            <p className="text-gray-300">{showArchived ? "Aucun planning archivé." : "Aucun planning actif."}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {visibleEntries.map((entry, i) => (
            <motion.article
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <div className="w-11 h-11 rounded-xl bg-sky-500/10 flex items-center justify-center mb-3">
                <FileText size={20} className="text-sky-400" />
              </div>
              <h2 className="text-white font-semibold">{entry.title}</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-300">{entry.class_name}</span>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/10 text-gray-300">{entry.department}</span>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/10 text-gray-300">{entry.semester}</span>
              </div>
              <p className="text-xs text-gray-500 mt-3 inline-flex items-center gap-1.5">
                <CalendarDays size={12} /> {formatDate(entry.created_at)}
              </p>

              <div className="flex gap-1 mt-4">
                <button onClick={() => openEdit(entry)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer" title="Modifier / remplacer le PDF">
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleToggleArchive(entry)}
                  className="p-2 rounded-lg text-gray-400 hover:text-sky-400 hover:bg-sky-500/10 transition-all cursor-pointer"
                  title={entry.archived ? "Désarchiver" : "Archiver"}
                >
                  {entry.archived ? <ArchiveRestore size={16} /> : <Archive size={16} />}
                </button>
                <button onClick={() => handleDelete(entry.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all cursor-pointer" title="Supprimer">
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">{editing ? "Modifier le planning" : "Nouveau planning"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Titre</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Ex: Planning BG1 - Semestre 1"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Classe</label>
                  <select
                    value={form.class_name}
                    onChange={(e) => setForm({ ...form, class_name: e.target.value })}
                    className="w-full px-3 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none appearance-none cursor-pointer"
                  >
                    {EMPLOI_CLASSES.map((c) => (
                      <option key={c} value={c} className="bg-gray-900">{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Département</label>
                  <select
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    className="w-full px-3 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none appearance-none cursor-pointer"
                  >
                    {EMPLOI_DEPARTMENTS.map((d) => (
                      <option key={d} value={d} className="bg-gray-900">{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Semestre</label>
                  <select
                    value={form.semester}
                    onChange={(e) => setForm({ ...form, semester: e.target.value })}
                    className="w-full px-3 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none appearance-none cursor-pointer"
                  >
                    {EMPLOI_SEMESTERS.map((s) => (
                      <option key={s} value={s} className="bg-gray-900">{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">
                  Fichier PDF {editing && "(laisser vide pour conserver l'actuel)"}
                </label>
                <label className="block border border-dashed border-white/20 rounded-xl p-5 cursor-pointer hover:border-sky-500/40 transition-all">
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
                  />
                  <div className="flex items-center justify-center gap-2 text-gray-300 text-sm">
                    <Upload size={16} />
                    {pdfFile ? pdfFile.name : editing ? "Remplacer le PDF existant" : "Choisir un fichier PDF"}
                  </div>
                </label>
                {editing && !pdfFile && (
                  <a href={editing.pdf_url} target="_blank" rel="noopener noreferrer" className="text-xs text-sky-400 hover:underline mt-2 inline-block">
                    Voir le PDF actuel
                  </a>
                )}
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 text-white font-semibold cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Save size={16} />
                {saving ? "Enregistrement..." : editing ? "Sauvegarder" : "Ajouter le planning"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
