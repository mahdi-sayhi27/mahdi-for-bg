// ============================================
// Maths Pour BG — Supabase Browser Client
// ============================================

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv, hasValidSupabaseEnv } from "@/lib/supabase/env";

export { hasValidSupabaseEnv };

export function createClient() {
  const env = getSupabaseEnv();
  if (!env) {
    throw new Error("Invalid Supabase environment. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  return createBrowserClient(
    env.url,
    env.anonKey
  );
}

export function createClientOrNull() {
  if (!hasValidSupabaseEnv()) return null;
  return createClient();
}
