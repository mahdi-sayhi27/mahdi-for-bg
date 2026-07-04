// ============================================
// Maths Pour BG — Local Admin Session (fallback when Supabase isn't configured)
// ============================================

const LOCAL_ADMIN_SESSION_KEY = "maths-pour-bg:local-admin-session";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function setLocalAdminSession() {
  if (!canUseStorage()) return;
  window.localStorage.setItem(LOCAL_ADMIN_SESSION_KEY, "true");
}

export function hasLocalAdminSession() {
  if (!canUseStorage()) return false;
  return window.localStorage.getItem(LOCAL_ADMIN_SESSION_KEY) === "true";
}

export function clearLocalAdminSession() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(LOCAL_ADMIN_SESSION_KEY);
}
