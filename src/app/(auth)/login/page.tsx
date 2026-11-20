"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, LogIn, UserPlus } from "lucide-react";
import AuthPanel from "@/components/AuthPanel";
import MobileBrand from "@/components/MobileBrand";
import { Button } from "@/components/ui";
import { api, ApiError, jsonBody, session, SessionUser } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await api<{
        token: string;
        refreshToken: string;
        user: SessionUser & { sellerProfile?: { businessName?: string } };
      }>("/api/auth/login", {
        method: "POST",
        body: jsonBody({ email: email.trim(), password }),
      });

      if (data.user.role === "BUYER") {
        setError(
          "Akun pembeli tidak dapat masuk ke dashboard web. Silakan gunakan aplikasi mobile eCupFish."
        );
        return;
      }

      session.save(data);
      router.replace(
        data.user.role === "SUPERADMIN" ? "/superadmin/dashboard" : "/dashboard"
      );
    } catch (err) {
      // Jika server backend offline dan ada akun terdaftar lokal
      const registeredUsersRaw = localStorage.getItem("registered_users");
      const registeredUsers = registeredUsersRaw ? JSON.parse(registeredUsersRaw) : [];
      const matched = registeredUsers.find(
        (u: any) =>
          u.email.toLowerCase() === email.trim().toLowerCase() &&
          u.password === password
      );

      if (matched) {
        if (matched.role === "BUYER") {
          setError(
            "Akun ini terdaftar sebagai akun Pembeli. Dashboard Web hanya untuk Pembudidaya / Penjual. Silakan masuk melalui aplikasi mobile eCupFish."
          );
          return;
        }

        const localSession = {
          token: "local_token_" + Date.now(),
          refreshToken: "local_refresh_" + Date.now(),
          user: {
            id: matched.id || 99,
            name: matched.name,
            email: matched.email,
            role: "ADMIN" as const,
            phoneNumber: matched.phoneNumber,
            sellerProfile: { businessName: matched.businessName || `${matched.name} Farm` },
          },
        };
        session.save(localSession);
        router.replace("/dashboard");
        return;
      }

      setError(
        err instanceof ApiError && err.status !== 0
          ? err.message
          : "Email/username atau kata sandi tidak cocok. Silakan daftar akun baru jika belum terdaftar."
      );
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
              Kelola budidaya Anda, dari kolam sampai pasar.
            </h2>
            <p className="mt-3 max-w-md text-sm text-primary-200 leading-relaxed xl:text-base">
              Satu dashboard terpadu untuk stok ikan cupang, sesi lelang langsung,
              pesanan, pengiriman, dan laporan keuangan tambak Anda.
            </p>
            <div className="mt-7 flex gap-8">
              <div>
                <b className="text-2xl font-bold text-white">2.400+</b>
                <p className="text-xs text-primary-300">Pembudidaya aktif</p>
              </div>
              <div>
                <b className="text-2xl font-bold text-white">18 Prov.</b>
                <p className="text-xs text-primary-300">Jangkauan pengiriman</p>
              </div>
              <div>
                <b className="text-2xl font-bold text-secondary-400">100%</b>
                <p className="text-xs text-primary-300">Terintegrasi</p>
              </div>
            </div>
          </div>
        </div>
      </AuthPanel>

      <section className="flex flex-col justify-center bg-white p-6 sm:p-10 lg:p-12">
        <div className="mx-auto w-full max-w-sm">
          <MobileBrand />

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-primary-950 sm:text-3xl">
              Masuk ke Akun
            </h1>
            <p className="mt-1 text-sm text-primary-500">
              Kelola penjualan ikan dan lelang tambak Anda
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-medium text-red-600 leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label">Email atau Username</label>
              <input
                className="input"
                type="text"
                placeholder="cth. nama@tambakanda.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="label">Kata Sandi</label>
                <Link
                  href="/lupa-sandi"
                  className="text-xs font-semibold text-primary-500 hover:text-primary-700 hover:underline"
                >
                  Lupa kata sandi?
                </Link>
              </div>
              <div className="relative">
                <input
                  className="input pr-10"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-400 hover:text-primary-600"
                  tabIndex={-1}
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 text-sm text-primary-600">
              <input
                type="checkbox"
                id="rememberMe"
                defaultChecked
                className="h-4 w-4 rounded border-primary-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="rememberMe" className="text-xs select-none">
                Ingat saya di perangkat ini
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full !py-2.5 text-sm font-bold shadow-md shadow-primary-900/10"
            >
              <LogIn size={16} />
              {loading ? "Memproses Masuk..." : "Masuk ke Dashboard"}
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-primary-400">
            <span className="h-px flex-1 bg-primary-100" />
            <span>atau</span>
            <span className="h-px flex-1 bg-primary-100" />
          </div>

          {/* Navigasi Daftar Akun Baru */}
          <div className="rounded-xl border border-primary-100 bg-primary-50/40 p-4 text-center">
            <p className="text-xs text-primary-600">
              Belum memiliki akun pembudidaya?
            </p>
            <Link
              href="/register"
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-800 hover:underline"
            >
              <UserPlus size={14} />
              Daftar Akun Pembudidaya Baru
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
