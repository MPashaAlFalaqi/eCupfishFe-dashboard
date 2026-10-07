"use client";
import { Check, Copy, Home, Printer, Truck } from "lucide-react";
import clsx from "clsx";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui";
import type { Pengiriman, StatusKirim } from "@/lib/types";
import StatusBadge from "./StatusBadge";

const stage: Record<StatusKirim, number> = { Diproses: 0, "Dalam Pengiriman": 1, Terlambat: 1, Diterima: 2 };
const steps = [
  { label: "Diproses", icon: Check, done: "12 Feb 2026, 09:00 · Pesanan disiapkan", wait: "Pesanan sedang disiapkan" },
  { label: "Dalam Pengiriman", icon: Truck, done: "13 Feb 2026, 14:30 · Paket dalam perjalanan", wait: "Menunggu diserahkan ke kurir" },
  { label: "Tiba", icon: Home, done: "14 Feb 2026, 11:20 · Diterima pembeli", wait: "Menunggu konfirmasi pembeli" },
];
const sub = "text-sm font-semibold text-primary-500";

export default function DetailPengirimanModal({ data, onClose }: { data: Pengiriman | null; onClose: () => void }) {
  if (!data) return null;
  const now = stage[data.status];
  const resi = data.resi === "—" ? "" : data.resi;
  const kurir = ["JNE Live Fish", "Dayak Fresh", "Kurir Tambak Sendiri"];
  return (
    <Modal open onClose={onClose} size="max-w-md" title="Detail Pengiriman" subtitle={`${data.id} · ${data.pembeli}`}
      icon={<div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary-500"><Truck size={18} /></div>}
      footer={<><a href={`/label/${data.id.slice(1)}`} target="_blank" rel="noreferrer"><Button variant="outline"><Printer size={16} />Cetak Label</Button></a><Button variant="outline" onClick={onClose}>Tutup</Button><Button onClick={onClose}><Check size={16} />Simpan Perubahan</Button></>}>
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 shrink-0 rounded-xl bg-primary-200" />
        <div className="min-w-0 flex-1"><p className="font-bold">{data.ikan}</p><p className="text-xs text-primary-400">Grade {data.grade} · Dikirim {data.tanggalKirim}</p></div>
        <StatusBadge status={data.status} />
      </div>
      <hr className="-mx-5 border-primary-50" />
      <p className={sub}>Informasi Kurir</p>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="label">Kurir</label>
          <select className="input" defaultValue={data.kurir}>{kurir.map(k => <option key={k}>{k}</option>)}</select></div>
        <div><label className="label">Nomor Resi</label>
          <div className="relative"><input className="input pr-10" defaultValue={resi} placeholder="Masukkan nomor resi" />
            <button type="button" aria-label="Salin nomor resi" onClick={() => resi && navigator.clipboard?.writeText(resi)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-primary-400 hover:text-primary-600"><Copy size={15} /></button></div></div>
      </div>
      <hr className="-mx-5 border-primary-50" />
      <p className={sub}>Lacak Pesanan</p>
      <ol>{steps.map((s, i) => {
        const done = i <= now;
        return (
          <li key={s.label} className="relative flex gap-3 pb-4 last:pb-0">
            {i < 2 && <span className={clsx("absolute bottom-0 left-[11px] top-6 w-0.5", i < now ? "bg-primary-900" : "bg-primary-100")} />}
            <span className={clsx("relative z-10 grid h-6 w-6 shrink-0 place-items-center rounded-full", done ? "bg-primary-900 text-white" : "border border-primary-100 bg-white text-primary-300")}><s.icon size={12} /></span>
            <div><p className={clsx("text-sm font-semibold", !done && "text-primary-400")}>{s.label}</p><p className="text-xs text-primary-400">{done ? s.done : s.wait}</p></div>
          </li>);
      })}</ol>
      <hr className="-mx-5 border-primary-50" />
      <div><label className={`${sub} mb-1.5 block`}>Catatan untuk Kurir (opsional)</label>
        <textarea className="input" rows={2} defaultValue="Hubungi pembeli sebelum tiba, mohon tangani dengan hati-hati." /></div>
    </Modal>
  );
}
