"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ScanSearch, Sparkles } from "lucide-react";
import clsx from "clsx";
import { useToast } from "@/components/Toast";
import { Button, Card } from "@/components/ui";

type Status = "Baik" | "Cukup" | "Perlu dicek";
const NILAI: Record<Status, number> = { Baik: 90, Cukup: 75, "Perlu dicek": 50 };
const BAGIAN = ["Sirip", "Warna", "Aktivitas", "Mata", "Sisik"];
const dari = (n: number): Status => (n >= 85 ? "Baik" : n >= 70 ? "Cukup" : "Perlu dicek");
interface Hasil { nama: string; awal: Status; status: Status; skor: number }
const warna = (s: Status) => (s === "Baik" ? "bg-emerald-500" : s === "Cukup" ? "bg-secondary-500" : "bg-red-500");

// CATATAN: ini simulasi tampilan. Hasil asli datang dari layanan AI Health Scanner di backend.
export default function AiScanner({ fotoSiap, onTerapkan }: { fotoSiap: boolean; onTerapkan: (teks: string) => void }) {
  const toast = useToast();
  const [scanning, setScanning] = useState(false);
  const [hasil, setHasil] = useState<Hasil[] | null>(null);
  const scan = () => {
    setScanning(true); setHasil(null);
    setTimeout(() => {
      setHasil(BAGIAN.map(nama => { const n = 72 + Math.round(Math.random() * 25); return { nama, awal: dari(n), status: dari(n), skor: n }; }));
      setScanning(false);
    }, 1800);
  };
  const ubah = (i: number, status: Status) => setHasil(h => h!.map((x, j) => (j === i ? { ...x, status, skor: status === x.awal ? x.skor : NILAI[status] } : x)));
  const total = hasil ? Math.round(hasil.reduce((n, h) => n + h.skor, 0) / hasil.length) : 0;
  const kategori = total >= 85 ? "Sehat" : total >= 70 ? "Cukup Sehat" : "Perlu Perhatian";
  const dikoreksi = !!hasil?.some(h => h.status !== h.awal);
  const terapkan = () => {
    onTerapkan(`Hasil pindai AI: kondisi ${kategori.toLowerCase()} (skor ${total}/100). ${hasil!.map(h => `${h.nama.toLowerCase()} ${h.status.toLowerCase()}`).join(", ")}.${dikoreksi ? " Telah dikoreksi penjual." : ""}`);
    toast("Hasil pindai diterapkan ke deskripsi kesehatan");
  };
  return (
    <Card>
      <div className="mb-3 flex items-center gap-2"><Sparkles size={16} className="text-secondary-600" /><h3 className="font-semibold">AI Health Scanner</h3></div>
      {!hasil && !scanning && (<>
        <p className="mb-3 text-sm text-primary-500">Pindai foto ikan untuk memperkirakan kondisi sirip, warna, aktivitas, mata, dan sisik. Hasilnya tampil juga di halaman produk pembeli.</p>
        <Button className="w-full" disabled={!fotoSiap} onClick={scan}><ScanSearch size={16} />Pindai Kesehatan Ikan</Button>
        {!fotoSiap && <p className="mt-2 text-xs text-primary-400">Unggah minimal satu foto ikan dulu untuk memindai.</p>}
      </>)}
      {scanning && (
        <div className="py-2"><p className="mb-2 text-sm text-primary-600">Menganalisis foto ikan…</p>
          <div className="h-2 overflow-hidden rounded-full bg-primary-50"><motion.div className="h-full rounded-full bg-gold" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.8, ease: "easeInOut" }} /></div></div>)}
      {hasil && (<>
        <div className="mb-3 flex items-end justify-between">
          <div><p className="text-xs text-primary-400">Skor kesehatan</p><p className="text-3xl font-bold">{total}<span className="text-base font-medium text-primary-400">/100</span></p></div>
          <span className={clsx("rounded-full px-3 py-1 text-sm font-semibold", total >= 85 ? "bg-emerald-50 text-emerald-600" : total >= 70 ? "bg-secondary-100 text-secondary-700" : "bg-red-50 text-red-600")}>{kategori}</span>
        </div>
        <ul className="space-y-3">{hasil.map((h, i) => (
          <li key={h.nama}>
            <div className="mb-1 flex items-center justify-between text-sm"><span>{h.nama}</span>
              <select value={h.status} onChange={e => ubah(i, e.target.value as Status)} aria-label={`Koreksi ${h.nama}`} className="rounded-md border border-primary-100 bg-white px-1.5 py-0.5 text-xs font-medium">
                <option>Baik</option><option>Cukup</option><option>Perlu dicek</option></select></div>
            <div className="h-1.5 rounded-full bg-primary-50"><motion.div className={clsx("h-full rounded-full", warna(h.status))} initial={{ width: 0 }} animate={{ width: `${h.skor}%` }} transition={{ duration: 0.6 }} /></div>
          </li>))}</ul>
        {dikoreksi && <p className="mt-3 text-xs font-medium text-secondary-700">Sudah dikoreksi oleh penjual</p>}
        <p className="mt-3 text-xs text-primary-400">Hasil perkiraan AI. Ubah pilihan di atas bila kondisi sebenarnya berbeda. Penjual tetap bertanggung jawab atas kondisi ikan.</p>
        <div className="mt-3 flex gap-2"><Button className="flex-1 !py-2" onClick={terapkan}>Terapkan ke Deskripsi</Button><Button variant="outline" className="!py-2" onClick={scan}>Pindai Ulang</Button></div>
      </>)}
    </Card>
  );
}
