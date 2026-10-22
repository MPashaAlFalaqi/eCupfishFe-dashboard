"use client";
import { useMemo, useState } from "react";
import { ArrowDownRight, ShoppingBag, TrendingUp, Wallet } from "lucide-react";
import clsx from "clsx";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import FilterBar, { usePeriode } from "@/components/FilterBar";
import DataTable, { type Column } from "@/components/DataTable";
import { Card } from "@/components/ui";
import { rp } from "@/lib/format";
import { MULAI_DATA, PRODUK, rpRingkas, transaksi, type Trx } from "@/lib/laporan";
import { BULAN, PERIODE_OPSI, REFERENSI, fmtTanggal, isoTanggal, rentang } from "@/lib/periode";
import ExportMenu from "./ExportMenu";

const DAY = 86400000;
const tambah = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const jumlah = (a: Trx[], j: Trx["jenis"]) => a.filter(t => t.jenis === j).reduce((n, t) => n + t.jumlah, 0);
const persen = (a: number, b: number) => (b > 0 ? `${a >= b ? "+" : "-"}${((Math.abs(a - b) / b) * 100).toFixed(1).replace(".", ",")}% dari periode sebelumnya` : undefined);
const pendek = (d: Date) => `${d.getDate()} ${BULAN[d.getMonth()]}`;

function buatBucket(mulai: Date, akhir: Date) {
  const hari = Math.round((+akhir - +mulai) / DAY) + 1;
  const mode = hari <= 14 ? "Harian" : hari <= 62 ? "Mingguan" : "Bulanan";
  const out: { label: string; dari: Date; sampai: Date }[] = [];
  if (mode === "Harian") for (let d = mulai; d <= akhir; d = tambah(d, 1)) out.push({ label: pendek(d), dari: d, sampai: d });
  else if (mode === "Mingguan") for (let d = mulai; d <= akhir; d = tambah(d, 7)) { const e = tambah(d, 6) > akhir ? akhir : tambah(d, 6); out.push({ label: d.getMonth() === e.getMonth() ? `${d.getDate()}–${pendek(e)}` : `${pendek(d)}–${pendek(e)}`, dari: d, sampai: e }); }
  else for (let d = new Date(mulai.getFullYear(), mulai.getMonth(), 1); d <= akhir; d = new Date(d.getFullYear(), d.getMonth() + 1, 1)) {
    const akhirBulan = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    out.push({ label: `${BULAN[d.getMonth()]} ${d.getFullYear()}`, dari: d < mulai ? mulai : d, sampai: akhirBulan > akhir ? akhir : akhirBulan });
  }
  return { mode, out };
}

function Rincian({ judul, items }: { judul: string; items: [string, number][] }) {
  const max = Math.max(1, ...items.map(i => i[1]));
  return (
    <Card>
      <h3 className="mb-3 font-semibold">{judul}</h3>
      {items.length === 0 ? <p className="py-4 text-sm text-primary-400">Tidak ada data.</p> : (
        <ul className="space-y-3">{items.map(([nama, n]) => (
          <li key={nama}><div className="mb-1 flex justify-between text-sm"><span>{nama}</span><b>{rp(n)}</b></div>
            <div className="h-1.5 rounded-full bg-primary-50"><div className="h-full origin-left animate-grow-x rounded-full bg-primary-400" style={{ width: `${(n / max) * 100}%` }} /></div></li>))}</ul>)}
    </Card>
  );
}

