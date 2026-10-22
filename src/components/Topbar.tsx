import type { ReactNode } from "react";
// Judul halaman + aksi utama halaman. Notifikasi dan breadcrumb ada di Navbar.
export default function Topbar({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <header className="mb-5 flex flex-wrap items-center gap-3">
      <div className="min-w-0 flex-1"><h1 className="text-lg font-bold sm:text-xl">{title}</h1>{subtitle && <p className="text-sm text-primary-500">{subtitle}</p>}</div>
      {action && <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto print:hidden">{action}</div>}
    </header>
  );
}
