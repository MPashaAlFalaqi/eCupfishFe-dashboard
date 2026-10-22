"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Check, ShieldCheck, Truck, User, type LucideIcon } from "lucide-react";
import clsx from "clsx";
import Topbar from "@/components/Topbar";
import FormField from "@/components/FormField";
import Toggle from "@/components/Toggle";
import Modal from "@/components/Modal";
import { useToast } from "@/components/Toast";
import { Button, Card } from "@/components/ui";

type Key = "profil" | "pengiriman" | "notifikasi" | "keamanan";
const bagian: { key: Key; label: string; desc: string; icon: LucideIcon }[] = [
  { key: "profil", label: "Profil", desc: "Data pemilik dan toko", icon: User },
  { key: "pengiriman", label: "Pengiriman", desc: "Alamat asal dan jam buka", icon: Truck },
  { key: "notifikasi", label: "Notifikasi", desc: "Pengingat yang Anda terima", icon: Bell },
  { key: "keamanan", label: "Keamanan", desc: "Email, username, kata sandi", icon: ShieldCheck },
];
const notifItems = [
  { key: "pesanan", title: "Pesanan baru", desc: "Beri tahu saya saat ada pesanan masuk" },
  { key: "klaim", title: "Klaim pembeli", desc: "Beri tahu saya saat pembeli mengajukan klaim" },
  { key: "stok", title: "Stok menipis", desc: "Beri tahu saya saat stok hampir habis" },
];

export default function PengaturanPage() {
  const toast = useToast();
  const [tab, setTab] = useState<Key>("profil");
  const [pw, setPw] = useState(false);
  const [notif, setNotif] = useState<Record<string, boolean>>({ pesanan: true, klaim: true, stok: false });
  const aktif = bagian.find(b => b.key === tab)!;
  const simpan = <div className="mt-6 flex justify-end border-t border-primary-50 pt-4"><Button onClick={() => toast(`${aktif.label} disimpan`)}><Check size={16} />Simpan Perubahan</Button></div>;

  return (
    <>
      <Topbar title="Pengaturan" subtitle="Atur profil tambak dan preferensi toko" />
      <div className="grid gap-4 lg:grid-cols-[250px_1fr]">
        <Card className="self-start !p-2">
          <nav aria-label="Bagian pengaturan" className="flex gap-1 overflow-x-auto lg:flex-col">
            {bagian.map(b => (
              <button key={b.key} onClick={() => setTab(b.key)} aria-current={tab === b.key ? "page" : undefined}
                className={clsx("flex shrink-0 items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2.5 text-left text-sm transition-colors", tab === b.key ? "bg-primary-50 font-semibold text-primary-700" : "text-primary-600 hover:bg-primary-50/60")}>
                <b.icon size={17} className={tab === b.key ? "text-primary-500" : "text-primary-400"} />
                <span><span className="block">{b.label}</span><span className="hidden text-xs font-normal text-primary-400 lg:block">{b.desc}</span></span>
              </button>))}
          </nav>
        </Card>
        <Card className="min-h-[420px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
              <h2 className="text-base font-bold">{aktif.label}</h2><p className="mb-5 text-sm text-primary-500">{aktif.desc}</p>
              {tab === "profil" && (<>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Nama Lengkap"><input className="input" defaultValue="Pasha" /></FormField>
                  <FormField label="Nama Tambak / Usaha"><input className="input" defaultValue="Betta Farm" /></FormField>
                  <FormField label="Nomor HP"><input className="input" type="tel" defaultValue="0812-3456-7890" /></FormField>
                  <FormField label="Lokasi Tambak"><input className="input" defaultValue="Kediri, Jawa Timur" /></FormField>
                  <div className="sm:col-span-2"><FormField label="Deskripsi toko"><textarea className="input" rows={3} defaultValue="Peternak cupang Halfmoon dan Giant dari Kediri. Ikan sehat, siap kirim ke seluruh Indonesia." /></FormField></div>
                  <div className="sm:col-span-2"><FormField label="Logo toko" hint="PNG atau JPG, maks. 2MB"><input className="input" type="file" accept="image/*" /></FormField></div>
                </div>{simpan}</>)}
              {tab === "pengiriman" && (<>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2"><FormField label="Alamat lengkap asal pengiriman"><textarea className="input" rows={2} defaultValue="Jl. Mina Raya No. 8, Kec. Mojoroto" /></FormField></div>
                  <FormField label="Kota"><input className="input" defaultValue="Kediri" /></FormField>
                  <FormField label="Kode pos"><input className="input" defaultValue="64112" /></FormField>
                  <FormField label="Jam buka"><input className="input" type="time" defaultValue="08:00" /></FormField>
                  <FormField label="Jam tutup"><input className="input" type="time" defaultValue="17:00" /></FormField>
                </div>{simpan}</>)}
              {tab === "notifikasi" && (<>
                <ul className="divide-y divide-primary-50">{notifItems.map(n => (
                  <li key={n.key} className="flex items-center justify-between gap-4 py-3.5 first:pt-0">
                    <div><p className="font-medium">{n.title}</p><p className="text-sm text-primary-500">{n.desc}</p></div>
                    <Toggle checked={notif[n.key]} onChange={v => setNotif(s => ({ ...s, [n.key]: v }))} label={n.title} />
                  </li>))}</ul>{simpan}</>)}
              {tab === "keamanan" && (<>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Email"><input className="input" type="email" defaultValue="pasha@bettafarm.id" /></FormField>
                  <FormField label="Username"><input className="input" defaultValue="bettafarm" /></FormField>
                  <div className="sm:col-span-2"><FormField label="Kata sandi" hint="Disarankan diganti secara berkala"><Button variant="outline" onClick={() => setPw(true)}>Ubah Kata Sandi</Button></FormField></div>
                </div>{simpan}</>)}
            </motion.div>
          </AnimatePresence>
        </Card>
      </div>
      <Modal open={pw} onClose={() => setPw(false)} title="Ubah Kata Sandi" subtitle="Gunakan kombinasi yang sulit ditebak"
        footer={<><Button variant="outline" onClick={() => setPw(false)}>Batal</Button><Button onClick={() => { setPw(false); toast("Kata sandi diperbarui"); }}>Simpan Sandi</Button></>}>
        <FormField label="Kata sandi lama"><input className="input" type="password" /></FormField>
        <FormField label="Kata sandi baru" hint="Minimal 8 karakter"><input className="input" type="password" /></FormField>
        <FormField label="Konfirmasi kata sandi baru"><input className="input" type="password" /></FormField>
      </Modal>
    </>
  );
}
