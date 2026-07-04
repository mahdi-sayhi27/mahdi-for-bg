"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { SOCIAL_LINKS } from "@/constants";

const FacebookIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
);
const InstagramIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5"/></svg>
);

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const contactItems = [
    {
      icon: Phone,
      label: "Phone",
      value: "+216 00 000",
      href: SOCIAL_LINKS.whatsapp,
    },
    {
      icon: Mail,
      label: "Email",
      value: "contact@mathspourbg.tn",
      href: SOCIAL_LINKS.email,
    },
    {
      icon: FacebookIcon,
      label: "Facebook",
      value: "@mathspourbg",
      href: SOCIAL_LINKS.facebook,
    },
    {
      icon: InstagramIcon,
      label: "Instagram",
      value: "@mathspourbg",
      href: SOCIAL_LINKS.instagram,
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Tunis, Tunisie",
      href: "#",
    },
  ];

  return (
    <section id="contact" className="relative py-24 lg:py-32 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sky-400 text-sm font-semibold uppercase tracking-widest">
            Contact
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4 mb-4">
            <span className="text-gradient">Contactez</span>-nous
          </h2>
          <p className="text-gray-400 text-lg">
            Nous sommes là pour vous aider
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
        >
          {contactItems.map((item, index) => (
            <motion.a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 18 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.35, delay: 0.25 + index * 0.07 }}
              className="group rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 hover:border-sky-500/30 hover:bg-white/[0.08] hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-black/15"
            >
              <div className="w-11 h-11 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center group-hover:bg-sky-500/20 transition-colors">
                <item.icon className="w-5 h-5" />
              </div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mt-4">{item.label}</p>
              <p className="text-white font-semibold mt-2 break-words">{item.value}</p>
            </motion.a>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 rounded-3xl border border-sky-500/20 bg-gradient-to-r from-sky-500/10 via-cyan-500/10 to-transparent p-6 sm:p-8"
        >
          <h3 className="text-2xl font-semibold text-white">Parlons de votre inscription</h3>
          <p className="text-gray-300 mt-2">
            Notre équipe vous répond rapidement sur WhatsApp, email, Facebook ou Instagram.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
