"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import clsx from "clsx";

const LABEL: Record<string, string> = {
  dashboard: "Dashboard", stok: "Manajemen Stok", baru: "Tambah Ikan", edit: "Edit Ikan", lelang: "Lelang", sesi: "Sesi Lelang",
  pesanan: "Semua Pesanan", pengiriman: "Pengiriman", chat: "Chat", klaim: "Klaim Pembeli", ulasan: "Ulasan",
  laporan: "Laporan Keuangan", pembayaran: "Pembayaran Masuk", notifikasi: "Notifikasi", pengaturan: "Pengaturan",
};
const BISA_DIKLIK = new Set(["/dashboard", "/stok", "/lelang", "/lelang/sesi", "/pesanan", "/pengiriman", "/chat", "/klaim", "/ulasan", "/laporan", "/pembayaran", "/notifikasi", "/pengaturan"]);
interface Crumb { label: string; href?: string }

export function buatCrumb(path: string): Crumb[] {
  const segs = path.split("/").filter(Boolean);
  const out: Crumb[] = [];
  let acc = "";
  for (const s of segs) {
    acc += "/" + s;
    if (/^\d+$/.test(s)) continue; // id numerik tidak ditampilkan
    out.push({ label: LABEL[s] ?? s.toUpperCase(), href: BISA_DIKLIK.has(acc) ? acc : undefined });
  }
  return out;
}

export default function Breadcrumb({ className }: { className?: string }) {
  const crumbs = buatCrumb(usePathname());
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center gap-1.5 overflow-hidden whitespace-nowrap text-sm">
        <li className="hidden shrink-0 items-center gap-1.5 sm:flex">
          <Link href="/dashboard" aria-label="Beranda" className="grid h-6 w-6 place-items-center rounded text-primary-500 hover:bg-primary-50 hover:text-primary-700"><Home size={15} /></Link>
          {crumbs.length > 1 || crumbs[0]?.label !== "Dashboard" ? <ChevronRight size={14} className="text-primary-300" /> : null}
        </li>
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          if (c.label === "Dashboard" && crumbs.length === 1) return <li key={i} className="flex items-center gap-1.5 font-semibold text-primary-900" aria-current="page">Dashboard</li>;
          return (
            <li key={i} className={clsx("min-w-0 items-center gap-1.5", last ? "flex" : "hidden sm:flex")}>
              {last || !c.href
                ? <span className={clsx("truncate", last ? "font-semibold text-primary-900" : "text-primary-500")} aria-current={last ? "page" : undefined}>{c.label}</span>
                : <Link href={c.href} className="truncate text-primary-500 hover:text-primary-700 hover:underline">{c.label}</Link>}
              {!last && <ChevronRight size={14} className="shrink-0 text-primary-300" />}
            </li>);
        })}
      </ol>
    </nav>
  );
}
