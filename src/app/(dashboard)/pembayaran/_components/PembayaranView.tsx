"use client";
import { useState } from "react";
import { GripVertical, Hourglass, Landmark, Plus, Receipt, Wallet, CreditCard, ArrowRight } from "lucide-react";
import clsx from "clsx";
import { Reorder } from "framer-motion";
import { useToast } from "@/components/Toast";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import Modal from "@/components/Modal";
import DataTable, { type Column } from "@/components/DataTable";
import { Button, Card, Pill } from "@/components/ui";
import { rp } from "@/lib/format";
import type { Pembayaran } from "@/lib/types";

const tone = { "Dalam Proses": "gold", Diteruskan: "green", Dikembalikan: "red" } as const;
const bersih = (p: Pembayaran) => (p.status === "Dikembalikan" ? 0 : p.kotor - p.komisi - p.gateway);
const langkah = ["Pembeli bayar di aplikasi", "Dana diterima gateway", "Pesanan tiba + jeda garansi 1×24 jam", "Diteruskan ke rekening Anda"];

export default function PembayaranView({ data, rekening }: { data: Pembayaran[]; rekening: string[] }) {
  const [reks, setReks] = useState(rekening);
  const toast = useToast();
  const [sel, setSel] = useState<Pembayaran | null>(null);
  const proses = data.filter(d => d.status === "Dalam Proses").reduce((n, d) => n + bersih(d), 0);
  const columns: Column<Pembayaran>[] = [
    { header: "Tanggal", cell: r => r.tanggal },
    { header: "Pesanan", cell: r => <div><p className="font-bold">{r.pesanan}</p><p className="text-xs text-primary-400">{r.pembeli}</p></div> },
    { header: "Metode", cell: r => r.metode },
    { header: "Dibayar Pembeli", cell: r => rp(r.kotor) },
    { header: "Potongan", cell: r => (r.komisi + r.gateway ? <span className="text-red-500">- {rp(r.komisi + r.gateway)}</span> : "—") },
    { header: "Diterima", cell: r => <b className={clsx(r.status === "Dikembalikan" && "text-primary-300")}>{rp(bersih(r))}</b> },
    { header: "Status", cell: r => <Pill tone={tone[r.status]}>{r.status}</Pill> },
    { header: "Aksi", cell: r => <Button variant="outline" className="!px-4 !py-1.5" onClick={() => setSel(r)}>Detail</Button> },
  ];
  const rinci: [string, string][] = sel ? [["Dibayar pembeli", rp(sel.kotor)], ["Komisi platform 5%", `- ${rp(sel.komisi)}`], ["Biaya gateway", `- ${rp(sel.gateway)}`]] : [];
  return (
    <>
      <Topbar title="Pembayaran Masuk" subtitle="Pembayaran pembeli diteruskan langsung ke rekening Anda" />
      <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard variant="blue" label="Diterima Bulan Ini" value="Rp 38.450.000" note="Sudah masuk rekening" icon={Wallet} />
        <StatCard label="Dalam Proses" value={rp(proses)} note="Menunggu pesanan tiba" icon={Hourglass} />
        <StatCard label="Komisi Platform" value="Rp 2.410.000" note="5% dari penjualan" icon={Receipt} />
        <StatCard label="Biaya Gateway" value="Rp 612.000" note="Dipotong otomatis" icon={CreditCard} />
      </div>
      <Card className="mb-4">
        <h3 className="mb-3 font-semibold">Cara dana sampai ke Anda</h3>
        <ol className="flex flex-wrap items-center gap-2 text-sm">
          {langkah.map((l, i) => (
            <li key={l} className="flex items-center gap-2">
              <span className="flex items-center gap-2 rounded-lg bg-primary-50 px-3 py-2"><span className="grid h-5 w-5 place-items-center rounded-full bg-primary-400 text-xs font-bold text-white">{i + 1}</span>{l}</span>
              {i < langkah.length - 1 && <ArrowRight size={14} className="text-primary-300" />}
            </li>))}
        </ol>
      </Card>
      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <Card><h3 className="mb-2 font-semibold">Riwayat Pembayaran</h3><DataTable columns={columns} rows={data} /></Card>
        <Card className="self-start">
          <h3 className="mb-1 font-semibold">Rekening Penerima</h3>
          <p className="mb-3 text-sm text-primary-500">Seret untuk mengubah urutan. Rekening paling atas jadi rekening utama.</p>
          <Reorder.Group as="ul" axis="y" values={reks} onReorder={setReks} className="space-y-2">{reks.map((r, i) => (
            <Reorder.Item as="li" key={r} value={r} whileDrag={{ scale: 1.03, boxShadow: "0 10px 28px rgba(8,36,64,.18)" }}
              className="flex cursor-grab items-center gap-3 rounded-lg border border-primary-100 bg-white p-3 active:cursor-grabbing">
              <GripVertical size={16} className="shrink-0 text-primary-300" />
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary-50 text-primary-500"><Landmark size={16} /></span>
              <div className="flex-1"><p className="text-sm font-semibold">{r.split(" · ")[0]}</p><p className="text-xs text-primary-400">{r.split(" · ")[1]}</p></div>
              {i === 0 ? <Pill tone="blue">Utama</Pill> : <button onClick={() => { setReks([r, ...reks.filter(x => x !== r)]); toast("Rekening utama diganti"); }} className="text-xs font-semibold text-primary-500">Jadikan utama</button>}
            </Reorder.Item>))}</Reorder.Group>
          <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-primary-200 py-2.5 text-sm font-medium text-primary-500 hover:bg-primary-50"><Plus size={16} />Tambah Rekening</button>
        </Card>
      </div>
      <Modal open={!!sel} onClose={() => setSel(null)} size="max-w-md" title="Detail Pembayaran" subtitle={sel ? `${sel.pesanan} · ${sel.tanggal}` : ""}
        footer={<Button variant="outline" onClick={() => setSel(null)}>Tutup</Button>}>
        {sel && (<>
          <div className="flex items-center justify-between"><div><p className="font-bold">{sel.pembeli}</p><p className="text-xs text-primary-400">{sel.metode}</p></div><Pill tone={tone[sel.status]}>{sel.status}</Pill></div>
          <hr className="-mx-5 border-primary-50" />
          <dl className="space-y-1.5 text-sm">{rinci.map(([a, b]) => <div key={a} className="flex justify-between"><dt className="text-primary-500">{a}</dt><dd>{b}</dd></div>)}
            <div className="flex justify-between border-t border-primary-50 pt-2 font-bold"><dt>Diterima penjual</dt><dd>{rp(bersih(sel))}</dd></div></dl>
          <hr className="-mx-5 border-primary-50" />
          <div className="text-sm"><p className="font-semibold text-primary-500">Rekening tujuan</p><p>{reks[0]}</p><p className="mt-2 text-primary-500">{sel.estimasi}</p></div>
        </>)}
      </Modal>
    </>
  );
}
