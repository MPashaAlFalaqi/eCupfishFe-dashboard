"use client";
import { useState } from "react";
import clsx from "clsx";
import { Clock, CreditCard, PackageCheck, Truck } from "lucide-react";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import Tabs from "@/components/Tabs";
import { useToast } from "@/components/Toast";
import SearchInput from "@/components/SearchInput";
import DataTable, { type Column } from "@/components/DataTable";
import { Button, Card, Pill } from "@/components/ui";
import { rp } from "@/lib/format";
import type { Pesanan, StatusPesanan } from "@/lib/types";
import DetailPesananModal from "./DetailPesananModal";

const tabs = ["Semua", "Menunggu Bayar", "Dibayar", "Dikemas", "Dikirim", "Selesai", "Dibatalkan"] as const;
export const tone = { "Menunggu Bayar": "gray", Dibayar: "gold", Dikemas: "blue", Dikirim: "blue", Selesai: "green", Dibatalkan: "red" } as const;

export default function PesananView({ data }: { data: Pesanan[] }) {
  const [items, setItems] = useState(data);
  const toast = useToast();
  const [tab, setTab] = useState<(typeof tabs)[number]>("Semua");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<Pesanan | null>(null);
  const count = (s: StatusPesanan) => items.filter(i => i.status === s).length;
  const k = q.toLowerCase();
  const rows = items.filter(i => (tab === "Semua" || i.status === tab) && [i.id, i.pembeli, i.ikan].some(v => v.toLowerCase().includes(k)));
  const msg: Partial<Record<StatusPesanan, string>> = { Dikemas: "Pesanan diterima & mulai dikemas", Dikirim: "Pesanan ditandai dikirim", Dibatalkan: "Pesanan dibatalkan" };
  const setStatus = (id: string, status: StatusPesanan) => { setItems(s => s.map(i => (i.id === id ? { ...i, status } : i))); if (msg[status]) toast(msg[status]!); };

  const columns: Column<Pesanan>[] = [
    { header: "ID Pesanan", cell: r => <b>{r.id}</b> },
    { header: "Pembeli", cell: r => r.pembeli },
    { header: "Ikan", cell: r => <div><p className="font-semibold">{r.ikan}</p><p className="text-xs text-primary-400">{r.jumlah} ekor</p></div> },
    { header: "Sumber", cell: r => <Pill tone={r.sumber === "Lelang" ? "gold" : "blue"}>{r.sumber}</Pill> },
    { header: "Total", cell: r => <b>{rp(r.hargaSatuan * r.jumlah + r.ongkir)}</b> },
    { header: "Tanggal", cell: r => r.tanggal },
    { header: "Status", cell: r => <Pill tone={tone[r.status]}>{r.status}</Pill> },
    { header: "Aksi", cell: r => <Button variant={r.status === "Dibayar" ? "primary" : "outline"} className="!px-4 !py-1.5" onClick={() => setSel(r)}>{r.status === "Dibayar" ? "Proses" : "Detail"}</Button> },
  ];
  return (
    <>
      <Topbar title="Pesanan" subtitle="Semua pesanan dari pembelian langsung dan lelang"
        action={<SearchInput value={q} onChange={setQ} placeholder="Cari ID, pembeli, ikan..." />} />
      <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Menunggu Bayar" value={String(count("Menunggu Bayar"))} icon={Clock} />
        <StatCard variant="blue" label="Perlu Diproses" value={String(count("Dibayar"))} icon={CreditCard} />
        <StatCard label="Sedang Dikirim" value={String(count("Dikirim"))} icon={Truck} />
        <StatCard label="Selesai" value={String(count("Selesai"))} icon={PackageCheck} />
      </div>
      <Tabs tabs={tabs} value={tab} onChange={setTab} counts={Object.fromEntries(tabs.filter(t => t !== "Semua").map(t => [t, count(t as StatusPesanan)]))} />
      <Card className="!p-2"><DataTable columns={columns} rows={rows} empty="Belum ada pesanan di tahap ini" /></Card>
      <DetailPesananModal data={sel} onClose={() => setSel(null)} onStatus={setStatus} />
    </>
  );
}
