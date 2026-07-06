import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Combine rows fetched from Supabase with rows saved to the browser's local-storage
 * fallback (used when a write succeeded locally but was rejected by Supabase RLS —
 * see src/lib/local-*.ts). Supabase rows win on id collisions; local-only rows are
 * appended so nothing saved locally silently disappears from the UI.
 */
export function mergeById<T extends { id: string }>(remote: T[], local: T[]): T[] {
  const remoteIds = new Set(remote.map((item) => item.id));
  return [...remote, ...local.filter((item) => !remoteIds.has(item.id))];
}
