"use client";
import { Play } from "lucide-react";
import { Card } from "@/components/ui";
export default function VideoUnboxing({ src }: { src?: string }) {
  return (
    <Card>
      <h3 className="mb-1 font-semibold">Pemutar Video Unboxing</h3>
      <p className="mb-3 text-sm text-primary-500">Video dari pembeli saat membuka paket</p>
      {src ? <video controls src={src} className="aspect-video w-full rounded-lg bg-primary-950" />
        : <div className="grid aspect-video place-items-center rounded-lg bg-primary-950"><button aria-label="Putar video" className="grid h-14 w-14 place-items-center rounded-full bg-white/90 text-primary-900"><Play size={22} /></button></div>}
    </Card>
  );
}