export default function LaporanView() {
  const periode = usePeriode("30h");
  const [jenis, setJenis] = useState("");
  const [sumber, setSumber] = useState("");
  const [produk, setProduk] = useState("");

  const [mulai, akhir] = useMemo(() => {
    const [a, b] = rentang(periode.value, periode.dari, periode.sampai);
    const e = b && b < REFERENSI ? b : REFERENSI;
    return [a ?? MULAI_DATA, e] as const;
  }, [periode.value, periode.dari, periode.sampai]);
  const valid = mulai <= akhir;

  const saring = (dari: Date, sampai: Date) => transaksi.filter(t => t.tanggal >= dari && t.tanggal <= sampai && (!jenis || t.jenis === jenis)
    && (!sumber || (t.jenis === "Pendapatan" && t.sumber === sumber)) && (!produk || (t.jenis === "Pendapatan" && t.produk === produk)));
  const data = useMemo(() => (valid ? saring(mulai, akhir) : []), [mulai, akhir, jenis, sumber, produk]); // eslint-disable-line react-hooks/exhaustive-deps
  const sebelum = useMemo(() => { if (!valid) return []; const hari = Math.round((+akhir - +mulai) / DAY) + 1, e = tambah(mulai, -1); return saring(tambah(e, -(hari - 1)), e); }, [mulai, akhir, jenis, sumber, produk]); // eslint-disable-line react-hooks/exhaustive-deps

  const pend = jumlah(data, "Pendapatan"), peng = jumlah(data, "Pengeluaran"), laba = pend - peng;
  const nTrx = data.filter(t => t.jenis === "Pendapatan").length;
  const { mode, out: bucket } = useMemo(() => (valid ? buatBucket(mulai, akhir) : { mode: "Harian", out: [] }), [mulai, akhir, valid]);
  const baris = bucket.map(b => { const x = data.filter(t => t.tanggal >= b.dari && t.tanggal <= b.sampai); return { id: b.label, label: b.label, pend: jumlah(x, "Pendapatan"), peng: jumlah(x, "Pengeluaran") }; });
  const maks = Math.max(1, ...baris.flatMap(b => [b.pend, b.peng]));

  const perProduk = Object.entries(data.filter(t => t.jenis === "Pendapatan").reduce<Record<string, number>>((m, t) => ({ ...m, [t.produk]: (m[t.produk] ?? 0) + t.jumlah }), {})).sort((a, b) => b[1] - a[1]);
  const perKategori = Object.entries(data.filter(t => t.jenis === "Pengeluaran").reduce<Record<string, number>>((m, t) => ({ ...m, [t.kategori]: (m[t.kategori] ?? 0) + t.jumlah }), {})).sort((a, b) => b[1] - a[1]);

  const kolom: Column<(typeof baris)[number]>[] = [
    { header: "Periode", cell: r => <b>{r.label}</b> },
    { header: "Pendapatan", cell: r => rp(r.pend) }, { header: "Pengeluaran", cell: r => rp(r.peng) },
    { header: "Laba / Rugi", cell: r => { const l = r.pend - r.peng; return <b className={l >= 0 ? "text-emerald-600" : "text-red-600"}>{l >= 0 ? "+" : "-"} {rp(Math.abs(l))}</b>; } },
  ];
  const ringkasFilter = [jenis && `Jenis: ${jenis}`, sumber && `Sumber: ${sumber}`, produk && `Produk: ${produk}`].filter(Boolean).join(", ") || "Tanpa filter tambahan";
  const csv: (string | number)[][] = [["Laporan Keuangan eCupFish"], ["Periode", `${fmtTanggal(mulai)} - ${fmtTanggal(akhir)}`], ["Filter", ringkasFilter], [],
    ["Periode", "Pendapatan (Rp)", "Pengeluaran (Rp)", "Laba/Rugi (Rp)"], ...baris.map(b => [b.label, b.pend, b.peng, b.pend - b.peng]), ["Total", pend, peng, laba]];

  return (
    <>
      <Topbar title="Laporan Keuangan & Penjualan" subtitle={valid ? `Periode ${fmtTanggal(mulai)} – ${fmtTanggal(akhir)}` : "Tanggal awal harus sebelum tanggal akhir"}
        action={<ExportMenu rows={csv} fileName={`laporan-keuangan-${isoTanggal(mulai)}_${isoTanggal(akhir)}.csv`} />} />
      <FilterBar periode={periode} opsiPeriode={PERIODE_OPSI.filter(o => o.value)}
        filters={[{ label: "Jenis", value: jenis, onChange: setJenis, options: ["Pendapatan", "Pengeluaran"] }, { label: "Sumber", value: sumber, onChange: setSumber, options: ["Lelang", "Beli langsung"] },
          { label: "Produk", value: produk, onChange: setProduk, options: PRODUK.map(p => p[0]) }]} />
      {(sumber || produk) && <p className="-mt-2 mb-4 text-xs text-primary-400">Filter sumber dan produk hanya berlaku untuk pendapatan penjualan.</p>}

      <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard variant="navy" label="Total Pendapatan" value={rpRingkas(pend)} note={persen(pend, jumlah(sebelum, "Pendapatan"))} icon={Wallet} />
        <StatCard label="Total Pengeluaran" value={rpRingkas(peng)} note={persen(peng, jumlah(sebelum, "Pengeluaran"))} noteTone={peng > jumlah(sebelum, "Pengeluaran") ? "red" : "blue"} icon={ArrowDownRight} />
        <StatCard label="Laba Bersih" value={rpRingkas(laba)} note={pend > 0 ? `Margin ${((laba / pend) * 100).toFixed(1).replace(".", ",")}%` : undefined} icon={TrendingUp} />
        <StatCard label="Total Transaksi" value={`${nTrx} pesanan`} note="Penjualan pada periode ini" icon={ShoppingBag} />
      </div>

      {data.length === 0 ? <Card><p className="py-10 text-center text-primary-400">Tidak ada transaksi pada filter ini. Coba ubah periode atau tekan Reset.</p></Card> : (
        <div className="space-y-4">
          <Card>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold">Grafik {mode}</h3>
              <div className="flex gap-3 text-xs text-primary-500"><span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-primary-400" />Pendapatan</span><span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-secondary-400" />Pengeluaran</span></div>
            </div>
            <div className="overflow-x-auto pb-1">
              <div className="flex h-52 items-end gap-2" style={{ minWidth: baris.length * 52 }}>
                {baris.map((b, i) => (
                  <div key={b.label} className="flex h-full flex-1 flex-col items-center gap-1" title={`${b.label}: pendapatan ${rp(b.pend)}, pengeluaran ${rp(b.peng)}`}>
                    <div className="flex w-full flex-1 items-end justify-center gap-1">
                      <div className="w-full max-w-[22px] origin-bottom animate-grow-y rounded-t-md bg-gradient-to-b from-primary-300 to-primary-500" style={{ height: `${(b.pend / maks) * 100}%`, animationDelay: `${i * 40}ms` }} />
                      <div className="w-full max-w-[22px] origin-bottom animate-grow-y rounded-t-md bg-gradient-to-b from-secondary-300 to-secondary-500" style={{ height: `${(b.peng / maks) * 100}%`, animationDelay: `${i * 40 + 20}ms` }} />
                    </div>
                    <span className="whitespace-nowrap text-[10px] text-primary-400">{b.label}</span>
                  </div>))}
              </div>
            </div>
          </Card>
          <Card>
            <h3 className="mb-2 font-semibold">Rincian Laba Rugi</h3>
            <DataTable columns={kolom} rows={[...baris, { id: "total", label: "Total", pend, peng }]} rowClassName={r => (r.id === "total" ? "bg-primary-50/70 font-bold" : "")} />
          </Card>
          <div className="grid gap-4 lg:grid-cols-2"><Rincian judul="Pendapatan per Produk" items={perProduk} /><Rincian judul="Pengeluaran per Kategori" items={perKategori} /></div>
        </div>)}
    </>
  );
}
