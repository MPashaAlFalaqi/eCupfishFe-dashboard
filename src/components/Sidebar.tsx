"use client";
import Logo from "@/components/Logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { motion } from "framer-motion";
import { LayoutDashboard, Boxes, Gavel, Truck, ShieldAlert, Wallet, Settings, LogOut, ClipboardList, MessageCircle, Landmark, Star } from "lucide-react";

const menu = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/stok", label: "Manajemen Stok", icon: Boxes },
  { href: "/lelang", label: "Lelang", icon: Gavel },
  { href: "/pesanan", label: "Semua Pesanan", icon: ClipboardList },
  { href: "/pengiriman", label: "Pengiriman", icon: Truck },
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/klaim", label: "Klaim Pembeli", icon: ShieldAlert },
  { href: "/ulasan", label: "Ulasan", icon: Star },
  { href: "/laporan", label: "Laporan Keuangan", icon: Wallet },
  { href: "/pembayaran", label: "Pembayaran Masuk", icon: Landmark },
];
const spring = { type: "spring" as const, stiffness: 420, damping: 34 };
function Item({ href, label, icon: Icon, active }: any) {
  return (
    <Link href={href} className={clsx("group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
      active ? "font-semibold text-secondary-400" : "text-primary-200 hover:bg-primary-900")}>
      {active && <motion.span layoutId="nav-bg" transition={spring} className="absolute inset-0 rounded-lg bg-primary-800" />}
      {active && <motion.span layoutId="nav-bar" transition={spring} className="absolute -left-4 top-1/2 -mt-3 h-6 w-1 rounded-r bg-secondary-500" />}
      <Icon size={16} className="relative transition-transform duration-200 group-hover:scale-125" /><span className="relative">{label}</span>
    </Link>
  );
}
export default function Sidebar() {
  const path = usePathname();
  return (
    <aside className="sticky top-0 print:hidden hidden h-screen w-56 shrink-0 flex-col overflow-y-auto bg-primary-950 p-4 lg:flex">
      <div className="mb-6"><Logo /></div>
      <p className="mb-2 px-3 text-xs font-medium text-primary-400 uppercase tracking-wider">Menu utama</p>
      <nav className="space-y-1">{menu.map(m => <Item key={m.href} {...m} active={path.startsWith(m.href)} />)}</nav>
      <p className="mb-2 mt-6 px-3 text-xs font-medium text-primary-400 uppercase tracking-wider">Lainnya</p>
      <Item href="/pengaturan" label="Pengaturan" icon={Settings} active={path.startsWith("/pengaturan")} />
      <div className="mt-auto border-t border-primary-800 pt-4">
        <Link href="/login" className="mb-3 flex items-center gap-2 px-3 text-sm text-primary-300"><LogOut size={16} />Keluar</Link>
        <div className="flex items-center gap-2 px-1">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-primary-500 text-sm font-bold text-white">PA</div>
          <div><p className="text-sm font-semibold text-white">PASHA</p><p className="text-xs text-primary-300">Betta Farm</p></div>
        </div>
      </div>
    </aside>
  );
}
