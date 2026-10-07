import { Inbox, Eye, CheckCircle2, XCircle } from "lucide-react";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import KlaimTable from "./_components/KlaimTable";
import { klaimList } from "@/lib/mock-data";
export default function KlaimPage() {
  return (
    <>
      <Topbar title="Klaim Pembeli" subtitle="Tinjau klaim dan bukti dari pembeli" />
      <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Klaim Masuk" value="18" note="Bulan September 2026" icon={Inbox} />
        <StatCard label="Perlu Ditinjau" value="5" note="Menunggu keputusan" icon={Eye} variant="gold" />
        <StatCard label="Disetujui" value="10" note="Refund dan penggantian" icon={CheckCircle2} />
        <StatCard label="Ditolak" value="3" note="Bukti tidak cukup" icon={XCircle} />
      </div>
      <KlaimTable data={klaimList} />
    </>
  );
}
