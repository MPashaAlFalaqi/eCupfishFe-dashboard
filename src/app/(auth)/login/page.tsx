"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthPanel from "@/components/AuthPanel";
import MobileBrand from "@/components/MobileBrand";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Gagal login. Periksa email dan kata sandi Anda.");

      if (data.user.role === "ADMIN") {
        localStorage.setItem("admin_token", data.token);
        localStorage.setItem("admin_data", JSON.stringify(data.user));
        router.push("/dashboard");
      } else {
        setError("Akses ditolak! Halaman ini khusus untuk Admin / Pembudidaya.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <AuthPanel>
        <div className="flex h-full flex-col justify-between">
          <div className="flex flex-1 items-center justify-center py-4">
            <Image 
              src="/logo.png" 
              alt="eCupFish" 
              width={340} 
              height={368} 
              priority 
              className="max-h-[40vh] object-contain" 
            />
          </div>
          
          <div className="mt-4 pb-4">
            <p className="mb-4 text-xl font-bold">eCup<span className="text-secondary-400">Fish</span></p>
            <h2 className="max-w-xl text-4xl font-bold leading-tight">Kelola budidaya Anda, dari kolam sampai pasar.</h2>
            <p className="mt-3 max-w-md text-base text-primary-200">Satu dashboard untuk stok ikan, lelang, pesanan, dan laporan keuangan Tambak Anda.</p>
            <div className="mt-8 flex gap-8">
              <div><b className="text-2xl">2.400+</b><p className="text-sm text-primary-300">Pembudidaya aktif</p></div>
              <div><b className="text-2xl">18 Prov.</b><p className="text-sm text-primary-300">Jangkauan terbaik</p></div>
            </div>
          </div>
          
        </div>
      </AuthPanel>
      
      <section className="grid place-items-center bg-white p-5 sm:p-8">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          <MobileBrand />
          <div>
            <h1 className="text-2xl font-bold">Masuk ke akun Anda</h1>
            <p className="text-sm text-primary-500">Kelola budidaya dan penjualan ikan Anda.</p>
          </div>

          {error && <div className="rounded-md bg-red-50 p-3 text-sm font-medium text-red-600">{error}</div>}

          <div>
            <label className="label">Email atau Username</label>
            <input 
              className="input" 
              type="email"
              placeholder="nama@tambakanda.id" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="label">Kata Sandi</label>
            <input 
              className="input" 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="flex justify-between text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" defaultChecked />Ingat saya</label>
            <Link href="/lupa-sandi" className="text-primary-500 hover:underline">Lupa kata sandi?</Link>
          </div>
          
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Memproses..." : "Masuk ke Dashboard"}
          </Button>
          
          <div className="flex items-center gap-3 text-xs text-primary-300">
            <span className="h-px flex-1 bg-primary-100" />atau<span className="h-px flex-1 bg-primary-100" />
          </div>
          
          <p className="text-center text-sm text-primary-500">
            Belum punya akun? <Link href="/register" className="font-semibold text-primary-600 hover:underline">Daftar sebagai pembudidaya</Link>
          </p>
        </form>
      </section>
    </div>
  );
}