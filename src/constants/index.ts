// ============================================
// Maths Pour BG — Constants
// ============================================

// --- Admin Credentials ---
// Read from env vars (set in .env.local, which is gitignored) so the real login
// is never committed to the repo. Falls back to an obvious placeholder if unset.
export const ADMIN_CREDENTIALS = {
  email: process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "admin@example.com",
  password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "change-me",
} as const;

import {
  Users,
  Trophy,
  CalendarClock,
  BookOpenCheck,
  Newspaper,
  PartyPopper,
  Briefcase,
  GraduationCap,
  CalendarDays,
  Megaphone,
  ClipboardCheck,
} from "lucide-react";
import type { FAQItem, StatItem, Announcement, AnnouncementCategory } from "@/types";

export const SITE_CONFIG = {
  name: "Maths Pour BG",
  tagline: "Master Mathematics. Build Your Future.",
  description:
    "Préparez-vous pour le BG1 et BG2 avec des cours de mathématiques professionnels en Tunisie.",
  url: "https://maths-pour-bg.vercel.app",
} as const;

export const NAV_LINKS = [
  { href: "#hero", label: "Accueil" },
  { href: "#why-us", label: "Pourquoi Nous" },
  { href: "#courses", label: "Cours" },
  { href: "#testimonials", label: "Commentaires" },
  { href: "#results", label: "Résultats" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
  { href: "#galerie", label: "Galerie" },
] as const;

export const STATS: StatItem[] = [
  { value: 500, suffix: "+", label: "Étudiants", icon: Users },
  { value: 98, suffix: "%", label: "Taux de Réussite", icon: Trophy },
  { value: 10, suffix: "+", label: "Ans d'Expérience", icon: CalendarClock },
  { value: 1000, suffix: "+", label: "Heures de Cours", icon: BookOpenCheck },
];

export const FAQ_DATA: FAQItem[] = [
  {
    question: "Quels sont les niveaux proposés ?",
    answer:
      "Nous proposons des cours pour les niveaux BG1 et BG2, adaptés au programme tunisien. Chaque niveau bénéficie d'un programme structuré et progressif.",
  },
  {
    question: "Comment s'inscrire aux cours ?",
    answer:
      "L'inscription se fait en ligne via notre formulaire. Cliquez sur le bouton 'S'inscrire' dans la section cours et remplissez le formulaire Google correspondant à votre niveau.",
  },
  {
    question: "Quel est le format des cours ?",
    answer:
      "Les cours sont dispensés en présentiel avec un suivi personnalisé. Chaque séance comprend une explication théorique, des exercices pratiques et des devoirs pour consolider les acquis.",
  },
  {
    question: "Y a-t-il un suivi personnalisé ?",
    answer:
      "Oui, chaque étudiant bénéficie d'un suivi personnalisé. Nous analysons les points forts et les lacunes pour adapter notre approche pédagogique.",
  },
  {
    question: "Quels sont les tarifs ?",
    answer:
      "Les tarifs varient selon le niveau et la formule choisie. Contactez-nous pour obtenir plus d'informations sur nos offres et nos facilités de paiement.",
  },
  {
    question: "Comment accéder aux ressources en ligne ?",
    answer:
      "Après votre inscription, vous aurez accès à votre espace étudiant où vous pourrez télécharger les cours en PDF, les exercices et consulter les annonces.",
  },
];

export const GOOGLE_FORMS = {
  BG1: "https://forms.gle/4PNh1cHEpskmM4XW7",
  BG2: "https://forms.gle/ggDfCiGbbHecaLybA",
} as const;

export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/share/1JWquFt15t/?mibextid=wwXIfr",
  instagram: "https://instagram.com",
  whatsapp: "https://wa.me/21600000000",
  email: "mailto:contact@mathspourbg.tn",
} as const;

export const MATH_SYMBOLS = ["∑", "π", "∫", "√", "Δ", "∞", "α", "β", "θ", "λ", "μ", "σ", "φ", "ω", "∂", "∇"];

export const PLACEHOLDER_TESTIMONIALS = [
  {
    id: "1",
    student_name: "Ahmed Ben Ali",
    photo_url: null,
    rating: 5,
    comment:
      "Grâce à Maths Pour BG, j'ai obtenu 18/20 en maths au bac. Les cours sont clairs et le suivi est exceptionnel !",
    specialty: "BG1",
    approved: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    student_name: "Sara Mansouri",
    photo_url: null,
    rating: 5,
    comment:
      "La meilleure expérience d'apprentissage que j'ai eue. Le professeur explique de manière simple et efficace.",
    specialty: "BG2",
    approved: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    student_name: "Mohamed Trabelsi",
    photo_url: null,
    rating: 5,
    comment:
      "J'étais nul en maths, maintenant je suis parmi les meilleurs de ma classe. Merci infiniment !",
    specialty: "BG1",
    approved: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    student_name: "Yasmine Bouazizi",
    photo_url: null,
    rating: 4,
    comment:
      "Des cours très bien structurés avec des exercices variés. Je recommande vivement !",
    specialty: "BG2",
    approved: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    student_name: "Karim Hammami",
    photo_url: null,
    rating: 5,
    comment:
      "Le suivi personnalisé fait toute la différence. On sent vraiment que le professeur se soucie de notre réussite.",
    specialty: "BG1",
    approved: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "6",
    student_name: "Ines Chaabane",
    photo_url: null,
    rating: 5,
    comment:
      "Excellente préparation pour le BG2. Les méthodes de résolution sont claires et applicables directement aux examens.",
    specialty: "BG2",
    approved: true,
    created_at: new Date().toISOString(),
  },
];

