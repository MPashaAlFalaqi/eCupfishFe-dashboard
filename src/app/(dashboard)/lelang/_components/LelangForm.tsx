"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Gavel, Plus, ArrowLeft } from "lucide-react";
import FormField from "@/components/FormField";
import { Badge, Button, Card } from "@/components/ui";
import { useToast } from "@/components/Toast";
import { useDashboardData } from "@/components/DashboardDataProvider";

const rp = (n: number) => "Rp " + n.toLocaleString("id-ID");

interface LelangFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function LelangForm({ onSuccess, onCancel }: LelangFormProps) {
  const { ikan: ikanList, addSesi } = useDashboardData();
  const toast = useToast();
  const [produk, setProduk] = useState(ikanList[0]?.id ?? "");
  const [harga, setHarga] = useState(28000);
  const [kelipatan, setKelipatan] = useState(2000);
  const [durasi, setDurasi] = useState("2 jam");
  const [deskripsi, setDeskripsi] = useState("");

  useEffect(() => {
    if (!ikanList.some(i => i.id === produk) && ikanList[0]) {
      setProduk(ikanList[0].id);
    }
  }, [ikanList, produk]);

  const ikan = ikanList.find(i => i.id === produk) ?? ikanList[0];

  const buatSesi = (status: "Live" | "Draft") => {
    if (!ikan) {
      toast("Pilih ikan dari stok terlebih dahulu.");
      return;
    }
    const detik =
      durasi === "24 jam" ? 86400 : durasi === "6 jam" ? 21600 : 7200;
    const newId = `L-${Math.floor(107 + Math.random() * 890)}`;
    addSesi({
      id: newId,
      produk: ikan.nama.replace(/^Cupang\s+/i, ""),
      grade: ikan.grade,
      hargaAwal: Math.max(1000, harga),
      kelipatan: Math.max(500, kelipatan),
      status,
      sisaDetik: status === "Live" ? detik : 0,
      jadwal:
        status === "Live" ? "Mulai sekarang" : "Draft · Belum dijadwalkan",
      bids: [],
    });
    toast(
      status === "Live"
        ? "Sesi lelang berhasil dimulai dan masuk ke daftar lelang!"
        : "Sesi lelang berhasil disimpan sebagai draft!"
    );
    if (onSuccess) {
      onSuccess();
    }
  };

  if (!ikan) {
    return (
      <Card className="text-center py-10">
        <p className="text-base font-semibold text-primary-900">
          Belum ada ikan di stok untuk dilelang
        </p>
        <p className="mt-1 text-xs text-primary-500">
          Silakan tambahkan data ikan baru atau pulihkan data default terlebih dahulu.
        </p>
        <Link href="/stok/baru" className="mt-4 inline-block">
          <Button variant="primary">
            <Plus size={15} />
            Tambah Ikan Baru
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="mb-4 grid gap-4 lg:grid-cols-[1fr_320px]">
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-primary-900">Form Detail Lelang</h3>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center gap-1 text-xs text-primary-500 hover:text-primary-700"
            >
              <ArrowLeft size={13} />
              Kembali ke Daftar
            </button>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FormField label="Pilih Ikan dari Stok">
              <select
                className="input"
                value={produk}
                onChange={e => setProduk(e.target.value)}
              >
                {ikanList.map(i => (
                  <option key={i.id} value={i.id}>
                    {i.nama} · Grade {i.grade} · {i.stok} ekor tersedia
                  </option>
                ))}
              </select>
            </FormField>
          </div>
          <FormField label="Harga Awal (Rp / ekor)">
            <input
              className="input"
              type="number"
              min="1000"
              step="1000"
              value={harga}
              onChange={e => setHarga(+e.target.value)}
            />
          </FormField>
          <FormField label="Kelipatan Bid Minimal (Rp)">
            <input
              className="input"
              type="number"
              min="500"
              step="500"
              value={kelipatan}
              onChange={e => setKelipatan(+e.target.value)}
            />
          </FormField>
          <FormField label="Waktu Mulai">
            <input
              className="input"
              type="datetime-local"
              defaultValue={new Date().toISOString().slice(0, 16)}
            />
          </FormField>
          <FormField label="Durasi Sesi Lelang">
            <select
              className="input"
              value={durasi}
              onChange={e => setDurasi(e.target.value)}
            >
              <option value="2 jam">2 jam (Cepat)</option>
              <option value="6 jam">6 jam (Sedang)</option>
              <option value="24 jam">24 jam (1 Hari Penuh)</option>
            </select>
          </FormField>
          <div className="sm:col-span-2">
            <FormField label="Deskripsi / Catatan Lelang">
              <textarea
                className="input"
                rows={3}
                value={deskripsi}
                onChange={e => setDeskripsi(e.target.value)}
                placeholder="cth. Cupang Giant Blue Rim grade A, kondisi prima dan sehat, siap kirim ke seluruh Indonesia"
              />
            </FormField>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-primary-50 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Batal
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => buatSesi("Draft")}
          >
            Simpan Sebagai Draft
          </Button>
          <Button
            type="button"
            variant="gold"
            onClick={() => buatSesi("Live")}
          >
            <Gavel size={16} />
            Mulai Lelang Sekarang
          </Button>
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 font-semibold text-primary-900">Pratinjau Sesi Lelang</h3>
        <div className="relative h-40 rounded-xl bg-gradient-to-br from-primary-400 via-primary-600 to-primary-900 flex items-end p-3 text-white">
          <span className="absolute top-2.5 right-2.5 rounded-full bg-secondary-400 text-primary-950 font-bold px-2 py-0.5 text-xs">
            Grade {ikan.grade}
          </span>
          <div>
            <p className="text-xs text-primary-200">Stok {ikan.stok} ekor</p>
            <p className="text-sm font-bold">{ikan.nama}</p>
          </div>
        </div>
        <p className="mt-3 font-semibold text-primary-900">{ikan.nama}</p>
        <p className="text-xs text-primary-500">Betta Farm · Kediri, Jawa Timur</p>
        <div className="mt-3 flex items-center justify-between border-t border-primary-50 pt-2.5">
          <Badge tone="gray">Belum dimulai</Badge>
          <div className="text-right">
            <p className="text-[10px] text-primary-400">Harga Awal</p>
            <b className="text-base text-secondary-700">{rp(harga)}</b>
          </div>
        </div>
        <div className="mt-2 text-xs text-primary-500">
          Kelipatan bid: <span className="font-semibold text-primary-700">{rp(kelipatan)}</span>
        </div>
      </Card>
    </div>
  );
}
