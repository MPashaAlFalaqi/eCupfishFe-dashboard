"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, Clock, ShieldCheck, XCircle } from "lucide-react";
import Topbar from "@/components/Topbar";
import { useToast } from "@/components/Toast";
import { Badge, Card } from "@/components/ui";
import { rp } from "@/lib/format";
import type { Klaim, StatusKlaim } from "@/lib/types";
import VideoUnboxing from "./VideoUnboxing";
import KeputusanKlaim from "./KeputusanKlaim";

const tone = { Pending: "gold", Disetujui: "green", Ditolak: "gray" } as const;
export default function KlaimDetailView({ klaim }: { klaim: Klaim }) {
  const toast = useToast();
  const [status, setStatus] = useState<StatusKlaim>(klaim.status);
  const [ringkasan, setRingkasan] = useState("");
  const decide = (s: "Disetujui" | "Ditolak", r: string) => { setStatus(s); setRingkasan(r); toast(s === "Disetujui" ? "Klaim disetujui, pembeli diberi tahu" : "Klaim ditolak, pembeli diberi tahu"); };
  const info = [["Pembeli", klaim.pembeli], ["No. Pesanan", klaim.pesanan], ["Jenis Ikan", klaim.ikan.split(" · ")[0]], ["Jumlah Bermasalah", `${klaim.bermasalah} ekor dari ${klaim.total} ekor`], ["Nilai Klaim", rp(klaim.nilai)]];
  return (
    <>
      <Topbar title={`Detail Klaim #${klaim.id}`} subtitle={`Diajukan ${klaim.tanggal}`}
        action={<Link href="/klaim" className="flex items-center gap-1 text-sm text-primary-600"><ArrowLeft size={16} />Kembali</Link>} />
      <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <VideoUnboxing />
          <Card>
            <h3 className="mb-3 font-semibold">Foto Bukti Tambahan</h3>
            <div className="grid grid-cols-3 gap-3">{[0, 1, 2].map(i => <div key={i} className="h-24 rounded-lg bg-gradient-to-b from-primary-200 to-primary-500" />)}</div>
          </Card>
        </div>
        <div className="space-y-4">
          <Card>
            <div className="mb-3 flex items-center justify-between"><h3 className="font-semibold">Detail Klaim</h3><Badge tone={tone[status]}>{status}</Badge></div>
            <dl className="space-y-2 text-sm">{info.map(([a, b]) => <div key={a} className="flex justify-between gap-4"><dt className="text-primary-500">{a}</dt><dd className="text-right font-medium">{b}</dd></div>)}</dl>
            <div className="mt-4 rounded-lg bg-primary-50 p-3 text-sm"><p className="mb-1 font-semibold">Alasan Klaim</p><p className="text-primary-600">{klaim.alasan}. Pembeli melampirkan video unboxing sebagai bukti.</p></div>
            <ul className="mt-3 space-y-1.5 text-sm text-primary-600">
              <li className="flex items-center gap-2"><ShieldCheck size={15} className="text-emerald-600" />Masuk jendela garansi 24 jam setelah ikan tiba</li>
              {status === "Pending" && klaim.batas && <li className="flex items-center gap-2"><Clock size={15} className="text-secondary-600" />Tanggapi dalam {klaim.batas}. Jika terlewat, klaim diteruskan ke tim eCupFish.</li>}
            </ul>
          </Card>
          {status === "Pending" ? <KeputusanKlaim klaim={klaim} onDecide={decide} /> : (
            <Card>
              <div className="flex items-start gap-3">
                {status === "Disetujui" ? <CheckCircle2 className="mt-0.5 text-emerald-600" /> : <XCircle className="mt-0.5 text-primary-400" />}
                <div><p className="font-bold">Klaim {status.toLowerCase()}</p>
                  {ringkasan && <p className="text-sm text-primary-600">{ringkasan}</p>}
                  <p className="mt-1 text-sm text-primary-500">Pembeli sudah diberi tahu. Jika pembeli keberatan, tim eCupFish akan menengahi.</p></div>
              </div>
            </Card>)}
        </div>
      </div>
    </>
  );
}
