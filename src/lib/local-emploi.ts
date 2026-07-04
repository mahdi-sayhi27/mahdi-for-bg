import type { Emploi } from "@/types";

const LOCAL_EMPLOI_KEY = "maths-pour-bg:manual-emploi";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function generateId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function normalizeEmploi(entries: Emploi[]) {
  return [...entries].sort((left, right) => {
    const leftDate = new Date(left.created_at).getTime();
    const rightDate = new Date(right.created_at).getTime();
    return rightDate - leftDate;
  });
}

function isEmploi(value: unknown): value is Emploi {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<Emploi>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.class_name === "string" &&
    typeof candidate.department === "string" &&
    typeof candidate.semester === "string" &&
    typeof candidate.pdf_url === "string" &&
    typeof candidate.archived === "boolean" &&
    typeof candidate.created_at === "string"
  );
}

export function readManualEmploi() {
  if (!canUseStorage()) return [];

  try {
    const raw = window.localStorage.getItem(LOCAL_EMPLOI_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return normalizeEmploi(parsed.filter(isEmploi));
  } catch {
    return [];
  }
}

export function writeManualEmploi(entries: Emploi[]) {
  if (!canUseStorage()) return normalizeEmploi(entries);

  const next = normalizeEmploi(entries);

  try {
    window.localStorage.setItem(LOCAL_EMPLOI_KEY, JSON.stringify(next));
  } catch {
    return next;
  }

  return next;
}

export function updateManualEmploi(updater: (current: Emploi[]) => Emploi[]) {
  const current = readManualEmploi();
  const next = updater(current);
  return writeManualEmploi(next);
}

export function createManualEmploi(
  entry: Omit<Emploi, "id" | "created_at"> & Partial<Pick<Emploi, "id" | "created_at">>,
) {
  return {
    ...entry,
    id: entry.id ?? generateId(),
    created_at: entry.created_at ?? new Date().toISOString(),
  } satisfies Emploi;
}
