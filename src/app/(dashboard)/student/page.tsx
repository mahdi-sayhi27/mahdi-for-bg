"use client";

import { motion } from "framer-motion";
import { BookOpen, Bell, FileText, User, ArrowRight } from "lucide-react";
import Link from "next/link";

const quickActions = [
  {
    title: "Mon Profil",
    desc: "Gérer vos informations personnelles",
    icon: User,
    href: "/student/profile",
    color: "sky",
  },
  {
    title: "Annonces",
    desc: "Dernières nouvelles et mises à jour",
    icon: Bell,
    href: "/student/announcements",
    color: "cyan",
  },
  {
    title: "Ressources",
    desc: "Télécharger les cours et exercices",
    icon: FileText,
    href: "/student/resources",
    color: "blue",
  },
  {
    title: "Inscription",
    desc: "Statut de votre inscription",
    icon: BookOpen,
    href: "/student/registration",
    color: "indigo",
  },
];

export default function StudentDashboard() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          Bienvenue ! 👋
        </h1>
        <p className="text-gray-400">
          Voici un aperçu de votre espace étudiant
        </p>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickActions.map((action, i) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              href={action.href}
              className="block p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-sky-500/30 hover:bg-white/[0.08] transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center mb-4 group-hover:bg-sky-500/20 transition-colors">
                <action.icon className="w-6 h-6 text-sky-400" />
              </div>
              <h3 className="text-white font-semibold mb-1">{action.title}</h3>
              <p className="text-gray-400 text-sm mb-3">{action.desc}</p>
              <span className="inline-flex items-center gap-1 text-sky-400 text-sm font-medium group-hover:gap-2 transition-all">
                Accéder <ArrowRight size={14} />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Announcements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl bg-white/5 border border-white/10 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Dernières annonces</h2>
          <Link
            href="/student/announcements"
            className="text-sky-400 text-sm hover:text-sky-300 transition-colors"
          >
            Voir tout →
          </Link>
        </div>
        <div className="space-y-4">
          {[
            {
              title: "Nouveau cours disponible",
              content: "Le chapitre 5 sur les intégrales est maintenant disponible.",
              date: "Aujourd'hui",
              priority: "high",
            },
            {
              title: "Devoirs de la semaine",
              content: "N'oubliez pas de rendre les exercices du chapitre 4.",
              date: "Hier",
              priority: "medium",
            },
            {
              title: "Examens blancs",
              content: "Les examens blancs commencent la semaine prochaine.",
              date: "Il y a 3 jours",
              priority: "low",
            },
          ].map((announcement, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/5 transition-colors"
            >
              <div
                className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                  announcement.priority === "high"
                    ? "bg-red-400"
                    : announcement.priority === "medium"
                    ? "bg-yellow-400"
                    : "bg-green-400"
                }`}
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium text-sm">
                  {announcement.title}
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  {announcement.content}
                </p>
              </div>
              <span className="text-gray-500 text-xs shrink-0">
                {announcement.date}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
