import { createClientOrNull, hasValidSupabaseEnv } from "@/lib/supabase/client";
import { readManualEmploi } from "@/lib/local-emploi";
import type { Emploi } from "@/types";

const EMPLOI_COLUMNS = "id, title, class_name, department, semester, pdf_url, archived, created_at";

export async function fetchAllEmploi(): Promise<{ emploi: Emploi[]; supabaseUnavailable: boolean }> {
  if (!hasValidSupabaseEnv()) {
    return { emploi: readManualEmploi(), supabaseUnavailable: true };
  }

  const supabase = createClientOrNull();
  if (!supabase) {
    return { emploi: readManualEmploi(), supabaseUnavailable: true };
  }

  const { data, error } = await supabase
    .from("emploi")
    .select(EMPLOI_COLUMNS)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return { emploi: readManualEmploi(), supabaseUnavailable: true };
  }

  return { emploi: data as Emploi[], supabaseUnavailable: false };
}
