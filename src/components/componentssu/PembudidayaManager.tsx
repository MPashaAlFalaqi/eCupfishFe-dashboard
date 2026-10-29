"use client";

import React, { useState, useMemo } from "react";
import {
  Store,
  Search,
  Filter,
  Plus,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Phone,
  Mail,
  MapPin,
  Star,
  ExternalLink,
  ChevronDown,
  ShieldCheck,
  ShieldAlert,
  Download,
  Building,
  CreditCard,
  Eye,
  X
} from "lucide-react";
import { Pembudidaya } from "@/data/mockData";

interface PembudidayaManagerProps {
  mitraList: Pembudidaya[];
  selectedMitra: Pembudidaya | null;
  onSelectMitra: (mitra: Pembudidaya | null) => void;
  onApproveMitra: (id: string) => void;
  onRejectMitra: (id: string, reason: string) => void;
  onSuspendMitra: (id: string, reason: string) => void;
  onUnsuspendMitra: (id: string) => void;
  onAddMitra: (newMitra: Omit<Pembudidaya, "id" | "statistik">) => void;
}

export const PembudidayaManager: React.FC<PembudidayaManagerProps> = ({
  mitraList,
  selectedMitra,
  onSelectMitra,
  onApproveMitra,
  onRejectMitra,
  onSuspendMitra,
  onUnsuspendMitra,
  onAddMitra,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [suspendModalMitra, setSuspendModalMitra] = useState<Pembudidaya | null>(null);
  const [suspendReason, setSuspendReason] = useState<string>("");
  const [rejectModalMitra, setRejectModalMitra] = useState<Pembudidaya | null>(null);
  const [rejectReason, setRejectReason] = useState<string>("");

  // New Mitra Form State
  const [formNamaFarm, setFormNamaFarm] = useState("");
  const [formNamaPemilik, setFormNamaPemilik] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formTelepon, setFormTelepon] = useState("");
  const [formKota, setFormKota] = useState("");
  const [formProvinsi, setFormProvinsi] = useState("Jawa Timur");
  const [formAlamat, setFormAlamat] = useState("");
  const [formSpesialisasi, setFormSpesialisasi] = useState("Halfmoon, Plakat");
  const [formNik, setFormNik] = useState("");
  const [formBank, setFormBank] = useState("BCA");
  const [formRekening, setFormRekening] = useState("");

  // Filtered & Sorted List
  const filteredList = useMemo(() => {
    return mitraList
      .filter((item) => {
        if (filterStatus === "all") return true;
        return item.status === filterStatus;
      })
      .filter((item) => {
        const query = searchQuery.toLowerCase();
        return (
          item.namaFarm.toLowerCase().includes(query) ||
          item.namaPemilik.toLowerCase().includes(query) ||
          item.email.toLowerCase().includes(query) ||
          item.kota.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.namaFarm.localeCompare(b.namaFarm);
        if (sortBy === "sales") return b.statistik.totalIkanTerjual - a.statistik.totalIkanTerjual;
        if (sortBy === "rating") return b.statistik.rating - a.statistik.rating;
        return 0;
      });
  }, [mitraList, filterStatus, searchQuery, sortBy]);

  // Counts
  const countAll = mitraList.length;
  const countPending = mitraList.filter((m) => m.status === "menunggu_verifikasi").length;
  const countActive = mitraList.filter((m) => m.status === "aktif").length;
  const countSuspended = mitraList.filter((m) => m.status === "ditangguhkan").length;

  const handleCreateMitra = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNamaFarm || !formNamaPemilik || !formEmail) {
      alert("Harap lengkapi field wajib!");
      return;
    }

    onAddMitra({
      namaFarm: formNamaFarm,
      namaPemilik: formNamaPemilik,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
      email: formEmail,
      telepon: formTelepon || "081234567890",
      kota: formKota || "Kediri",
      provinsi: formProvinsi,
      alamatLengkap: formAlamat || "Sentra Budidaya Ikan Hias",
      tanggalGabung: "Hari ini",
      spesialisasi: formSpesialisasi.split(",").map((s) => s.trim()),
      status: "aktif",
      dokumen: {
        nik: formNik || "3506123456780009",
        fotoKtp: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80",
        fotoFarm: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=600&auto=format&fit=crop&q=80",
      },
      bank: {
        namaBank: formBank,
        nomorRekening: formRekening || "1234567890",
        atasNama: formNamaPemilik,
      },
    });

    setIsAddModalOpen(false);
    // Reset Form
    setFormNamaFarm("");
    setFormNamaPemilik("");
    setFormEmail("");
    setFormTelepon("");
    setFormKota("");
    setFormAlamat("");
  };

  const exportCSV = () => {
    const headers = ["ID,Nama Farm,Nama Pemilik,Email,Telepon,Kota,Status,Total Terjual,Rating\n"];
    const rows = mitraList.map(
      (m) =>
        `"${m.id}","${m.namaFarm}","${m.namaPemilik}","${m.email}","${m.telepon}","${m.kota}","${m.status}","${m.statistik.totalIkanTerjual}","${m.statistik.rating}"\n`
    );
    const blob = new Blob([...headers, ...rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "daftar-mitra-pembudidaya-ecupfish.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Kelola Akun Pembudidaya (Mitra)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Verifikasi pendaftaran farm mitra, periksa izin KTP, dan kelola status operasional akun.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={exportCSV}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#0B1A30] hover:bg-[#142D52] text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Tambah Mitra Baru</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="rounded-2xl bg-white p-4 shadow-xs border border-slate-200/80 space-y-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setFilterStatus("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              filterStatus === "all"
                ? "bg-[#0B1A30] text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Semua Mitra ({countAll})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus("menunggu_verifikasi")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              filterStatus === "menunggu_verifikasi"
                ? "bg-amber-500 text-white"
                : "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            Menunggu Verifikasi ({countPending})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus("aktif")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              filterStatus === "aktif"
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Mitra Aktif ({countActive})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus("ditangguhkan")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              filterStatus === "ditangguhkan"
                ? "bg-rose-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Ditangguhkan ({countSuspended})
          </button>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama farm, pemilik, kota..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-slate-400 font-medium">Urutkan:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Urutkan Mitra"
              className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="newest">Terbaru Bergabung</option>
              <option value="name">Nama Farm (A-Z)</option>
              <option value="sales">Penjualan Terbanyak</option>
              <option value="rating">Rating Tertinggi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-2xl bg-white shadow-xs border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">MITRA PEMBUDIDAYA</th>
                <th className="py-3 px-4">LOKASI & KONTAK</th>
                <th className="py-3 px-4">DOKUMEN LEGALITAS</th>
                <th className="py-3 px-4">PERFORMA</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredList.map((mitra) => (
                <tr
                  key={mitra.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* Farm & Pemilik */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0 shadow-2xs">
                        <Store className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900">{mitra.namaFarm}</span>
                          {mitra.status === "aktif" && (
                            <span title="Terverifikasi">
                              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500">Pemilik: {mitra.namaPemilik}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{mitra.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Lokasi & Kontak */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <p className="font-medium text-slate-800 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {mitra.kota}, {mitra.provinsi}
                      </p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-emerald-500" />
                        {mitra.telepon}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate max-w-[180px]">
                        {mitra.email}
                      </p>
                    </div>
                  </td>

                  {/* Legalitas */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="px-1.5 py-0.2 bg-blue-50 text-blue-700 rounded font-medium border border-blue-100">
                          NIK: {mitra.dokumen.nik.slice(0, 8)}...
                        </span>
                      </div>
                      <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Foto KTP & Farm Ada
                      </p>
                      {mitra.dokumen.suratIzin && (
                        <p className="text-[10px] text-slate-400 truncate">
                          {mitra.dokumen.suratIzin}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Performa */}
                  <td className="py-3.5 px-4">
                    <div>
                      <div className="flex items-center gap-1 font-bold text-slate-800">
                        <span>{mitra.statistik.totalIkanTerjual}</span>
                        <span className="text-[11px] font-normal text-slate-500">ekor terjual</span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5 text-amber-500 text-[11px] font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{mitra.statistik.rating > 0 ? mitra.statistik.rating.toFixed(1) : "-"}</span>
                        <span className="text-slate-400 font-normal">
                          ({mitra.statistik.totalUlasan} ulasan)
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Status Badges */}
                  <td className="py-3.5 px-4">
                    {mitra.status === "aktif" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#DCFCE7] text-[#15803D]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span>
                        Aktif
                      </span>
                    )}
                    {mitra.status === "menunggu_verifikasi" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FEF3C7] text-[#B45309]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse"></span>
                        Menunggu Verifikasi
                      </span>
                    )}
                    {mitra.status === "ditangguhkan" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FEE2E2] text-[#B91C1C]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]"></span>
                        Ditangguhkan
                      </span>
                    )}
                    {mitra.status === "ditolak" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        Ditolak
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onSelectMitra(mitra)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition-colors"
                      >
                        Detail & Berkas
                      </button>

                      {mitra.status === "menunggu_verifikasi" && (
                        <>
                          <button
                            type="button"
                            onClick={() => onApproveMitra(mitra.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition-colors shadow-2xs"
                            title="Setujui Kemitraan"
                          >
                            Setujui
                          </button>
                          <button
                            type="button"
                            onClick={() => setRejectModalMitra(mitra)}
                            className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold rounded-lg text-xs transition-colors border border-rose-200"
                            title="Tolak Pendaftaran"
                          >
                            Tolak
                          </button>
                        </>
                      )}

                      {mitra.status === "aktif" && (
                        <button
                          type="button"
                          onClick={() => setSuspendModalMitra(mitra)}
                          className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 font-medium rounded-lg text-xs transition-colors border border-amber-200"
                          title="Tangguhkan Akun"
                        >
                          Suspend
                        </button>
                      )}

                      {mitra.status === "ditangguhkan" && (
                        <button
                          type="button"
                          onClick={() => onUnsuspendMitra(mitra.id)}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition-colors"
                        >
                          Aktifkan
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredList.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Store className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">Tidak ada data pembudidaya</p>
                    <p className="text-xs mt-1">Coba sesuaikan kata kunci pencarian atau filter status.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail Mitra */}
      {selectedMitra && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 bg-[#0B1A30] text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">{selectedMitra.namaFarm}</h3>
                  <p className="text-xs text-slate-300">
                    ID: {selectedMitra.id} · Terdaftar {selectedMitra.tanggalGabung}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onSelectMitra(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
              {/* Status Banner */}
              <div
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  selectedMitra.status === "aktif"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : selectedMitra.status === "menunggu_verifikasi"
                    ? "bg-amber-50 border-amber-200 text-amber-800"
                    : "bg-rose-50 border-rose-200 text-rose-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span className="font-bold uppercase tracking-wider text-[11px]">
                    Status: {selectedMitra.status.replace("_", " ")}
                  </span>
                </div>
                {selectedMitra.alasanStatus && (
                  <span className="text-[11px] italic">"{selectedMitra.alasanStatus}"</span>
                )}
              </div>

              {/* Grid 2 Cols */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Informasi Farm & Pemilik */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <h4 className="font-bold text-slate-900 border-b pb-1.5 border-slate-200 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-blue-600" /> Profil Usaha Mitra
                  </h4>
                  <p>
                    <span className="text-slate-400">Pemilik:</span>{" "}
                    <strong className="text-slate-800">{selectedMitra.namaPemilik}</strong>
                  </p>
                  <p>
                    <span className="text-slate-400">Email:</span> {selectedMitra.email}
                  </p>
                  <p>
                    <span className="text-slate-400">WhatsApp:</span> {selectedMitra.telepon}
                  </p>
                  <p>
                    <span className="text-slate-400">Alamat:</span> {selectedMitra.alamatLengkap},{" "}
                    {selectedMitra.kota}, {selectedMitra.provinsi}
                  </p>
                </div>

                {/* Rekening Bank Pencairan */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <h4 className="font-bold text-slate-900 border-b pb-1.5 border-slate-200 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-amber-600" /> Rekening Pencairan Hasil
                  </h4>
                  <p>
                    <span className="text-slate-400">Bank:</span>{" "}
                    <strong>{selectedMitra.bank.namaBank}</strong>
                  </p>
                  <p>
                    <span className="text-slate-400">No Rekening:</span>{" "}
                    <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-slate-800">
                      {selectedMitra.bank.nomorRekening}
                    </code>
                  </p>
                  <p>
                    <span className="text-slate-400">Atas Nama:</span> {selectedMitra.bank.atasNama}
                  </p>
                  <p className="text-[10px] text-slate-400 italic">
                    Digunakan untuk transfer dana lelang & pesanan setelah dipotong komisi eCupFish.
                  </p>
                </div>
              </div>

              {/* Dokumen Verifikasi (KTP & Farm Photo) */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  Pratinjau Dokumen Identitas & Farm
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* KTP */}
                  <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-slate-700">Foto KTP Pemilik</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                        NIK: {selectedMitra.dokumen.nik}
                      </span>
                    </div>
                    <div className="relative h-36 bg-slate-200 rounded-lg overflow-hidden border border-slate-300">
                      <img
                        src={selectedMitra.dokumen.fotoKtp}
                        alt="KTP"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Foto Farm */}
                  <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-slate-700">Foto Lokasi Budidaya / Farm</span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">
                        Fisik Terverifikasi
                      </span>
                    </div>
                    <div className="relative h-36 bg-slate-200 rounded-lg overflow-hidden border border-slate-300">
                      <img
                        src={selectedMitra.dokumen.fotoFarm}
                        alt="Foto Farm"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Spesialisasi */}
              <div>
                <p className="font-semibold text-slate-800 mb-1.5">Fokus Jenis Ikan Cupang:</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedMitra.spesialisasi.map((sp) => (
                    <span
                      key={sp}
                      className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 font-semibold rounded-lg text-xs"
                    >
                      {sp}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer / Action Buttons */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => onSelectMitra(null)}
                className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
              >
                Tutup
              </button>

              <div className="flex items-center gap-2">
                {selectedMitra.status === "menunggu_verifikasi" && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setRejectModalMitra(selectedMitra);
                      }}
                      className="px-4 py-2 bg-rose-50 text-rose-700 border border-rose-300 hover:bg-rose-100 font-semibold rounded-xl text-xs transition-colors"
                    >
                      Tolak Pengajuan
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onApproveMitra(selectedMitra.id);
                        onSelectMitra(null);
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm"
                    >
                      Setujui Kemitraan Sekarang
                    </button>
                  </>
                )}

                {selectedMitra.status === "aktif" && (
                  <button
                    type="button"
                    onClick={() => {
                      setSuspendModalMitra(selectedMitra);
                    }}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-xs transition-colors"
                  >
                    Tangguhkan Akun Mitra
                  </button>
                )}

                {selectedMitra.status === "ditangguhkan" && (
                  <button
                    type="button"
                    onClick={() => {
                      onUnsuspendMitra(selectedMitra.id);
                      onSelectMitra(null);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-colors"
                  >
                    Buka Penangguhan (Aktifkan)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Suspend Mitra */}
      {suspendModalMitra && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <ShieldAlert className="w-6 h-6" />
              <h3 className="font-bold text-base text-slate-900">Tangguhkan Akun Mitra</h3>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Anda akan menangguhkan akun <strong>{suspendModalMitra.namaFarm}</strong>. Mitra ini tidak
              akan dapat membuka lelang atau menerima pesanan baru sampai penangguhan dibuka.
            </p>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alasan Penangguhan:
            </label>
            <textarea
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              placeholder="Contoh: Terindikasi kirim ikan tidak sesuai spek / menolak konfirmasi pesanan lelang."
              rows={3}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-rose-500 mb-4"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSuspendModalMitra(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onSuspendMitra(suspendModalMitra.id, suspendReason || "Ditangguhkan oleh Super Admin.");
                  setSuspendModalMitra(null);
                  if (selectedMitra?.id === suspendModalMitra.id) {
                    onSelectMitra(null);
                  }
                  setSuspendReason("");
                }}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs"
              >
                Konfirmasi Penangguhan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tolak Verifikasi Mitra */}
      {rejectModalMitra && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <XCircle className="w-6 h-6" />
              <h3 className="font-bold text-base text-slate-900">Tolak Pendaftaran Kemitraan</h3>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Tolak pengajuan dari <strong>{rejectModalMitra.namaFarm}</strong>. Berikan catatan agar
              calon mitra dapat melengkapi berkasnya kembali.
            </p>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alasan Penolakan:
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Contoh: Foto KTP buram dan tidak terbaca, mohon unggah ulang foto asli beresolusi tinggi."
              rows={3}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-rose-500 mb-4"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectModalMitra(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onRejectMitra(rejectModalMitra.id, rejectReason || "Berkas tidak memenuhi syarat verifikasi.");
                  setRejectModalMitra(null);
                  if (selectedMitra?.id === rejectModalMitra.id) {
                    onSelectMitra(null);
                  }
                  setRejectReason("");
                }}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs"
              >
                Kirim Penolakan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Mitra Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 bg-[#0B1A30] text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white">Daftarkan Pembudidaya (Mitra) Baru</h3>
                <p className="text-xs text-slate-300">Tambahkan akun farm mitra langsung oleh Super Admin</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMitra} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Usaha / Farm <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formNamaFarm}
                    onChange={(e) => setFormNamaFarm(e.target.value)}
                    placeholder="Contoh: Kediri Betta Royal"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Pemilik Farm <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formNamaPemilik}
                    onChange={(e) => setFormNamaPemilik(e.target.value)}
                    placeholder="Nama Lengkap KTP"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Email Mitra <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="mitra@ecupfish.id"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nomor WhatsApp / Telp
                  </label>
                  <input
                    type="text"
                    value={formTelepon}
                    onChange={(e) => setFormTelepon(e.target.value)}
                    placeholder="081234567890"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kota Asal</label>
                  <input
                    type="text"
                    value={formKota}
                    onChange={(e) => setFormKota(e.target.value)}
                    placeholder="Kediri / Bogor / Solo"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Provinsi</label>
                  <select
                    value={formProvinsi}
                    onChange={(e) => setFormProvinsi(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-hidden"
                  >
                    <option value="Jawa Timur">Jawa Timur</option>
                    <option value="Jawa Barat">Jawa Barat</option>
                    <option value="Jawa Tengah">Jawa Tengah</option>
                    <option value="DKI Jakarta">DKI Jakarta</option>
                    <option value="Banten">Banten</option>
                    <option value="DI Yogyakarta">DI Yogyakarta</option>
                    <option value="Sumatera Utara">Sumatera Utara</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alamat Lengkap Farm</label>
                <input
                  type="text"
                  value={formAlamat}
                  onChange={(e) => setFormAlamat(e.target.value)}
                  placeholder="Jl. Raya Perikanan RT 02/05"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bank Pencairan</label>
                  <select
                    value={formBank}
                    onChange={(e) => setFormBank(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-hidden"
                  >
                    <option value="BCA">BCA</option>
                    <option value="Mandiri">Mandiri</option>
                    <option value="BRI">BRI</option>
                    <option value="BNI">BNI</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Nomor Rekening</label>
                  <input
                    type="text"
                    value={formRekening}
                    onChange={(e) => setFormRekening(e.target.value)}
                    placeholder="1234567890"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Spesialisasi Ikan (pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={formSpesialisasi}
                  onChange={(e) => setFormSpesialisasi(e.target.value)}
                  placeholder="Plakat Koi, Halfmoon, Blue Rim"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0B1A30] hover:bg-[#142D52] text-white font-semibold rounded-xl text-xs shadow-xs"
                >
                  Simpan & Daftarkan Mitra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
