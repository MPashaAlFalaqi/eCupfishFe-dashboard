"use client";
import { useEffect, useRef, useState } from "react";
import { ImagePlus, Send } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";
import Topbar from "@/components/Topbar";
import SearchInput from "@/components/SearchInput";
import { Card } from "@/components/ui";
import type { Percakapan } from "@/lib/types";

const quick = ["Stok masih tersedia, kak 😊", "Barang dikemas aman ya kak", "Mohon ditunggu, saya cek dulu", "Terima kasih sudah berbelanja!"];
const initials = (n: string) => n.split(" ").map(w => w[0]).join("").slice(0, 2);

export default function ChatView({ data }: { data: Percakapan[] }) {
  const [list, setList] = useState(data);
  const [active, setActive] = useState(data[0].id);
  const [q, setQ] = useState("");
  const [text, setText] = useState("");
  const end = useRef<HTMLDivElement>(null);
  const cur = list.find(c => c.id === active)!;
  useEffect(() => { end.current?.scrollIntoView({ block: "end" }); }, [active, cur.pesan.length]);
  const open = (id: string) => { setActive(id); setList(l => l.map(c => (c.id === id ? { ...c, belumDibaca: 0 } : c))); };
  const send = (t: string) => {
    if (!t.trim()) return;
    setList(l => l.map(c => (c.id === active ? { ...c, terakhir: t, pesan: [...c.pesan, { dari: "penjual", teks: t, waktu: "Baru saja" }] } : c)));
    setText("");
  };
  const shown = list.filter(c => [c.nama, c.produk].some(v => v.toLowerCase().includes(q.toLowerCase())));
  return (
    <>
      <Topbar title="Chat" subtitle="Percakapan dengan pembeli" />
      <div className="grid h-[calc(100vh-9rem)] min-h-[480px] gap-4 lg:grid-cols-[340px_1fr]">
        <Card className="flex flex-col overflow-hidden !p-0">
          <div className="border-b border-primary-50 p-3"><SearchInput className="w-full" value={q} onChange={setQ} placeholder="Cari pembeli atau produk..." /></div>
          <ul className="flex-1 overflow-y-auto">
            {shown.length === 0 && <li className="p-6 text-center text-sm text-primary-400">Tidak ada percakapan yang cocok.</li>}
            {shown.map(c => (
              <li key={c.id}><button onClick={() => open(c.id)} className={clsx("flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-primary-50", c.id === active && "bg-primary-50")}>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-100 text-sm font-bold text-primary-600">{initials(c.nama)}</span>
                <span className="min-w-0 flex-1"><span className="flex justify-between"><b>{c.nama}</b></span>
                  <span className="block truncate text-xs text-primary-400">{c.produk}</span>
                  <span className={clsx("block truncate text-sm", c.belumDibaca ? "font-semibold" : "text-primary-500")}>{c.terakhir}</span></span>
                {c.belumDibaca > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-secondary-500 px-1.5 text-xs font-bold text-primary-950">{c.belumDibaca}</span>}
              </button></li>))}
          </ul>
        </Card>
        <Card className="flex flex-col overflow-hidden !p-0">
          <div className="flex items-center gap-3 border-b border-primary-50 p-4">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-100 text-sm font-bold text-primary-600">{initials(cur.nama)}</span>
            <div className="flex-1"><p className="font-bold">{cur.nama}</p></div>
            <div className="flex items-center gap-2 rounded-lg bg-primary-50 px-3 py-1.5"><div className="h-8 w-8 rounded-lg bg-primary-200" /><div><p className="text-sm font-semibold">{cur.produk}</p><p className="text-xs text-primary-500">{cur.harga}</p></div></div>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto bg-surface p-4">
            {cur.pesan.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.2 }} className={clsx("flex", m.dari === "penjual" && "justify-end")}>
                <div className={clsx("max-w-[75%] rounded-2xl px-4 py-2.5", m.dari === "penjual" ? "rounded-br-sm bg-primary-400 text-white" : "rounded-bl-sm bg-white shadow-card")}>
                  <p className="text-sm">{m.teks}</p><p className={clsx("mt-1 text-right text-xs", m.dari === "penjual" ? "text-primary-100" : "text-primary-400")}>{m.waktu}</p></div>
              </motion.div>))}
            <div ref={end} />
          </div>
          <div className="border-t border-primary-50 p-3">
            <div className="mb-2 flex flex-wrap gap-2">{quick.map(t => <button key={t} onClick={() => send(t)} className="rounded-full border border-primary-100 px-3 py-1 text-xs text-primary-600 hover:bg-primary-50">{t}</button>)}</div>
            <div className="flex items-center gap-2">
              <button aria-label="Kirim foto atau video" className="grid h-10 w-10 place-items-center rounded-lg border border-primary-100 text-primary-500 hover:bg-primary-50"><ImagePlus size={18} /></button>
              <input className="input" value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === "Enter" && send(text)} placeholder="Tulis balasan..." />
              <button onClick={() => send(text)} aria-label="Kirim" className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary-400 text-white hover:bg-primary-500"><Send size={16} /></button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
