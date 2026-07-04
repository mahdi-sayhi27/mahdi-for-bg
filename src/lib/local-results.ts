import type { Result } from "@/types";

const LOCAL_RESULTS_KEY = "maths-pour-bg:manual-results";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function generateId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function normalizeResults(results: Result[]) {
  return [...results].sort((left, right) => {
    const leftDate = new Date(left.created_at).getTime();
    const rightDate = new Date(right.created_at).getTime();
    return rightDate - leftDate;
  });
}

function isResult(value: unknown): value is Result {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<Result>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.student_name === "string" &&
    typeof candidate.specialty === "string" &&
    typeof candidate.score === "string" &&
    typeof candidate.created_at === "string"
  );
}

export function readManualResults() {
  if (!canUseStorage()) return [];

  try {
    const raw = window.localStorage.getItem(LOCAL_RESULTS_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return normalizeResults(parsed.filter(isResult));
  } catch {
    return [];
  }
}

export function writeManualResults(results: Result[]) {
  if (!canUseStorage()) return normalizeResults(results);

  const next = normalizeResults(results);

  try {
    window.localStorage.setItem(LOCAL_RESULTS_KEY, JSON.stringify(next));
  } catch {
    return next;
  }

  return next;
}

export function updateManualResults(updater: (current: Result[]) => Result[]) {
  const current = readManualResults();
  const next = updater(current);
  return writeManualResults(next);
}

export function createManualResult(
  result: Omit<Result, "id" | "created_at"> & Partial<Pick<Result, "id" | "created_at">>,
) {
  return {
    ...result,
    id: result.id ?? generateId(),
    created_at: result.created_at ?? new Date().toISOString(),
  } satisfies Result;
}
