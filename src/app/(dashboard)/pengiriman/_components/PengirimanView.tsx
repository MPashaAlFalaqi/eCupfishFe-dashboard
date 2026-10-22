"use client";
import { useState } from "react";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import FilterBar, { usePeriode } from "@/components/FilterBar";
import { dalamPeriode, ekstrakTanggal } from "@/lib/periode";
import DataTable, { type Column } from "@/components/DataTable";
import { Button, Card } from "@/components/ui";
import type { Pengiriman } from "@/lib/types";
import StatusBadge from "./StatusBadge";
import DetailPengirimanModal from "./DetailPengirimanModal";

export default function PengirimanView({ data }: { data: Pengiriman[] }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [kurir, setKurir] = useState("");
  const periode = usePeriode();
  const [sel, setSel] = useState<Pengiriman | null>(null);
  const k = q.toLowerCase();
  const kurirList = Array.from(new Set(data.map(r => r.kurir)));
  const rows = data.filter(r => (!status || r.status === status) && (!kurir || r.kurir === kurir) && dalamPeriode(ekstrakTanggal(r.tanggalKirim), periode.value, periode.dari, periode.sampai) && [r.id, r.resi, r.pembeli].some(v => v.toLowerCase().includes(k)));
  const columns: Column<Pengiriman>[] = [
    { header: "ID Pesanan", cell: r => <b>{r.id}</b> },
    { header: "Pembeli", cell: r => r.pembeli },
    { header: "Jenis Ikan", cell: r => r.ikan, className: "max-w-[200px]" },
    { header: "Kurir", cell: r => r.kurir },
    { header: "No. Resi", cell: r => r.resi },
    { header: "Status", cell: r => <StatusBadge status={r.status} /> },
    { header: "Aksi", cell: r => (
      <Button variant={r.status === "Dalam Pengiriman" ? "primary" : "outline"} className="!px-4 !py-1.5" onClick={() => setSel(r)}>
        {r.status === "Diproses" ? "Kirim" : r.status === "Diterima" ? "Detail" : "Lacak"}
      </Button>) },
  ];
  return (
    <>
      <Topbar title="Pengiriman" subtitle="Pantau status kirim seluruh pesanan pembeli" />
      <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Sedang Diproses" value="6" />
        <StatCard variant="blue" label="Dalam Pengiriman" value="9" />
        <StatCard label="Diterima Pembeli" value="68" />
        <StatCard label="Perlu Perhatian" value="2" />
      </div>
      <FilterBar total={rows.length} periode={periode} search={{ value: q, onChange: setQ, placeholder: "Cari resi / ID pesanan..." }}
        filters={[{ label: "Status", value: status, onChange: setStatus, options: ["Diproses", "Dalam Pengiriman", "Diterima", "Terlambat"] }, { label: "Kurir", value: kurir, onChange: setKurir, options: kurirList }]} />
      <Card className="!p-2">
        <DataTable columns={columns} rows={rows} empty="Pengiriman tidak ditemukan" rowClassName={r => (r.status === "Dalam Pengiriman" ? "bg-primary-50/70" : "")} />
      </Card>
      <DetailPengirimanModal data={sel} onClose={() => setSel(null)} />
    </>
  );
}
