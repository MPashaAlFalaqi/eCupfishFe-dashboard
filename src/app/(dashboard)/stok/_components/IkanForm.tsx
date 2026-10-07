"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Toggle from "@/components/Toggle";
import { useToast } from "@/components/Toast";
import { Check, ImagePlus } from "lucide-react";
import Topbar from "@/components/Topbar";
import FormField from "@/components/FormField";
import { Button, Card } from "@/components/ui";
import type { Ikan } from "@/lib/types";
import MediaUploader, { type MediaItem } from "./MediaUploader";
import AiScanner from "./AiScanner";

export default function IkanForm({ ikan }: { ikan?: Ikan }) {
  const router = useRouter();
  const toast = useToast();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [kesehatan, setKesehatan] = useState(ikan?.kesehatan ?? "");
  const [publish, setPublish] = useState(ikan?.publish ?? true);
  const edit = !!ikan;
  return (
    <>
      <Topbar title={edit ? "Edit Data Ikan" : "Tambah Data Ikan Baru"} subtitle={`Manajemen Stok · ${edit ? ikan.nama : "Tambah Baru"}`} />
      <form onSubmit={e => { e.preventDefault(); toast(edit ? "Perubahan data ikan disimpan" : "Data ikan baru disimpan"); router.push("/stok"); }} className="grid gap-4 lg:grid-cols-[340px_1fr]">
        <div className="space-y-4 self-start"><MediaUploader onChange={setMedia} /><AiScanner fotoSiap={media.some(m => m.type === "image")} onTerapkan={setKesehatan} /></div>
        <Card>
          <h3 className="mb-4 font-semibold">Detail Ikan</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Jenis ikan"><input className="input" placeholder="cth. Cupang Halfmoon Merah" defaultValue={ikan?.nama} /></FormField>
            <FormField label="Grade">
              <select className="input" defaultValue={ikan ? `Grade ${ikan.grade}` : ""}><option value="">Pilih grade</option><option>Grade A</option><option>Grade B</option><option>Grade C</option></select>
            </FormField>
            <FormField label="Usia (bulan)"><input className="input" type="number" placeholder="cth. 4" defaultValue={ikan?.usia} /></FormField>
            <FormField label="Jumlah stok (ekor)"><input className="input" type="number" placeholder="cth. 330" defaultValue={ikan?.stok} /></FormField>
            <FormField label="Harga (Rp / ekor)"><input className="input" type="number" placeholder="cth. 85000" defaultValue={ikan?.harga} /></FormField>
            <div className="flex items-center justify-between gap-3 self-end rounded-lg border border-primary-100 px-3 py-2"><div><p className="text-sm font-medium">Tampilkan di marketplace</p><p className="text-xs text-primary-400">Pembeli bisa melihat dan memesan</p></div><Toggle checked={publish} onChange={setPublish} label="Tampilkan di marketplace" /></div>
            <div className="sm:col-span-2"><FormField label="Lokasi akuarium / toples"><input className="input" placeholder="cth. Akuarium A-12, Kediri" defaultValue={ikan?.varian} /></FormField></div>
            <div className="sm:col-span-2"><FormField label="Deskripsi kesehatan ikan"><textarea className="input" rows={3} placeholder="Kondisi sirip, aktivitas, warna, dan nafsu makan" value={kesehatan} onChange={e => setKesehatan(e.target.value)} /></FormField></div>
            <div className="sm:col-span-2"><FormField label="Catatan tambahan"><textarea className="input" rows={2} placeholder="Opsional" /></FormField></div>
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>Batal</Button>
            <Button type="submit"><Check size={16} />{edit ? "Simpan Perubahan" : "Simpan Data"}</Button>
          </div>
        </Card>
      </form>
    </>
  );
}
