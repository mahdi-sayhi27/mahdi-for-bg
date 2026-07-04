"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Sun,
  Moon,
  ArrowRight,
  MessageCircle,
  Trophy,
  Home,
  GraduationCap,
  Images,
  Phone,
  Newspaper,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/shared/theme-provider";
import { useUnreadAnnouncements } from "@/hooks/use-unread-announcements";
import { markAnnouncementsAsRead } from "@/lib/local-announcements";

const navLinks = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/bg1", label: "BG1", icon: GraduationCap },
  { href: "/bg2", label: "BG2", icon: GraduationCap },
  { href: "/testimonials", label: "Galerie", icon: Images },
  { href: "/#contact", label: "Contact", icon: Phone },
];

const mobileTabs = [
  { href: "/#temoignages", label: "Témoignage", icon: MessageCircle },
  { href: "/#results", label: "Résultat", icon: Trophy },
];

const mobileMenuLinks = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/#results", label: "Résultat", icon: Trophy },
  { href: "/testimonials", label: "Galerie", icon: Images },
  { href: "/news", label: "Emploi", icon: Newspaper },
  { href: "/#contact", label: "Contact", icon: Phone },
];

function NewsBellButton({ size = "md" }: { size?: "md" | "sm" }) {
  const unreadCount = useUnreadAnnouncements();
  const dimension = size === "md" ? "p-2.5" : "p-2";
  const iconSize = size === "md" ? 16 : 20;

  return (
    <Link
      href="/news"
      onClick={() => markAnnouncementsAsRead()}
      className={cn(
        "relative rounded-full border border-white/10 hover:border-white/30 text-gray-300 hover:text-white transition-all cursor-pointer",
        dimension
      )}
      aria-label="Actualités et annonces"
    >
      <Newspaper size={iconSize} />
      <AnimatePresence>
        {unreadCount > 0 && (
          <motion.span
            key="badge"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 text-white text-[10px] font-bold flex items-center justify-center shadow-lg shadow-sky-500/40"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled || !isHome
            ? "bg-gray-950/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20 gap-3">
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <span className="h-14 w-14 rounded-full bg-[#ffffff] overflow-hidden shrink-0 inline-block">
                <Image
                  src="/logo.png"
                  alt="Maths Pour BG"
                  width={56}
                  height={56}
                  className="h-full w-full object-cover"
                  priority
                />
              </span>
              <span className="text-sm font-semibold text-white/90 whitespace-nowrap">
                Maths Pour BG
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href === "/" && pathname === "/");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all relative group rounded-full",
                      isActive ? "bg-white/10" : "hover:bg-white/5"
                    )}
                  >
                    <link.icon
                      size={14}
                      className={cn(
                        "transition-colors",
                        isActive ? "text-cyan-300" : "text-sky-400/70 group-hover:text-cyan-300"
                      )}
                    />
                    <span
                      className={cn(
                        "transition-colors",
                        isActive ? "text-gradient" : "text-gray-300 group-hover:text-gradient"
                      )}
                    >
                      {link.label}
                    </span>
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 rounded-full bg-gradient-to-r from-sky-400 to-cyan-400 group-hover:w-3/4 transition-all duration-300" />
                  </Link>
                );
              })}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={toggle}
                className="p-2.5 rounded-full border border-white/10 hover:border-white/30 text-gray-300 hover:text-white transition-all cursor-pointer"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              <NewsBellButton size="md" />

              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full hover:shadow-lg hover:shadow-sky-500/25 transition-all duration-300 hover:scale-105"
              >
                Rejoindre
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={toggle}
                className="p-2 text-gray-300 hover:text-white transition-colors cursor-pointer"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <NewsBellButton size="sm" />
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 text-gray-300 hover:text-white transition-colors cursor-pointer"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile sub-tabs: Témoignage / Résultat */}
        <div className="lg:hidden grid grid-cols-2 gap-1.5">
          {mobileTabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className="group relative flex items-center justify-center gap-2 py-4 rounded-b-[32px] bg-[#0A2540] shadow-lg shadow-black/30 font-[family-name:var(--font-poppins)] transition-all duration-300 ease-out hover:bg-[#0A2540]/90 active:scale-[0.98]"
            >
              <tab.icon size={15} className="text-[#ffffff]/80 group-hover:text-[#ffffff] group-hover:scale-110 transition-all duration-300" />
              <span className="text-sm font-medium text-[#ffffff]/90 group-hover:text-[#ffffff] transition-colors duration-300">
                {tab.label}
              </span>
              <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0.5 rounded-full bg-[#ffffff] group-hover:w-8 transition-all duration-300 ease-out" />
            </Link>
          ))}
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-gray-950/95 backdrop-blur-xl border-l border-white/10 z-50 lg:hidden p-6 flex flex-col"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="self-end p-2 text-gray-400 hover:text-white mb-8 cursor-pointer"
              >
                <X size={24} />
              </button>

              <div className="flex flex-col gap-2">
                {mobileMenuLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="group flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer"
                    >
                      <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-sky-400 group-hover:text-cyan-300 group-hover:border-cyan-400/30 transition-colors">
                        <link.icon size={16} />
                      </span>
                      <span className="text-lg font-medium text-gray-200 group-hover:text-gradient transition-colors">
                        {link.label}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
