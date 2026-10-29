"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  PanelLeft,
  Home,
  Bell,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  Shield,
  X,
  LogOut
} from "lucide-react";
import { NavTab } from "./Sidebar";

interface HeaderProps {
  currentTab: NavTab;
  isSidebarExpanded: boolean;
  onToggleSidebar: () => void;
  pendingMitraCount: number;
  onNavigateToTab: (tab: NavTab) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  isSidebarExpanded,
  onToggleSidebar,
  pendingMitraCount,
  onNavigateToTab,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const getPageInfo = () => {
    switch (currentTab) {
      case "dashboard":
        return { title: "Dashboard", subtitle: "Ringkasan" };
      case "pembudidaya":
        return { title: "Kelola Pembudidaya", subtitle: "Mitra Farm" };
      case "pembeli":
        return { title: "Kelola Pembeli", subtitle: "Akun Pengguna" };
      case "audit":
        return { title: "Log Aktivitas", subtitle: "Audit Trail" };
      case "pengaturan":
        return { title: "Pengaturan", subtitle: "Sistem Admin" };
      default:
        return { title: "Dashboard", subtitle: "Utama" };
    }
  };

  const { title } = getPageInfo();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6 bg-white border-b border-slate-200 shadow-2xs">
      {/* Left: Sidebar Toggle Button [ ◫ ] and Breadcrumb [ 🏠 Dashboard ] */}
      <div className="flex items-center gap-3">
        {/* Toggle Sidebar Button (Matching the [ ◫ ] icon from user screenshot) */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="flex items-center justify-center p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 shadow-2xs"
          title={isSidebarExpanded ? "Kecilkan Sidebar" : "Perlebar Sidebar"}
        >
          <PanelLeft className="w-4.5 h-4.5" />
        </button>

        {/* Vertical divider */}
        <div className="h-4 w-px bg-slate-200 hidden sm:block" />

        {/* Breadcrumb matching user's screenshot format: [ 🏠 Dashboard ] */}
        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800">
          <button
            type="button"
            onClick={() => onNavigateToTab("dashboard")}
            className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors"
          >
            <Home className="w-4 h-4 text-slate-400" />
            <span>Dashboard</span>
          </button>

          {currentTab !== "dashboard" && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className="text-slate-900 font-bold">{title}</span>
            </>
          )}
        </div>
      </div>

      {/* Right: Quick Search, Notification Bell [ 🔔 3 ], and User Avatar */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Quick Search */}
        <div className="relative hidden md:block w-56 lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari farm, pembeli, NIK..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-colors"
          />
        </div>

        {/* Notification Bell (Yellow counter badge '3' like in user screenshot) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            title="Pemberitahuan Akun"
          >
            <Bell className="w-5 h-5" />
            {pendingMitraCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white ring-2 ring-white shadow-2xs">
                {pendingMitraCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Modal */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-800 text-sm">Pemberitahuan Akun</h4>
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-700 rounded-full">
                    {pendingMitraCount} Tindakan
                  </span>
                </div>
                <button
                  type="button"
                  className="p-1 text-slate-400 hover:text-slate-700 rounded"
                  onClick={() => setShowNotifications(false)}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="py-2 divide-y divide-slate-100 max-h-72 overflow-y-auto">
                <div
                  className="py-2.5 flex items-start gap-3 hover:bg-slate-50 p-2 rounded-xl cursor-pointer transition-colors"
                  onClick={() => {
                    onNavigateToTab("pembudidaya");
                    setShowNotifications(false);
                  }}
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">
                      Galaxy Betta Farm meminta verifikasi
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      KTP & foto farm diunggah 10 menit lalu dari Bogor.
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      Tinjau KTP Sekarang &rarr;
                    </span>
                  </div>
                </div>

                <div
                  className="py-2.5 flex items-start gap-3 hover:bg-slate-50 p-2 rounded-xl cursor-pointer transition-colors"
                  onClick={() => {
                    onNavigateToTab("pembeli");
                    setShowNotifications(false);
                  }}
                >
                  <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">
                      Laporan Akun Pembeli (eko_bidder99)
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Terindikasi 3x Bid and Run lelang tanpa penyelesaian pembayaran.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={() => {
                    onNavigateToTab("audit");
                    setShowNotifications(false);
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Lihat Riwayat Audit Akun &rarr;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Admin Avatar Circle [ PA ] */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <Link
            href="/login"
            title="Pasha (Super Admin) - Klik untuk Keluar"
            className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center ring-2 ring-slate-100 shadow-2xs hover:ring-rose-400 transition-all cursor-pointer"
          >
            PA
          </Link>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight">Pasha</p>
            <Link
              href="/login"
              className="text-[10px] text-amber-600 hover:text-rose-500 font-semibold block transition-colors"
              title="Keluar"
            >
              Super Admin · Keluar &rarr;
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
