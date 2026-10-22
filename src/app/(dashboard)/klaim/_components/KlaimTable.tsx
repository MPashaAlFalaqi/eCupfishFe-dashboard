"use client";
import Link from "next/link";
import { useState } from "react";
import { Badge, Button, Card } from "@/components/ui";
import FilterBar, { usePeriode } from "@/components/FilterBar";
import { dalamPeriode, ekstrakTanggal } from "@/lib/periode";
import DataTable, { type Column } from "@/components/DataTable";
import type { Klaim } from "@/lib/types";

const tone = { Pending: "gold", Disetujui: "green", Ditolak: "gray" } as const;
export default function KlaimTable({ data }: { data: Klaim[] }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [alasan, setAlasan] = useState("");
  const periode = usePeriode();
  const k = q.toLowerCase();
  const alasanList = Array.from(new Set(data.map(r => r.alasan)));
  const rows = data.filter(r => (!status || r.status === status) && (!alasan || r.alasan === alasan) && dalamPeriode(ekstrakTanggal(r.tanggal), periode.value, periode.dari, periode.sampai) && [r.id, r.pembeli, r.ikan].some(v => v.toLowerCase().includes(k)));
  const columns: Column<Klaim>[] = [
    { header: "ID Klaim", cell: r => <b>#{r.id}</b> },
    { header: "Pembeli", cell: r => r.pembeli },
    { header: "Jenis Ikan", cell: r => r.ikan },
    { header: "Tanggal Klaim", cell: r => r.tanggal },
    { header: "Alasan", cell: r => <Badge tone="red">{r.alasan}</Badge> },
    { header: "Status", cell: r => <div><Badge tone={tone[r.status]}>{r.status}</Badge>{r.status === "Pending" && r.batas && <p className="mt-1 text-xs text-red-500">Tanggapi dalam {r.batas}</p>}</div> },
    { header: "Aksi", cell: r => <Link href={`/klaim/${r.id}`}><Button variant={r.status === "Pending" ? "primary" : "outline"} className="!px-3 !py-1.5">{r.status === "Pending" ? "Tinjau" : "Detail"}</Button></Link> },
  ];
  return (
    <>
      <FilterBar total={rows.length} periode={periode} search={{ value: q, onChange: setQ, placeholder: "Cari ID klaim, pembeli, ikan..." }}
        filters={[{ label: "Status", value: status, onChange: setStatus, options: ["Pending", "Disetujui", "Ditolak"] }, { label: "Alasan", value: alasan, onChange: setAlasan, options: alasanList }]} />
      <Card className="!p-2"><DataTable columns={columns} rows={rows} empty="Klaim tidak ditemukan" /></Card>
    </>
  );
}
