import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center p-8 text-center text-white" style={{ background: "linear-gradient(200deg,#041727 0%,#0a2a44 50%,#0e3858 78%,#18507b 100%)" }}>
      <div className="max-w-md">
        <Image src="/logo.png" alt="eCupFish" width={150} height={163} priority className="mx-auto animate-float" />
        <p className="mt-6 bg-gold bg-clip-text text-8xl font-black text-transparent">404</p>
        <h1 className="mt-2 text-2xl font-bold">Ups, halaman ini tidak ditemukan</h1>
        <p className="mt-2 text-primary-200">Alamatnya mungkin salah ketik atau halamannya sudah pindah. Yuk kembali ke dashboard.</p>
        <Link href="/dashboard" className="mt-6 inline-flex rounded-lg bg-gold px-6 py-3 font-semibold text-primary-950 transition hover:brightness-95 active:scale-[0.97]">Kembali ke Dashboard</Link>
      </div>
    </main>
  );
}
