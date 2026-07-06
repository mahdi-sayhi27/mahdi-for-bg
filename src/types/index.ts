// ============================================
// Maths Pour BG — Type Definitions
// ============================================

import type { LucideIcon } from "lucide-react";

export interface Testimonial {
  id: string;
  student_name: string;
  photo_url: string | null;
  rating: number;
  comment: string;
  specialty: string;
  approved: boolean;
  created_at: string;
}

export interface Result {
  id: string;
  student_name: string;
  specialty: string;
  score: string;
  screenshot_url: string;
  description: string | null;
  created_at: string;
}

export interface Resultat {
  id: string;
  name: string;
  note: string;
  rang: string;
  section: string;
  annee_universitaire: string;
  created_at: string;
}

/** Homepage "Classement détaillé" cards — managed independently from Resultat. */
export interface Detail {
  id: string;
  nom: string;
  prenom: string;
  rang: string;
  created_at: string;
}

export type AnnouncementCategory =
  | "News"
  | "Event"
  | "Internship"
  | "Exam"
  | "Schedule"
  | "Job"
  | "Announcement";

export type AnnouncementStatus = "draft" | "published";

export interface Announcement {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  category: AnnouncementCategory;
  cover_image: string | null;
  images: string[];
  author: string;
  tags: string[];
  featured: boolean;
  pinned: boolean;
  status: AnnouncementStatus;
  publish_date: string;
  priority: "low" | "medium" | "high";
  created_at: string;
}

export interface Emploi {
  id: string;
  title: string;
  class_name: string;
  department: string;
  semester: string;
  pdf_url: string;
  archived: boolean;
  created_at: string;
}

export interface Resource {
  id: string;
  title: string;
  file_url: string;
  type: "pdf" | "exercise" | "homework";
  course: "BG1" | "BG2";
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: "student" | "admin";
  specialty: string | null;
  created_at: string;
}

export interface Registration {
  id: string;
  student_id: string;
  course: "BG1" | "BG2";
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
  icon: LucideIcon;
}
