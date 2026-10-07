import { Card } from "@/components/ui";
import DataTable, { type Column } from "@/components/DataTable";
import { laporanMingguan } from "@/lib/mock-data";
const rp = (n: number) => "Rp " + n.toLocaleString("id-ID");
type Row = (typeof laporanMingguan)[number] & { id: string };
const rows: Row[] = laporanMingguan.map(r => ({ ...r, id: r.minggu }));
const columns: Column<Row>[] = [
  { header: "Periode", cell: r => <b>{r.minggu}</b> },
  { header: "Pendapatan", cell: r => rp(r.pendapatan) },
  { header: "Pengeluaran", cell: r => rp(r.pengeluaran) },
  { header: "Laba / Rugi", cell: r => { const l = r.pendapatan - r.pengeluaran; return <b className={l >= 0 ? "text-emerald-600" : "text-red-600"}>{l >= 0 ? "+" : "-"} {rp(Math.abs(l))}</b>; } },
];
export default function LabaRugiTable() {
  return <Card><h3 className="mb-3 font-semibold">Rincian Laba Rugi</h3><DataTable columns={columns} rows={rows} /></Card>;
}
