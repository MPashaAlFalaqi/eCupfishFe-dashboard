"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertTriangle, ArrowLeft, Clock, Plus, Trophy } from "lucide-react";
import clsx from "clsx";
import Topbar from "@/components/Topbar";
import Modal from "@/components/Modal";
import { useToast } from "@/components/Toast";
import { Button, Card, Pill } from "@/components/ui";
import { bidTertinggi, hms, rp } from "@/lib/format";
import type { SesiLelang, StatusSesi } from "@/lib/types";
import { tone } from "./SesiView";

type Aksi = "batal" | "akhiri" | "tawar" | "batalpesanan";
const BATAS_BAYAR = 24 * 3600;

export default function MonitorLelang({ sesi }: { sesi: SesiLelang }) {
  const toast = useToast();
  const [status, setStatus] = useState<StatusSesi>(sesi.status);
  const [sisa, setSisa] = useState(sesi.sisaDetik);
  const [bayar, setBayar] = useState(sesi.bayar);
  const [bayarSisa, setBayarSisa] = useState(BATAS_BAYAR);
  const [win, setWin] = useState(0);
  const [aksi, setAksi] = useState<Aksi | null>(null);
  const live = status === "Live";
  const winner = sesi.bids[win], next = sesi.bids[win + 1];
  const tutup = () => { setStatus("Selesai"); if (sesi.bids.length) { setBayar("Menunggu Bayar"); setBayarSisa(BATAS_BAYAR); } };

  useEffect(() => { if (!live) return; const t = setInterval(() => setSisa(s => s - 1), 1000); return () => clearInterval(t); }, [live]);
  useEffect(() => { if (live && sisa <= 0) tutup(); }, [sisa, live]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (bayar !== "Menunggu Bayar") return; const t = setInterval(() => setBayarSisa(s => s - 1), 1000); return () => clearInterval(t); }, [bayar]);
  useEffect(() => { if (bayar === "Menunggu Bayar" && bayarSisa <= 0) setBayar("Gagal Bayar"); }, [bayarSisa, bayar]);

  const cfg: Record<Aksi, { judul: string; isi: string; ya: string; merah?: boolean }> = {
    batal: { judul: "Batalkan sesi lelang?", isi: "Semua bid akan dibatalkan dan penawar diberi tahu. Tindakan ini tidak bisa dikembalikan.", ya: "Ya, Batalkan", merah: true },
    akhiri: { judul: "Akhiri lelang sekarang?", isi: "Penawar tertinggi saat ini otomatis menjadi pemenang dan pesanan dibuat dengan batas bayar 24 jam.", ya: "Ya, Akhiri" },
    tawar: { judul: "Tawarkan ke penawar berikutnya?", isi: next ? `${next.nama} diberi tahu dan punya waktu 24 jam untuk membayar ${rp(next.jumlah)}.` : "", ya: "Ya, Tawarkan" },
    batalpesanan: { judul: "Batalkan pesanan pemenang?", isi: `${winner?.nama ?? "Pemenang"} tidak membayar. Pesanan dibatalkan, sesi ditutup, dan pembeli menerima peringatan.`, ya: "Ya, Batalkan Pesanan", merah: true },
  };
  const jalankan = () => {
    if (aksi === "batal") { setStatus("Dibatalkan"); toast("Sesi lelang dibatalkan"); }
    if (aksi === "akhiri") { tutup(); toast("Lelang diakhiri, pesanan dibuat untuk pemenang"); }
    if (aksi === "tawar") { setWin(w => w + 1); setBayar("Menunggu Bayar"); setBayarSisa(BATAS_BAYAR); toast(`Penawaran dikirim ke ${next?.nama}`); }
    if (aksi === "batalpesanan") { setStatus("Dibatalkan"); setBayar(undefined); toast("Pesanan pemenang dibatalkan"); }
    setAksi(null);
  };
  const hi = live ? 0 : win;
  return (
    <>
      <Topbar title={`Lelang ${sesi.produk}`} subtitle={`${sesi.id} · Grade ${sesi.grade} · ${sesi.jadwal}`}
        action={<Link href="/lelang/sesi" className="flex items-center gap-1 text-sm text-primary-600"><ArrowLeft size={16} />Kembali</Link>} />
      <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <Card>
            <div className="flex h-40 items-end justify-between rounded-xl bg-gradient-to-br from-primary-500 to-primary-900 p-4">
              <p className="font-semibold text-white">{sesi.produk} · Grade {sesi.grade}</p><Pill tone={tone[status]}>{status}</Pill>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div><p className="text-sm text-primary-400">{sesi.bids.length ? "Tawaran tertinggi" : "Harga awal"}</p><p className="text-2xl font-bold">{rp(bidTertinggi(sesi))}</p></div>
              <div><p className="text-sm text-primary-400">Penawar</p><p className="text-2xl font-bold">{new Set(sesi.bids.map(b => b.nama)).size}</p></div>
              <div><p className="text-sm text-primary-400">Sisa waktu</p><p className="flex items-center gap-1.5 text-2xl font-bold text-secondary-600"><Clock size={20} />{live ? hms(sisa) : "--:--:--"}</p></div>
            </div>
            <p className="mt-3 text-sm text-primary-500">Harga awal {rp(sesi.hargaAwal)} · Kelipatan bid {rp(sesi.kelipatan)}</p>
          </Card>

          {bayar === "Menunggu Bayar" && winner && (
            <Card className="!bg-secondary-50">
              <div className="flex items-start gap-3"><Trophy className="mt-0.5 shrink-0 text-secondary-600" />
                <div className="flex-1"><p className="font-bold">Pemenang: {winner.nama} · {rp(winner.jumlah)}</p>
                  <p className="text-sm text-primary-600">Pesanan dibuat otomatis. Batas pembayaran:</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xl font-bold text-secondary-600"><Clock size={18} />{hms(bayarSisa)}</p>
                  <Link href="/pesanan" className="mt-1 inline-block text-sm font-semibold text-primary-600">Lihat pesanan →</Link></div></div>
            </Card>)}
          {bayar === "Gagal Bayar" && winner && (
            <Card className="!bg-red-50">
              <div className="flex items-start gap-3"><AlertTriangle className="mt-0.5 shrink-0 text-red-500" />
                <div className="flex-1"><p className="font-bold">{winner.nama} tidak membayar sampai batas waktu</p>
                  <p className="text-sm text-primary-600">{next ? `Anda bisa menawarkan ke penawar berikutnya, ${next.nama} (${rp(next.jumlah)}), atau membatalkan pesanan ini.` : "Tidak ada penawar lain. Batalkan pesanan atau jadwalkan ulang lelangnya."}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {next && <Button onClick={() => setAksi("tawar")}>Tawarkan ke {next.nama}</Button>}
                    {!next && <Link href="/lelang"><Button>Jadwalkan Ulang</Button></Link>}
                    <Button variant="outline" className="!border-red-200 !text-red-600 hover:!bg-red-50" onClick={() => setAksi("batalpesanan")}>Batalkan Pesanan</Button>
                  </div></div></div>
            </Card>)}
          {live && (
            <Card>
              <h3 className="mb-3 font-semibold">Kontrol Sesi</h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => { setSisa(s => s + 600); toast("Waktu diperpanjang 10 menit"); }}><Plus size={16} />Perpanjang 10 Menit</Button>
                <Button variant="outline" onClick={() => setAksi("akhiri")}>Akhiri Sekarang</Button>
                <Button variant="outline" className="!border-red-200 !text-red-600 hover:!bg-red-50" onClick={() => setAksi("batal")}>Batalkan Sesi</Button>
              </div>
            </Card>)}
        </div>
        <Card>
          <h3 className="mb-3 font-semibold">Riwayat Bid</h3>
          {sesi.bids.length === 0 ? <p className="py-8 text-center text-sm text-primary-400">Belum ada penawar. Bagikan lelang ini agar lebih banyak pembeli bergabung.</p> : (
            <ul className="space-y-2">{sesi.bids.map((b, i) => (
              <li key={b.nama + b.jumlah} className={clsx("flex items-center gap-3 rounded-lg p-3", i === hi ? "bg-secondary-50" : "bg-primary-50/50")}>
                <span className={clsx("grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold", i === hi ? "bg-gold text-primary-950" : "bg-primary-100 text-primary-600")}>{i + 1}</span>
                <div className="flex-1"><p className="font-semibold">{b.nama}</p><p className="text-xs text-primary-400">{b.waktu}</p>{!live && i < win && <p className="text-xs font-medium text-red-500">Tidak membayar</p>}</div>
                <b>{rp(b.jumlah)}</b>
              </li>))}</ul>)}
        </Card>
      </div>
      <Modal open={!!aksi} onClose={() => setAksi(null)} title={aksi ? cfg[aksi].judul : ""} subtitle={sesi.produk}
        footer={<><Button variant="outline" onClick={() => setAksi(null)}>Kembali</Button><Button className={aksi && cfg[aksi].merah ? "!bg-red-500 hover:!bg-red-600" : ""} onClick={jalankan}>{aksi ? cfg[aksi].ya : ""}</Button></>}>
        <p className="text-sm text-primary-600">{aksi ? cfg[aksi].isi : ""}</p>
      </Modal>
    </>
  );
}
