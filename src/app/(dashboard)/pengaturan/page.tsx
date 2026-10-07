"use client";
import { useState } from "react";
import { Check } from "lucide-react";
import Topbar from "@/components/Topbar";
import FormField from "@/components/FormField";
import Toggle from "@/components/Toggle";
import Modal from "@/components/Modal";
import { useToast } from "@/components/Toast";
import { Button, Card } from "@/components/ui";

const notifItems = [
  { key: "pesanan", title: "Pesanan baru", desc: "Beri tahu saya saat ada pesanan masuk" },
  { key: "klaim", title: "Klaim pembeli", desc: "Beri tahu saya saat pembeli mengajukan klaim" },
  { key: "stok", title: "Stok menipis", desc: "Beri tahu saya saat stok hampir habis" },
];
export default function PengaturanPage() {
  const [pw, setPw] = useState(false);
  const toast = useToast();
  const [notif, setNotif] = useState<Record<string, boolean>>({ pesanan: true, klaim: true, stok: false });
  return (
    <>
      <Topbar title="Pengaturan" subtitle="Profil tambak dan preferensi notifikasi" />
      <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
        <Card>
          <h3 className="mb-4 font-semibold">Profil Tambak</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Nama Lengkap"><input className="input" defaultValue="Pasha" /></FormField>
            <FormField label="Nama Tambak / Usaha"><input className="input" defaultValue="Betta Farm" /></FormField>
            <FormField label="Nomor HP"><input className="input" type="tel" defaultValue="0812-3456-7890" /></FormField>
            <FormField label="Lokasi Tambak"><input className="input" defaultValue="Kediri, Jawa Timur" /></FormField>
          </div>
          <div className="mt-5 flex justify-end"><Button onClick={() => toast("Profil tambak disimpan")}><Check size={16} />Simpan Perubahan</Button></div>
        </Card>
        <Card>
          <h3 className="mb-4 font-semibold">Notifikasi</h3>
          <ul className="space-y-4">{notifItems.map(n => (
            <li key={n.key} className="flex items-center justify-between gap-4">
              <div><p className="font-medium">{n.title}</p><p className="text-sm text-primary-500">{n.desc}</p></div>
              <Toggle checked={notif[n.key]} onChange={v => setNotif(s => ({ ...s, [n.key]: v }))} label={n.title} />
            </li>))}
          </ul>
        </Card>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 font-semibold">Akun & Keamanan</h3>
          <div className="space-y-4">
            <FormField label="Email"><input className="input" type="email" defaultValue="pasha@bettafarm.id" /></FormField>
            <FormField label="Username"><input className="input" defaultValue="bettafarm" /></FormField>
            <Button variant="outline" onClick={() => setPw(true)}>Ubah Kata Sandi</Button>
          </div>
        </Card>
        <Card>
          <h3 className="mb-4 font-semibold">Profil Toko</h3>
          <div className="space-y-4">
            <FormField label="Deskripsi toko"><textarea className="input" rows={3} defaultValue="Peternak cupang Halfmoon dan Giant dari Kediri. Ikan sehat, siap kirim ke seluruh Indonesia." /></FormField>
            <FormField label="Logo toko" hint="PNG atau JPG, maks. 2MB"><input className="input" type="file" accept="image/*" /></FormField>
          </div>
        </Card>
        <Card>
          <h3 className="mb-4 font-semibold">Alamat Asal Pengiriman</h3>
          <div className="space-y-4">
            <FormField label="Alamat lengkap"><textarea className="input" rows={2} defaultValue="Jl. Mina Raya No. 8, Kec. Mojoroto" /></FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Kota"><input className="input" defaultValue="Kediri" /></FormField>
              <FormField label="Kode pos"><input className="input" defaultValue="64112" /></FormField>
            </div>
          </div>
        </Card>
        <Card>
          <h3 className="mb-4 font-semibold">Jam Operasional</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 pt-1">
              <FormField label="Buka"><input className="input" type="time" defaultValue="08:00" /></FormField>
              <FormField label="Tutup"><input className="input" type="time" defaultValue="17:00" /></FormField>
            </div>
          </div>
        </Card>
      </div>
      <div className="mt-4 flex justify-end"><Button onClick={() => toast("Semua pengaturan disimpan")}><Check size={16} />Simpan Semua Perubahan</Button></div>
      <Modal open={pw} onClose={() => setPw(false)} title="Ubah Kata Sandi" subtitle="Gunakan kombinasi yang sulit ditebak"
        footer={<><Button variant="outline" onClick={() => setPw(false)}>Batal</Button><Button onClick={() => { setPw(false); toast("Kata sandi diperbarui"); }}>Simpan Sandi</Button></>}>
        <FormField label="Kata sandi lama"><input className="input" type="password" /></FormField>
        <FormField label="Kata sandi baru" hint="Minimal 8 karakter"><input className="input" type="password" /></FormField>
        <FormField label="Konfirmasi kata sandi baru"><input className="input" type="password" /></FormField>
      </Modal>
    </>
  );
}
