"use client";

import React, { useState } from "react";
import {
  Users,
  Store,
  ShieldCheck,
  ShieldAlert,
  ArrowUpRight,
  Clock,
  CheckCircle,
  ExternalLink,
  ChevronDown,
  UserCheck,
  UserX,
  FileText,
  BadgeAlert,
  Sparkles,
  Search,
  Filter
} from "lucide-react";
import { Pembudidaya, Pembeli } from "@/data/mockData";
import { NavTab } from "./Sidebar";

interface DashboardOverviewProps {
  pembudidayaList: Pembudidaya[];
  pembeliList: Pembeli[];
  onNavigateToTab: (tab: NavTab) => void;
  onOpenMitraDetail: (mitra: Pembudidaya) => void;
  onOpenBuyerDetail: (buyer: Pembeli) => void;
  onApproveMitra: (id: string) => void;
  onRejectMitra: (id: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  pembudidayaList,
  pembeliList,
  onNavigateToTab,
  onOpenMitraDetail,
  onOpenBuyerDetail,
  onApproveMitra,
  onRejectMitra
}) => {
  const [chartPeriod, setChartPeriod] = useState<"Minggu ini" | "Bulan ini">("Minggu ini");

  // Calculations
  const pendingMitra = pembudidayaList.filter((p) => p.status === "menunggu_verifikasi");
  const activeMitra = pembudidayaList.filter((p) => p.status === "aktif");
  const suspendedMitra = pembudidayaList.filter((p) => p.status === "ditangguhkan");

  const blockedBuyers = pembeliList.filter((b) => b.status === "diblokir");
  const activeBuyers = pembeliList.filter((b) => b.status === "aktif");

  const totalUsers = pembudidayaList.length + pembeliList.length;
  const totalSuspended = suspendedMitra.length + blockedBuyers.length;

  // 7 days registration bar data (matching screenshot layout)
  const chartDays = [
    { day: "Sen", value: 42, label: "42 akun" },
    { day: "Sel", value: 68, label: "68 akun" },
    { day: "Rab", value: 35, label: "35 akun" },
    { day: "Kam", value: 58, label: "58 akun" },
    { day: "Jum", value: 52, label: "52 akun" },
    { day: "Sab", value: 92, label: "92 akun", isHighlighted: true }, // Highlighted yellow in screenshot!
    { day: "Min", value: 64, label: "64 akun" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome & Date Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          Selamat pagi, Pasha <span className="inline-block animate-bounce">👋</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-2 font-medium">
          <span>Kamis, 22 Oktober 2026</span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
          <span className="text-amber-600 font-semibold">
            {pendingMitra.length} akun pembudidaya menunggu tindakan verifikasi
          </span>
        </p>
      </div>

      {/* 4 Top Metric Cards (Exact styled structure from user screenshot) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Dark Navy Gradient Card (matching 'Pendapatan Bulan Ini') */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B213F] via-[#0E2E57] to-[#12386A] p-5 text-white shadow-md border border-[#1E4374]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-300">Total Pengguna Aktif</p>
              <h3 className="text-2xl font-bold mt-2 tracking-tight text-white">
                {totalUsers * 128} <span className="text-sm font-normal text-slate-300">akun</span>
              </h3>
              <p className="text-[11px] text-emerald-300 mt-1.5 flex items-center font-medium">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5 inline" /> +14,8% dari bulan lalu
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md text-amber-400 border border-white/10">
              <Users className="w-5 h-5" />
            </div>
          </div>
          {/* Subtle bottom glow */}
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* Card 2: Mitra Pembudidaya (White Card with Blue badge) */}
        <div className="rounded-2xl bg-white p-5 shadow-xs border border-slate-200/80 hover:border-slate-300 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Mitra Pembudidaya</p>
              <h3 className="text-2xl font-bold mt-2 text-slate-900 tracking-tight">
                {activeMitra.length} <span className="text-sm font-medium text-slate-500">farm aktif</span>
              </h3>
              <p className="text-[11px] text-amber-600 mt-1.5 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                {pendingMitra.length} pengajuan menunggu verifikasi
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Store className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Card 3: Akun Pembeli (White Card with Yellow badge) */}
        <div className="rounded-2xl bg-white p-5 shadow-xs border border-slate-200/80 hover:border-slate-300 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Akun Pembeli</p>
              <h3 className="text-2xl font-bold mt-2 text-slate-900 tracking-tight">
                {activeBuyers.length * 280}{" "}
                <span className="text-sm font-medium text-slate-500">pembeli</span>
              </h3>
              <p className="text-[11px] text-blue-600 mt-1.5 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                18 pendaftar baru hari ini
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Card 4: Akun Ditangguhkan (White Card with Red/Blue badge) */}
        <div className="rounded-2xl bg-white p-5 shadow-xs border border-slate-200/80 hover:border-slate-300 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Akun Ditangguhkan</p>
              <h3 className="text-2xl font-bold mt-2 text-slate-900 tracking-tight">
                {totalSuspended} <span className="text-sm font-medium text-slate-500">akun</span>
              </h3>
              <p className="text-[11px] text-rose-600 mt-1.5 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                {blockedBuyers.length} pembeli di-banned
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Chart & Urgent Action Card (matching screenshot) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Bar Chart 'Pertumbuhan Akun 7 Hari Terakhir' (2 Cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-white p-5 sm:p-6 shadow-xs border border-slate-200/80">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">Pertumbuhan Akun 7 Hari Terakhir</h2>
              <p className="text-xs text-slate-500 mt-0.5">Statistik registrasi pembeli & pengajuan mitra baru</p>
            </div>
            <div className="relative">
              <select
                value={chartPeriod}
                onChange={(e) => setChartPeriod(e.target.value as any)}
                aria-label="Filter Periode Grafik"
                className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 pr-7 focus:outline-hidden cursor-pointer"
              >
                <option value="Minggu ini">Minggu ini</option>
                <option value="Bulan ini">Bulan ini</option>
              </select>
            </div>
          </div>

          {/* Bar Chart Visualization - Exact replicate of screenshot's gradient bars and yellow Saturday bar */}
          <div className="h-56 flex items-end justify-between gap-3 sm:gap-6 pt-6 pb-2 px-2 border-b border-slate-100">
            {chartDays.map((item) => (
              <div key={item.day} className="flex-1 flex flex-col items-center h-full justify-end group">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-slate-600 mb-1.5">
                  {item.label}
                </div>
                <div
                  className={`w-full max-w-[56px] rounded-t-xl transition-all duration-300 group-hover:brightness-110 shadow-xs ${
                    item.isHighlighted
                      ? "bg-gradient-to-t from-amber-500 to-amber-400 ring-2 ring-amber-400/40"
                      : "bg-gradient-to-t from-[#2563EB] to-[#60A5FA]"
                  }`}
                  style={{ height: `${item.value}%` }}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between px-2 pt-3 text-xs font-semibold text-slate-400">
            {chartDays.map((item) => (
              <span
                key={item.day}
                className={`flex-1 text-center ${
                  item.isHighlighted ? "text-amber-600 font-bold" : ""
                }`}
              >
                {item.day}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Urgent Action Card (styled like 'Lelang Berlangsung' in user screenshot) */}
        <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-xs border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Verifikasi Menunggu</h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                {pendingMitra.length} Urgent
              </span>
            </div>

            {pendingMitra.length > 0 ? (
              <div className="space-y-4">
                {/* Dark Navy Showcase Card (like the dark blue inner box in screenshot) */}
                <div className="rounded-xl bg-gradient-to-br from-[#0C2442] to-[#123661] p-4 text-white shadow-xs">
                  <div className="flex items-center justify-between text-xs text-amber-300 font-medium">
                    <span>Pengajuan Mitra Kemitraan</span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-300">
                      <Clock className="w-3 h-3 text-amber-400" /> Baru saja
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-1.5 truncate">
                    {pendingMitra[0].namaFarm}
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Pemilik: {pendingMitra[0].namaPemilik} · {pendingMitra[0].kota}
                  </p>
                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-slate-300">Kelengkapan Berkas:</span>
                    <span className="font-semibold text-emerald-300">KTP & Foto Farm Siap</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-slate-500 font-medium">Spesialisasi Ikan Budidaya:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {pendingMitra[0].spesialisasi.map((sp) => (
                      <span
                        key={sp}
                        className="px-2 py-0.5 text-[11px] bg-slate-100 text-slate-700 font-medium rounded-md"
                      >
                        {sp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center">
                <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">Semua Mitra Terverifikasi</p>
                <p className="text-xs text-slate-400 mt-1">Tidak ada pengajuan verifikasi yang tertunda saat ini.</p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2">
            {pendingMitra.length > 0 ? (
              <>
                <button
                  type="button"
                  onClick={() => onOpenMitraDetail(pendingMitra[0])}
                  className="flex-1 py-2.5 px-3 bg-[#0B1A30] hover:bg-[#132B4C] text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
                >
                  Tinjau Berkas & KTP
                </button>
                <button
                  type="button"
                  onClick={() => onApproveMitra(pendingMitra[0].id)}
                  className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
                  title="Langsung Setujui"
                >
                  Setujui
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => onNavigateToTab("pembudidaya")}
                className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Lihat Daftar Pembudidaya
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row: Pending Actions Table & Distribution (matching screenshot layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Pending Actions Table (like 'Pesanan Perlu Tindakan') */}
        <div className="lg:col-span-2 rounded-2xl bg-white p-5 sm:p-6 shadow-xs border border-slate-200/80">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900">Akun Perlu Tindakan</h2>
            <button
              type="button"
              onClick={() => onNavigateToTab("pembudidaya")}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Lihat semua
            </button>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-12 text-[11px] font-bold text-slate-400 uppercase tracking-wider py-2 border-b border-slate-100 px-2">
            <div className="col-span-6 sm:col-span-5">PENGGUNA & ROLE</div>
            <div className="col-span-3 sm:col-span-4">WILAYAH / DETAIL</div>
            <div className="col-span-3 text-right">STATUS</div>
          </div>

          {/* Table Rows (Matching the soft pills from user screenshot: Bayar, Kemas, Kirim, Klaim) */}
          <div className="divide-y divide-slate-100">
            {/* Row 1: Menunggu Verifikasi (Yellow Pill like 'Bayar') */}
            {pendingMitra.map((mitra) => (
              <div
                key={mitra.id}
                onClick={() => onOpenMitraDetail(mitra)}
                className="grid grid-cols-12 items-center py-3.5 px-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
              >
                <div className="col-span-6 sm:col-span-5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                    <Store className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900 truncate">{mitra.namaFarm}</p>
                    <p className="text-[11px] text-slate-500 truncate">{mitra.namaPemilik}</p>
                  </div>
                </div>
                <div className="col-span-3 sm:col-span-4 text-xs text-slate-600 truncate font-medium">
                  {mitra.kota}, {mitra.provinsi}
                </div>
                <div className="col-span-3 text-right">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FEF3C7] text-[#B45309]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></span>
                    Verifikasi
                  </span>
                </div>
              </div>
            ))}

            {/* Row 2: Pembeli Diblokir (Red / Rose pill like 'Klaim') */}
            {blockedBuyers.map((buyer) => (
              <div
                key={buyer.id}
                onClick={() => onOpenBuyerDetail(buyer)}
                className="grid grid-cols-12 items-center py-3.5 px-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
              >
                <div className="col-span-6 sm:col-span-5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs shrink-0">
                    <UserX className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900 truncate">{buyer.namaLengkap}</p>
                    <p className="text-[11px] text-slate-500 truncate">@{buyer.username}</p>
                  </div>
                </div>
                <div className="col-span-3 sm:col-span-4 text-xs text-slate-600 truncate font-medium">
                  {buyer.kota}
                </div>
                <div className="col-span-3 text-right">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FEE2E2] text-[#B91C1C]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]"></span>
                    Diblokir
                  </span>
                </div>
              </div>
            ))}

            {/* Row 3: Mitra Ditangguhkan */}
            {suspendedMitra.map((mitra) => (
              <div
                key={mitra.id}
                onClick={() => onOpenMitraDetail(mitra)}
                className="grid grid-cols-12 items-center py-3.5 px-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
              >
                <div className="col-span-6 sm:col-span-5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900 truncate">{mitra.namaFarm}</p>
                    <p className="text-[11px] text-slate-500 truncate">{mitra.alasanStatus || "Ditangguhkan"}</p>
                  </div>
                </div>
                <div className="col-span-3 sm:col-span-4 text-xs text-slate-600 truncate font-medium">
                  {mitra.kota}
                </div>
                <div className="col-span-3 text-right">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    Suspend
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Sebaran Mitra & Kategori (styled like 'Stok Menipis' in user screenshot) */}
        <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-xs border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Distribusi Sentra Mitra</h2>
              <span className="text-amber-500 text-xs">
                <Store className="w-4 h-4" />
              </span>
            </div>

            <div className="space-y-4">
              {/* Item 1 */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1 font-semibold">
                  <span className="text-slate-800">Kediri & Tulungagung</span>
                  <span className="text-rose-500 font-bold">48 Farm</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: "85%" }} />
                </div>
              </div>

              {/* Item 2 */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1 font-semibold">
                  <span className="text-slate-800">Jabodetabek & Banten</span>
                  <span className="text-amber-500 font-bold">36 Farm</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: "65%" }} />
                </div>
              </div>

              {/* Item 3 */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1 font-semibold">
                  <span className="text-slate-800">Solo & Semarang</span>
                  <span className="text-amber-500 font-bold">28 Farm</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: "50%" }} />
                </div>
              </div>

              {/* Item 4 */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1 font-semibold">
                  <span className="text-slate-800">Bandung & Jabar</span>
                  <span className="text-blue-500 font-bold">22 Farm</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: "40%" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onNavigateToTab("pembudidaya")}
              className="w-full py-2.5 px-3 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-xl transition-colors"
            >
              Kelola Semua Pembudidaya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
