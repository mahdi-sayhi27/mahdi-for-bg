"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import ScrollProgress from "@/components/shared/scroll-progress";
import BackToTop from "@/components/shared/back-to-top";
import { cn } from "@/lib/utils";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/admin") || pathname.startsWith("/student");
  const hideFooter = isDashboard || pathname === "/news";

  return (
    <>
      {!isDashboard && <ScrollProgress />}
      {!isDashboard && <Navbar />}

      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={cn("min-h-screen", !isDashboard && "pt-[108px] lg:pt-20")}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {!hideFooter && <Footer />}
      {!isDashboard && <BackToTop />}
    </>
  );
}