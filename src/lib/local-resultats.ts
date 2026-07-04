import type { Resultat } from "@/types";

const LOCAL_RESULTATS_KEY = "maths-pour-bg:manual-resultats";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function generateId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function normalizeResultats(resultats: Resultat[]) {
  return [...resultats].sort((left, right) => {
    const leftDate = new Date(left.created_at).getTime();
    const rightDate = new Date(right.created_at).getTime();
    return rightDate - leftDate;
  });
}

function isResultat(value: unknown): value is Resultat {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<Resultat>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.note === "string" &&
    typeof candidate.rang === "string" &&
    typeof candidate.section === "string" &&
    typeof candidate.annee_universitaire === "string" &&
    typeof candidate.created_at === "string"
  );
}

export function readManualResultats() {
  if (!canUseStorage()) return [];

  try {
    const raw = window.localStorage.getItem(LOCAL_RESULTATS_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return normalizeResultats(parsed.filter(isResultat));
  } catch {
    return [];
  }
}

export function writeManualResultats(resultats: Resultat[]) {
  if (!canUseStorage()) return normalizeResultats(resultats);

  const next = normalizeResultats(resultats);

  try {
    window.localStorage.setItem(LOCAL_RESULTATS_KEY, JSON.stringify(next));
  } catch {
    return next;
  }

  return next;
}

export function updateManualResultats(updater: (current: Resultat[]) => Resultat[]) {
  const current = readManualResultats();
  const next = updater(current);
  return writeManualResultats(next);
}

export function createManualResultat(
  resultat: Omit<Resultat, "id" | "created_at"> & Partial<Pick<Resultat, "id" | "created_at">>,
) {
  return {
    ...resultat,
    id: resultat.id ?? generateId(),
    created_at: resultat.created_at ?? new Date().toISOString(),
  } satisfies Resultat;
}
