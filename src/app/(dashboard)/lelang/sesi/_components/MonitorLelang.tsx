"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Clock,
  Plus,
  Trophy,
  Gavel,
  CheckCircle2,
  Check,
} from "lucide-react";
import clsx from "clsx";
import Topbar from "@/components/Topbar";
import Modal from "@/components/Modal";
import { useToast } from "@/components/Toast";
import { Button, Card, Pill } from "@/components/ui";
import { bidTertinggi, hms, rp } from "@/lib/format";
import type { SesiLelang, StatusSesi } from "@/lib/types";
import { useDashboardData } from "@/components/DashboardDataProvider";
import { tone } from "./SesiView";

type Aksi = "batal" | "akhiri" | "tawar" | "batalpesanan";
const BATAS_BAYAR = 24 * 3600;

export default function MonitorLelang({ sesi: initialSesi }: { sesi: SesiLelang }) {
  const toast = useToast();
  const {
    sesi: ctxSesi,
    pesanan,
    addBid,
    selesaikanSesi,
    updateSesi,
    konfirmasiBayarPesanan,
  } = useDashboardData();

  // Ambil sesi terbaru dari context jika ada, fallback ke prop
  const currentSesi = ctxSesi.find(s => s.id === initialSesi.id) || initialSesi;

  const [status, setStatus] = useState<StatusSesi>(currentSesi.status);
  const [sisa, setSisa] = useState(currentSesi.sisaDetik);
  const [bayar, setBayar] = useState(currentSesi.bayar);
  const [bayarSisa, setBayarSisa] = useState(BATAS_BAYAR);
  const [win, setWin] = useState(0);
  const [aksi, setAksi] = useState<Aksi | null>(null);

  // Form Live Bid
  const [namaPenawar, setNamaPenawar] = useState("Budi Kolektor");
  const [customNominal, setCustomNominal] = useState<number | "">("");

  useEffect(() => {
    setStatus(currentSesi.status);
    setBayar(currentSesi.bayar);
  }, [currentSesi.status, currentSesi.bayar]);

  const live = status === "Live";
  const winner = currentSesi.bids[win],
    next = currentSesi.bids[win + 1];

  // Cari pesanan yang terkait sesi ini jika sudah selesai
  const pesananTerkait = pesanan.find(
    p =>
      p.sumber === "Lelang" &&
      p.ikan.toLowerCase().includes(currentSesi.produk.toLowerCase()) &&
      (winner ? p.pembeli === winner.nama : true)
  );

  const tutup = () => {
    setStatus("Selesai");
    selesaikanSesi(currentSesi.id);
    if (currentSesi.bids.length) {
      setBayar("Menunggu Bayar");
      setBayarSisa(BATAS_BAYAR);
    }
  };

  useEffect(() => {
    if (!live) return;
    const t = setInterval(() => setSisa(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [live]);

  useEffect(() => {
    if (live && sisa <= 0) tutup();
  }, [sisa, live]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (bayar !== "Menunggu Bayar") return;
    const t = setInterval(() => setBayarSisa(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [bayar]);

  useEffect(() => {
    if (bayar === "Menunggu Bayar" && bayarSisa <= 0) setBayar("Gagal Bayar");
  }, [bayarSisa, bayar]);

  const highestBid = bidTertinggi(currentSesi);
  const minNextBid = highestBid + currentSesi.kelipatan;

  const handleKirimBid = (nominal?: number) => {
    const val = nominal ?? (Number(customNominal) || minNextBid);
    if (val <= highestBid) {
      toast(`Tawaran harus lebih tinggi dari ${rp(highestBid)}!`);
      return;
    }
    const nama = namaPenawar.trim() || "Penawar Anonim";
    addBid(currentSesi.id, {
      nama,
      jumlah: val,
      waktu: "Baru saja",
    });
    setCustomNominal("");
    toast(`Tawaran ${rp(val)} berhasil dikirimkan secara realtime!`);
  };

  const cfg: Record<
    Aksi,
    { judul: string; isi: string; ya: string; merah?: boolean }
  > = {
    batal: {
      judul: "Batalkan sesi lelang?",
      isi: "Semua bid akan dibatalkan dan penawar diberi tahu. Tindakan ini tidak bisa dikembalikan.",
      ya: "Ya, Batalkan",
      merah: true,
    },
    akhiri: {
      judul: "Akhiri lelang sekarang?",
      isi: "Penawar tertinggi saat ini otomatis menjadi pemenang, stok ikan otomatis berkurang, dan pesanan dibuat dengan batas bayar 24 jam.",
      ya: "Ya, Akhiri",
    },
    tawar: {
      judul: "Tawarkan ke penawar berikutnya?",
      isi: next
        ? `${next.nama} diberi tahu dan punya waktu 24 jam untuk membayar ${rp(next.jumlah)}.`
        : "",
      ya: "Ya, Tawarkan",
    },
    batalpesanan: {
      judul: "Batalkan pesanan pemenang?",
      isi: `${winner?.nama ?? "Pemenang"} tidak membayar. Pesanan dibatalkan, sesi ditutup, dan pembeli menerima peringatan.`,
      ya: "Ya, Batalkan Pesanan",
      merah: true,
    },
  };

  const jalankan = () => {
    if (aksi === "batal") {
      setStatus("Dibatalkan");
      updateSesi(currentSesi.id, { status: "Dibatalkan" });
      toast("Sesi lelang dibatalkan");
    }
    if (aksi === "akhiri") {
      tutup();
      toast("Lelang diakhiri! Pesanan otomatis dibuat & stok ikan dikurangi.");
    }
    if (aksi === "tawar") {
      setWin(w => w + 1);
      setBayar("Menunggu Bayar");
      setBayarSisa(BATAS_BAYAR);
      toast(`Penawaran dikirim ke ${next?.nama}`);
    }
    if (aksi === "batalpesanan") {
      setStatus("Dibatalkan");
      setBayar(undefined);
      updateSesi(currentSesi.id, { status: "Dibatalkan" });
      toast("Pesanan pemenang dibatalkan");
    }
    setAksi(null);
  };

  const hi = live ? 0 : win;

  return (
    <>
      <Topbar
        title={`Lelang ${currentSesi.produk}`}
        subtitle={`${currentSesi.id} · Grade ${currentSesi.grade} · ${currentSesi.jadwal}`}
        action={
          <Link
            href="/lelang/sesi"
            className="flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-800"
          >
            <ArrowLeft size={16} />
            Kembali ke Daftar Sesi
          </Link>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <Card>
            <div className="flex h-40 items-end justify-between rounded-xl bg-gradient-to-br from-primary-600 to-primary-950 p-4 shadow-inner">
              <div>
                <p className="font-bold text-lg text-white">
                  {currentSesi.produk} · Grade {currentSesi.grade}
                </p>
                <p className="text-xs text-primary-200 mt-0.5 font-mono">
                  ID Sesi: {currentSesi.id}
                </p>
              </div>
              <Pill tone={tone[status]}>{status}</Pill>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-primary-400">
                  {currentSesi.bids.length ? "Tawaran Tertinggi" : "Harga Awal"}
                </p>
                <p className="text-2xl font-bold text-primary-900">
                  {rp(highestBid)}
                </p>
              </div>
              <div>
                <p className="text-sm text-primary-400">Penawar</p>
                <p className="text-2xl font-bold text-primary-900">
                  {new Set(currentSesi.bids.map(b => b.nama)).size}
                </p>
              </div>
              <div>
                <p className="text-sm text-primary-400">Sisa Waktu</p>
                <p className="flex items-center gap-1.5 text-2xl font-bold text-secondary-600 font-mono">
                  <Clock size={20} />
                  {live ? hms(sisa) : "--:--:--"}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm text-primary-500 border-t border-primary-50 pt-2">
              Harga awal <b>{rp(currentSesi.hargaAwal)}</b> · Kelipatan tawaran{" "}
              <b>{rp(currentSesi.kelipatan)}</b>
            </p>
          </Card>

          {/* Panel Eksekusi Live Bidding (Realtime) */}
          {live && (
            <Card className="border border-emerald-200 bg-emerald-50/40">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <Gavel size={16} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-primary-900">
                      Pasang Tawaran Langsung (Live Bidding)
                    </h3>
                    <p className="text-xs text-primary-500">
                      Eksekusi tawaran real-time dan langsung sinkron ke seluruh tab
                    </p>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-full border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Sesi Aktif
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="label">Nama Penawar</label>
                  <input
                    type="text"
                    value={namaPenawar}
                    onChange={e => setNamaPenawar(e.target.value)}
                    className="input font-medium"
                    placeholder="Contoh: Budi Santoso"
                  />
                </div>
                <div>
                  <label className="label">Nominal Tawaran Kustom</label>
                  <input
                    type="number"
                    value={customNominal}
                    onChange={e =>
                      setCustomNominal(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    placeholder={`Min. ${rp(minNextBid)}`}
                    className="input font-semibold"
                  />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-primary-500">Tawaran Cepat:</span>
                  <button
                    type="button"
                    onClick={() => handleKirimBid(minNextBid)}
                    className="px-2.5 py-1 bg-white hover:bg-emerald-100 border border-emerald-300 rounded-lg text-xs font-bold text-emerald-800 transition"
                  >
                    + {rp(currentSesi.kelipatan)} ({rp(minNextBid)})
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleKirimBid(highestBid + currentSesi.kelipatan * 2)
                    }
                    className="px-2.5 py-1 bg-white hover:bg-emerald-100 border border-emerald-300 rounded-lg text-xs font-bold text-emerald-800 transition"
                  >
                    + {rp(currentSesi.kelipatan * 2)} (
                    {rp(highestBid + currentSesi.kelipatan * 2)})
                  </button>
                </div>
                <Button
                  onClick={() => handleKirimBid()}
                  className="!py-1.5 !px-4"
                >
                  <Gavel size={15} />
                  Kirim Tawaran
                </Button>
              </div>
            </Card>
          )}

          {/* Kartu Status Pemenang & Eksekusi Pesanan Terintegrasi */}
          {bayar === "Menunggu Bayar" && winner && (
            <Card className="!bg-secondary-50 border border-secondary-200">
              <div className="flex items-start gap-3">
                <Trophy className="mt-0.5 shrink-0 text-secondary-600 w-6 h-6" />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-bold text-base text-primary-950">
                      Pemenang Lelang: {winner.nama} · {rp(winner.jumlah)}
                    </p>
                    <span className="rounded-md bg-secondary-200 px-2 py-0.5 text-xs font-bold text-secondary-900">
                      Pesanan Otomatis Dibuat
                    </span>
                  </div>
                  <p className="text-xs text-primary-600 mt-1">
                    Pesanan telah otomatis terintegrasi ke halaman{" "}
                    <b>Pesanan</b> dan stok ikan otomatis dipotong. Batas
                    pembayaran:
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-lg font-bold text-secondary-700 font-mono">
                    <Clock size={16} />
                    {hms(bayarSisa)}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Link href="/pesanan">
                      <Button variant="primary" className="!py-1.5 text-xs">
                        Lihat di Daftar Pesanan →
                      </Button>
                    </Link>
                    {pesananTerkait && pesananTerkait.status === "Menunggu Bayar" && (
                      <Button
                        variant="outline"
                        className="!py-1.5 text-xs bg-white"
                        onClick={() => {
                          konfirmasiBayarPesanan(pesananTerkait.id);
                          setBayar("Dibayar");
                          toast(
                            `Pembayaran pesanan #${pesananTerkait.id} berhasil dikonfirmasi!`
                          );
                        }}
                      >
                        <Check size={14} />
                        Konfirmasi Pembayaran Diterima
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {bayar === "Dibayar" && winner && (
            <Card className="!bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="shrink-0 text-emerald-600 w-6 h-6" />
                <div className="flex-1">
                  <p className="font-bold text-sm text-emerald-900">
                    Pembayaran Lunas dari {winner.nama} ({rp(winner.jumlah)})
                  </p>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Pesanan siap dikemas dan dikirim ke pembeli.
                  </p>
                </div>
                <Link href="/pengiriman">
                  <Button className="!py-1.5 text-xs">Kemas & Kirim</Button>
                </Link>
              </div>
            </Card>
          )}

          {bayar === "Gagal Bayar" && winner && (
            <Card className="!bg-red-50 border border-red-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 shrink-0 text-red-500" />
                <div className="flex-1">
                  <p className="font-bold text-red-900">
                    {winner.nama} tidak membayar sampai batas waktu
                  </p>
                  <p className="text-xs text-red-700 mt-1">
                    {next
                      ? `Anda bisa menawarkan ke penawar berikutnya, ${next.nama} (${rp(next.jumlah)}), atau membatalkan pesanan ini.`
                      : "Tidak ada penawar lain. Batalkan pesanan atau jadwalkan ulang lelangnya."}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {next && (
                      <Button onClick={() => setAksi("tawar")}>
                        Tawarkan ke {next.nama}
                      </Button>
                    )}
                    {!next && (
                      <Link href="/lelang">
                        <Button>Jadwalkan Ulang</Button>
                      </Link>
                    )}
                    <Button
                      variant="outline"
                      className="!border-red-200 !text-red-600 hover:!bg-red-50"
                      onClick={() => setAksi("batalpesanan")}
                    >
                      Batalkan Pesanan
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {live && (
            <Card>
              <h3 className="mb-3 font-semibold text-primary-900">Kontrol Sesi</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSisa(s => s + 600);
                    toast("Waktu diperpanjang 10 menit");
                  }}
                >
                  <Plus size={16} />
                  Perpanjang 10 Menit
                </Button>
                <Button variant="outline" onClick={() => setAksi("akhiri")}>
                  Akhiri Sekarang
                </Button>
                <Button
                  variant="outline"
                  className="!border-red-200 !text-red-600 hover:!bg-red-50"
                  onClick={() => setAksi("batal")}
                >
                  Batalkan Sesi
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Panel Riwayat Bid */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-primary-900">Riwayat Tawaran (Bid)</h3>
            <span className="text-xs font-semibold text-primary-500">
              {currentSesi.bids.length} Tawaran
            </span>
          </div>

          {currentSesi.bids.length === 0 ? (
            <p className="py-8 text-center text-sm text-primary-400">
              Belum ada penawar. Gunakan form di samping untuk memasang tawaran
              pertama.
            </p>
          ) : (
            <ul className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {currentSesi.bids.map((b, i) => (
                <li
                  key={b.nama + b.jumlah + i}
                  className={clsx(
                    "flex items-center gap-3 rounded-xl p-3 border transition-colors",
                    i === hi
                      ? "bg-secondary-50/70 border-secondary-200"
                      : "bg-primary-50/40 border-primary-100"
                  )}
                >
                  <span
                    className={clsx(
                      "grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold shadow-2xs",
                      i === hi
                        ? "bg-gold text-primary-950"
                        : "bg-primary-200 text-primary-700"
                    )}
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm text-primary-900 truncate">
                      {b.nama}
                    </p>
                    <p className="text-[11px] text-primary-400">{b.waktu}</p>
                    {!live && i < win && (
                      <p className="text-[10px] font-semibold text-red-500">
                        Tidak membayar
                      </p>
                    )}
                  </div>
                  <b className="text-sm font-bold text-primary-950 font-mono">
                    {rp(b.jumlah)}
                  </b>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Modal
        open={!!aksi}
        onClose={() => setAksi(null)}
        title={aksi ? cfg[aksi].judul : ""}
        subtitle={currentSesi.produk}
        footer={
          <>
            <Button variant="outline" onClick={() => setAksi(null)}>
              Kembali
            </Button>
            <Button
              className={aksi && cfg[aksi].merah ? "!bg-red-500 hover:!bg-red-600" : ""}
              onClick={jalankan}
            >
              {aksi ? cfg[aksi].ya : ""}
            </Button>
          </>
        }
      >
        <p className="text-sm text-primary-600">{aksi ? cfg[aksi].isi : ""}</p>
      </Modal>
    </>
  );
}
