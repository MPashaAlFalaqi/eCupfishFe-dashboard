"use client";
import { useEffect, useState } from "react";
// Angka naik dari 0 ke nilai akhir (mendukung format Indonesia: 38.450.000 / 48,2)
export default function CountUp({ value }: { value: string }) {
  const m = /\d[\d.,]*/.exec(value);
  const raw = m?.[0] ?? "";
  const dec = raw.includes(",") ? raw.split(",")[1].length : 0;
  const target = m ? parseFloat(raw.replace(/\./g, "").replace(",", ".")) : 0;
  const [cur, setCur] = useState(target);
  useEffect(() => {
    if (!m || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0; const t0 = performance.now();
    const tick = (t: number) => { const p = Math.min(1, (t - t0) / 800); setCur(target * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  if (!m) return <>{value}</>;
  return <>{value.replace(raw, cur.toLocaleString("id-ID", { minimumFractionDigits: dec, maximumFractionDigits: dec }))}</>;
}
