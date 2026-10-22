"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Download, FileSpreadsheet, Printer } from "lucide-react";
import { Button } from "@/components/ui";
import { useToast } from "@/components/Toast";

// Ekspor mengikuti filter yang sedang aktif: `rows` sudah berisi data hasil filter.
export default function ExportMenu({ rows, fileName }: { rows: (string | number)[][]; fileName: string }) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const toast = useToast();
  useEffect(() => {
    const h = (e: MouseEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h);
  }, []);
  const csv = () => {
    // titik koma + BOM supaya terbaca benar di Excel berbahasa Indonesia
    const blob = new Blob(["\uFEFF" + rows.map(r => r.join(";")).join("\r\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = fileName; a.click(); URL.revokeObjectURL(a.href);
    setOpen(false); toast("Laporan CSV diunduh sesuai filter");
  };
  const cetak = () => { setOpen(false); setTimeout(() => window.print(), 150); };
  return (
    <div ref={box} className="relative">
      <Button variant="outline" onClick={() => setOpen(o => !o)}><Download size={16} />Ekspor<ChevronDown size={14} /></Button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}
            className="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-xl border border-primary-100 bg-white shadow-card">
            <button onClick={csv} className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-primary-50"><FileSpreadsheet size={16} className="text-primary-500" /><span><b className="block">Unduh CSV</b><span className="text-xs text-primary-400">Sesuai filter, buka di Excel</span></span></button>
            <button onClick={cetak} className="flex w-full items-center gap-3 border-t border-primary-50 px-4 py-3 text-left text-sm hover:bg-primary-50"><Printer size={16} className="text-primary-500" /><span><b className="block">Cetak / Simpan PDF</b><span className="text-xs text-primary-400">Pilih "Simpan sebagai PDF"</span></span></button>
          </motion.div>)}
      </AnimatePresence>
    </div>
  );
}
