"use client";

import { useEffect, useState } from "react";
import Logo from "@/components/Logo";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useShell } from "@/components/ShellProvider";
import { 
  LayoutDashboard, Boxes, Gavel, Truck, ShieldAlert, 
  Wallet, Settings, LogOut, ClipboardList, 
  MessageCircle, Landmark, Star 
} from "lucide-react";

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

function Item({ href, label, icon: Icon, active, ns, onNavigate, collapsed }: any) {
  return (
    <Link href={href} onClick={onNavigate} title={collapsed ? label : undefined}
      className={clsx("group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors", collapsed && "justify-center px-0",
        active ? "font-semibold text-secondary-400" : "text-primary-200 hover:bg-primary-900")}>
      {active && <motion.span layoutId={`nav-bg-${ns}`} transition={spring} className="absolute inset-0 rounded-lg bg-primary-800" />}
      {active && <motion.span layoutId={`nav-bar-${ns}`} transition={spring} className="absolute -left-4 top-1/2 -mt-3 h-6 w-1 rounded-r bg-secondary-500" />}
      <Icon size={collapsed ? 18 : 16} className="relative transition-transform duration-200 group-hover:scale-125" />
      {!collapsed && <span className="relative">{label}</span>}
    </Link>
  );
}

export function SidebarBody({ ns, onNavigate, collapsed = false }: { ns: string; onNavigate?: () => void; collapsed?: boolean }) {
  const path = usePathname();
  const router = useRouter();
  
  const [namaAdmin, setNamaAdmin] = useState("Memuat...");
  const [inisial, setInisial] = useState("..");

  useEffect(() => {
    const adminData = localStorage.getItem("admin_data");
    if (adminData) {
      const parsedData = JSON.parse(adminData);
      setNamaAdmin(parsedData.name);
      if (parsedData.name) {
        setInisial(parsedData.name.substring(0, 2).toUpperCase());
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_data");
    router.push("/login");
  };

  const label = "mb-2 px-3 text-xs font-medium uppercase tracking-wider text-primary-400";
  
  return (
    <>
      <div className={clsx("mb-6", collapsed && "flex justify-center")}><Logo compact={collapsed} /></div>
      {collapsed ? <div className="mb-2 border-t border-primary-800" /> : <p className={label}>Menu utama</p>}
      
      <nav className="space-y-1">
        {menu.map(m => (
          <Item key={m.href} {...m} ns={ns} onNavigate={onNavigate} collapsed={collapsed} active={path.startsWith(m.href)} />
        ))}
      </nav>
      
      {collapsed ? <div className="my-3 border-t border-primary-800" /> : <p className={`${label} mt-6`}>Lainnya</p>}
      <Item href="/pengaturan" label="Pengaturan" icon={Settings} ns={ns} onNavigate={onNavigate} collapsed={collapsed} active={path.startsWith("/pengaturan")} />
      
      <div className="mt-auto border-t border-primary-800 pt-4">
        <button 
          onClick={handleLogout} 
          title={collapsed ? "Keluar" : undefined} 
          className={clsx("w-full mb-3 flex items-center gap-2 px-3 text-sm text-primary-300 hover:text-white transition-colors", collapsed && "justify-center px-0")}
        >
          <LogOut size={collapsed ? 18 : 16} />{!collapsed && "Keluar"}
        </button>
        
        <div className={clsx("flex items-center gap-2 px-1 overflow-hidden", collapsed && "justify-center px-0")}>
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-500 text-sm font-bold text-white">
            {inisial}
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate max-w-[130px]">{namaAdmin}</p>
              <p className="text-xs text-primary-300">Betta Farm</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function Sidebar() {
  const { collapsed } = useShell();
  return (
    <aside className={clsx("sticky top-0 hidden h-screen shrink-0 flex-col overflow-y-auto overflow-x-hidden bg-primary-950 p-4 transition-[width] duration-200 lg:flex print:hidden", collapsed ? "w-[4.5rem]" : "w-56")}>
      <SidebarBody ns="d" collapsed={collapsed} />
    </aside>
  );
}