"use client";

import { Home, GraduationCap, Images, Phone, Mail, BookOpen, Newspaper } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { GOOGLE_FORMS, SOCIAL_LINKS } from "@/constants";

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5"/></svg>
);

const quickLinks = [
  { label: "Accueil", href: "/", icon: Home },
  { label: "BG1", href: "/bg1", icon: GraduationCap },
  { label: "BG2", href: "/bg2", icon: GraduationCap },
  { label: "Galerie", href: "/testimonials", icon: Images },
  { label: "Emploi", href: "/news", icon: Newspaper },
  { label: "Contact", href: "/#contact", icon: Phone },
];

const courseLinks = [
  { label: "BG1 — Première année", href: GOOGLE_FORMS.BG1 },
  { label: "BG2 — Deuxième année", href: GOOGLE_FORMS.BG2 },
  { label: "Ressources", href: "#" },
  { label: "Exercices", href: "#" },
];

export default function Footer() {
  return (
    <footer className="relative bg-gray-950 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4 group w-fit">
              <span className="h-12 w-12 rounded-full bg-[#ffffff] overflow-hidden shrink-0 inline-block">
                <Image
                  src="/logo.png"
                  alt="Maths Pour BG"
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                  priority
                />
              </span>
              <span className="text-sm font-semibold text-white/90">Maths Pour BG</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Master Mathematics.
              <br />
              Build Your Future.
            </p>
            <p className="text-gray-500 text-xs">
              La plateforme #1 de cours de mathématiques en Tunisie.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Liens Rapides</h3>
            <ul className="flex flex-col items-start gap-1">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 px-3 py-1.5 -ml-3 rounded-full text-gray-400 text-sm hover:bg-white/5 hover:text-sky-400 transition-all cursor-pointer"
                  >
                    <link.icon size={14} className="text-sky-400/70 group-hover:text-sky-400 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h3 className="text-white font-semibold mb-4">Cours</h3>
            <ul className="flex flex-col items-start gap-1">
              {courseLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      link.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="group inline-flex items-center gap-2 px-3 py-1.5 -ml-3 rounded-full text-gray-400 text-sm hover:bg-white/5 hover:text-sky-400 transition-all"
                  >
                    <BookOpen size={14} className="text-sky-400/70 group-hover:text-sky-400 transition-colors" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail size={14} className="text-sky-400 shrink-0" />
                contact@mathspourbg.tn
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone size={14} className="text-sky-400 shrink-0" />
                +216 20 000 000 
              </li>
            </ul>

            {/* Social */}
            <div className="flex gap-2 mt-4">
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all"
              >
                <FacebookIcon />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all"
              >
                <InstagramIcon />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar — navbar-style pill, same navy as the Témoignage/Résultat tabs */}
        <div className="mt-12 flex justify-center">
          <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 rounded-full bg-[#0A2540] shadow-lg shadow-black/30 px-6 py-3">
            <div className="flex items-center gap-2">
              <span className="h-8 w-8 rounded-full bg-[#ffffff] overflow-hidden shrink-0 inline-block">
                <Image
                  src="/logo.png"
                  alt="Maths Pour BG"
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                />
              </span>
              <p className="text-[#ffffff] text-sm font-semibold font-[family-name:var(--font-poppins)]">
                Maths Pour BG
              </p>
              <p className="text-[#ffffff]/70 text-sm hidden sm:block">
                © 2024 Maths Pour BG. Tous droits réservés.
              </p>
            </div>
            <p className="text-[#ffffff]/70 text-xs sm:hidden">
              © 2024 Maths Pour BG. Tous droits réservés.
            </p>
            <p className="text-[#ffffff]/80 text-sm">
              Conçu avec ❤️ en Tunisie
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
