"use client";
import Link from "next/link";
import { Button, Card, Pill } from "@/components/ui";
import DataTable, { type Column } from "@/components/DataTable";
import { bidTertinggi, hms, rp } from "@/lib/format";
import { sesiList } from "@/lib/mock-data";
import type { SesiLelang } from "@/lib/types";
import { tone } from "../sesi/_components/SesiView";

const aktif = sesiList.filter(s => s.status === "Live" || s.status === "Terjadwal").sort((a, b) => (a.status === "Live" ? -1 : 1) - (b.status === "Live" ? -1 : 1));
const columns: Column<SesiLelang>[] = [
  { header: "Produk", cell: r => <div><p className="font-bold">{r.produk}</p><p className="text-xs text-primary-400">Grade {r.grade} · {r.id}</p></div> },
  { header: "Bid Tertinggi", cell: r => <b>{rp(bidTertinggi(r))}</b> },
  { header: "Penawar", cell: r => new Set(r.bids.map(b => b.nama)).size },
  { header: "Waktu", cell: r => (r.status === "Live" ? <b className="text-secondary-600">{hms(r.sisaDetik)}</b> : <span className="text-primary-500">{r.jadwal}</span>) },
  { header: "Status", cell: r => <Pill tone={tone[r.status]}>{r.status}</Pill> },
  { header: "Aksi", cell: r => <Link href={`/lelang/sesi/${r.id}`}><Button variant={r.status === "Live" ? "primary" : "outline"} className="!px-4 !py-1.5">{r.status === "Live" ? "Pantau" : "Detail"}</Button></Link> },
];
export default function SesiAktif() {
  return (
    <Card>
      <div className="mb-3 flex items-center justify-between"><h3 className="font-semibold">Sesi Lelang Aktif</h3><Link href="/lelang/sesi" className="text-sm font-medium text-primary-500">Lihat semua</Link></div>
      <DataTable columns={columns} rows={aktif} empty="Belum ada sesi aktif. Isi form di atas untuk memulai lelang pertamamu!" />
    </Card>
  );
}
