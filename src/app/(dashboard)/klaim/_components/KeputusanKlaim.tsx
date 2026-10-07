"use client";
import { useState } from "react";
import { Check, X } from "lucide-react";
import FormField from "@/components/FormField";
import Modal from "@/components/Modal";
import { Button, Card } from "@/components/ui";
import { rp } from "@/lib/format";
import type { Klaim } from "@/lib/types";

const alasanCepat = ["Bukti video kurang jelas", "Di luar jendela garansi", "Kerusakan akibat penanganan pembeli"];
export default function KeputusanKlaim({ klaim, onDecide }: { klaim: Klaim; onDecide: (s: "Disetujui" | "Ditolak", ringkasan: string) => void }) {
  const [jenis, setJenis] = useState("Refund penuh");
  const [nominal, setNominal] = useState(String(klaim.nilai));
  const [catatan, setCatatan] = useState("");
  const [modal, setModal] = useState<"setuju" | "tolak" | null>(null);
  const [alasan, setAlasan] = useState("");
  const n = Number(nominal);
  const errNominal = jenis === "Refund sebagian" && (n <= 0 || n >= klaim.nilai) ? `Isi nominal antara Rp 1 dan ${rp(klaim.nilai - 1)}` : "";
  const ringkas = jenis === "Refund penuh" ? `Refund penuh ${rp(klaim.nilai)}` : jenis === "Refund sebagian" ? `Refund sebagian ${rp(n)}` : `Ganti ${klaim.bermasalah} ekor ikan`;
  return (
    <Card>
      <h3 className="mb-3 font-semibold">Keputusan</h3>
      <div className="space-y-3">
        <FormField label="Jenis Penyelesaian"><select className="input" value={jenis} onChange={e => setJenis(e.target.value)}><option>Refund penuh</option><option>Refund sebagian</option><option>Ganti ikan</option></select></FormField>
        {jenis === "Refund sebagian" && <FormField label="Nominal refund (Rp)" error={errNominal} hint={`Nilai klaim ${rp(klaim.nilai)}`}><input className="input" type="number" value={nominal} onChange={e => setNominal(e.target.value)} /></FormField>}
        <FormField label="Catatan Penjelasan (opsional)"><textarea className="input" rows={3} value={catatan} onChange={e => setCatatan(e.target.value)} placeholder="Jelaskan keputusan kepada pembeli" /></FormField>
      </div>
      <div className="mt-4 flex gap-2">
        <Button variant="outline" className="flex-1 !text-red-600" onClick={() => setModal("tolak")}><X size={16} />Tolak Klaim</Button>
        <Button className="flex-1" disabled={!!errNominal} onClick={() => setModal("setuju")}><Check size={16} />Setujui Klaim</Button>
      </div>
      <Modal open={modal === "setuju"} onClose={() => setModal(null)} title="Setujui klaim ini?" subtitle={`#${klaim.id} · ${klaim.pembeli}`}
        footer={<><Button variant="outline" onClick={() => setModal(null)}>Kembali</Button><Button onClick={() => { onDecide("Disetujui", ringkas); setModal(null); }}>Ya, Setujui</Button></>}>
        <p className="font-semibold">{ringkas}</p>
        <p className="text-sm text-primary-600">{jenis === "Ganti ikan" ? "Pembeli diberi tahu bahwa ikan pengganti akan dikirim." : "Dana dikembalikan ke pembeli lewat metode pembayaran asalnya dan dipotong dari pembayaran Anda yang belum diteruskan."}</p>
      </Modal>
      <Modal open={modal === "tolak"} onClose={() => setModal(null)} title="Tolak klaim ini?" subtitle="Alasan wajib diisi agar pembeli paham"
        footer={<><Button variant="outline" onClick={() => setModal(null)}>Kembali</Button><Button className="!bg-red-500 hover:!bg-red-600" disabled={alasan.trim().length < 10} onClick={() => { onDecide("Ditolak", alasan.trim()); setModal(null); }}>Tolak Klaim</Button></>}>
        <div className="flex flex-wrap gap-2">{alasanCepat.map(a => <button key={a} onClick={() => setAlasan(a)} className="rounded-full border border-primary-100 px-3 py-1 text-xs text-primary-600 hover:bg-primary-50">{a}</button>)}</div>
        <FormField label="Alasan penolakan" error={alasan && alasan.trim().length < 10 ? "Tulis minimal 10 karakter" : ""}><textarea className="input" rows={3} value={alasan} onChange={e => setAlasan(e.target.value)} placeholder="Jelaskan dengan sopan dan jelas" /></FormField>
        <p className="text-sm text-primary-500">Jika pembeli keberatan, tim eCupFish akan menengahi dan melihat alasan ini.</p>
      </Modal>
    </Card>
  );
}
