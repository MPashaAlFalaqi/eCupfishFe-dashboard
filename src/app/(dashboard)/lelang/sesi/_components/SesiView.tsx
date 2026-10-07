"use client";
import Link from "next/link";
import { useState } from "react";
import { CalendarClock, CheckCircle2, FileText, Plus, Radio } from "lucide-react";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import Tabs from "@/components/Tabs";
import DataTable, { type Column } from "@/components/DataTable";
import { Button, Card, Pill } from "@/components/ui";
import { bidTertinggi, hms, rp } from "@/lib/format";
import type { SesiLelang, StatusSesi } from "@/lib/types";

const tabs = ["Semua", "Live", "Terjadwal", "Draft", "Selesai", "Dibatalkan"] as const;
export const tone = { Live: "gold", Terjadwal: "blue", Draft: "gray", Selesai: "green", Dibatalkan: "red" } as const;

export default function SesiView({ data }: { data: SesiLelang[] }) {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Semua");
  const n = (s: StatusSesi) => data.filter(d => d.status === s).length;
  const rows = data.filter(d => tab === "Semua" || d.status === tab);
  const columns: Column<SesiLelang>[] = [
    { header: "Produk", cell: r => <div><p className="font-bold">{r.produk}</p><p className="text-xs text-primary-400">Grade {r.grade} · {r.id}</p></div> },
    { header: "Harga Awal", cell: r => rp(r.hargaAwal) },
    { header: "Bid Tertinggi", cell: r => <b>{rp(bidTertinggi(r))}</b> },
    { header: "Penawar", cell: r => new Set(r.bids.map(b => b.nama)).size },
    { header: "Waktu", cell: r => (r.status === "Live" ? <b className="text-secondary-600">{hms(r.sisaDetik)}</b> : <span className="text-primary-500">{r.jadwal}</span>) },
    { header: "Status", cell: r => <Pill tone={tone[r.status]}>{r.status}</Pill> },
    { header: "Aksi", cell: r => <Link href={`/lelang/sesi/${r.id}`}><Button variant={r.status === "Live" ? "primary" : "outline"} className="!px-4 !py-1.5">{r.status === "Live" ? "Pantau" : "Detail"}</Button></Link> },
  ];
  return (
    <>
      <Topbar title="Sesi Lelang" subtitle="Pantau semua sesi lelang: live, terjadwal, dan selesai"
        action={<Link href="/lelang"><Button variant="gold"><Plus size={16} />Buat Sesi Baru</Button></Link>} />
      <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard variant="blue" label="Sedang Live" value={String(n("Live"))} icon={Radio} />
        <StatCard label="Terjadwal" value={String(n("Terjadwal"))} icon={CalendarClock} />
        <StatCard label="Draft" value={String(n("Draft"))} icon={FileText} />
        <StatCard label="Selesai" value={String(n("Selesai"))} icon={CheckCircle2} />
      </div>
      <Tabs tabs={tabs} value={tab} onChange={setTab} />
      <Card className="!p-2"><DataTable columns={columns} rows={rows} empty="Belum ada sesi di tahap ini. Yuk buat lelang pertamamu!" /></Card>
    </>
  );
}
