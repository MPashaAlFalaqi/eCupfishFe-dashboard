"use client";
import { useId } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
export default function Tabs<T extends string>({ tabs, value, onChange, counts }: { tabs: readonly T[]; value: T; onChange: (v: T) => void; counts?: Partial<Record<T, number>> }) {
  const id = useId();
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {tabs.map(t => (
        <button key={t} onClick={() => onChange(t)} className={clsx("relative rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
          value === t ? "border-primary-400 text-white" : "border-primary-100 bg-white text-primary-600 hover:bg-primary-50")}>
          {value === t && <motion.span layoutId={`tab-${id}`} transition={{ type: "spring", stiffness: 420, damping: 34 }} className="absolute inset-0 rounded-full bg-primary-400" />}
          <span className="relative">{t}{counts?.[t] !== undefined && <span className="ml-1.5 opacity-70">{counts[t]}</span>}</span>
        </button>))}
    </div>
  );
}
