"use client";
import Link from "next/link";
import { useState } from "react";
import { CheckCheck, Gavel, MessageCircle, Package, ShieldAlert, ShoppingBag, type LucideIcon } from "lucide-react";
import clsx from "clsx";
import Topbar from "@/components/Topbar";
import FilterBar from "@/components/FilterBar";
import { useToast } from "@/components/Toast";
import { Button, Card } from "@/components/ui";
import type { Notif } from "@/lib/types";

const jenisList = ["Pesanan", "Lelang", "Klaim", "Stok", "Pesan"];
const icon: Record<Notif["jenis"], LucideIcon> = { Pesanan: ShoppingBag, Lelang: Gavel, Klaim: ShieldAlert, Stok: Package, Pesan: MessageCircle };

export default function NotifView({ data }: { data: Notif[] }) {
  const [items, setItems] = useState(data);
  const toast = useToast();
  const [q, setQ] = useState("");
  const [jenis, setJenis] = useState("");
  const [status, setStatus] = useState("");
  const [waktu, setWaktu] = useState("");
  const unread = items.filter(i => !i.dibaca).length;
  const k = q.toLowerCase();
  const rows = items.filter(i => (!jenis || i.jenis === jenis) && (!waktu || i.grup === waktu) && (!status || (status === "Belum dibaca" ? !i.dibaca : i.dibaca)) && [i.judul, i.isi].some(v => v.toLowerCase().includes(k)));
  const read = (id: string) => setItems(s => s.map(i => (i.id === id ? { ...i, dibaca: true } : i)));
  return (
    <>
      <Topbar title="Notifikasi" subtitle={unread ? `${unread} belum dibaca` : "Semua sudah dibaca"}
        action={<Button variant="outline" disabled={!unread} onClick={() => { setItems(s => s.map(i => ({ ...i, dibaca: true }))); toast("Semua notifikasi ditandai dibaca"); }}><CheckCheck size={16} />Tandai semua dibaca</Button>} />
      <FilterBar total={rows.length} search={{ value: q, onChange: setQ, placeholder: "Cari notifikasi..." }}
        filters={[{ label: "Jenis", value: jenis, onChange: setJenis, options: jenisList }, { label: "Status", value: status, onChange: setStatus, options: ["Belum dibaca", "Sudah dibaca"] }, { label: "Waktu", value: waktu, onChange: setWaktu, options: ["Hari ini", "Kemarin"] }]} />
      {rows.length === 0 ? <Card><p className="py-10 text-center text-primary-400">Belum ada notifikasi di sini. Tenang, kabar baik akan segera datang!</p></Card> : (
        (["Hari ini", "Kemarin"] as const).map(g => {
          const list = rows.filter(r => r.grup === g);
          return list.length === 0 ? null : (
            <div key={g} className="mb-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary-400">{g}</p>
              <Card className="!p-0"><ul className="divide-y divide-primary-50">{list.map(n => {
                const I = icon[n.jenis];
                return (
                  <li key={n.id}><Link href={n.href} onClick={() => read(n.id)} className={clsx("flex items-start gap-3 p-4 transition hover:bg-primary-50/60", !n.dibaca && "bg-primary-50/50")}>
                    <span className={clsx("grid h-10 w-10 shrink-0 place-items-center rounded-xl", n.jenis === "Lelang" ? "bg-secondary-100 text-secondary-600" : "bg-primary-50 text-primary-500")}><I size={18} /></span>
                    <div className="min-w-0 flex-1"><p className="font-semibold">{n.judul}</p><p className="text-sm text-primary-500">{n.isi}</p><p className="mt-1 text-xs text-primary-400">{n.waktu}</p></div>
                    {!n.dibaca && <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-secondary-500" />}
                  </Link></li>);
              })}</ul></Card>
            </div>);
        }))}
    </>
  );
}
