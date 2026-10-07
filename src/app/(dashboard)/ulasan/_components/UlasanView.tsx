"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "@/components/Toast";
import { Flag, MessageSquare, Star, ThumbsUp } from "lucide-react";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import Tabs from "@/components/Tabs";
import Stars from "@/components/Stars";
import Modal from "@/components/Modal";
import { Button, Card, Pill } from "@/components/ui";
import type { Ulasan } from "@/lib/types";

const tabs = ["Semua", "Belum dibalas", "5 ★", "4 ★", "3 ★", "2 ★", "1 ★"] as const;
const initials = (n: string) => n.split(" ").map(w => w[0]).join("").slice(0, 2);

export default function UlasanView({ data }: { data: Ulasan[] }) {
  const [items, setItems] = useState(data);
  const toast = useToast();
  const [tab, setTab] = useState<(typeof tabs)[number]>("Semua");
  const [balas, setBalas] = useState<string | null>(null);
  const [teks, setTeks] = useState("");
  const [lapor, setLapor] = useState<Ulasan | null>(null);
  const avg = items.reduce((n, i) => n + i.bintang, 0) / items.length;
  const belum = items.filter(i => !i.balasan).length;
  const lima = Math.round((items.filter(i => i.bintang === 5).length / items.length) * 100);
  const rows = items.filter(i => tab === "Semua" ? true : tab === "Belum dibalas" ? !i.balasan : i.bintang === Number(tab[0]));
  const kirim = (id: string) => { if (!teks.trim()) return; setItems(s => s.map(i => (i.id === id ? { ...i, balasan: teks.trim() } : i))); setBalas(null); setTeks(""); toast("Balasan terkirim"); };
  return (
    <>
      <Topbar title="Ulasan & Rating" subtitle="Tanggapi ulasan pembeli untuk membangun kepercayaan toko" />
      <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard variant="blue" label="Rating Rata-rata" value={`${avg.toFixed(1).replace(".", ",")} / 5`} icon={Star} />
        <StatCard label="Total Ulasan" value={String(items.length)} icon={MessageSquare} />
        <StatCard label="Belum Dibalas" value={String(belum)} note={belum ? "Balas dalam 2 hari ya" : "Semua sudah dibalas"} noteTone={belum ? "red" : "blue"} icon={MessageSquare} />
        <StatCard label="Ulasan Bintang 5" value={`${lima}%`} icon={ThumbsUp} />
      </div>
      <Tabs tabs={tabs} value={tab} onChange={setTab} />
      {rows.length === 0 && <Card><p className="py-10 text-center text-primary-400">Belum ada ulasan di kategori ini. Layani pembeli dengan baik, bintang akan datang!</p></Card>}
      <div className="space-y-3"><AnimatePresence initial={false}>{rows.map(u => (
        <motion.div key={u.id} layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.22 }}><Card>
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-100 text-sm font-bold text-primary-600">{initials(u.nama)}</span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2"><b>{u.nama}</b><Stars n={u.bintang} /><span className="text-xs text-primary-400">{u.tanggal}</span>{u.dilaporkan && <Pill tone="red">Dilaporkan</Pill>}</div>
              <p className="text-xs text-primary-400">{u.produk}</p>
              <p className="mt-2 text-sm">{u.komentar}</p>
              {u.tags.length > 0 && <div className="mt-2 flex flex-wrap gap-1.5">{u.tags.map(t => <span key={t} className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs text-primary-600">{t}</span>)}</div>}
              {u.foto > 0 && <div className="mt-3 flex gap-2">{Array.from({ length: u.foto }).map((_, i) => <div key={i} className="h-16 w-16 rounded-lg bg-primary-200" />)}</div>}
              {u.balasan && <div className="mt-3 rounded-lg bg-primary-50 p-3 text-sm"><p className="mb-0.5 text-xs font-semibold text-primary-500">Balasan Anda</p>{u.balasan}</div>}
              {balas === u.id && (
                <div className="mt-3"><textarea className="input" rows={2} value={teks} onChange={e => setTeks(e.target.value)} placeholder="Tulis balasan yang ramah untuk pembeli..." />
                  <div className="mt-2 flex gap-2"><Button className="!py-1.5" onClick={() => kirim(u.id)}>Kirim Balasan</Button><Button variant="outline" className="!py-1.5" onClick={() => { setBalas(null); setTeks(""); }}>Batal</Button></div></div>)}
            </div>
            <div className="flex shrink-0 gap-2">
              {!u.balasan && balas !== u.id && <Button variant="outline" className="!px-3 !py-1.5" onClick={() => { setBalas(u.id); setTeks(""); }}>Balas</Button>}
              {!u.dilaporkan && <button aria-label="Laporkan ulasan" onClick={() => setLapor(u)} className="grid h-9 w-9 place-items-center rounded-lg border border-primary-100 text-primary-400 hover:bg-primary-50"><Flag size={15} /></button>}
            </div>
          </div>
        </Card></motion.div>))}</AnimatePresence></div>
      <Modal open={!!lapor} onClose={() => setLapor(null)} title="Laporkan ulasan?" subtitle={lapor ? `${lapor.nama} · ${lapor.produk}` : ""}
        footer={<><Button variant="outline" onClick={() => setLapor(null)}>Batal</Button><Button onClick={() => { setItems(s => s.map(i => (i.id === lapor?.id ? { ...i, dilaporkan: true } : i))); setLapor(null); toast("Laporan terkirim, terima kasih"); }}>Laporkan</Button></>}>
        <label className="label">Alasan</label>
        <select className="input"><option>Mengandung kata kasar</option><option>Bukan ulasan produk ini</option><option>Spam atau iklan</option><option>Lainnya</option></select>
        <p className="text-sm text-primary-500">Tim eCupFish akan meninjau laporanmu. Ulasan tetap tampil sampai ada keputusan.</p>
      </Modal>
    </>
  );
}
