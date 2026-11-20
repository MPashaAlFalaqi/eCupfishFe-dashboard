"use client";

import { useState } from "react";
import { Truck, PackageCheck, Hourglass, AlertCircle } from "lucide-react";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import FilterBar, { usePeriode } from "@/components/FilterBar";
import { dalamPeriode, ekstrakTanggal } from "@/lib/periode";
import DataTable, { type Column } from "@/components/DataTable";
import { Button, Card } from "@/components/ui";
import { useDashboardData } from "@/components/DashboardDataProvider";
import ResetDataButton from "@/components/ResetDataButton";
import type { Pengiriman } from "@/lib/types";
import StatusBadge from "./StatusBadge";
import DetailPengirimanModal from "./DetailPengirimanModal";

export default function PengirimanView({ data }: { data?: Pengiriman[] }) {
  const { pengiriman } = useDashboardData();
  const list = pengiriman.length > 0 ? pengiriman : data ?? [];

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [kurir, setKurir] = useState("");
  const periode = usePeriode();
  const [sel, setSel] = useState<Pengiriman | null>(null);

  const k = q.toLowerCase();
  const kurirList = Array.from(new Set(list.map(r => r.kurir).filter(Boolean)));

  const rows = list.filter(r => {
    const matchStatus = !status || r.status === status;
    const matchKurir = !kurir || r.kurir === kurir;
    const matchPeriode = dalamPeriode(
      ekstrakTanggal(r.tanggalKirim),
      periode.value,
      periode.dari,
      periode.sampai
    );
    const matchQuery =
      !k ||
      [r.id, r.resi, r.pembeli, r.ikan, r.kurir, r.alamat].some(v =>
        v.toLowerCase().includes(k)
      );
    return matchStatus && matchKurir && matchPeriode && matchQuery;
  });

  const diproses = list.filter(r => r.status === "Diproses").length;
  const dalamKirim = list.filter(r => r.status === "Dalam Pengiriman").length;
  const diterima = list.filter(r => r.status === "Diterima").length;
  const terlambat = list.filter(r => r.status === "Terlambat").length;

  const columns: Column<Pengiriman>[] = [
    {
      header: "No. Pesanan",
      cell: r => (
        <div>
          <b className="text-primary-900 font-bold">{r.id}</b>
          <p className="text-xs text-primary-400">Grade {r.grade}</p>
        </div>
      ),
    },
    {
      header: "Pembeli & Alamat",
      cell: r => (
        <div className="max-w-[220px]">
          <p className="font-semibold text-primary-900 leading-tight">{r.pembeli}</p>
          <p className="text-xs text-primary-500 truncate" title={r.alamat}>
            {r.alamat}
          </p>
          <p className="text-[11px] text-primary-400">{r.telp}</p>
        </div>
      ),
    },
    {
      header: "Ikan & Jumlah",
      cell: r => (
        <div>
          <p className="font-medium text-primary-900 leading-tight">{r.ikan}</p>
          <p className="text-xs text-primary-400">{r.berat} kg (perkiraan berat)</p>
        </div>
      ),
    },
    {
      header: "Jenis Kurir",
      cell: r => (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-800">
          <Truck size={14} className="text-primary-500 shrink-0" />
          {r.kurir}
        </span>
      ),
    },
    {
      header: "No. Resi Pengiriman",
      cell: r =>
        r.resi && r.resi !== "—" ? (
          <span className="inline-block rounded border border-primary-200 bg-primary-50 px-2 py-0.5 font-mono text-xs font-bold text-primary-900">
            {r.resi}
          </span>
        ) : (
          <span className="inline-block rounded border border-dashed border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-400 italic">
            Belum ada resi
          </span>
        ),
    },
    {
      header: "Status Kirim",
      cell: r => <StatusBadge status={r.status} />,
    },
    {
      header: "Tanggal Kirim",
      cell: r => <span className="text-xs text-primary-600">{r.tanggalKirim}</span>,
    },
    {
      header: "Aksi",
      cell: r => (
        <Button
          variant={r.status === "Dalam Pengiriman" ? "primary" : "outline"}
          className="!px-3.5 !py-1 text-xs font-semibold"
          onClick={() => setSel(r)}
        >
          {r.status === "Diproses"
            ? "Kirim"
            : r.status === "Diterima"
            ? "Detail"
            : "Lacak"}
        </Button>
      ),
    },
  ];

  return (
    <>
      <Topbar
        title="Pengiriman Ikan"
        subtitle="Pantau status kirim, kurir, dan no. resi seluruh pesanan pembeli yang terintegrasi"
        action={<ResetDataButton label="Reset Data" />}
      />

      <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Sedang Diproses"
          value={String(diproses)}
          note="Siap kemas & tunggu kurir"
          icon={Hourglass}
        />
        <StatCard
          variant="blue"
          label="Dalam Pengiriman"
          value={String(dalamKirim)}
          note="Paket dalam perjalanan"
          icon={Truck}
        />
        <StatCard
          label="Diterima Pembeli"
          value={String(diterima)}
          note="Pesanan tiba dengan selamat"
          icon={PackageCheck}
        />
        <StatCard
          label="Perlu Perhatian"
          value={String(terlambat)}
          note={terlambat > 0 ? "Melewati jadwal estimasi" : "Semua pengiriman lancar"}
          noteTone={terlambat > 0 ? "red" : "blue"}
          icon={AlertCircle}
        />
      </div>

      <FilterBar
        total={rows.length}
        periode={periode}
        search={{
          value: q,
          onChange: setQ,
          placeholder: "Cari nomor resi, ID pesanan, pembeli, ikan...",
        }}
        filters={[
          {
            label: "Status",
            value: status,
            onChange: setStatus,
            options: ["Diproses", "Dalam Pengiriman", "Diterima", "Terlambat"],
          },
          {
            label: "Kurir",
            value: kurir,
            onChange: setKurir,
            options: kurirList,
          },
        ]}
      />

      <Card className="!p-2">
        <DataTable
          columns={columns}
          rows={rows}
          empty="Pengiriman tidak ditemukan untuk filter ini"
          rowClassName={r =>
            r.status === "Dalam Pengiriman"
              ? "bg-primary-50/50"
              : r.status === "Terlambat"
              ? "bg-red-50/40"
              : ""
          }
        />
      </Card>

      <DetailPengirimanModal data={sel} onClose={() => setSel(null)} />
    </>
  );
}
