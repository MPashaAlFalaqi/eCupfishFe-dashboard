"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  Users,
  ShieldCheck,
  History,
  Settings,
  LogOut,
  Fish,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";

export type NavTab = "dashboard" | "pembudidaya" | "pembeli" | "audit" | "pengaturan";

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  pendingMitraCount: number;
  blockedBuyerCount: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  pendingMitraCount,
  blockedBuyerCount,
  isExpanded,
  onToggleExpand,
  isOpenMobile,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Mobile backdrop overlay for very small screens (< 768px) */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Sidebar: Always visible on tablet, laptop & desktop (md: and up), toggleable on mobile */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-[#0B1A30] text-slate-300 border-r border-[#152B47] transition-all duration-300 ease-in-out ${
          isExpanded ? "w-64" : "w-20"
        } ${
          isOpenMobile ? "translate-x-0" : "max-md:-translate-x-full"
        }`}
      >
        {/* Brand / Logo Section */}
        <div
          className={`flex items-center border-b border-[#132742] transition-all duration-300 ${
            isExpanded ? "px-5 py-4 justify-between" : "px-3 py-4 justify-center"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 shrink-0">
              <img
                src="/logo.png"
                alt="eCupFish Official Logo"
                className="w-full h-full object-contain drop-shadow-md select-none"
              />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-[#0B1A30]"></span>
              </span>
            </div>

            {isExpanded && (
              <div className="overflow-hidden transition-opacity duration-200">
                <div className="flex items-center">
                  <span className="text-xl font-bold tracking-tight text-white">eCup</span>
                  <span className="text-xl font-bold tracking-tight text-[#38BDF8]">Fish</span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="inline-block px-1.5 py-0.2 bg-amber-400/15 text-amber-400 border border-amber-400/30 text-[10px] font-semibold tracking-wider rounded">
                    SUPER ADMIN
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
          {/* Main Menu Section */}
          <div>
            {isExpanded && (
              <p className="px-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-2">
                MENU UTAMA
              </p>
            )}

            <nav className="space-y-1.5">
              {/* Dashboard */}
              <button
                type="button"
                onClick={() => {
                  onSelectTab("dashboard");
                  onCloseMobile();
                }}
                title="Dashboard Utama"
                className={`w-full flex items-center rounded-xl text-sm font-medium transition-all ${
                  isExpanded ? "px-3.5 py-2.5 justify-start gap-3" : "p-2.5 justify-center"
                } ${
                  currentTab === "dashboard"
                    ? "bg-[#163359] text-white shadow-xs border border-blue-500/30"
                    : "text-slate-300 hover:text-white hover:bg-[#122540]"
                }`}
              >
                <LayoutDashboard
                  className={`w-5 h-5 shrink-0 ${
                    currentTab === "dashboard" ? "text-amber-400" : "text-slate-400"
                  }`}
                />
                {isExpanded && <span>Dashboard</span>}
              </button>

              {/* Kelola Pembudidaya (Mitra) */}
              <button
                type="button"
                onClick={() => {
                  onSelectTab("pembudidaya");
                  onCloseMobile();
                }}
                title="Kelola Akun Pembudidaya (Mitra)"
                className={`relative w-full flex items-center rounded-xl text-sm font-medium transition-all ${
                  isExpanded ? "px-3.5 py-2.5 justify-between" : "p-2.5 justify-center"
                } ${
                  currentTab === "pembudidaya"
                    ? "bg-[#163359] text-white shadow-xs border border-blue-500/30"
                    : "text-slate-300 hover:text-white hover:bg-[#122540]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Store
                    className={`w-5 h-5 shrink-0 ${
                      currentTab === "pembudidaya" ? "text-amber-400" : "text-slate-400"
                    }`}
                  />
                  {isExpanded && <span>Kelola Pembudidaya</span>}
                </div>

                {pendingMitraCount > 0 &&
                  (isExpanded ? (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {pendingMitraCount} baru
                    </span>
                  ) : (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-[#0B1A30]" />
                  ))}
              </button>

              {/* Kelola Pembeli */}
              <button
                type="button"
                onClick={() => {
                  onSelectTab("pembeli");
                  onCloseMobile();
                }}
                title="Kelola Akun Pembeli"
                className={`relative w-full flex items-center rounded-xl text-sm font-medium transition-all ${
                  isExpanded ? "px-3.5 py-2.5 justify-between" : "p-2.5 justify-center"
                } ${
                  currentTab === "pembeli"
                    ? "bg-[#163359] text-white shadow-xs border border-blue-500/30"
                    : "text-slate-300 hover:text-white hover:bg-[#122540]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users
                    className={`w-5 h-5 shrink-0 ${
                      currentTab === "pembeli" ? "text-amber-400" : "text-slate-400"
                    }`}
                  />
                  {isExpanded && <span>Kelola Pembeli</span>}
                </div>

                {blockedBuyerCount > 0 &&
                  (isExpanded ? (
                    <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {blockedBuyerCount} blokir
                    </span>
                  ) : (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-400 ring-2 ring-[#0B1A30]" />
                  ))}
              </button>
            </nav>
          </div>

          {/* Audit & Settings */}
          <div>
            {isExpanded && (
              <p className="px-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-2">
                KEAMANAN & SISTEM
              </p>
            )}

            <nav className="space-y-1.5">
              <button
                type="button"
                onClick={() => {
                  onSelectTab("audit");
                  onCloseMobile();
                }}
                title="Log Aktivitas Akun"
                className={`w-full flex items-center rounded-xl text-sm font-medium transition-all ${
                  isExpanded ? "px-3.5 py-2.5 justify-start gap-3" : "p-2.5 justify-center"
                } ${
                  currentTab === "audit"
                    ? "bg-[#163359] text-white shadow-xs border border-blue-500/30"
                    : "text-slate-300 hover:text-white hover:bg-[#122540]"
                }`}
              >
                <History
                  className={`w-5 h-5 shrink-0 ${
                    currentTab === "audit" ? "text-amber-400" : "text-slate-400"
                  }`}
                />
                {isExpanded && <span>Log Aktivitas Akun</span>}
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectTab("pengaturan");
                  onCloseMobile();
                }}
                title="Pengaturan Admin"
                className={`w-full flex items-center rounded-xl text-sm font-medium transition-all ${
                  isExpanded ? "px-3.5 py-2.5 justify-start gap-3" : "p-2.5 justify-center"
                } ${
                  currentTab === "pengaturan"
                    ? "bg-[#163359] text-white shadow-xs border border-blue-500/30"
                    : "text-slate-300 hover:text-white hover:bg-[#122540]"
                }`}
              >
                <Settings
                  className={`w-5 h-5 shrink-0 ${
                    currentTab === "pengaturan" ? "text-amber-400" : "text-slate-400"
                  }`}
                />
                {isExpanded && <span>Pengaturan Admin</span>}
              </button>
            </nav>
          </div>

          {/* Super Admin Info Card (only in expanded mode) */}
          {isExpanded && (
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#11243f] to-[#152e4f] border border-[#1f3f6b]/50">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-white">Akses Super Admin</p>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                    Kontrol penuh verifikasi identitas, legalitas farm mitra & penertiban akun pembeli.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Footer / Admin Profile */}
        <div className="p-3.5 border-t border-[#132742] bg-[#091526]">
          {isExpanded ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-600 to-blue-700 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white/10 shrink-0">
                  PA
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-white truncate">PASHA</p>
                  <p className="text-[11px] text-amber-400 font-medium truncate">Super Admin eCupFish</p>
                </div>
              </div>
              <Link
                href="/login"
                title="Keluar ke Halaman Login"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="flex justify-center">
              <Link
                href="/login"
                title="Pasha (Super Admin) - Klik untuk Keluar"
                className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-600 to-blue-700 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white/10 hover:ring-rose-400 transition-all cursor-pointer"
              >
                PA
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