// --- News & Announcements ---
export const ANNOUNCEMENT_CATEGORIES: {
  value: AnnouncementCategory;
  label: string;
  icon: typeof Newspaper;
  color: string;
  bg: string;
}[] = [
  { value: "News", label: "Actualité", icon: Newspaper, color: "#0EA5E9", bg: "rgba(14,165,233,0.12)" },
  { value: "Event", label: "Événement", icon: PartyPopper, color: "#A855F7", bg: "rgba(168,85,247,0.12)" },
  { value: "Internship", label: "Stage", icon: GraduationCap, color: "#22C55E", bg: "rgba(34,197,94,0.12)" },
  { value: "Exam", label: "Examen", icon: ClipboardCheck, color: "#F97316", bg: "rgba(249,115,22,0.12)" },
  { value: "Schedule", label: "Planning", icon: CalendarDays, color: "#29C8E6", bg: "rgba(41,200,230,0.12)" },
  { value: "Job", label: "Emploi", icon: Briefcase, color: "#6366F1", bg: "rgba(99,102,241,0.12)" },
  { value: "Announcement", label: "Annonce", icon: Megaphone, color: "#94A3B8", bg: "rgba(148,163,184,0.12)" },
];

export function getCategoryConfig(category: AnnouncementCategory) {
  return ANNOUNCEMENT_CATEGORIES.find((c) => c.value === category) ?? ANNOUNCEMENT_CATEGORIES[6];
}

// --- Emploi (timetable) filters ---
export const EMPLOI_CLASSES = ["BG1", "BG2"] as const;
export const EMPLOI_DEPARTMENTS = ["Mathématiques"] as const;
export const EMPLOI_SEMESTERS = ["Semestre 1", "Semestre 2"] as const;

export const PLACEHOLDER_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "a1",
    slug: "ouverture-inscriptions-bg2",
    title: "Ouverture des inscriptions BG2 pour la nouvelle session",
    description:
      "Les inscriptions pour le programme BG2 sont désormais ouvertes. Places limitées, places attribuées par ordre d'inscription.",
    content:
      "<p>Nous sommes heureux d'annoncer l'ouverture des inscriptions pour le programme <strong>BG2</strong>. Ce programme s'adresse aux élèves souhaitant consolider leurs acquis et viser l'excellence en mathématiques.</p><p>Les places étant limitées, nous recommandons de vous inscrire rapidement via le formulaire en ligne.</p>",
    category: "Announcement",
    cover_image: null,
    images: [],
    author: "Maths Pour BG",
    tags: ["BG2", "inscription"],
    featured: true,
    pinned: true,
    status: "published",
    publish_date: new Date().toISOString(),
    priority: "high",
    created_at: new Date().toISOString(),
  },
  {
    id: "a2",
    slug: "resultats-bac-blanc-disponibles",
    title: "Résultats du bac blanc disponibles",
    description:
      "Les résultats du dernier bac blanc sont maintenant disponibles dans votre espace étudiant.",
    content:
      "<p>Les copies corrigées et les notes du bac blanc sont désormais consultables. Un bilan individuel sera communiqué à chaque étudiant lors de la prochaine séance.</p>",
    category: "Exam",
    cover_image: null,
    images: [],
    author: "Maths Pour BG",
    tags: ["examen", "résultats"],
    featured: false,
    pinned: false,
    status: "published",
    publish_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    priority: "medium",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: "a3",
    slug: "recrutement-professeur-assistant",
    title: "Recrutement : professeur assistant en mathématiques",
    description:
      "Maths Pour BG recrute un professeur assistant pour renforcer son équipe pédagogique.",
    content:
      "<p>Dans le cadre de sa croissance, Maths Pour BG recherche un(e) professeur(e) assistant(e) passionné(e) de mathématiques pour accompagner nos étudiants de BG1 et BG2.</p><p>Envoyez votre candidature via la page contact.</p>",
    category: "Job",
    cover_image: null,
    images: [],
    author: "Maths Pour BG",
    tags: ["recrutement", "emploi"],
    featured: false,
    pinned: false,
    status: "published",
    publish_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    priority: "medium",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: "a4",
    slug: "nouveau-planning-ete",
    title: "Nouveau planning de cours d'été",
    description:
      "Le planning des cours intensifs d'été est désormais disponible dans la section Emploi.",
    content:
      "<p>Retrouvez le nouveau planning des séances intensives d'été dans la section <strong>Emploi</strong>. Les horaires ont été adaptés pour maximiser la préparation avant la rentrée.</p>",
    category: "Schedule",
    cover_image: null,
    images: [],
    author: "Maths Pour BG",
    tags: ["planning", "été"],
    featured: false,
    pinned: false,
    status: "published",
    publish_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    priority: "low",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
  },
];
