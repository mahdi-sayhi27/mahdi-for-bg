"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Upload,
  Eye,
  EyeOff,
  Pin,
  PinOff,
  Newspaper,
  Star,
} from "lucide-react";
import { createClientOrNull, hasValidSupabaseEnv } from "@/lib/supabase/client";
import { fetchAllAnnouncements } from "@/lib/announcements";
import { createManualAnnouncement, generateSlug, readManualAnnouncements, updateManualAnnouncements } from "@/lib/local-announcements";
import { ANNOUNCEMENT_CATEGORIES, getCategoryConfig } from "@/constants";
import RichTextEditor from "@/components/admin/rich-text-editor";
import type { Announcement, AnnouncementCategory } from "@/types";

type FormState = {
  title: string;
  slug: string;
  description: string;
  content: string;
  category: AnnouncementCategory;
  author: string;
  tagsInput: string;
  featured: boolean;
  pinned: boolean;
  status: "draft" | "published";
  publishDateLocal: string;
};

type GalleryEntry = { id: string; url: string; file?: File };

function toDatetimeLocal(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromDatetimeLocal(value: string) {
  return value ? new Date(value).toISOString() : new Date().toISOString();
}

function nowDatetimeLocal() {
  return toDatetimeLocal(new Date().toISOString());
}

const MAX_ANNOUNCEMENTS = 5;

const initialForm: FormState = {
  title: "",
  slug: "",
  description: "",
  content: "",
  category: "Announcement",
  author: "Maths Pour BG",
  tagsInput: "",
  featured: false,
  pinned: false,
  status: "published",
  publishDateLocal: nowDatetimeLocal(),
};

export default function AdminAnnouncementsPage() {
  const supabase = useMemo(() => createClientOrNull(), []);
  const [supabaseUnavailable, setSupabaseUnavailable] = useState(!hasValidSupabaseEnv());
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [gallery, setGallery] = useState<GalleryEntry[]>([]);

  const refresh = useCallback(async () => {
    const { announcements: data, supabaseUnavailable: unavailable } = await fetchAllAnnouncements();
    setAnnouncements(data);
    setSupabaseUnavailable(unavailable);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void refresh(), 0);
    return () => window.clearTimeout(timer);
  }, [refresh]);

  const resetModal = () => {
    setForm(initialForm);
    setCoverFile(null);
    setCoverPreview(null);
    setGallery([]);
    setEditing(null);
  };

  const openAdd = () => {
    resetModal();
    setShowModal(true);
  };

  const openEdit = (a: Announcement) => {
    setEditing(a);
    setForm({
      title: a.title,
      slug: a.slug,
      description: a.description,
      content: a.content,
      category: a.category,
      author: a.author,
      tagsInput: a.tags.join(", "),
      featured: a.featured,
      pinned: a.pinned,
      status: a.status,
      publishDateLocal: toDatetimeLocal(a.publish_date),
    });
    setCoverPreview(a.cover_image);
    setCoverFile(null);
    setGallery(a.images.map((url, i) => ({ id: `existing-${i}`, url })));
    setShowModal(true);
  };

  const handleCoverChange = (file: File | null) => {
    setCoverFile(file);
    if (file) setCoverPreview(URL.createObjectURL(file));
  };

  const handleGalleryAdd = (files: FileList | null) => {
    if (!files) return;
    const entries: GalleryEntry[] = Array.from(files).map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      url: URL.createObjectURL(file),
      file,
    }));
    setGallery((current) => [...current, ...entries]);
  };

  const handleGalleryRemove = (id: string) => {
    setGallery((current) => current.filter((entry) => entry.id !== id));
  };

  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
      reader.onerror = () => reject(new Error("Impossible de lire le fichier sélectionné."));
      reader.readAsDataURL(file);
    });

  const uploadToNewsBucket = async (file: File, folder: string) => {
    if (!supabase) throw new Error("Supabase indisponible");
    const extension = file.name.split(".").pop() || "jpg";
    const filePath = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
    const { error } = await supabase.storage.from("news").upload(filePath, file, { upsert: false });
    if (error) throw new Error(error.message);
    const { data } = supabase.storage.from("news").getPublicUrl(filePath);
    return data.publicUrl;
  };

  // Tracks whether any image in this save had to fall back to a local data URL
  // because the Supabase Storage upload failed (e.g. RLS rejected it — no real
  // authenticated admin session yet). Read by handleSave to skip the doomed
  // Supabase table write and go straight to the local store.
  const lastImageUploadFailedRef = useRef(false);

  const resolveImage = async (file: File, folder: string) => {
    if (!supabase) return readFileAsDataUrl(file);

    try {
      return await uploadToNewsBucket(file, folder);
    } catch (uploadError) {
      console.warn("Supabase image upload failed, saving locally instead:", uploadError);
      lastImageUploadFailedRef.current = true;
      return readFileAsDataUrl(file);
    }
  };

  const enforceAnnouncementCapRemote = async () => {
    if (!supabase) return;

    const { data } = await supabase
      .from("announcements")
      .select("id")
      .order("created_at", { ascending: true });

    if (!data || data.length <= MAX_ANNOUNCEMENTS) return;

    const excessIds = data.slice(0, data.length - MAX_ANNOUNCEMENTS).map((a) => a.id);
    await supabase.from("announcements").delete().in("id", excessIds);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    lastImageUploadFailedRef.current = false;

    try {
      const coverImage = coverFile ? await resolveImage(coverFile, "covers") : editing?.cover_image ?? coverPreview ?? null;

      const images = await Promise.all(
        gallery.map((entry) => (entry.file ? resolveImage(entry.file, "gallery") : Promise.resolve(entry.url))),
      );

      const slug = form.slug.trim() || generateSlug(form.title);
      const tags = form.tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        title: form.title.trim(),
        slug,
        description: form.description.trim(),
        content: form.content,
        category: form.category,
        cover_image: coverImage,
        images,
        author: form.author.trim() || "Maths Pour BG",
        tags,
        featured: form.featured,
        pinned: form.pinned,
        status: form.status,
        publish_date: fromDatetimeLocal(form.publishDateLocal),
        priority: "medium" as const,
      };

      // An item that only exists in the local fallback was never actually written to
      // Supabase (RLS likely rejected it) — updating it there would silently match
      // zero rows and look like a success, so go straight to the local store instead.
      const isLocalOnlyEdit = editing ? readManualAnnouncements().some((item) => item.id === editing.id) : false;

      if (supabase && !isLocalOnlyEdit && !lastImageUploadFailedRef.current) {
        try {
          if (editing) {
            const { error } = await supabase.from("announcements").update(payload).eq("id", editing.id);
            if (error) throw new Error(error.message);
          } else {
            const { error } = await supabase.from("announcements").insert(payload);
            if (error) throw new Error(error.message);
            await enforceAnnouncementCapRemote();
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

      const saved = updateManualAnnouncements((current) => {
        const announcement = createManualAnnouncement({
          ...payload,
          id: editing?.id,
          created_at: editing?.created_at,
        });

        let next: Announcement[];
        if (editing) {
          const exists = current.some((item) => item.id === editing.id);
          next = exists
            ? current.map((item) => (item.id === editing.id ? announcement : item))
            : [announcement, ...current];
        } else {
          next = [announcement, ...current];
        }

        if (next.length > MAX_ANNOUNCEMENTS) {
          const sortedByAge = [...next].sort(
            (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
          );
          const removeIds = new Set(sortedByAge.slice(0, next.length - MAX_ANNOUNCEMENTS).map((a) => a.id));
          next = next.filter((a) => !removeIds.has(a.id));
        }

        return next;
      });

      setAnnouncements(saved);
      setShowModal(false);
      resetModal();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (a: Announcement) => {
    const nextStatus = a.status === "published" ? "draft" : "published";
    const isLocalOnly = readManualAnnouncements().some((item) => item.id === a.id);

    if (!supabase || isLocalOnly) {
      updateManualAnnouncements((current) => current.map((i) => (i.id === a.id ? { ...i, status: nextStatus } : i)));
      if (!supabase) setSupabaseUnavailable(true);
      await refresh();
      return;
    }

    const { error } = await supabase.from("announcements").update({ status: nextStatus }).eq("id", a.id);
    if (error) {
      updateManualAnnouncements((current) => current.map((i) => (i.id === a.id ? { ...i, status: nextStatus } : i)));
      setSupabaseUnavailable(true);
      await refresh();
      return;
    }
    await refresh();
  };

  const handleTogglePin = async (a: Announcement) => {
    const isLocalOnly = readManualAnnouncements().some((item) => item.id === a.id);

    if (!supabase || isLocalOnly) {
      updateManualAnnouncements((current) => current.map((i) => (i.id === a.id ? { ...i, pinned: !a.pinned } : i)));
      if (!supabase) setSupabaseUnavailable(true);
      await refresh();
      return;
    }

    const { error } = await supabase.from("announcements").update({ pinned: !a.pinned }).eq("id", a.id);
    if (error) {
      updateManualAnnouncements((current) => current.map((i) => (i.id === a.id ? { ...i, pinned: !a.pinned } : i)));
      setSupabaseUnavailable(true);
      await refresh();
      return;
    }
    await refresh();
  };

  const handleDelete = async (id: string) => {
    if (!supabase) {
      setAnnouncements(updateManualAnnouncements((current) => current.filter((i) => i.id !== id)));
      return;
    }

    // Local-only entries were never written to Supabase — deleting them there would
    // silently match zero rows, so remove from the local store directly instead.
    const isLocalOnly = readManualAnnouncements().some((item) => item.id === id);
    if (isLocalOnly) {
      updateManualAnnouncements((current) => current.filter((i) => i.id !== id));
      await refresh();
      return;
    }

    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (error) {
      setAnnouncements(updateManualAnnouncements((current) => current.filter((i) => i.id !== id)));
      setSupabaseUnavailable(true);
      return;
    }
    await refresh();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Actualités &amp; Annonces</h1>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 text-white font-medium text-sm hover:shadow-lg hover:shadow-sky-500/25 transition-all cursor-pointer"
          >
            <Plus size={16} /> Nouvelle annonce
          </button>
        </div>

        {supabaseUnavailable && (
          <div className="mb-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-yellow-100">
            Mode local activé. Les annonces sont enregistrées dans ce navigateur tant que Supabase n&apos;est pas configuré.
          </div>
        )}

        {loading && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-gray-300">
            Chargement des annonces...
          </div>
        )}

        {!loading && announcements.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
            <Newspaper size={28} className="mx-auto text-gray-500 mb-3" />
            <p className="text-gray-300">Aucune annonce pour le moment.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {announcements.map((a, i) => {
            const config = getCategoryConfig(a.category);
            return (
              <motion.article
                key={a.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`rounded-2xl border overflow-hidden backdrop-blur-sm transition-all ${
                  a.status === "published" ? "bg-green-500/5 border-green-500/20" : "bg-white/5 border-white/10"
                }`}
              >
                <div className="relative aspect-[16/9] bg-gray-900/70">
                  {a.cover_image ? (
                    <Image src={a.cover_image} alt={a.title} fill className="object-cover" />
                  ) : (
                    <div
                      className="h-full w-full flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${config.bg}, transparent)` }}
                    >
                      <config.icon size={26} style={{ color: config.color }} />
                    </div>
                  )}
                  {a.pinned && (
                    <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-[#0A2540]/90 text-white text-[11px] px-2 py-1">
                      <Pin size={10} /> Épinglé
                    </span>
                  )}
                  {a.featured && (
                    <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-yellow-500/90 text-white text-[11px] px-2 py-1">
                      <Star size={10} /> À la une
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between mb-3 gap-3">
                    <div className="min-w-0">
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                        style={{ backgroundColor: config.bg, color: config.color }}
                      >
                        <config.icon size={10} />
                        {config.label}
                      </span>
                      <h2 className="text-white text-base font-semibold mt-2 truncate">{a.title}</h2>
                    </div>
                    <span
                      className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium ${
                        a.status === "published" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {a.status === "published" ? "Publié" : "Brouillon"}
                    </span>
                  </div>

                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{a.description}</p>

                  <div className="flex gap-1">
                    <button onClick={() => openEdit(a)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer" title="Modifier">
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleTogglePublish(a)}
                      className={`p-2 rounded-lg transition-all cursor-pointer ${
                        a.status === "published" ? "text-green-400 hover:bg-green-500/10" : "text-gray-400 hover:bg-green-500/10 hover:text-green-400"
                      }`}
                      title={a.status === "published" ? "Dépublier" : "Publier"}
                    >
                      {a.status === "published" ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button
                      onClick={() => handleTogglePin(a)}
                      className={`p-2 rounded-lg transition-all cursor-pointer ${
                        a.pinned ? "text-sky-400 hover:bg-sky-500/10" : "text-gray-400 hover:bg-sky-500/10 hover:text-sky-400"
                      }`}
                      title={a.pinned ? "Désépingler" : "Épingler"}
                    >
                      {a.pinned ? <PinOff size={16} /> : <Pin size={16} />}
                    </button>
                    <button onClick={() => handleDelete(a.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all cursor-pointer" title="Supprimer">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </motion.div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">{editing ? "Modifier" : "Nouvelle"} annonce</h2>
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
                  placeholder="Ex: Ouverture des inscriptions BG2"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Slug (URL)</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="genere-automatiquement-si-vide"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Catégorie</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as AnnouncementCategory })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none appearance-none cursor-pointer"
                  >
                    {ANNOUNCEMENT_CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value} className="bg-gray-900">
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Auteur</label>
                  <input
                    type="text"
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Description courte</label>
                <textarea
                  rows={2}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Résumé affiché sur les cartes du News Center"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none transition-all resize-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Contenu</label>
                <RichTextEditor value={form.content} onChange={(html) => setForm({ ...form, content: html })} />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Image de couverture</label>
                <label className="block border border-dashed border-white/20 rounded-xl p-5 cursor-pointer hover:border-sky-500/40 transition-all">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleCoverChange(e.target.files?.[0] ?? null)} />
                  <div className="flex items-center justify-center gap-2 text-gray-300 text-sm">
                    <Upload size={16} />
                    {coverFile ? coverFile.name : "Choisir une image de couverture"}
                  </div>
                </label>
                {coverPreview && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-white/10">
                    <Image src={coverPreview} alt="Aperçu" width={900} height={500} unoptimized className="w-full h-auto object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Galerie d&apos;images (optionnel)</label>
                <label className="block border border-dashed border-white/20 rounded-xl p-5 cursor-pointer hover:border-sky-500/40 transition-all">
                  <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleGalleryAdd(e.target.files)} />
                  <div className="flex items-center justify-center gap-2 text-gray-300 text-sm">
                    <Upload size={16} />
                    Ajouter des images
                  </div>
                </label>
                {gallery.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {gallery.map((entry) => (
                      <div key={entry.id} className="relative aspect-square rounded-lg overflow-hidden border border-white/10 group">
                        <Image src={entry.url} alt="Galerie" fill unoptimized className="object-cover" />
                        <button
                          type="button"
                          onClick={() => handleGalleryRemove(entry.id)}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Tags (séparés par des virgules)</label>
                <input
                  type="text"
                  value={form.tagsInput}
                  onChange={(e) => setForm({ ...form, tagsInput: e.target.value })}
                  placeholder="BG1, inscription, examen"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Statut</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as "draft" | "published" })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none appearance-none cursor-pointer"
                  >
                    <option value="draft" className="bg-gray-900">Brouillon</option>
                    <option value="published" className="bg-gray-900">Publié</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Date de publication</label>
                  <input
                    type="datetime-local"
                    value={form.publishDateLocal}
                    onChange={(e) => setForm({ ...form, publishDateLocal: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none transition-all"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 -mt-2">
                Une date future gardera l&apos;annonce invisible du public jusqu&apos;à cette date (publication programmée).
              </p>

              <div className="flex flex-wrap gap-6">
                <label className="inline-flex items-center gap-2 text-sm text-gray-300">
                  <input type="checkbox" checked={form.pinned} onChange={(e) => setForm({ ...form, pinned: e.target.checked })} className="accent-sky-500" />
                  Épingler cette annonce
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-gray-300">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-sky-500" />
                  Mettre à la une (hero du News Center)
                </label>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 text-white font-semibold cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Save size={16} />
                {saving ? "Enregistrement..." : editing ? "Sauvegarder" : "Publier l'annonce"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
