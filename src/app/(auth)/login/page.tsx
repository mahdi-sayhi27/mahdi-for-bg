"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ADMIN_CREDENTIALS } from "@/constants";
import { createClientOrNull, hasValidSupabaseEnv } from "@/lib/supabase/client";
import { setLocalAdminSession } from "@/lib/local-auth";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClientOrNull();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Only the admin account can log in.
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      let supabaseSessionFailed = false;

      if (hasValidSupabaseEnv() && supabase) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          console.warn("No real Supabase session for the admin account yet — using local admin session instead:", signInError.message);
          supabaseSessionFailed = true;
        }
      }

      // Cookie-based fallback session (see src/lib/local-auth.ts): lets the proxy
      // (src/proxy.ts) grant /admin access even without a real Supabase Auth session.
      setLocalAdminSession();

      if (supabaseSessionFailed) {
        // Warn instead of blocking: the panel still opens via the local session,
        // but Supabase-backed features (image uploads, etc.) need a real auth.users
        // account for this email — RLS will reject those requests without it.
        window.sessionStorage?.setItem(
          "maths-pour-bg:supabase-session-warning",
          "Le compte admin n'existe pas encore dans Supabase Auth. Les fonctionnalités liées à Supabase (upload d'images, etc.) ne fonctionneront pas tant qu'il n'est pas créé.",
        );
      } else {
        window.sessionStorage?.removeItem("maths-pour-bg:supabase-session-warning");
      }

      setLoading(false);
      router.push("/admin");
      return;
    }

    setLoading(false);
    setError("Email ou mot de passe incorrect");
  };

  return (
    <div className="min-h-[100svh] flex items-start justify-center px-4 sm:px-6 py-24 lg:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-cyan-400 flex items-center justify-center text-white font-bold">
            M
          </div>
          <span className="text-2xl font-bold text-gradient">
            Maths Pour BG
          </span>
        </Link>

        {/* Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-2xl shadow-black/10">
          <h1 className="text-2xl font-bold text-white mb-2">Connexion</h1>
          <p className="text-gray-400 text-sm mb-8">
            Accès réservé à l&apos;administrateur
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Email</label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">
                Mot de passe
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-12 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sky-400 text-sm hover:text-sky-300 transition-colors"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 text-white font-semibold hover:shadow-lg hover:shadow-sky-500/25 hover:scale-[1.01] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Se connecter
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
