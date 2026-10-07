"use client";
import Link from "next/link";
import { useState } from "react";
import { Badge, Button, Card } from "@/components/ui";
import DataTable, { type Column } from "@/components/DataTable";
import type { Klaim } from "@/lib/types";

const tone = { Pending: "gold", Disetujui: "green", Ditolak: "gray" } as const;
export default function KlaimTable({ data }: { data: Klaim[] }) {
  const [status, setStatus] = useState("");
  const rows = data.filter(r => !status || r.status === status);
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
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <select value={status} onChange={e => setStatus(e.target.value)} className="input !w-auto">
          <option value="">Semua Status</option><option>Pending</option><option>Disetujui</option><option>Ditolak</option>
        </select>
        <p className="text-sm text-primary-400">{rows.length} klaim ditemukan</p>
      </div>
      <DataTable columns={columns} rows={rows} />
    </Card>
  );
}
