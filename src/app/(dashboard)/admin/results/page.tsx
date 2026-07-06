"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Edit, Plus, Save, Trash2, Trophy, X } from "lucide-react";
import { createClientOrNull, hasValidSupabaseEnv } from "@/lib/supabase/client";
import { createManualResultat, readManualResultats, updateManualResultats } from "@/lib/local-resultats";
import { mergeById } from "@/lib/utils";
import type { Resultat } from "@/types";

type FormState = {
  name: string;
  note: string;
  rang: string;
  section: string;
  annee_universitaire: string;
};

const initialForm: FormState = {
  name: "",
  note: "",
  rang: "",
  section: "",
  annee_universitaire: "",
};

export default function ResultatsPage() {
  const supabase = useMemo(() => createClientOrNull(), []);
  const [supabaseUnavailable, setSupabaseUnavailable] = useState(!hasValidSupabaseEnv());
  const [resultats, setResultats] = useState<Resultat[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Resultat | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);

  const refreshResultats = useCallback(async () => {
    if (!supabase) {
      setSupabaseUnavailable(true);
      setResultats(readManualResultats());
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("resultats")
      .select("id, name, note, rang, section, annee_universitaire, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      setSupabaseUnavailable(true);
      setResultats(readManualResultats());
      setLoading(false);
      return;
    }

    setSupabaseUnavailable(false);
    setResultats(mergeById(data ?? [], readManualResultats()));
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refreshResultats();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [refreshResultats]);

  const resetModal = () => {
    setForm(initialForm);
    setEditing(null);
  };

  const openAdd = () => {
    resetModal();
    setShowModal(true);
  };

  const openEdit = (resultat: Resultat) => {
    setEditing(resultat);
    setForm({
      name: resultat.name,
      note: resultat.note,
      rang: resultat.rang,
      section: resultat.section,
      annee_universitaire: resultat.annee_universitaire,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        note: form.note.trim(),
        rang: form.rang.trim(),
        section: form.section,
        annee_universitaire: form.annee_universitaire.trim(),
      };

      // An item that only exists in the local fallback was never actually written to
      // Supabase (RLS likely rejected it) — updating it there would silently match
      // zero rows and look like a success, so go straight to the local store instead.
      const isLocalOnlyEdit = editing ? readManualResultats().some((item) => item.id === editing.id) : false;

      if (supabase && !isLocalOnlyEdit) {
        try {
          if (editing) {
            const { error } = await supabase.from("resultats").update(payload).eq("id", editing.id);
            if (error) throw new Error(error.message);
          } else {
            const { error } = await supabase.from("resultats").insert(payload);
            if (error) throw new Error(error.message);
          }

          await refreshResultats();
          setShowModal(false);
          resetModal();
          return;
        } catch (remoteError) {
          console.error(remoteError);
          setSupabaseUnavailable(true);
        }
      }

      const savedResultats = updateManualResultats((current) => {
        const resultat = createManualResultat({
          ...payload,
          id: editing?.id,
          created_at: editing?.created_at,
        });

        if (editing) {
          const existsInLocalStore = current.some((item) => item.id === editing.id);
          if (existsInLocalStore) {
            return current.map((item) => (item.id === editing.id ? resultat : item));
          }
          return [resultat, ...current];
        }

        return [resultat, ...current];
      });

      setResultats(savedResultats);
      setShowModal(false);
      resetModal();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!supabase) {
      const savedResultats = updateManualResultats((current) => current.filter((item) => item.id !== id));
      setResultats(savedResultats);
      setSupabaseUnavailable(true);
      return;
    }

    // Local-only entries were never written to Supabase — deleting them there would
    // silently match zero rows, so remove from the local store directly instead.
    const isLocalOnly = readManualResultats().some((item) => item.id === id);
    if (isLocalOnly) {
      updateManualResultats((current) => current.filter((item) => item.id !== id));
      await refreshResultats();
      return;
    }

    const { error } = await supabase.from("resultats").delete().eq("id", id);
    if (error) {
      const savedResultats = updateManualResultats((current) => current.filter((item) => item.id !== id));
      setResultats(savedResultats);
      setSupabaseUnavailable(true);
      return;
    }

    await refreshResultats();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Résultats</h1>
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 text-white font-medium text-sm hover:shadow-lg hover:shadow-sky-500/25 transition-all cursor-pointer">
            <Plus size={16} /> Ajouter
          </button>
        </div>

        {supabaseUnavailable && (
          <div className="mb-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-yellow-100">
            Mode local activé. Les résultats sont enregistrés dans ce navigateur tant que Supabase n’est pas configuré.
          </div>
        )}

        {loading && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-gray-300">
            Chargement des résultats...
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resultats.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden group">
              <div className="h-28 bg-gradient-to-br from-sky-500/10 to-cyan-500/10 flex flex-col items-center justify-center">
                <Trophy className="w-7 h-7 text-sky-400/60 mb-1" />
                <span className="text-2xl font-bold text-gradient">{r.note}</span>
              </div>
              <div className="p-5">
                <h3 className="text-white font-semibold text-sm">{r.name}</h3>
                <p className="text-gray-400 text-xs mt-1">Rang : {r.rang}</p>
                <p className="text-sky-400 text-xs mt-1">{r.section}</p>
                <p className="text-gray-400 text-xs mt-1">Année : {r.annee_universitaire}</p>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => openEdit(r)}
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer">
                    <Edit size={14} />
                  </button>
                  <button onClick={() => handleDelete(r.id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all cursor-pointer">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">{editing ? "Modifier le résultat" : "Ajouter un résultat"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white cursor-pointer"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Nom</label>
                <input type="text" required value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none transition-all" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Note</label>
                <input type="text" required placeholder="18/20" value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none transition-all" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Rang</label>
                <input type="text" required placeholder="1er / 32" value={form.rang}
                  onChange={(e) => setForm({ ...form, rang: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none transition-all" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Section</label>
                <input type="text" required placeholder="Ex: BG1" value={form.section}
                  onChange={(e) => setForm({ ...form, section: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none transition-all" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Année universitaire</label>
                <input type="text" required placeholder="2025 - 2026" value={form.annee_universitaire}
                  onChange={(e) => setForm({ ...form, annee_universitaire: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none transition-all" />
              </div>
              <button type="submit" disabled={saving} className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 text-white font-semibold cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                <Save size={16} />
                {saving ? "Enregistrement..." : editing ? "Sauvegarder" : "Ajouter"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
