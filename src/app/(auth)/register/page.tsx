import AuthPanel from "@/components/AuthPanel";
import Image from "next/image";
import Link from "next/link";
import { CheckSquare } from "lucide-react";
import FormField from "@/components/FormField";
import { Button } from "@/components/ui";

const benefits = ["Catat stok dan kesehatan ikan per ekor", "Jual langsung, lelang, atau keduanya dalam satu tempat", "Laporan keuangan otomatis dari setiap penjualan"];
export default function RegisterPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <AuthPanel showDots={false}>
        <div className="flex min-h-[200px] flex-1 items-center justify-center py-6"><Image src="/logo.png" alt="eCupFish" width={260} height={282} priority /></div>
        <p className="mb-4 text-xl font-bold">eCup<span className="text-secondary-400">Fish</span></p>
        <h2 className="max-w-md text-4xl font-bold leading-tight">Gabung sebagai mitra pembudidaya</h2>
        <p className="mt-3 max-w-sm text-base text-primary-200">Lengkapi data tambak Anda untuk mulai mengelola stok dan menjual ikan cupang.</p>
        <ul className="mb-10 mt-8 space-y-3">{benefits.map(b => <li key={b} className="flex items-center gap-3 text-base"><CheckSquare size={18} className="text-secondary-400" />{b}</li>)}</ul>
      </AuthPanel>
      <section className="grid place-items-center overflow-y-auto bg-white p-8">
        <form className="w-full max-w-md space-y-4">
          <div><h1 className="text-2xl font-bold">Buat akun pembudidaya</h1><p className="text-sm text-primary-500">Butuh 2 menit. Data bisa diubah lagi kapan saja.</p></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Nama Lengkap"><input className="input" placeholder="cth. Pasha Santoso" /></FormField>
            <FormField label="Nama Usaha"><input className="input" placeholder="cth. Betta Farm" /></FormField>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Email"><input className="input" type="email" placeholder="nama@email.com" /></FormField>
            <FormField label="Nomor HP"><input className="input" type="tel" placeholder="08xx-xxxx-xxxx" /></FormField>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Kata Sandi"><input className="input" type="password" placeholder="Minimal 8 karakter" /></FormField>
            <FormField label="Konfirmasi Kata Sandi"><input className="input" type="password" placeholder="Ulangi kata sandi" /></FormField>
          </div>
          <FormField label="Lokasi"><input className="input" placeholder="cth. Kediri, Jawa Timur" /></FormField>
          <label className="flex items-start gap-2 text-sm"><input type="checkbox" className="mt-1" />Saya menyetujui <b>syarat dan ketentuan</b> yang berlaku</label>
          <Button className="w-full">Daftar Sekarang</Button>
          <p className="text-center text-sm text-primary-500">Sudah punya akun? <Link href="/login" className="font-semibold text-primary-600">Masuk di sini</Link></p>
        </form>
      </section>
    </div>
  );
}
