"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Download, FileSpreadsheet, Printer } from "lucide-react";
import { Button } from "@/components/ui";
import { useToast } from "@/components/Toast";
import { laporanMingguan } from "@/lib/mock-data";

export default function ExportMenu() {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const toast = useToast();
  useEffect(() => {
    const h = (e: MouseEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h);
  }, []);
  const csv = () => {
    const baris: (string | number)[][] = [["Periode", "Pendapatan (Rp)", "Pengeluaran (Rp)", "Laba/Rugi (Rp)"],
      ...laporanMingguan.map(r => [r.minggu, r.pendapatan, r.pengeluaran, r.pendapatan - r.pengeluaran])];
    const t = laporanMingguan.reduce((a, r) => ({ p: a.p + r.pendapatan, k: a.k + r.pengeluaran }), { p: 0, k: 0 });
    baris.push(["Total", t.p, t.k, t.p - t.k]);
    // titik koma + BOM supaya terbaca benar di Excel berbahasa Indonesia
    const blob = new Blob(["\uFEFF" + baris.map(r => r.join(";")).join("\r\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "laporan-keuangan-2026-09.csv"; a.click(); URL.revokeObjectURL(a.href);
    setOpen(false); toast("Laporan CSV diunduh");
  };
  const cetak = () => { setOpen(false); setTimeout(() => window.print(), 150); };
  return (
    <div ref={box} className="relative">
      <Button variant="outline" onClick={() => setOpen(o => !o)}><Download size={16} />Ekspor<ChevronDown size={14} /></Button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}
            className="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-xl border border-primary-100 bg-white shadow-card">
            <button onClick={csv} className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-primary-50"><FileSpreadsheet size={16} className="text-primary-500" /><span><b className="block">Unduh CSV</b><span className="text-xs text-primary-400">Buka di Excel atau Sheets</span></span></button>
            <button onClick={cetak} className="flex w-full items-center gap-3 border-t border-primary-50 px-4 py-3 text-left text-sm hover:bg-primary-50"><Printer size={16} className="text-primary-500" /><span><b className="block">Cetak / Simpan PDF</b><span className="text-xs text-primary-400">Pilih "Simpan sebagai PDF"</span></span></button>
          </motion.div>)}
      </AnimatePresence>
    </div>
  );
}
