"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Trophy,
  MessageSquare,
  Images,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart3,
  ListOrdered,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClientOrNull, hasValidSupabaseEnv } from "@/lib/supabase/client";
import { clearLocalAdminSession, hasLocalAdminSession } from "@/lib/local-auth";

const sidebarLinks = [
  { href: "/admin", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/admin/temoignages", label: "Témoignages", icon: MessageSquare },
  { href: "/admin/results", label: "Résultats", icon: Trophy },
  { href: "/admin/details", label: "Détails", icon: ListOrdered },
  { href: "/admin/testimonials", label: "Galerie", icon: Images },
  { href: "/admin/announcements", label: "Annonces", icon: Bell },
  { href: "/admin/analytics", label: "Analytique", icon: BarChart3 },
  { href: "/admin/settings", label: "Paramètres", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [sessionWarning, setSessionWarning] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      if (hasValidSupabaseEnv()) {
        const supabase = createClientOrNull();
        const { data } = (await supabase?.auth.getUser()) ?? { data: { user: null } };
        if (data.user) {
          if (active) setAuthorized(true);
          return;
        }
      }

      if (hasLocalAdminSession()) {
        if (active) {
          setAuthorized(true);
          setSessionWarning(window.sessionStorage?.getItem("maths-pour-bg:supabase-session-warning") ?? null);
        }
        return;
      }

      if (active) {
        setAuthorized(false);
        router.replace("/login");
      }
    })();

    return () => {
      active = false;
    };
  }, [router]);

  const handleLogout = async () => {
    clearLocalAdminSession();
    const supabase = createClientOrNull();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push("/login");
  };

  if (authorized !== true) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-sky-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col fixed inset-y-0 left-0 bg-gray-950 border-r border-white/10 z-40">
        <div className="h-16 flex items-center gap-2 px-6 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-cyan-400 flex items-center justify-center text-white font-bold text-xs">
            M
          </div>
          <span className="text-lg font-bold text-gradient">Admin Panel</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                pathname === link.href
                  ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <link.icon size={18} />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all cursor-pointer"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 inset-x-0 h-16 bg-gray-950/90 backdrop-blur-xl border-b border-white/10 z-40 flex items-center justify-between px-4">
        <span className="font-bold text-gradient">Admin Panel</span>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-gray-400">
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-72 bg-gray-950 border-r border-white/10 z-50 lg:hidden p-4 pt-20"
            >
              <nav className="space-y-1">
                {sidebarLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                      pathname === link.href ? "bg-sky-500/10 text-sky-400" : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}>
                    <link.icon size={18} />
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-4 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setSidebarOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all cursor-pointer"
                >
                  <LogOut size={18} />
                  Déconnexion
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 lg:ml-72 pt-16 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8">
          {sessionWarning && (
            <div className="mb-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-yellow-100 text-sm">
              {sessionWarning}
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
