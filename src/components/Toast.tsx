"use client";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
const Ctx = createContext<(msg: string) => void>(() => {});
export const useToast = () => useContext(Ctx);
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<{ id: number; msg: string }[]>([]);
  const push = useCallback((msg: string) => {
    const id = Date.now() + Math.random();
    setItems(s => [...s, { id, msg }]);
    setTimeout(() => setItems(s => s.filter(i => i.id !== id)), 2800);
  }, []);
  return (
    <Ctx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[70] flex flex-col gap-2" aria-live="polite">
        <AnimatePresence>
          {items.map(t => (
            <motion.div key={t.id} layout initial={{ opacity: 0, y: 24, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, x: 48 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="pointer-events-auto flex items-center gap-2 rounded-xl bg-primary-950 px-4 py-3 text-sm font-medium text-white shadow-lg">
              <CheckCircle2 size={16} className="text-secondary-400" />{t.msg}
            </motion.div>))}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  );
}
