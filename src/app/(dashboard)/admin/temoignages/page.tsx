"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Edit, Plus, Save, Trash2, X } from "lucide-react";
import { createClientOrNull, hasValidSupabaseEnv } from "@/lib/supabase/client";
import { createManualResult, readManualResults, updateManualResults } from "@/lib/local-results";
import { mergeById } from "@/lib/utils";
import type { Result } from "@/types";

type FormState = {
  student_name: string;
  specialty: string;
  score: string;
  description: string;
};

const initialForm: FormState = {
  student_name: "",
  specialty: "",
  score: "",
  description: "",
};

export default function TemoignagesPage() {
  const supabase = useMemo(() => createClientOrNull(), []);
  const [supabaseUnavailable, setSupabaseUnavailable] = useState(!hasValidSupabaseEnv());
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Result | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);

  const refreshResults = useCallback(async () => {
    if (!supabase) {
      setSupabaseUnavailable(true);
      setResults(readManualResults());
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("results")
      .select("id, student_name, specialty, score, screenshot_url, description, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      setSupabaseUnavailable(true);
      setResults(readManualResults());
      setLoading(false);
      return;
    }

    setSupabaseUnavailable(false);
    setResults(mergeById(data ?? [], readManualResults()));
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refreshResults();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [refreshResults]);

  const resetModal = () => {
    setForm(initialForm);
    setEditing(null);
  };

  const openAdd = () => {
    resetModal();
    setShowModal(true);
  };

  const openEdit = (result: Result) => {
    setEditing(result);
    setForm({
      student_name: result.student_name,
      specialty: result.specialty,
      score: result.score,
      description: result.description ?? "",
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        student_name: form.student_name.trim(),
        specialty: form.specialty,
        score: form.score.trim(),
        description: form.description.trim() || null,
        screenshot_url: editing?.screenshot_url ?? null,
      };

      // An item that only exists in the local fallback was never actually written to
      // Supabase (RLS likely rejected it) — updating it there would silently match
      // zero rows and look like a success, so go straight to the local store instead.
      const isLocalOnlyEdit = editing ? readManualResults().some((item) => item.id === editing.id) : false;

      if (supabase && !isLocalOnlyEdit) {
        try {
          if (editing) {
            const { error } = await supabase.from("results").update(payload).eq("id", editing.id);
            if (error) throw new Error(error.message);
          } else {
            const { error } = await supabase.from("results").insert(payload);
            if (error) throw new Error(error.message);
          }

          await refreshResults();
          setShowModal(false);
          resetModal();
          return;
        } catch (remoteError) {
          console.error(remoteError);
          setSupabaseUnavailable(true);
        }
      }

      const savedResults = updateManualResults((current) => {
        const result = createManualResult({
          student_name: payload.student_name,
          specialty: payload.specialty,
          score: payload.score,
          description: payload.description,
          screenshot_url: payload.screenshot_url ?? "",
          id: editing?.id,
          created_at: editing?.created_at,
        });

        if (editing) {
          const existsInLocalStore = current.some((item) => item.id === editing.id);
          if (existsInLocalStore) {
            return current.map((item) => (item.id === editing.id ? result : item));
          }
          return [result, ...current];
        }

        return [result, ...current];
      });

      setResults(savedResults);
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
      const savedResults = updateManualResults((current) => current.filter((item) => item.id !== id));
      setResults(savedResults);
      setSupabaseUnavailable(true);
      return;
    }

    // Local-only entries were never written to Supabase — deleting them there would
    // silently match zero rows, so remove from the local store directly instead.
    const isLocalOnly = readManualResults().some((item) => item.id === id);
    if (isLocalOnly) {
      updateManualResults((current) => current.filter((item) => item.id !== id));
      await refreshResults();
      return;
    }

    const { error } = await supabase.from("results").delete().eq("id", id);
    if (error) {
      const savedResults = updateManualResults((current) => current.filter((item) => item.id !== id));
      setResults(savedResults);
      setSupabaseUnavailable(true);
      return;
    }

    await refreshResults();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Témoignages</h1>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 text-white font-medium text-sm hover:shadow-lg hover:shadow-sky-500/25 transition-all cursor-pointer"
          >
            <Plus size={16} /> Ajouter
          </button>
        </div>

        {supabaseUnavailable && (
          <div className="mb-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-yellow-100">
            Mode local activé. Les témoignages sont enregistrés dans ce navigateur tant que Supabase n’est pas configuré.
          </div>
        )}

        {loading && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-gray-300">
            Chargement des témoignages...
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {results.map((r, i) => (
            <motion.article key={r.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-start justify-between mb-3 gap-3">
                <div>
                  <h2 className="text-white text-base font-semibold">{r.student_name}</h2>
                  <p className="text-sky-400 text-xs mt-1">{r.specialty}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-sky-500/10 text-sky-400">
                  Note : {r.score}
                </span>
              </div>

              {r.description && (
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">{r.description}</p>
              )}

              <div className="flex gap-1">
                <button onClick={() => openEdit(r)}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                  title="Modifier">
                  <Edit size={16} />
                </button>
                <button onClick={() => handleDelete(r.id)}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all cursor-pointer"
                  title="Supprimer">
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">{editing ? "Modifier" : "Ajouter"} un témoignage</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white cursor-pointer"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Nom de l&apos;étudiant</label>
                <input type="text" required value={form.student_name}
                  onChange={(e) => setForm({ ...form, student_name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none transition-all" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Niveau</label>
                <input type="text" required placeholder="Ex: BG1" value={form.specialty}
                  onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none transition-all" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Note</label>
                <input type="text" required placeholder="18/20" value={form.score}
                  onChange={(e) => setForm({ ...form, score: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none transition-all" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Témoignage</label>
                <textarea rows={5} value={form.description}
                  placeholder="Le témoignage de l'étudiant..."
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none transition-all resize-none" />
              </div>

              <button type="submit" disabled={saving} className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 text-white font-semibold cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                <Save size={16} />
                {saving ? "Enregistrement..." : editing ? "Sauvegarder" : "Ajouter le témoignage"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
