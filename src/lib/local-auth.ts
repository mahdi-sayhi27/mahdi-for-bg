// ============================================
// Maths Pour BG — Local Admin Session (fallback when there's no real Supabase Auth session)
// ============================================
// Stored as a cookie (not just localStorage) so the server-side proxy (src/proxy.ts)
// can also recognize it and let the local admin into /admin without a real Supabase user.

const LOCAL_ADMIN_COOKIE = "mpb_local_admin";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function canUseDocument() {
  return typeof document !== "undefined";
}

export function setLocalAdminSession() {
  if (!canUseDocument()) return;
  document.cookie = `${LOCAL_ADMIN_COOKIE}=1; path=/; max-age=${MAX_AGE_SECONDS}; SameSite=Lax`;
}

export function hasLocalAdminSession() {
  if (!canUseDocument()) return false;
  return document.cookie
    .split("; ")
    .some((entry) => entry === `${LOCAL_ADMIN_COOKIE}=1`);
}

export function clearLocalAdminSession() {
  if (!canUseDocument()) return;
  document.cookie = `${LOCAL_ADMIN_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}
