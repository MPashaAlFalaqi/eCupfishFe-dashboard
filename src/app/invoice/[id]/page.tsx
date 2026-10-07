import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PrintButton from "@/components/PrintButton";
import { rp } from "@/lib/format";
import { pesananList } from "@/lib/mock-data";

export default function InvoicePage({ params }: { params: { id: string } }) {
  const p = pesananList.find(x => x.id === `#${params.id}`);
  if (!p) notFound();
  const sub = p.hargaSatuan * p.jumlah, total = sub + p.ongkir;
  return (
    <main className="min-h-screen bg-surface p-6 print:bg-white print:p-0">
      <div className="mx-auto mb-4 flex max-w-3xl items-center justify-between print:hidden">
        <Link href="/pesanan" className="text-sm font-medium text-primary-600">← Kembali ke Pesanan</Link><PrintButton />
      </div>
      <article className="mx-auto max-w-3xl rounded-card bg-white p-10 shadow-card print:rounded-none print:shadow-none">
        <header className="flex items-start justify-between border-b border-primary-100 pb-6">
          <div className="flex items-center gap-3"><Image src="/logo-icon.png" alt="" width={48} height={48} /><div><p className="text-xl font-bold">eCup<span className="text-secondary-500">Fish</span></p><p className="text-sm text-primary-500">Marketplace & lelang ikan cupang</p></div></div>
          <div className="text-right"><p className="text-2xl font-bold tracking-wide text-primary-700">INVOICE</p><p className="text-sm text-primary-500">INV/2026/10/{p.id.slice(1)}</p><p className="text-sm text-primary-500">{p.tanggal}</p></div>
        </header>
        <section className="grid grid-cols-2 gap-6 py-6 text-sm">
          <div><p className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary-400">Dari (Penjual)</p><p className="font-bold">Betta Farm</p><p className="text-primary-600">Jl. Mina Raya No. 8, Mojoroto, Kediri 64112</p></div>
          <div><p className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary-400">Kepada (Pembeli)</p><p className="font-bold">{p.pembeli}</p><p className="text-primary-600">{p.alamat}</p></div>
        </section>
        <table className="w-full text-left text-sm">
          <thead><tr className="border-y border-primary-100 bg-primary-50/60 text-xs uppercase tracking-wide text-primary-500"><th className="px-3 py-2">Produk</th><th className="px-3 py-2 text-right">Jumlah</th><th className="px-3 py-2 text-right">Harga Satuan</th><th className="px-3 py-2 text-right">Subtotal</th></tr></thead>
          <tbody><tr className="border-b border-primary-50"><td className="px-3 py-3 font-semibold">{p.ikan}<p className="text-xs font-normal text-primary-400">Sumber: {p.sumber}</p></td><td className="px-3 py-3 text-right">{p.jumlah} ekor</td><td className="px-3 py-3 text-right">{rp(p.hargaSatuan)}</td><td className="px-3 py-3 text-right">{rp(sub)}</td></tr></tbody>
        </table>
        <dl className="ml-auto mt-4 w-72 space-y-1.5 text-sm">
          <div className="flex justify-between"><dt className="text-primary-500">Subtotal</dt><dd>{rp(sub)}</dd></div>
          <div className="flex justify-between"><dt className="text-primary-500">Ongkos kirim</dt><dd>{p.ongkir ? rp(p.ongkir) : "Gratis"}</dd></div>
          <div className="flex justify-between border-t border-primary-100 pt-2 text-base font-bold"><dt>Total</dt><dd>{rp(total)}</dd></div>
        </dl>
        <footer className="mt-8 grid grid-cols-2 gap-6 border-t border-primary-100 pt-6 text-sm">
          <div><p className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary-400">Pembayaran</p><p>{p.metode}</p><p className="font-semibold">Status: {p.status}</p></div>
          <div><p className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary-400">Garansi</p><p className="text-primary-600">Garansi ikan hidup 24 jam setelah ikan tiba. Ajukan klaim dengan video unboxing lewat aplikasi eCupFish.</p></div>
        </footer>
      </article>
    </main>
  );
}
