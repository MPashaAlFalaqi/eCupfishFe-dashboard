"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";
import { Card } from "@/components/ui";

const hari = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const data: Record<string, number[]> = {
  "Minggu ini": [4.3, 6.2, 3.3, 5.4, 4.5, 8.1, 5.8],
  "Minggu lalu": [3.8, 5.1, 4.2, 4.9, 3.6, 6.4, 4.4],
};
export default function PenjualanChart() {
  const [periode, setPeriode] = useState("Minggu ini");
  const v = data[periode], max = Math.max(...v);
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">Penjualan 7 Hari Terakhir</h3>
        <div className="relative">
          <select value={periode} onChange={e => setPeriode(e.target.value)} className="input !w-auto appearance-none !py-1.5 pr-8 text-sm">
            {Object.keys(data).map(p => <option key={p}>{p}</option>)}
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-primary-500" />
        </div>
      </div>
      <div className="flex h-48 gap-3">
        {v.map((n, i) => (
          <div key={hari[i]} className="flex h-full flex-1 flex-col items-center gap-1.5" title={`${hari[i]}: Rp ${n.toLocaleString("id-ID")} jt`}>
            <div className="flex w-full flex-1 items-end">
              <div className={clsx("w-full origin-bottom animate-grow-y rounded-t-lg bg-gradient-to-b transition-all duration-500", n === max ? "from-secondary-300 to-secondary-500" : "from-primary-300 to-primary-500")} style={{ height: `${(n / max) * 100}%`, animationDelay: `${i * 70}ms` }} />
            </div>
            <span className="text-xs text-primary-400">{hari[i]}</span>
          </div>))}
      </div>
    </Card>
  );
}
