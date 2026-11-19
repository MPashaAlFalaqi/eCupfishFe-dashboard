"use client";
import { useEffect, useState } from "react";
import { Gavel } from "lucide-react";
import FormField from "@/components/FormField";
import { Badge, Button, Card } from "@/components/ui";
import { useToast } from "@/components/Toast";
import { useDashboardData } from "@/components/DashboardDataProvider";

const rp = (n: number) => "Rp " + n.toLocaleString("id-ID");

export default function LelangForm() {
  const { ikan: ikanList, addSesi } = useDashboardData();
  const toast = useToast();
  const [produk, setProduk] = useState(ikanList[0]?.id ?? "");
  const [harga, setHarga] = useState(28000);
  const [kelipatan, setKelipatan] = useState(2000);
  const [durasi, setDurasi] = useState("2 jam");

  useEffect(() => {
    if (!ikanList.some(i => i.id === produk) && ikanList[0]) {
      setProduk(ikanList[0].id);
    }
  }, [ikanList, produk]);

  const ikan = ikanList.find(i => i.id === produk) ?? ikanList[0];

  const buatSesi = (status: "Live" | "Draft") => {
    if (!ikan) return;
    const detik =
      durasi === "24 jam" ? 86400 : durasi === "6 jam" ? 21600 : 7200;
    addSesi({
      id: `L-${Math.floor(107 + Math.random() * 890)}`,
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
        ? "Sesi lelang dimulai & tampil di daftar aktif"
        : "Sesi lelang disimpan sebagai draft"
    );
  };

  if (!ikan) return null;

  return (
    <div className="mb-4 grid gap-4 lg:grid-cols-[1fr_320px]">
      <Card>
        <h3 className="mb-4 font-semibold">Detail Lelang</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FormField label="Produk dari Stok">
              <select
                className="input"
                value={produk}
                onChange={e => setProduk(e.target.value)}
              >
                {ikanList.map(i => (
                  <option key={i.id} value={i.id}>
                    {i.nama} · {i.stok} ekor tersedia
                  </option>
                ))}
              </select>
            </FormField>
          </div>
          <FormField label="Harga Awal (Rp / ekor)">
            <input
              className="input"
              type="number"
              value={harga}
              onChange={e => setHarga(+e.target.value)}
            />
          </FormField>
          <FormField label="Kelipatan Bid (Rp)">
            <input
              className="input"
              type="number"
              value={kelipatan}
              onChange={e => setKelipatan(+e.target.value)}
            />
          </FormField>
          <FormField label="Waktu Mulai">
            <input className="input" type="datetime-local" />
          </FormField>
          <FormField label="Durasi Lelang">
            <select
              className="input"
              value={durasi}
              onChange={e => setDurasi(e.target.value)}
            >
              <option>2 jam</option>
              <option>6 jam</option>
              <option>24 jam</option>
            </select>
          </FormField>
          <div className="sm:col-span-2">
            <FormField label="Deskripsi Lelang">
              <textarea
                className="input"
                rows={3}
                placeholder="cth. Cupang Giant Blue Rim grade A, siap kirim ke seluruh Indonesia"
              />
            </FormField>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => buatSesi("Draft")}
          >
            Simpan Draft
          </Button>
          <Button
            type="button"
            variant="gold"
            onClick={() => buatSesi("Live")}
          >
            <Gavel size={16} />
            Mulai Lelang
          </Button>
        </div>
      </Card>
      <Card>
        <h3 className="mb-3 font-semibold">Pratinjau Lelang</h3>
        <div className="relative h-36 rounded-lg bg-gradient-to-b from-primary-300 to-primary-600">
          <span className="absolute bottom-2 left-2 rounded-full bg-white px-2 py-0.5 text-xs font-semibold">
            Grade {ikan.grade}
          </span>
        </div>
        <p className="mt-3 font-semibold">{ikan.nama}</p>
        <p className="text-sm text-primary-500">Betta Farm · Kediri</p>
        <div className="mt-3 flex items-center justify-between">
          <Badge tone="gray">Belum dimulai</Badge>
          <b className="text-lg text-secondary-700">{rp(harga)}</b>
        </div>
      </Card>
    </div>
  );
}