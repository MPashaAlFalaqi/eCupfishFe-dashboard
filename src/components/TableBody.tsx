"use client";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
export interface BodyRow { id: string; cls: string; cells: { k: string; cls: string; node: ReactNode }[] }
export default function TableBody({ rows, cols, empty }: { rows: BodyRow[]; cols: number; empty: string }) {
  return (
    <tbody className="divide-y divide-primary-50">
      {rows.length === 0 && <tr><td colSpan={cols} className="px-3 py-10 text-center text-primary-400">{empty}</td></tr>}
      <AnimatePresence initial={false}>
        {rows.map(r => (
          <motion.tr key={r.id} layout="position" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className={`hover:bg-primary-50/40 ${r.cls}`}>
            {r.cells.map(c => <td key={c.k} className={`px-3 py-3 ${c.cls}`}>{c.node}</td>)}
          </motion.tr>))}
      </AnimatePresence>
    </tbody>
  );
}
