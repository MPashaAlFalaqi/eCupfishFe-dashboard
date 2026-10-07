"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Film, ImagePlus, Star, X } from "lucide-react";
import clsx from "clsx";
import { Card } from "@/components/ui";

export interface MediaItem { id: string; name: string; url: string; type: "image" | "video"; size: number }
const MAX_FILES = 6, MAX_MB = 20;

export default function MediaUploader({ onChange }: { onChange: (items: MediaItem[]) => void }) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [drag, setDrag] = useState(false);
  const ref = useRef(items); ref.current = items;
  useEffect(() => () => ref.current.forEach(i => URL.revokeObjectURL(i.url)), []);
  const set = (next: MediaItem[]) => { setItems(next); onChange(next); };

  const add = (files: FileList | File[]) => {
    const msgs: string[] = [], ok: MediaItem[] = [];
    for (const f of Array.from(files)) {
      const image = f.type.startsWith("image/"), video = f.type.startsWith("video/");
      if (!image && !video) { msgs.push(`${f.name}: format belum didukung. Gunakan JPG, PNG, atau MP4.`); continue; }
      if (f.size > MAX_MB * 1024 * 1024) { msgs.push(`${f.name}: ukuran melebihi ${MAX_MB}MB. Kompres dulu, lalu coba lagi.`); continue; }
      if (items.length + ok.length >= MAX_FILES) { msgs.push(`Maksimal ${MAX_FILES} file per ikan.`); break; }
      ok.push({ id: `${Date.now()}-${Math.random()}`, name: f.name, url: URL.createObjectURL(f), type: image ? "image" : "video", size: f.size });
    }
    setErrors(msgs);
    if (ok.length) set([...items, ...ok]);
  };
  const remove = (id: string) => { const it = items.find(i => i.id === id); if (it) URL.revokeObjectURL(it.url); set(items.filter(i => i.id !== id)); };
  const cover = (id: string) => set([items.find(i => i.id === id)!, ...items.filter(i => i.id !== id)]);

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between"><h3 className="font-semibold">Foto / Video Ikan</h3><span className="text-xs text-primary-400">{items.length}/{MAX_FILES} file</span></div>
      <label onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={e => { e.preventDefault(); setDrag(false); add(e.dataTransfer.files); }}
        className={clsx("grid cursor-pointer place-items-center rounded-lg border-2 border-dashed p-5 text-center transition-colors",
          drag ? "border-primary-400 bg-primary-100" : "border-primary-200 bg-primary-50 text-primary-500 hover:bg-primary-100/60", items.length ? "h-24" : "h-44")}>
        <input type="file" multiple accept="image/*,video/*" className="sr-only" onChange={e => { if (e.target.files) add(e.target.files); e.target.value = ""; }} />
        <span><ImagePlus className="mx-auto mb-1.5" />{items.length ? "Tambah file lagi" : "Unggah atau seret file ke sini"}<br /><span className="text-xs">JPG, PNG, MP4 · maks. {MAX_MB}MB per file · sampai {MAX_FILES} file</span></span>
      </label>
      {errors.length > 0 && <ul className="mt-2 space-y-0.5 text-xs text-red-600">{errors.map(e => <li key={e}>{e}</li>)}</ul>}
      {items.length > 0 && (
        <ul className="mt-3 grid grid-cols-3 gap-2">
          <AnimatePresence initial={false}>
            {items.map((m, i) => (
              <motion.li key={m.id} layout initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }} className="group relative aspect-square overflow-hidden rounded-lg bg-primary-100">
                {m.type === "image" ? <img src={m.url} alt={m.name} className="h-full w-full object-cover" /> : <div className="grid h-full w-full place-items-center bg-primary-900 text-white"><Film size={22} /></div>}
                {i === 0 && <span className="absolute left-1 top-1 rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold text-primary-950">Sampul</span>}
                <button type="button" aria-label={`Hapus ${m.name}`} onClick={() => remove(m.id)} className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-primary-950/70 text-white opacity-0 transition group-hover:opacity-100"><X size={13} /></button>
                {i > 0 && <button type="button" onClick={() => cover(m.id)} className="absolute inset-x-1 bottom-1 flex items-center justify-center gap-1 rounded bg-primary-950/70 py-0.5 text-[10px] font-semibold text-white opacity-0 transition group-hover:opacity-100"><Star size={10} />Jadikan sampul</button>}
              </motion.li>))}
          </AnimatePresence>
        </ul>)}
    </Card>
  );
}
