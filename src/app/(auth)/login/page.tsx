import AuthPanel from "@/components/AuthPanel";
import MobileBrand from "@/components/MobileBrand";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <AuthPanel>
        <div className="flex flex-1 items-center justify-center py-8">
          <Image src="/logo.png" alt="eCupFish" width={340} height={368} priority />
        </div>
        <div>
          <p className="mb-4 text-xl font-bold">eCup<span className="text-secondary-400">Fish</span></p>
          <h2 className="max-w-xl text-4xl font-bold leading-tight">Kelola budidaya Anda, dari kolam sampai pasar.</h2>
          <p className="mt-3 max-w-md text-base text-primary-200">Satu dashboard untuk stok ikan, lelang, pesanan, dan laporan keuangan Tambak Anda.</p>
          <div className="mt-8 flex gap-8"><div><b className="text-2xl">2.400+</b><p className="text-sm text-primary-300">Pembudidaya aktif</p></div><div><b className="text-2xl">18 Prov.</b><p className="text-sm text-primary-300">Jangkauan terbaik</p></div></div>
        </div>
      </AuthPanel>
      <section className="grid place-items-center bg-white p-5 sm:p-8">
        <form className="w-full max-w-sm space-y-4">
          <MobileBrand />
          <div><h1 className="text-2xl font-bold">Masuk ke akun Anda</h1><p className="text-sm text-primary-500">Kelola budidaya dan penjualan ikan Anda.</p></div>
          <div><label className="label">Email atau Username</label><input className="input" placeholder="nama@tambakanda.id" /></div>
          <div><label className="label">Kata Sandi</label><input className="input" type="password" placeholder="••••••••" /></div>
          <div className="flex justify-between text-sm"><label className="flex items-center gap-2"><input type="checkbox" defaultChecked />Ingat saya</label><Link href="/lupa-sandi" className="text-primary-500">Lupa kata sandi?</Link></div>
          <Link href="/dashboard" className="block"><Button className="w-full">Masuk ke Dashboard</Button></Link>
          <p className="text-center text-sm text-primary-500">Akun dibuat dan dikelola oleh admin eCupFish.</p>
        </form>
      </section>
    </div>
  );
}
