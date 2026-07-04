import type { Testimonial } from "@/types";

const LOCAL_TESTIMONIALS_KEY = "maths-pour-bg:manual-testimonials";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function generateId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function normalizeTestimonials(testimonials: Testimonial[]) {
  return [...testimonials].sort((left, right) => {
    const leftDate = new Date(left.created_at).getTime();
    const rightDate = new Date(right.created_at).getTime();
    return rightDate - leftDate;
  });
}

function isTestimonial(value: unknown): value is Testimonial {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<Testimonial>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.student_name === "string" &&
    (candidate.photo_url === null || typeof candidate.photo_url === "string") &&
    typeof candidate.rating === "number" &&
    typeof candidate.comment === "string" &&
    typeof candidate.specialty === "string" &&
    typeof candidate.approved === "boolean" &&
    typeof candidate.created_at === "string"
  );
}

export function readManualTestimonials() {
  if (!canUseStorage()) return [];

  try {
    const raw = window.localStorage.getItem(LOCAL_TESTIMONIALS_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return normalizeTestimonials(parsed.filter(isTestimonial));
  } catch {
    return [];
  }
}

export function writeManualTestimonials(testimonials: Testimonial[]) {
  if (!canUseStorage()) return normalizeTestimonials(testimonials);

  const next = normalizeTestimonials(testimonials);

  try {
    window.localStorage.setItem(LOCAL_TESTIMONIALS_KEY, JSON.stringify(next));
  } catch {
    return next;
  }

  return next;
}

export function updateManualTestimonials(
  updater: (current: Testimonial[]) => Testimonial[],
) {
  const current = readManualTestimonials();
  const next = updater(current);
  return writeManualTestimonials(next);
}

export function createManualTestimonial(
  testimonial: Omit<Testimonial, "id" | "created_at"> & Partial<Pick<Testimonial, "id" | "created_at">>,
) {
  return {
    ...testimonial,
    id: testimonial.id ?? generateId(),
    created_at: testimonial.created_at ?? new Date().toISOString(),
  } satisfies Testimonial;
}