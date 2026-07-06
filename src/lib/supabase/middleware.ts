// ============================================
// Maths Pour BG — Supabase Middleware Client
// ============================================

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "@/lib/supabase/env";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const env = getSupabaseEnv();
  if (!env) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    env.url,
    env.anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // The admin login page falls back to a cookie-based "local admin" session
  // (see src/lib/local-auth.ts) when there's no real Supabase Auth account yet.
  // It only ever grants access to /admin, never /student.
  const isLocalAdmin = request.cookies.get("mpb_local_admin")?.value === "1";

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isStudentRoute = request.nextUrl.pathname.startsWith("/student");

  // Protect dashboard routes
  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/forgot-password");

  if (!user && isStudentRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (!user && isAdminRoute && !isLocalAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/student";
    return NextResponse.redirect(url);
  }

  // Protect admin routes (skip the role check for the local-admin cookie fallback —
  // there's no real profile row backing it).
  if (user && isAdminRoute) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/student";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
