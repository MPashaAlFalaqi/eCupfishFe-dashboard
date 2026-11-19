"use client";

import Link from "next/link";
import clsx from "clsx";
import { AlertTriangle, Gavel, Package, Truck, Wallet } from "lucide-react";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import DataTable, { type Column } from "@/components/DataTable";
import { Button, Card, Pill } from "@/components/ui";
import { useDashboardData } from "@/components/DashboardDataProvider";
import { rp } from "@/lib/format";
import { rpRingkas } from "@/lib/laporan";
import PenjualanChart from "./_components/PenjualanChart";
import LelangBerlangsung from "./_components/LelangBerlangsung";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

interface RowTindakan {
  id: string;
  ikan: string;
  pembeli: string;
  total: string;
  status: string;
  warna: "blue" | "gold";
}

const statusTone: Record<string, "gold" | "blue" | "gray" | "green" | "red"> = {
  "Menunggu Bayar": "gray",
  Dibayar: "gold",
  Dikemas: "blue",
  Dikirim: "blue",
};

const columns: Column<RowTindakan>[] = [
  {
    header: "Ikan & Pesanan",
    cell: r => (
      <div className="flex items-center gap-3">
        <div
          className={clsx(
            "h-10 w-10 shrink-0 rounded-xl",
            r.warna === "gold" ? "bg-secondary-200" : "bg-primary-200"
          )}
        />
        <div>
          <p className="font-bold">{r.ikan}</p>
          <p className="text-xs text-primary-400">
            {r.id} · {r.pembeli}
          </p>
        </div>
      </div>
    ),
  },
  { header: "Total", cell: r => <b>{r.total}</b> },
  {
    header: "Status",
    cell: r => <Pill tone={statusTone[r.status] ?? "blue"}>{r.status}</Pill>,
  },
];

const bar = {
  red: ["bg-red-500", "text-red-500"],
  gold: ["bg-secondary-500", "text-secondary-600"],
  blue: ["bg-primary-400", "text-primary-500"],
} as const;

export default function DashboardPage() {
  const [namaAdmin, setNamaAdmin] = useState("Admin");
  const router = useRouter();
  const { ikan, pesanan, pengiriman, pembayaran, sesi, klaim } = useDashboardData();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const adminData = localStorage.getItem("admin_data");

    if (!token) {
      router.push("/login");
    } else if (adminData) {
      const parsedData = JSON.parse(adminData);
      setNamaAdmin(parsedData.name);
    }
  }, [router]);

  // Sinkronisasi seluruh metrik dari context
  const totalPendapatan = pembayaran
    .filter(b => b.status !== "Dikembalikan")
    .reduce((n, b) => n + (b.kotor - b.komisi - b.gateway), 0);

  const totalStok = ikan.reduce((n, i) => n + i.stok, 0);
  const varianHampirHabis = ikan.filter(i => i.stok <= 200).length;

  const lelangLive = sesi.filter(s => s.status === "Live");
  const totalPenawar = new Set(
    lelangLive.flatMap(s => s.bids.map(b => b.nama))
  ).size;

  const perluDikirim = pengiriman.filter(
    k => k.status === "Diproses" || k.status === "Dalam Pengiriman"
  ).length;
  const terlambat = pengiriman.filter(k => k.status === "Terlambat").length;

  const pesananAktif: RowTindakan[] = pesanan
    .filter(p => ["Dibayar", "Dikemas", "Dikirim"].includes(p.status))
    .slice(0, 5)
    .map(p => ({
      id: p.id,
      ikan: p.ikan,
      pembeli: p.pembeli,
      total: rp(p.hargaSatuan * p.jumlah + p.ongkir),
      status: p.status,
      warna: p.sumber === "Lelang" ? "gold" : "blue",
    }));

  const stokRendah = [...ikan].sort((a, b) => a.stok - b.stok).slice(0, 4);
  const maksStok = Math.max(1, ...stokRendah.map(s => s.stok));

  const tugasMenunggu =
    pesanan.filter(p => p.status === "Dibayar").length +
    klaim.filter(k => k.status === "Pending").length;

  const tanggal = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  });
  const split = "xl:grid-cols-[1.65fr_1fr]";

  return (
    <>
      <Topbar
        title={`Selamat pagi, ${namaAdmin} 👋`}
        subtitle={`${tanggal} · ${tugasMenunggu} tugas menunggu tindakan`}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          variant="navy"
          label="Pendapatan Bersih"
          value={rpRingkas(totalPendapatan)}
          note="Sinkron dari pembayaran masuk"
          icon={Wallet}
        />
        <StatCard
          label="Stok Tersedia"
          value={`${totalStok.toLocaleString("id-ID")} ekor`}
          note={`${varianHampirHabis} varian perlu pantauan`}
          noteTone={varianHampirHabis > 0 ? "red" : "blue"}
          icon={Package}
        />
        <StatCard
          label="Lelang Aktif"
          value={`${lelangLive.length} sesi`}
          note={`${totalPenawar} penawar aktif`}
          noteTone="blue"
          icon={Gavel}
          iconTone="gold"
        />
        <StatCard
          label="Pengiriman Aktif"
          value={`${perluDikirim} pesanan`}
          note={
            terlambat > 0
              ? `${terlambat} melewati batas kirim`
              : "Semua jadwal aman"
          }
          noteTone={terlambat > 0 ? "red" : "blue"}
          icon={Truck}
        />
      </div>

      <div className={`mt-4 grid gap-4 ${split}`}>
        <PenjualanChart />
        <LelangBerlangsung />
      </div>

      <div className={`mt-4 grid gap-4 ${split}`}>
        <Card>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold">Pesanan Perlu Tindakan</h3>
            <Link
              href="/pesanan"
              className="text-sm font-medium text-primary-500"
            >
              Lihat semua
            </Link>
          </div>
          <DataTable
            columns={columns}
            rows={pesananAktif}
            empty="Tidak ada pesanan yang menunggu tindakan"
          />
        </Card>

        <Card className="flex flex-col">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold">Stok Terendah</h3>
            <AlertTriangle size={16} className="text-secondary-500" />
          </div>
          <ul className="space-y-4">
            {stokRendah.map(s => {
              const [b, t] =
                bar[s.stok === 0 ? "red" : s.stok < 200 ? "gold" : "blue"];
              return (
                <li key={s.id}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span>{s.nama}</span>
                    <b className={t}>{s.stok} ekor</b>
                  </div>
                  <div className="h-1.5 rounded-full bg-primary-50">
                    <div
                      className={`h-full origin-left animate-grow-x rounded-full ${b}`}
                      style={{ width: `${(s.stok / maksStok) * 100}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
          <Link href="/stok" className="mt-auto block pt-6">
            <Button variant="outline" className="w-full">
              Kelola Stok
            </Button>
          </Link>
        </Card>
      </div>
    </>
  );
}