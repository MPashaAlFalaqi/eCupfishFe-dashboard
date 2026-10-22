"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { SidebarBody } from "./Sidebar";
import { useShell } from "./ShellProvider";

// Laci menu untuk layar di bawah 1024 px (dibuka dari tombol di Navbar)
export default function MobileDrawer() {
  const { mobileOpen: open, setMobileOpen } = useShell();
  const path = usePathname();
  useEffect(() => setMobileOpen(false), [path, setMobileOpen]);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);
  useEffect(() => { const h = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false); if (open) window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h); }, [open, setMobileOpen]);
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div key="overlay" className="fixed inset-0 z-50 bg-primary-950/60 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.aside key="drawer" role="dialog" aria-modal aria-label="Menu navigasi" className="fixed inset-y-0 left-0 z-50 flex w-64 max-w-[85vw] flex-col overflow-y-auto bg-primary-950 p-4 lg:hidden"
            initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", stiffness: 380, damping: 36 }}>
            <button onClick={() => setMobileOpen(false)} aria-label="Tutup menu" className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-lg text-primary-200 hover:bg-primary-800"><X size={18} /></button>
            <SidebarBody ns="m" onNavigate={() => setMobileOpen(false)} />
          </motion.aside>
        </>)}
    </AnimatePresence>
  );
}
