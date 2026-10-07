"use client";
import { useState } from "react";
import { Gavel } from "lucide-react";
import FormField from "@/components/FormField";
import { Badge, Button, Card } from "@/components/ui";
import { ikanList } from "@/lib/mock-data";

const rp = (n: number) => "Rp " + n.toLocaleString("id-ID");
export default function LelangForm() {
  const [produk, setProduk] = useState(ikanList[2].id);
  const [harga, setHarga] = useState(28000);
  const ikan = ikanList.find(i => i.id === produk)!;
  return (
    <div className="mb-4 grid gap-4 lg:grid-cols-[1fr_320px]">
      <Card>
        <h3 className="mb-4 font-semibold">Detail Lelang</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><FormField label="Produk dari Stok">
            <select className="input" value={produk} onChange={e => setProduk(e.target.value)}>{ikanList.map(i => <option key={i.id} value={i.id}>{i.nama} · {i.stok} ekor tersedia</option>)}</select></FormField></div>
          <FormField label="Harga Awal (Rp / ekor)"><input className="input" type="number" value={harga} onChange={e => setHarga(+e.target.value)} /></FormField>
          <FormField label="Kelipatan Bid (Rp)"><input className="input" type="number" defaultValue={2000} /></FormField>
          <FormField label="Waktu Mulai"><input className="input" type="datetime-local" /></FormField>
          <FormField label="Durasi Lelang"><select className="input"><option>2 jam</option><option>6 jam</option><option>24 jam</option></select></FormField>
          <div className="sm:col-span-2"><FormField label="Deskripsi Lelang"><textarea className="input" rows={3} placeholder="cth. Cupang Giant Blue Rim grade A, siap kirim ke seluruh Indonesia" /></FormField></div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline">Simpan Draft</Button>
          <Button variant="gold"><Gavel size={16} />Mulai Lelang</Button>
        </div>
      </Card>
      <Card>
        <h3 className="mb-3 font-semibold">Pratinjau Lelang</h3>
        <div className="relative h-36 rounded-lg bg-gradient-to-b from-primary-300 to-primary-600"><span className="absolute bottom-2 left-2 rounded-full bg-white px-2 py-0.5 text-xs font-semibold">Grade {ikan.grade}</span></div>
        <p className="mt-3 font-semibold">{ikan.nama}</p>
        <p className="text-sm text-primary-500">Betta Farm · Kediri</p>
        <div className="mt-3 flex items-center justify-between"><Badge tone="gray">Belum dimulai</Badge><b className="text-lg text-secondary-700">{rp(harga)}</b></div>
      </Card>
    </div>
  );
}
