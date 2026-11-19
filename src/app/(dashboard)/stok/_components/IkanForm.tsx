"use client";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Toggle from "@/components/Toggle";
import { useToast } from "@/components/Toast";
import { Check } from "lucide-react";
import Topbar from "@/components/Topbar";
import FormField from "@/components/FormField";
import { Button, Card } from "@/components/ui";
import { useDashboardData } from "@/components/DashboardDataProvider";
import type { Grade, Ikan } from "@/lib/types";
import MediaUploader, { type MediaItem } from "./MediaUploader";
import AiScanner from "./AiScanner";

function ekstrakJenis(nama: string): string {
  const bersih = nama.replace(/^cupang\s+/i, "").trim();
  const kataPertama = bersih.split(/\s+/)[0];
  if (!kataPertama) return "Lainnya";
  return kataPertama.charAt(0).toUpperCase() + kataPertama.slice(1);
}

export default function IkanForm({ ikan }: { ikan?: Ikan }) {
  const router = useRouter();
  const toast = useToast();
  const { addIkan, updateIkan } = useDashboardData();

  const [media, setMedia] = useState<MediaItem[]>([]);
  const [nama, setNama] = useState(ikan?.nama ?? "");
  const [grade, setGrade] = useState<Grade>(ikan?.grade ?? "A");
  const [usia, setUsia] = useState(ikan ? String(ikan.usia) : "");
  const [stok, setStok] = useState(ikan ? String(ikan.stok) : "");
  const [harga, setHarga] = useState(ikan ? String(ikan.harga) : "");
  const [varian, setVarian] = useState(ikan?.varian ?? "");
  const [kesehatan, setKesehatan] = useState(ikan?.kesehatan ?? "");
  const [publish, setPublish] = useState(ikan?.publish ?? true);

  useEffect(() => {
    if (ikan) {
      setNama(ikan.nama);
      setGrade(ikan.grade);
      setUsia(String(ikan.usia));
      setStok(String(ikan.stok));
      setHarga(String(ikan.harga));
      setVarian(ikan.varian);
      setKesehatan(ikan.kesehatan);
      setPublish(ikan.publish);
    }
  }, [ikan]);

  const edit = !!ikan;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const namaTrim = nama.trim();
    if (!namaTrim) {
      toast("Nama / jenis ikan wajib diisi");
      return;
    }

    const stokNum = Math.max(0, Number(stok) || 0);
    const usiaNum = Math.max(1, Number(usia) || 1);
    const hargaNum = Math.max(0, Number(harga) || 0);
    const warna: Ikan["warna"] =
      grade === "A" ? "gold" : grade === "B" ? "blue" : "navy";

    const payload: Omit<Ikan, "id"> = {
      nama: namaTrim,
      jenis: ekstrakJenis(namaTrim),
      grade,
      usia: usiaNum,
      stok: stokNum,
      harga: hargaNum,
      publish,
      varian: varian.trim() || "Akuarium A-01 · Sortir",
      status: stokNum > 0 ? "Tersedia" : "Habis",
      kesehatan: kesehatan.trim() || "Sehat, nafsu makan baik, siap jual",
      warna,
    };

    if (edit && ikan) {
      updateIkan(ikan.id, payload);
      toast("Perubahan data ikan disimpan");
    } else {
      addIkan({
        id: `ik-${Date.now()}`,
        ...payload,
      });
      toast("Data ikan baru berhasil ditambahkan");
    }

    router.push("/stok");
  };

  return (
    <>
      <Topbar
        title={edit ? "Edit Data Ikan" : "Tambah Data Ikan Baru"}
        subtitle={`Manajemen Stok · ${edit ? ikan.nama : "Tambah Baru"}`}
      />
      <form
        onSubmit={handleSubmit}
        className="grid gap-4 lg:grid-cols-[340px_1fr]"
      >
        <div className="space-y-4 self-start">
          <MediaUploader onChange={setMedia} />
          <AiScanner onTerapkan={setKesehatan} />
        </div>
        <Card>
          <h3 className="mb-4 font-semibold">Detail Ikan</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Jenis ikan">
              <input
                className="input"
                placeholder="cth. Cupang Halfmoon Merah"
                value={nama}
                onChange={e => setNama(e.target.value)}
                required
              />
            </FormField>
            <FormField label="Grade">
              <select
                className="input"
                value={grade}
                onChange={e => setGrade(e.target.value as Grade)}
              >
                <option value="A">Grade A</option>
                <option value="B">Grade B</option>
                <option value="C">Grade C</option>
              </select>
            </FormField>
            <FormField label="Usia (bulan)">
              <input
                className="input"
                type="number"
                min={1}
                placeholder="cth. 4"
                value={usia}
                onChange={e => setUsia(e.target.value)}
              />
            </FormField>
            <FormField label="Jumlah stok (ekor)">
              <input
                className="input"
                type="number"
                min={0}
                placeholder="cth. 330"
                value={stok}
                onChange={e => setStok(e.target.value)}
              />
            </FormField>
            <FormField label="Harga (Rp / ekor)">
              <input
                className="input"
                type="number"
                min={0}
                placeholder="cth. 85000"
                value={harga}
                onChange={e => setHarga(e.target.value)}
              />
            </FormField>
            <div className="flex items-center justify-between gap-3 self-end rounded-lg border border-primary-100 px-3 py-2">
              <div>
                <p className="text-sm font-medium">Tampilkan di marketplace</p>
                <p className="text-xs text-primary-400">
                  Pembeli bisa melihat dan memesan
                </p>
              </div>
              <Toggle
                checked={publish}
                onChange={setPublish}
                label="Tampilkan di marketplace"
              />
            </div>
            <div className="sm:col-span-2">
              <FormField label="Lokasi akuarium / toples">
                <input
                  className="input"
                  placeholder="cth. Akuarium A-12 · Sortir"
                  value={varian}
                  onChange={e => setVarian(e.target.value)}
                />
              </FormField>
            </div>
            <div className="sm:col-span-2">
              <FormField label="Deskripsi kesehatan ikan">
                <textarea
                  className="input"
                  rows={3}
                  placeholder="Kondisi sirip, aktivitas, warna, dan nafsu makan"
                  value={kesehatan}
                  onChange={e => setKesehatan(e.target.value)}
                />
              </FormField>
            </div>
            <div className="sm:col-span-2">
              <FormField label="Catatan tambahan">
                <textarea className="input" rows={2} placeholder="Opsional" />
              </FormField>
            </div>
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Batal
            </Button>
            <Button type="submit">
              <Check size={16} />
              {edit ? "Simpan Perubahan" : "Simpan Data"}
            </Button>
          </div>
        </Card>
      </form>
    </>
  );
}