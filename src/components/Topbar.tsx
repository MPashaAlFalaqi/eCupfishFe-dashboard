import Link from "next/link";
import { Bell } from "lucide-react";
import type { ReactNode } from "react";
export default function Topbar({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <header className="mb-5 flex items-center justify-between">
      <div><h1 className="text-xl font-bold">{title}</h1>{subtitle && <p className="text-sm text-primary-500">{subtitle}</p>}</div>
      <div className="flex items-center gap-3 print:hidden">
        {action}
        <Link href="/notifikasi" aria-label="Notifikasi" className="relative rounded-full p-2 text-primary-600 hover:bg-primary-50"><Bell size={16} /><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-secondary-500" /></Link>
        <div className="grid h-8 w-8 place-items-center rounded-full bg-primary-500 text-sm font-bold text-white">PA</div>
      </div>
    </header>
  );
}
