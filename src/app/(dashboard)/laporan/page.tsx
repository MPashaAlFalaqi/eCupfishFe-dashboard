import { Wallet, ArrowDownRight, TrendingUp, ShoppingBag } from "lucide-react";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import SalesChart from "./_components/SalesChart";
import LabaRugiTable from "./_components/LabaRugiTable";
import ExportMenu from "./_components/ExportMenu";
export default function LaporanPage() {
  return (
    <>
      <Topbar title="Laporan Keuangan & Penjualan" subtitle="Periode 1-30 September 2026"
        action={<><select className="input !w-auto"><option>September 2026</option><option>Agustus 2026</option></select><ExportMenu /></>} />
      <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Pendapatan" value="Rp 48,2 jt" note="+12,4% dari bulan lalu" icon={Wallet} variant="navy" />
        <StatCard label="Total Pengeluaran" value="Rp 19,6 jt" note="-5,2% dari bulan lalu" icon={ArrowDownRight} />
        <StatCard label="Laba Bersih" value="Rp 28,6 jt" note="Margin 59,3%" icon={TrendingUp} />
        <StatCard label="Total Transaksi" value="86 pesanan" note="Terjual bulan ini" icon={ShoppingBag} />
      </div>
      <div className="space-y-4"><SalesChart /><LabaRugiTable /></div>
    </>
  );
}
