"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, UserPlus, CheckCircle, ArrowLeft } from "lucide-react";
import AuthPanel from "@/components/AuthPanel";
import MobileBrand from "@/components/MobileBrand";
import { Button } from "@/components/ui";
import { api, ApiError, jsonBody, session } from "@/lib/api";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Kata sandi harus minimal 8 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    if (!agree) {
      setError("Anda harus menyetujui syarat & ketentuan layanan eCupFish.");
      return;
    }

    setLoading(true);

    try {
      const data = await api<{
        token: string;
        refreshToken?: string;
        user: any;
      }>("/api/auth/register", {
        method: "POST",
        body: jsonBody({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phoneNumber: phoneNumber.trim(),
          password,
          role: "ADMIN",
          businessName: businessName.trim() || name.trim(),
        }),
      });

      session.save({
        token: data.token,
        refreshToken: data.refreshToken,
        user: {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: "ADMIN",
          phoneNumber: data.user.phoneNumber,
        },
      });

      // Simpan data toko tambahan
      const fullUser = {
        ...data.user,
        role: "ADMIN",
        sellerProfile: { businessName: businessName.trim() || name.trim() },
      };
      localStorage.setItem("ecf_user", JSON.stringify(fullUser));
      localStorage.setItem("admin_data", JSON.stringify(fullUser));

      router.replace("/dashboard");
    } catch (err) {
      // Fallback penyimpanan lokal jika backend tidak aktif / koneksi gagal
      const rawRegistered = localStorage.getItem("registered_users");
      const registeredList = rawRegistered ? JSON.parse(rawRegistered) : [];

      const emailExists = registeredList.some(
        (u: any) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (emailExists) {
        setError("Email ini sudah terdaftar sebelumnya. Silakan gunakan email lain atau langsung masuk.");
        setLoading(false);
        return;
      }

      const localNewUser = {
        id: Date.now(),
        name: name.trim(),
        businessName: businessName.trim() || `${name.trim()} Farm`,
        email: email.trim().toLowerCase(),
        phoneNumber: phoneNumber.trim(),
        password,
        role: "ADMIN" as const,
        sellerProfile: {
          businessName: businessName.trim() || `${name.trim()} Farm`,
        },
      };

      registeredList.push(localNewUser);
      localStorage.setItem("registered_users", JSON.stringify(registeredList));

      // Otomatis aktifkan sesi login untuk akun baru
      session.save({
        token: "local_reg_token_" + Date.now(),
        refreshToken: "local_reg_refresh_" + Date.now(),
        user: {
          id: localNewUser.id,
          name: localNewUser.name,
          email: localNewUser.email,
          role: "ADMIN",
          phoneNumber: localNewUser.phoneNumber,
        },
      });
      localStorage.setItem("ecf_user", JSON.stringify(localNewUser));
      localStorage.setItem("admin_data", JSON.stringify(localNewUser));

      router.replace("/dashboard");
    } finally {
      setLoading(false);
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
              className="max-h-[38vh] object-contain drop-shadow-xl"
            />
          </div>

          <div className="mt-4 pb-4">
            <p className="mb-3 text-xl font-bold">
              eCup<span className="text-secondary-400">Fish</span>
            </p>
            <h2 className="max-w-xl text-3xl font-extrabold leading-tight xl:text-4xl">
              Mulai Perjalanan Budidaya Anda Bersama Kami.
            </h2>
            <p className="mt-3 max-w-md text-sm text-primary-200 leading-relaxed xl:text-base">
              Daftarkan tambak cupang Anda sekarang dan nikmati kemudahan menjual
              ikan lewat lelang langsung dan marketplace terpercaya.
            </p>

            <ul className="mt-6 space-y-2.5 text-xs text-primary-200">
              <li className="flex items-center gap-2">
                <CheckCircle size={15} className="text-secondary-400 shrink-0" />
                <span>Manajemen stok cupang lengkap & AI deteksi kesehatan ikan</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={15} className="text-secondary-400 shrink-0" />
                <span>Sesi lelang interaktif dengan hitung mundur & penawar live</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={15} className="text-secondary-400 shrink-0" />
                <span>Pengiriman khusus ikan hidup bergaransi & cetak resi otomatis</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={15} className="text-secondary-400 shrink-0" />
                <span>Pencairan dana aman langsung ke rekening bank Anda</span>
              </li>
            </ul>
          </div>
        </div>
      </AuthPanel>

      <section className="flex flex-col justify-center bg-white p-6 sm:p-10 lg:p-12 overflow-y-auto">
        <div className="mx-auto w-full max-w-md">
          <MobileBrand />

          <div className="mb-5 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary-950 sm:text-3xl">
                Daftar Akun Pembudidaya
              </h1>
              <p className="mt-1 text-sm text-primary-500">
                Lengkapi data pemilik dan tambak cupang Anda
              </p>
              <p className="mt-0.5 text-xs text-primary-400">
                (Khusus Pembudidaya/Penjual · Akun Pembeli silakan gunakan aplikasi mobile)
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-medium text-red-600 leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-3.5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label">Nama Pemilik</label>
                <input
                  className="input"
                  type="text"
                  placeholder="cth. Pasha Santoso"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="label">Nama Tambak / Farm</label>
                <input
                  className="input"
                  type="text"
                  placeholder="cth. Betta Farm Kediri"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Email Resmi</label>
              <input
                className="input"
                type="email"
                placeholder="cth. pasha@tambak.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label">Nomor WhatsApp / HP</label>
              <input
                className="input"
                type="tel"
                placeholder="cth. 081234567890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                required
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label">Kata Sandi</label>
                <div className="relative">
                  <input
                    className="input pr-10"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-400 hover:text-primary-600"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="label">Konfirmasi Sandi</label>
                <input
                  className="input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ulangi kata sandi"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
            </div>

            <div className="flex items-start gap-2 pt-1 text-xs text-primary-600">
              <input
                type="checkbox"
                id="agree"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-primary-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="agree" className="select-none leading-relaxed">
                Saya menyetujui <span className="font-semibold text-primary-800">Syarat & Ketentuan</span> serta{" "}
                <span className="font-semibold text-primary-800">Kebijakan Privasi</span> eCupFish.
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full !py-2.5 text-sm font-bold shadow-md shadow-primary-900/10"
            >
              <UserPlus size={16} />
              {loading ? "Mendaftarkan Akun..." : "Daftar Akun Sekarang"}
            </Button>
          </form>

          <p className="mt-5 text-center text-xs text-primary-500">
            Sudah memiliki akun pembudidaya?{" "}
            <Link
              href="/login"
              className="font-bold text-primary-600 hover:text-primary-800 hover:underline"
            >
              Masuk di sini
            </Link>
          </p>

          <div className="mt-4 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs text-primary-400 hover:text-primary-600"
            >
              <ArrowLeft size={13} />
              Kembali ke halaman login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
