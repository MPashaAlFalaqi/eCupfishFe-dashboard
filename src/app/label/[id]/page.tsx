import { notFound } from "next/navigation";
import Link from "next/link";
import PrintButton from "@/components/PrintButton";
import { pengirimanList } from "@/lib/mock-data";

// Barcode sederhana (dekoratif) dari karakter nomor resi
function Barcode({ text }: { text: string }) {
  let x = 0; const bars: { x: number; w: number }[] = [];
  for (const ch of text) { const c = ch.charCodeAt(0); const a = 1 + (c % 3), b = 1 + ((c >> 2) % 3); bars.push({ x, w: a }); x += a + b; }
  return <svg viewBox={`0 0 ${x} 40`} preserveAspectRatio="none" className="h-14 w-full" role="img" aria-label={`Barcode ${text}`}>{bars.map((r, i) => <rect key={i} x={r.x} width={r.w} height="40" fill="#041727" />)}</svg>;
}

export default function LabelPage({ params }: { params: { id: string } }) {
  const p = pengirimanList.find(x => x.id === `#${params.id}`);
  if (!p) notFound();
  const kode = p.resi === "—" ? p.id.slice(1) : p.resi;
  const jumlah = p.ikan.split("·")[1]?.trim() ?? "";
  return (
    <main className="min-h-screen bg-surface p-6 print:bg-white print:p-0">
      <style>{"@page { size: 100mm 150mm; margin: 0 }"}</style>
      <div className="mx-auto mb-4 flex max-w-md items-center justify-between print:hidden">
        <Link href="/pengiriman" className="text-sm font-medium text-primary-600">← Kembali ke Pengiriman</Link><PrintButton label="Cetak Label" />
      </div>
      <section className="mx-auto flex h-[150mm] w-[100mm] flex-col border-2 border-primary-950 bg-white p-3 text-[11px] leading-snug print:mx-0 print:border-0">
        <header className="flex items-center justify-between border-b-2 border-primary-950 pb-2"><p className="text-base font-extrabold">eCup<span className="text-secondary-600">Fish</span></p><p className="text-sm font-bold">{p.kurir}</p></header>
        <div className="py-2"><Barcode text={kode} /><p className="text-center font-mono text-sm font-bold tracking-widest">{p.resi === "—" ? "BELUM ADA RESI" : p.resi}</p></div>
        <div className="grid flex-1 grid-rows-2 gap-2">
          <div className="border border-primary-950 p-2"><p className="text-[9px] font-bold uppercase tracking-wider">Penerima</p><p className="text-sm font-bold">{p.pembeli}</p><p>{p.telp}</p><p>{p.alamat}</p></div>
          <div className="border border-primary-950 p-2"><p className="text-[9px] font-bold uppercase tracking-wider">Pengirim</p><p className="font-bold">Betta Farm</p><p>0812-3456-7890</p><p>Jl. Mina Raya No. 8, Mojoroto, Kediri 64112</p></div>
        </div>
        <div className="mt-2 grid grid-cols-3 border border-primary-950 text-center"><div className="border-r border-primary-950 p-1.5"><p className="text-[9px] uppercase">Isi</p><p className="font-bold">{jumlah}</p></div><div className="border-r border-primary-950 p-1.5"><p className="text-[9px] uppercase">Berat</p><p className="font-bold">{p.berat} kg</p></div><div className="p-1.5"><p className="text-[9px] uppercase">Pesanan</p><p className="font-bold">{p.id}</p></div></div>
        <p className="mt-2 bg-primary-950 py-1.5 text-center text-[11px] font-extrabold uppercase tracking-wider text-white">Ikan hidup · jangan dibanting · jangan ditumpuk</p>
      </section>
    </main>
  );
}
