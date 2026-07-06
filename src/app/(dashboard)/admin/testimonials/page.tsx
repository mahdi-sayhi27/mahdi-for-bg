"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle, Edit, ImagePlus, Plus, Save, Trash2, Upload, X } from "lucide-react";
import { createClientOrNull, hasValidSupabaseEnv } from "@/lib/supabase/client";
import { createManualTestimonial, readManualTestimonials, updateManualTestimonials } from "@/lib/local-testimonials";
import { mergeById } from "@/lib/utils";
import type { Testimonial } from "@/types";

type FormState = {
  approved: boolean;
};

const initialForm: FormState = {
  approved: true,
};

export default function TestimonialsPage() {
  const supabase = useMemo(() => createClientOrNull(), []);
  const [supabaseUnavailable, setSupabaseUnavailable] = useState(!hasValidSupabaseEnv());
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);

  const refreshTestimonials = useCallback(async () => {
    if (!supabase) {
      setSupabaseUnavailable(true);
      setTestimonials(readManualTestimonials());
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("testimonials")
      .select("id, student_name, photo_url, rating, comment, specialty, approved, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      setSupabaseUnavailable(true);
      setTestimonials(readManualTestimonials());
      setLoading(false);
      return;
    }

    setSupabaseUnavailable(false);
    setTestimonials(mergeById(data ?? [], readManualTestimonials()));
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refreshTestimonials();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [refreshTestimonials]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const resetModal = () => {
    setForm(initialForm);
    setSelectedImage(null);
    setPreviewUrl(null);
    setEditing(null);
  };

  const openAdd = () => {
    resetModal();
    setShowModal(true);
  };

  const openEdit = (testimonial: Testimonial) => {
    setEditing(testimonial);
    setForm({
      approved: testimonial.approved,
    });
    setPreviewUrl(testimonial.photo_url);
    setSelectedImage(null);
    setShowModal(true);
  };

  const handleFileChange = (file: File | null) => {
    setSelectedImage(file);
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
      reader.onerror = () => reject(new Error("Impossible de lire l'image sélectionnée."));
      reader.readAsDataURL(file);
    });

  const uploadImage = async (file: File) => {
    if (!supabase) {
      throw new Error("Supabase indisponible");
    }

    const extension = file.name.split(".").pop() || "jpg";
    const filePath = `testimonials/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from("results")
      .upload(filePath, file, { upsert: false });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data } = supabase.storage.from("results").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let photoUrl = editing?.photo_url ?? null;
      // If the Supabase Storage upload fails (e.g. RLS rejects it because there's no
      // real authenticated admin session), fall back to embedding the image as a data
      // URL in the local store instead of aborting the whole save.
      let uploadFailed = false;
      if (selectedImage) {
        if (supabase) {
          try {
            photoUrl = await uploadImage(selectedImage);
          } catch (uploadError) {
            console.warn("Supabase image upload failed, saving locally instead:", uploadError);
            photoUrl = await readFileAsDataUrl(selectedImage);
            uploadFailed = true;
          }
        } else {
          photoUrl = await readFileAsDataUrl(selectedImage);
        }
      }

      const payload = {
        student_name: "Anonyme",
        specialty: "BG1" as const,
        rating: 5,
        approved: form.approved,
        comment: "",
        photo_url: photoUrl,
      };

      // An item that only exists in the local fallback was never actually written to
      // Supabase (RLS likely rejected it) — updating it there would silently match
      // zero rows and look like a success, so go straight to the local store instead.
      const isLocalOnlyEdit = editing ? readManualTestimonials().some((item) => item.id === editing.id) : false;

      if (supabase && !isLocalOnlyEdit && !uploadFailed) {
        try {
          if (editing) {
            const { error } = await supabase.from("testimonials").update(payload).eq("id", editing.id);
            if (error) throw new Error(error.message);
          } else {
            const { error } = await supabase.from("testimonials").insert(payload);
            if (error) throw new Error(error.message);
          }

          await refreshTestimonials();
          setShowModal(false);
          resetModal();
          return;
        } catch (remoteError) {
          console.error(remoteError);
          setSupabaseUnavailable(true);
        }
      }

      const savedTestimonials = updateManualTestimonials((current) => {
        const testimonial = createManualTestimonial({
          student_name: payload.student_name,
          specialty: payload.specialty,
          rating: payload.rating,
          approved: payload.approved,
          comment: payload.comment,
          photo_url: payload.photo_url,
          id: editing?.id,
          created_at: editing?.created_at,
        });

        if (editing) {
          const existsInLocalStore = current.some((item) => item.id === editing.id);
          if (existsInLocalStore) {
            return current.map((item) => (item.id === editing.id ? testimonial : item));
          }

          return [testimonial, ...current];
        }

        return [testimonial, ...current];
      });

      setTestimonials(savedTestimonials);
      setShowModal(false);
      resetModal();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleApproval = async (testimonial: Testimonial) => {
    // Local-only entries were never written to Supabase — updating them there would
    // silently match zero rows, so update the local store directly instead.
    const isLocalOnly = readManualTestimonials().some((item) => item.id === testimonial.id);

    if (!supabase || isLocalOnly) {
      updateManualTestimonials((current) =>
        current.map((item) =>
          item.id === testimonial.id ? { ...item, approved: !testimonial.approved } : item,
        ),
      );
      if (!supabase) setSupabaseUnavailable(true);
      await refreshTestimonials();
      return;
    }

    const { error } = await supabase
      .from("testimonials")
      .update({ approved: !testimonial.approved })
      .eq("id", testimonial.id);

    if (error) {
      const savedTestimonials = updateManualTestimonials((current) =>
        current.map((item) =>
          item.id === testimonial.id ? { ...item, approved: !testimonial.approved } : item,
        ),
      );
      setTestimonials(savedTestimonials);
      setSupabaseUnavailable(true);
      return;
    }

    await refreshTestimonials();
  };

  const handleDelete = async (id: string) => {
    if (!supabase) {
      const savedTestimonials = updateManualTestimonials((current) => current.filter((item) => item.id !== id));
      setTestimonials(savedTestimonials);
      setSupabaseUnavailable(true);
      return;
    }

    // Local-only entries were never written to Supabase — deleting them there would
    // silently match zero rows, so remove from the local store directly instead.
    const isLocalOnly = readManualTestimonials().some((item) => item.id === id);
    if (isLocalOnly) {
      updateManualTestimonials((current) => current.filter((item) => item.id !== id));
      await refreshTestimonials();
      return;
    }

    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) {
      const savedTestimonials = updateManualTestimonials((current) => current.filter((item) => item.id !== id));
      setTestimonials(savedTestimonials);
      setSupabaseUnavailable(true);
      return;
    }

    await refreshTestimonials();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Galerie</h1>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 text-white font-medium text-sm hover:shadow-lg hover:shadow-sky-500/25 transition-all cursor-pointer"
          >
            <Plus size={16} /> Ajouter
          </button>
        </div>

        {supabaseUnavailable && (
          <div className="mb-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-yellow-100">
            Mode local activé. Les photos sont enregistrées dans ce navigateur tant que Supabase n’est pas configuré.
          </div>
        )}

        {loading && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-gray-300">
            Chargement de la galerie...
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <motion.article key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`rounded-2xl border overflow-hidden backdrop-blur-sm transition-all ${
                t.approved ? "bg-green-500/5 border-green-500/20" : "bg-white/5 border-white/10"
              }`}>
              <div className="relative aspect-[4/3] bg-gray-900/70">
                {t.photo_url ? (
                  <Image src={t.photo_url} alt="Témoignage" fill className="object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-500">
                    <ImagePlus size={22} />
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between mb-4 gap-3">
                  <span className="text-gray-400 text-xs">Capture d&apos;écran</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    t.approved ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
                  }`}>
                    {t.approved ? "Publié" : "Brouillon"}
                  </span>
                </div>

                <div className="flex gap-1">
                  <button onClick={() => openEdit(t)}
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                    title="Modifier">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleToggleApproval(t)}
                    className={`p-2 rounded-lg transition-all cursor-pointer ${
                      t.approved ? "text-green-400 hover:bg-green-500/10" : "text-gray-400 hover:bg-green-500/10 hover:text-green-400"
                    }`}
                    title={t.approved ? "Retirer de la galerie" : "Publier dans la galerie"}>
                    <CheckCircle size={16} />
                  </button>
                  <button onClick={() => handleDelete(t.id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all cursor-pointer"
                    title="Supprimer">
                    <Trash2 size={16} />
                  </button>
                </div>
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
              <h2 className="text-xl font-bold text-white">{editing ? "Modifier" : "Ajouter"} une photo</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white cursor-pointer"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Capture / image</label>
                <label className="block border border-dashed border-white/20 rounded-xl p-5 cursor-pointer hover:border-sky-500/40 transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                  />
                  <div className="flex items-center justify-center gap-2 text-gray-300 text-sm">
                    <Upload size={16} />
                    {selectedImage ? selectedImage.name : "Choisir une image"}
                  </div>
                </label>
                {previewUrl && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-white/10">
                    <Image
                      src={previewUrl}
                      alt="Apercu"
                      width={900}
                      height={600}
                      unoptimized
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}
              </div>

              <label className="inline-flex items-center gap-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={form.approved}
                  onChange={(e) => setForm({ ...form, approved: e.target.checked })}
                  className="accent-sky-500"
                />
                Publier immédiatement dans la galerie
              </label>

              <button type="submit" disabled={saving} className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 text-white font-semibold cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                <Save size={16} />
                {saving ? "Enregistrement..." : editing ? "Sauvegarder" : "Ajouter la photo"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
