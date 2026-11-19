"use client";
import { Inbox, Eye, CheckCircle2, XCircle } from "lucide-react";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import { useDashboardData } from "@/components/DashboardDataProvider";
import KlaimTable from "./_components/KlaimTable";

export default function KlaimPage() {
  const { klaim } = useDashboardData();
  const pending = klaim.filter(k => k.status === "Pending").length;
  const disetujui = klaim.filter(k => k.status === "Disetujui").length;
  const ditolak = klaim.filter(k => k.status === "Ditolak").length;

  return (
    <>
      <Topbar
        title="Klaim Pembeli"
        subtitle="Tinjau klaim dan bukti dari pembeli"
      />
      <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Klaim Masuk"
          value={String(klaim.length)}
          note="Semua periode"
          icon={Inbox}
        />
        <StatCard
          label="Perlu Ditinjau"
          value={String(pending)}
          note="Menunggu keputusan"
          icon={Eye}
          variant="gold"
        />
        <StatCard
          label="Disetujui"
          value={String(disetujui)}
          note="Refund dan penggantian"
          icon={CheckCircle2}
        />
        <StatCard
          label="Ditolak"
          value={String(ditolak)}
          note="Bukti tidak cukup"
          icon={XCircle}
        />
      </div>
      <KlaimTable data={klaim} />
    </>
  );
}