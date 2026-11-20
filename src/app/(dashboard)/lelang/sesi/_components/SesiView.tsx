"use client";

import Link from "next/link";
import { useState } from "react";
import { CalendarClock, CheckCircle2, FileText, Plus, Radio, Eye } from "lucide-react";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import FilterBar, { usePeriode } from "@/components/FilterBar";
import { dalamPeriode, ekstrakTanggal } from "@/lib/periode";
import DataTable, { type Column } from "@/components/DataTable";
import { Button, Card, Pill } from "@/components/ui";
import { bidTertinggi, hms, rp } from "@/lib/format";
import { useDashboardData } from "@/components/DashboardDataProvider";
import ResetDataButton from "@/components/ResetDataButton";
import type { SesiLelang, StatusSesi } from "@/lib/types";

const statusList: StatusSesi[] = ["Live", "Terjadwal", "Draft", "Selesai", "Dibatalkan"];
export const tone = {
  Live: "gold",
  Terjadwal: "blue",
  Draft: "gray",
  Selesai: "green",
  Dibatalkan: "red",
} as const;

interface SesiViewProps {
  data?: SesiLelang[];
  onTambah?: () => void;
  showTopbar?: boolean;
}

export default function SesiView({
  data,
  onTambah,
  showTopbar = true,
}: SesiViewProps) {
  const { sesi: ctxSesi } = useDashboardData();
  const list = ctxSesi.length > 0 ? ctxSesi : data ?? [];

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [grade, setGrade] = useState("");
  const periode = usePeriode();

  const n = (s: StatusSesi) => list.filter(d => d.status === s).length;
  const k = q.toLowerCase();

  const rows = list.filter(
    d =>
      (!status || d.status === status) &&
      (!grade || d.grade === grade) &&
      dalamPeriode(
        ekstrakTanggal(d.jadwal),
        periode.value,
        periode.dari,
        periode.sampai
      ) &&
      [d.produk, d.id].some(v => v.toLowerCase().includes(k))
  );

  const columns: Column<SesiLelang>[] = [
    {
      header: "Produk Lelang",
      cell: r => (
        <div>
          <p className="font-bold text-primary-900">{r.produk}</p>
          <p className="text-xs text-primary-400">
            Grade {r.grade} · ID {r.id}
          </p>
        </div>
      ),
    },
    { header: "Harga Awal", cell: r => rp(r.hargaAwal) },
    {
      header: "Bid Tertinggi",
      cell: r => (
        <b className="text-secondary-700 font-bold">{rp(bidTertinggi(r))}</b>
      ),
    },
    {
      header: "Penawar",
      cell: r => (
        <span className="font-medium text-xs text-primary-700">
          {new Set(r.bids.map(b => b.nama)).size} penawar ({r.bids.length} bid)
        </span>
      ),
    },
    {
      header: "Waktu / Status",
      cell: r =>
        r.status === "Live" ? (
          <b className="text-secondary-600 font-mono text-sm">{hms(r.sisaDetik)}</b>
        ) : (
          <span className="text-xs text-primary-500">{r.jadwal}</span>
        ),
    },
    {
      header: "Status",
      cell: r => <Pill tone={tone[r.status]}>{r.status}</Pill>,
    },
    {
      header: "Aksi",
      cell: r => (
        <Link href={`/lelang/sesi/${r.id}`}>
          <Button
            variant={r.status === "Live" ? "primary" : "outline"}
            className="!px-3.5 !py-1 text-xs font-semibold"
          >
            {r.status === "Live" ? (
              <>
                <Radio size={13} /> Pantau
              </>
            ) : (
              <>
                <Eye size={13} /> Detail
              </>
            )}
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <>
      {showTopbar && (
        <Topbar
          title="Daftar Sesi Lelang"
          subtitle="Pantau seluruh sesi lelang: live, terjadwal, draft, dan selesai"
          action={
            <div className="flex flex-wrap items-center gap-2">
              <ResetDataButton label="Reset Data" />
              {onTambah ? (
                <Button variant="gold" onClick={onTambah}>
                  <Plus size={16} />
                  Tambah Sesi Lelang
                </Button>
              ) : (
                <Link href="/lelang">
                  <Button variant="gold">
                    <Plus size={16} />
                    Tambah Sesi Lelang
                  </Button>
                </Link>
              )}
            </div>
          }
        />
      )}

      <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          variant="blue"
          label="Sedang Live"
          value={String(n("Live"))}
          note="Sedang berlangsung sekarang"
          icon={Radio}
        />
        <StatCard
          label="Terjadwal"
          value={String(n("Terjadwal"))}
          note="Akan dimulai sesuai jadwal"
          icon={CalendarClock}
        />
        <StatCard
          label="Draft"
          value={String(n("Draft"))}
          note="Belum dipublikasikan"
          icon={FileText}
        />
        <StatCard
          label="Selesai"
          value={String(n("Selesai"))}
          note="Pemenang lelang ditentukan"
          icon={CheckCircle2}
        />
      </div>

      <FilterBar
        total={rows.length}
        periode={periode}
        search={{
          value: q,
          onChange: setQ,
          placeholder: "Cari produk cupang atau ID sesi...",
        }}
        filters={[
          {
            label: "Status",
            value: status,
            onChange: setStatus,
            options: statusList,
          },
          {
            label: "Grade",
            value: grade,
            onChange: setGrade,
            options: [
              { value: "A", label: "Grade A" },
              { value: "B", label: "Grade B" },
              { value: "C", label: "Grade C" },
            ],
          },
        ]}
      />

      <Card className="!p-2">
        <DataTable
          columns={columns}
          rows={rows}
          empty="Belum ada sesi lelang pada filter ini. Klik 'Tambah Sesi Lelang' untuk membuat lelang baru!"
        />
      </Card>
    </>
  );
}
