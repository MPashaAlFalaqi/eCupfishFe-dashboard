import Link from "next/link";
import clsx from "clsx";
import { AlertTriangle, Gavel, Package, Truck, Wallet } from "lucide-react";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import DataTable, { type Column } from "@/components/DataTable";
import { Button, Card, Pill } from "@/components/ui";
import { pesananTindakan, stokMenipis } from "@/lib/mock-data";
import PenjualanChart from "./_components/PenjualanChart";
import LelangBerlangsung from "./_components/LelangBerlangsung";

export const dynamic = "force-dynamic";
type Row = (typeof pesananTindakan)[number];
const statusTone = { Bayar: "gold", Kemas: "blue", Kirim: "blue", Klaim: "gray" } as const;
const columns: Column<Row>[] = [
  { header: "Ikan & Pesanan", cell: r => (
    <div className="flex items-center gap-3">
      <div className={clsx("h-10 w-10 shrink-0 rounded-xl", r.warna === "gold" ? "bg-secondary-200" : "bg-primary-200")} />
      <div><p className="font-bold">{r.ikan}</p><p className="text-xs text-primary-400">#{r.id} · {r.pembeli}</p></div>
    </div>) },
  { header: "Total", cell: r => <b>{r.total}</b> },
  { header: "Status", cell: r => <Pill tone={statusTone[r.status]}>{r.status}</Pill> },
];
const bar = { red: ["bg-red-500", "text-red-500"], gold: ["bg-secondary-500", "text-secondary-600"], blue: ["bg-primary-400", "text-primary-500"] } as const;

export default function DashboardPage() {
  const tanggal = new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" });
  const split = "xl:grid-cols-[1.65fr_1fr]";
  return (
    <>
      <Topbar title="Selamat pagi, Pasha 👋" subtitle={`${tanggal} · 5 tugas menunggu tindakan`} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard variant="navy" label="Pendapatan Bulan Ini" value="Rp 48,2 jt" note="+12,4% dari bulan lalu" icon={Wallet} />
        <StatCard label="Stok Tersedia" value="342 ekor" note="4 varian hampir habis" noteTone="red" icon={Package} />
        <StatCard label="Lelang Aktif" value="3 sesi" note="12 penawar hari ini" noteTone="blue" icon={Gavel} iconTone="gold" />
        <StatCard label="Perlu Dikirim" value="7 pesanan" note="2 melewati batas kirim" noteTone="red" icon={Truck} />
      </div>
      <div className={`mt-4 grid gap-4 ${split}`}><PenjualanChart /><LelangBerlangsung /></div>
      <div className={`mt-4 grid gap-4 ${split}`}>
        <Card>
          <div className="mb-2 flex items-center justify-between"><h3 className="font-semibold">Pesanan Perlu Tindakan</h3><Link href="/pesanan" className="text-sm font-medium text-primary-500">Lihat semua</Link></div>
          <DataTable columns={columns} rows={[...pesananTindakan]} />
        </Card>
        <Card className="flex flex-col">
          <div className="mb-3 flex items-center justify-between"><h3 className="font-semibold">Stok Menipis</h3><AlertTriangle size={16} className="text-secondary-500" /></div>
          <ul className="space-y-4">{stokMenipis.map(s => {
            const [b, t] = bar[s.qty < 5 ? "red" : s.qty < 10 ? "gold" : "blue"];
            return (<li key={s.nama}>
              <div className="mb-1.5 flex justify-between text-sm"><span>{s.nama}</span><b className={t}>{s.qty} ekor</b></div>
              <div className="h-1.5 rounded-full bg-primary-50"><div className={`h-full origin-left animate-grow-x rounded-full ${b}`} style={{ width: `${(s.qty / 20) * 100}%` }} /></div>
            </li>);
          })}</ul>
          <Link href="/stok" className="mt-auto block pt-6"><Button variant="outline" className="w-full">Kelola Stok</Button></Link>
        </Card>
      </div>
    </>
  );
}
