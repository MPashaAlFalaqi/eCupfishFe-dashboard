"use client";
import Link from "next/link";
import { Bell, Menu, PanelLeft } from "lucide-react";
import Breadcrumb from "./Breadcrumb";
import { useShell } from "./ShellProvider";
import { useDashboardData } from "./DashboardDataProvider";

export default function Navbar() {
  const { collapsed, toggleCollapsed, setMobileOpen } = useShell();
  const { notif } = useDashboardData();
  const unread = notif.filter(n => !n.dibaca).length;
  const btn =
    "h-9 w-9 shrink-0 place-items-center rounded-lg text-primary-700 transition hover:bg-primary-50 active:scale-95";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-primary-100 bg-white/90 px-3 backdrop-blur sm:gap-3 sm:px-6 print:hidden">
      <button
        onClick={() => setMobileOpen(true)}
        aria-label="Buka menu navigasi"
        className={`grid lg:hidden ${btn}`}
      >
        <Menu size={20} />
      </button>
      <button
        onClick={toggleCollapsed}
        aria-label={collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
        aria-expanded={!collapsed}
        className={`hidden lg:grid ${btn}`}
      >
        <PanelLeft size={20} />
      </button>
      <Breadcrumb className="min-w-0 flex-1" />
      <div
        title="Sinkronisasi data real-time aktif (WebSocket & Broadcast Channel)"
        className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 shadow-2xs"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="hidden sm:inline">Realtime Sync</span>
      </div>
      <Link
        href="/notifikasi"
        aria-label={unread ? `Notifikasi, ${unread} belum dibaca` : "Notifikasi"}
        className={`relative grid ${btn}`}
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-secondary-500 px-1 text-[10px] font-bold leading-none text-primary-950">
            {unread}
          </span>
        )}
      </Link>
    </header>
  );
}