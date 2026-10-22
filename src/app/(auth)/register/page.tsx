"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthPanel from "@/components/AuthPanel";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 1. Validasi Keamanan Kata Sandi
    // Harus mengandung minimal 1 angka dan 1 karakter unik/simbol
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])/;
    if (!passwordRegex.test(password)) {
      setError("Kata sandi harus mengandung kombinasi angka dan karakter unik/simbol (!@#$%^&*)");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          email, 
          phoneNumber, 
          password, 
          role: "ADMIN" // <-- Memastikan akun yang didaftar lewat web langsung jadi Admin
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal mendaftar. Pastikan email belum digunakan.");
      }

      // 2. Berhasil & Mengalihkan (Redirect)
      alert("Pendaftaran berhasil! Mengalihkan ke halaman login...");
      router.push("/login");
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <AuthPanel>
        <div className="flex flex-1 items-center justify-center py-8">
          <Image src="/logo.png" alt="eCupFish" width={340} height={368} priority />
        </div>
        <div>
          <p className="mb-4 text-xl font-bold">eCup<span className="text-secondary-400">Fish</span></p>
          <h2 className="max-w-xl text-4xl font-bold leading-tight">Mulai perjalanan budidaya Anda bersama kami.</h2>
          <p className="mt-3 max-w-md text-base text-primary-200">Bergabunglah dengan ribuan pembudidaya lainnya di seluruh Indonesia.</p>
        </div>
      </AuthPanel>
      
      <section className="grid place-items-center bg-white p-8">
        <form onSubmit={handleRegister} className="w-full max-w-sm space-y-4">
          <div>
            <h1 className="text-2xl font-bold">Daftar Akun Pembudidaya</h1>
            <p className="text-sm text-primary-500">Lengkapi data diri Anda di bawah ini.</p>
          </div>

          {/* Tempat Notifikasi Error */}
          {error && <div className="rounded-md bg-red-50 p-3 text-sm font-medium text-red-600">{error}</div>}

          <div>
            <label className="label">Nama Lengkap</label>
            <input 
              className="input" 
              type="text"
              placeholder="Nama Anda" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">Email</label>
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
            <label className="label">Nomor Handphone</label>
            <input 
              className="input" 
              type="tel"
              placeholder="08123456789" 
              value={phoneNumber}
              // 3. Validasi Nomor Telepon (Hanya menerima ketikan angka)
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))} 
              required
            />
          </div>
          
          <div>
            <label className="label">Kata Sandi</label>
            <input 
              className="input" 
              type="password" 
              placeholder="Minimal 6 karakter" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          
          <Button type="submit" disabled={isLoading} className="w-full mt-2">
            {isLoading ? "Memproses..." : "Daftar Sekarang"}
          </Button>
          
          <p className="text-center text-sm text-primary-500 mt-4">
            Sudah punya akun? <Link href="/login" className="font-semibold text-primary-600">Masuk di sini</Link>
          </p>
        </form>
      </section>
    </div>
  );
}