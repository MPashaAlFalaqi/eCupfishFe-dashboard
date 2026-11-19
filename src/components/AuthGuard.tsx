"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError, session, type Role, type SessionUser } from "@/lib/api";

export default function AuthGuard({
  roles,
  children,
}: {
  roles: Role[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [siap, setSiap] = useState(false);
  const [gagal, setGagal] = useState<string | null>(null);

  useEffect(() => {
    let batal = false;
    (async () => {
      try {
        if (!session.token) {
          router.replace("/login");
          return;
        }
        const { user } = await api<{ user: SessionUser }>("/api/me");
        if (!roles.includes(user.role)) {
          throw new Error(`Peran akun (${user.role}) tidak diizinkan membuka halaman ini.`);
        }
        if (!batal) setSiap(true);
      } catch (err) {
        console.error("AuthGuard error:", err);
        const pesan =
          err instanceof ApiError
            ? `Error ${err.status}: ${err.message}`
            : err instanceof Error
            ? err.message
            : "Gagal memverifikasi sesi ke /api/me";

        // Hanya tendang ke login jika memang 401/403 (token tidak valid / role salah)
        if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
          session.clear();
          router.replace("/login");
        } else if (!batal) {
          setGagal(pesan);
        }
      }
    })();

    return () => {
      batal = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gagal) {
    return (
      <div className="grid min-h-screen place-items-center p-6">
        <div className="max-w-md rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          <p className="font-bold">Gagal memuat sesi Dashboard</p>
          <p className="mt-1">{gagal}</p>
          <button
            onClick={() => {
              session.clear();
              router.replace("/login");
            }}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white"
          >
            Kembali ke Login
          </button>
        </div>
      </div>
    );
  }

  return siap ? <>{children}</> : null;
}