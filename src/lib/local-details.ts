import type { Detail } from "@/types";

const LOCAL_DETAILS_KEY = "maths-pour-bg:manual-details";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function generateId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function normalizeDetails(details: Detail[]) {
  return [...details].sort((left, right) => {
    const leftDate = new Date(left.created_at).getTime();
    const rightDate = new Date(right.created_at).getTime();
    return rightDate - leftDate;
  });
}

function isDetail(value: unknown): value is Detail {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<Detail>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.nom === "string" &&
    typeof candidate.prenom === "string" &&
    typeof candidate.rang === "string" &&
    typeof candidate.created_at === "string"
  );
}

export function readManualDetails() {
  if (!canUseStorage()) return [];

  try {
    const raw = window.localStorage.getItem(LOCAL_DETAILS_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return normalizeDetails(parsed.filter(isDetail));
  } catch {
    return [];
  }
}

export function writeManualDetails(details: Detail[]) {
  if (!canUseStorage()) return normalizeDetails(details);

  const next = normalizeDetails(details);

  try {
    window.localStorage.setItem(LOCAL_DETAILS_KEY, JSON.stringify(next));
  } catch {
    return next;
  }

  return next;
}

export function updateManualDetails(updater: (current: Detail[]) => Detail[]) {
  const current = readManualDetails();
  const next = updater(current);
  return writeManualDetails(next);
}

export function createManualDetail(
  detail: Omit<Detail, "id" | "created_at"> & Partial<Pick<Detail, "id" | "created_at">>,
) {
  return {
    ...detail,
    id: detail.id ?? generateId(),
    created_at: detail.created_at ?? new Date().toISOString(),
  } satisfies Detail;
}
