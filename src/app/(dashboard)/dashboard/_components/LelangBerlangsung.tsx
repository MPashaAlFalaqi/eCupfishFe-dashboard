"use client";
import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { Card, Pill } from "@/components/ui";

const pad = (n: number) => String(n).padStart(2, "0");
export default function LelangBerlangsung() {
  const [sisa, setSisa] = useState(2 * 3600 + 14 * 60 + 36);
  useEffect(() => { const t = setInterval(() => setSisa(s => Math.max(0, s - 1)), 1000); return () => clearInterval(t); }, []);
  return (
    <Card>
      <div className="mb-3 flex items-center justify-between"><h3 className="font-semibold">Lelang Berlangsung</h3><Pill tone="gold">Live</Pill></div>
      <div className="flex h-32 items-end rounded-xl bg-gradient-to-br from-primary-500 to-primary-900 p-3">
        <p className="text-sm font-semibold text-white">Halfmoon Blue Rim · Grade A</p>
      </div>
      <div className="mt-3 flex items-end justify-between">
        <div><p className="text-xs text-primary-400">Tawaran tertinggi</p><p className="text-xl font-bold">Rp 850.000</p></div>
        <p className="flex items-center gap-1.5 text-sm font-semibold text-secondary-600"><Clock size={14} />{pad(Math.floor(sisa / 3600))}:{pad(Math.floor(sisa / 60) % 60)}:{pad(sisa % 60)}</p>
      </div>
    </Card>
  );
}
