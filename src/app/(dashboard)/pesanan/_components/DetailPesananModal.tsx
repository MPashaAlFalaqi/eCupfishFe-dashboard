"use client";
import { useState } from "react";
import Link from "next/link";
import { Check, FileDown, FileText, X } from "lucide-react";
import Modal from "@/components/Modal";
import { Button, Pill } from "@/components/ui";
import { rp } from "@/lib/format";
import type { Pesanan, StatusPesanan } from "@/lib/types";
import { tone } from "./PesananView";

export default function DetailPesananModal({ data, onClose, onStatus }: { data: Pesanan | null; onClose: () => void; onStatus: (id: string, s: StatusPesanan) => void }) {
  const [resi, setResi] = useState("");
  if (!data) return null;
  const sub = data.hargaSatuan * data.jumlah, total = sub + data.ongkir;
  const go = (s: StatusPesanan) => { onStatus(data.id, s); setResi(""); onClose(); };
  const danger = "!border-red-200 !text-red-600 hover:!bg-red-50";
  const footer = (
    <>
      {data.status === "Menunggu Bayar" && <Button variant="outline" className={danger} onClick={() => go("Dibatalkan")}><X size={16} />Batalkan Pesanan</Button>}
      {data.status === "Dibayar" && <><Button variant="outline" className={danger} onClick={() => go("Dibatalkan")}>Tolak</Button><Button onClick={() => go("Dikemas")}><Check size={16} />Terima & Kemas</Button></>}
      {data.status === "Dikemas" && <Button disabled={!resi.trim()} onClick={() => go("Dikirim")}><Check size={16} />Tandai Dikirim</Button>}
      {data.status === "Dikirim" && <Link href="/pengiriman"><Button>Lihat Pengiriman</Button></Link>}
      {data.status !== "Dibatalkan" && <a href={`/invoice/${data.id.slice(1)}`} target="_blank" rel="noreferrer"><Button variant="outline"><FileDown size={16} />Invoice</Button></a>}
      <Button variant="outline" onClick={onClose}>Tutup</Button>
    </>
  );
  const rows: [string, string][] = [["Harga satuan", rp(data.hargaSatuan)], [`Subtotal (${data.jumlah} ekor)`, rp(sub)], ["Ongkos kirim", data.ongkir ? rp(data.ongkir) : "Gratis"]];
  return (
    <Modal open onClose={onClose} size="max-w-md" title="Detail Pesanan" subtitle={`${data.id} · ${data.tanggal}`}
      icon={<div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary-500"><FileText size={18} /></div>} footer={footer}>
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 shrink-0 rounded-xl bg-primary-200" />
        <div className="min-w-0 flex-1"><p className="font-bold">{data.ikan}</p><p className="text-xs text-primary-400">{data.jumlah} ekor · {data.sumber}</p></div>
        <Pill tone={tone[data.status]}>{data.status}</Pill>
      </div>
      <hr className="-mx-5 border-primary-50" />
      <div><p className="text-sm font-semibold text-primary-500">Pembeli</p><p className="mt-1 font-medium">{data.pembeli}</p><p className="text-sm text-primary-500">{data.alamat}</p></div>
      <hr className="-mx-5 border-primary-50" />
      <div>
        <p className="mb-2 text-sm font-semibold text-primary-500">Rincian Pembayaran · {data.metode}</p>
        <dl className="space-y-1.5 text-sm">{rows.map(([a, b]) => <div key={a} className="flex justify-between"><dt className="text-primary-500">{a}</dt><dd>{b}</dd></div>)}
          <div className="flex justify-between border-t border-primary-50 pt-2 font-bold"><dt>Total</dt><dd>{rp(total)}</dd></div></dl>
      </div>
      {data.status === "Dikemas" && (<><hr className="-mx-5 border-primary-50" />
        <div><label className="label">Nomor Resi</label><input className="input" value={resi} onChange={e => setResi(e.target.value)} placeholder="Masukkan nomor resi untuk menandai dikirim" /></div></>)}
    </Modal>
  );
}
