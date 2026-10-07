"use client";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
export default function Modal({ open, onClose, title, subtitle, icon, size = "max-w-lg", children, footer }:
  { open: boolean; onClose: () => void; title: string; subtitle?: string; icon?: ReactNode; size?: string; children: ReactNode; footer?: ReactNode }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-primary-950/60 p-4 backdrop-blur-sm" onClick={onClose}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          <motion.div role="dialog" aria-modal className={`max-h-[90vh] w-full ${size} overflow-y-auto rounded-card bg-white shadow-card`} onClick={e => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}>
            <div className="flex items-start justify-between border-b border-primary-50 p-5">
              <div className="flex items-center gap-3">{icon}<div><h2 className="text-lg font-bold">{title}</h2>{subtitle && <p className="text-sm text-primary-500">{subtitle}</p>}</div></div>
              <button onClick={onClose} aria-label="Tutup" className="rounded-lg border border-primary-100 p-1.5 text-primary-500 hover:bg-primary-50"><X size={18} /></button>
            </div>
            <div className="space-y-4 p-5">{children}</div>
            {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-primary-50 p-4">{footer}</div>}
          </motion.div>
        </motion.div>)}
    </AnimatePresence>
  );
}
