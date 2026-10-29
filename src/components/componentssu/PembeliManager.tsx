"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  Search,
  Filter,
  Plus,
  Ban,
  ShieldCheck,
  ShieldAlert,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  Gavel,
  Download,
  ExternalLink,
  X,
  UserCheck,
  UserX,
  History,
  AlertCircle
} from "lucide-react";
import { Pembeli } from "@/data/mockData";

interface PembeliManagerProps {
  pembeliList: Pembeli[];
  selectedBuyer: Pembeli | null;
  onSelectBuyer: (buyer: Pembeli | null) => void;
  onBlockBuyer: (id: string, reason: string) => void;
  onUnblockBuyer: (id: string) => void;
  onAddBuyer: (newBuyer: Omit<Pembeli, "id" | "statistik" | "terakhirLogin">) => void;
}

export const PembeliManager: React.FC<PembeliManagerProps> = ({
  pembeliList,
  selectedBuyer,
  onSelectBuyer,
  onBlockBuyer,
  onUnblockBuyer,
  onAddBuyer,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("spending");
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [blockModalBuyer, setBlockModalBuyer] = useState<Pembeli | null>(null);
  const [blockReason, setBlockReason] = useState<string>("");

  // New Buyer Form
  const [formNama, setFormNama] = useState("");
  const [formUsername, setFormUsername] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formTelepon, setFormTelepon] = useState("");
  const [formKota, setFormKota] = useState("");
  const [formProvinsi, setFormProvinsi] = useState("DKI Jakarta");
  const [formAlamat, setFormAlamat] = useState("");

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Filter & Sort
  const filteredList = useMemo(() => {
    return pembeliList
      .filter((b) => {
        if (filterStatus === "all") return true;
        return b.status === filterStatus;
      })
      .filter((b) => {
        const query = searchQuery.toLowerCase();
        return (
          b.namaLengkap.toLowerCase().includes(query) ||
          b.username.toLowerCase().includes(query) ||
          b.email.toLowerCase().includes(query) ||
          b.kota.toLowerCase().includes(query) ||
          b.telepon.includes(query)
        );
      })
      .sort((a, b) => {
        if (sortBy === "spending") return b.statistik.totalTransaksiRp - a.statistik.totalTransaksiRp;
        if (sortBy === "orders") return b.statistik.totalPesanan - a.statistik.totalPesanan;
        if (sortBy === "name") return a.namaLengkap.localeCompare(b.namaLengkap);
        return 0;
      });
  }, [pembeliList, filterStatus, searchQuery, sortBy]);

  const countAll = pembeliList.length;
  const countActive = pembeliList.filter((b) => b.status === "aktif").length;
  const countBlocked = pembeliList.filter((b) => b.status === "diblokir").length;

  const handleCreateBuyer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNama || !formEmail) {
      alert("Harap lengkapi nama dan email!");
      return;
    }

    onAddBuyer({
      namaLengkap: formNama,
      username: formUsername || formNama.toLowerCase().replace(/\s+/g, "_"),
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
      email: formEmail,
      telepon: formTelepon || "081299998888",
      kota: formKota || "Jakarta",
      provinsi: formProvinsi,
      alamatUtama: formAlamat || "Jl. Contoh Pembeli No. 1",
      tanggalDaftar: "Hari ini",
      status: "aktif",
    });

    setIsAddModalOpen(false);
    setFormNama("");
    setFormUsername("");
    setFormEmail("");
    setFormTelepon("");
    setFormKota("");
    setFormAlamat("");
  };

  const exportCSV = () => {
    const headers = ["ID,Nama Lengkap,Username,Email,Telepon,Kota,Status,Total Pesanan,Total Belanja (Rp)\n"];
    const rows = pembeliList.map(
      (b) =>
        `"${b.id}","${b.namaLengkap}","${b.username}","${b.email}","${b.telepon}","${b.kota}","${b.status}","${b.statistik.totalPesanan}","${b.statistik.totalTransaksiRp}"\n`
    );
    const blob = new Blob([...headers, ...rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "daftar-akun-pembeli-ecupfish.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Kelola Akun Pembeli
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pantau aktivitas pembeli, riwayat lelang, dan tertibkan akun yang melanggar aturan lelang (bid & run).
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
            <span>Tambah Akun Pembeli</span>
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
            Semua Pembeli ({countAll})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus("aktif")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              filterStatus === "aktif"
                ? "bg-emerald-600 text-white"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
            }`}
          >
            Pembeli Aktif ({countActive})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus("diblokir")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              filterStatus === "diblokir"
                ? "bg-rose-600 text-white"
                : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            Akun Diblokir ({countBlocked})
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
              placeholder="Cari nama, username, email, WhatsApp..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-slate-400 font-medium">Urutkan:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Urutkan Pembeli"
              className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="spending">Total Belanja Tertinggi</option>
              <option value="orders">Pesanan Terbanyak</option>
              <option value="name">Nama Lengkap (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl bg-white shadow-xs border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">DATA PEMBELI</th>
                <th className="py-3 px-4">KONTAK & KOTA</th>
                <th className="py-3 px-4">AKTIVITAS BELANJA</th>
                <th className="py-3 px-4">LELANG DIMENANGKAN</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredList.map((buyer) => (
                <tr key={buyer.id} className="hover:bg-slate-50/80 transition-colors group">
                  {/* Avatar & Profile */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                        <img
                          src={buyer.avatar}
                          alt={buyer.namaLengkap}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{buyer.namaLengkap}</p>
                        <p className="text-[11px] text-blue-600 font-medium">@{buyer.username}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Gabung: {buyer.tanggalDaftar}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Kontak & Lokasi */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <p className="font-medium text-slate-800 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {buyer.kota}, {buyer.provinsi}
                      </p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-emerald-500" />
                        {buyer.telepon}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate max-w-[170px]">
                        {buyer.email}
                      </p>
                    </div>
                  </td>

                  {/* Belanja */}
                  <td className="py-3.5 px-4">
                    <div>
                      <p className="font-bold text-slate-900">
                        {formatRupiah(buyer.statistik.totalTransaksiRp)}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                        <ShoppingBag className="w-3 h-3 text-blue-500" />
                        {buyer.statistik.totalPesanan} transaksi selesai
                      </p>
                    </div>
                  </td>

                  {/* Lelang */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                        <Gavel className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">
                          {buyer.statistik.lelangDimenangkan} lelang
                        </p>
                        <p className="text-[10px] text-slate-400">
                          dari {buyer.statistik.lelangDimasuki} sesi diikuti
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    {buyer.status === "aktif" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#DCFCE7] text-[#15803D]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span>
                        Aktif
                      </span>
                    )}
                    {buyer.status === "diblokir" && (
                      <div>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FEE2E2] text-[#B91C1C]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]"></span>
                          Diblokir
                        </span>
                        {buyer.alasanStatus && (
                          <p className="text-[10px] text-rose-600 mt-0.5 line-clamp-1 max-w-[160px]" title={buyer.alasanStatus}>
                            {buyer.alasanStatus}
                          </p>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Aksi */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onSelectBuyer(buyer)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition-colors"
                      >
                        Detail
                      </button>

                      {buyer.status === "aktif" ? (
                        <button
                          type="button"
                          onClick={() => setBlockModalBuyer(buyer)}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-lg text-xs transition-colors border border-rose-200"
                          title="Blokir Akun Pembeli"
                        >
                          Blokir
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onUnblockBuyer(buyer.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition-colors shadow-2xs"
                          title="Buka Blokir Akun"
                        >
                          Buka Blokir
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredList.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">Tidak ada pembeli yang sesuai</p>
                    <p className="text-xs mt-1">Sesuaikan kata kunci pencarian atau status filter.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail Pembeli */}
      {selectedBuyer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-5 bg-[#0B1A30] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400">
                  <img
                    src={selectedBuyer.avatar}
                    alt={selectedBuyer.namaLengkap}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">{selectedBuyer.namaLengkap}</h3>
                  <p className="text-xs text-amber-300">
                    @{selectedBuyer.username} · ID: {selectedBuyer.id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onSelectBuyer(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 text-xs text-slate-700">
              {/* Status Alert */}
              <div
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  selectedBuyer.status === "aktif"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-rose-50 border-rose-200 text-rose-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span className="font-bold uppercase tracking-wider text-[11px]">
                    Status Akun: {selectedBuyer.status}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500">
                  Login Terakhir: {selectedBuyer.terakhirLogin}
                </span>
              </div>

              {selectedBuyer.alasanStatus && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 space-y-1">
                  <p className="font-bold text-[11px] flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                    Catatan Pelanggaran / Alasan Pemblokiran:
                  </p>
                  <p className="text-xs">{selectedBuyer.alasanStatus}</p>
                </div>
              )}

              {/* Data Kontak & Alamat Pengiriman */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 border-b pb-1.5 border-slate-200">
                  Informasi Kontak & Pengiriman Ikan
                </h4>
                <p>
                  <span className="text-slate-400">Email:</span> {selectedBuyer.email}
                </p>
                <p>
                  <span className="text-slate-400">Nomor WhatsApp:</span> {selectedBuyer.telepon}
                </p>
                <p>
                  <span className="text-slate-400">Kota Domisili:</span> {selectedBuyer.kota},{" "}
                  {selectedBuyer.provinsi}
                </p>
                <p>
                  <span className="text-slate-400">Alamat Pengiriman:</span> {selectedBuyer.alamatUtama}
                </p>
              </div>

              {/* Statistik Belanja & Lelang */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-xl">
                  <p className="text-[11px] text-blue-600 font-semibold">Total Transaksi Selesai</p>
                  <p className="text-lg font-bold text-blue-950 mt-1">
                    {formatRupiah(selectedBuyer.statistik.totalTransaksiRp)}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {selectedBuyer.statistik.totalPesanan} paket pesanan
                  </p>
                </div>

                <div className="p-3.5 bg-amber-50/50 border border-amber-100 rounded-xl">
                  <p className="text-[11px] text-amber-700 font-semibold">Kemenangan Lelang</p>
                  <p className="text-lg font-bold text-amber-950 mt-1">
                    {selectedBuyer.statistik.lelangDimenangkan} sesi
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Dari {selectedBuyer.statistik.lelangDimasuki} partisipasi lelang
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onSelectBuyer(null)}
                className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs"
              >
                Tutup
              </button>

              <div>
                {selectedBuyer.status === "aktif" ? (
                  <button
                    type="button"
                    onClick={() => {
                      setBlockModalBuyer(selectedBuyer);
                    }}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-xs"
                  >
                    Blokir Akun Pembeli Ini
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      onUnblockBuyer(selectedBuyer.id);
                      onSelectBuyer(null);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-xs"
                  >
                    Buka Blokir (Aktifkan Kembali)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Blokir Pembeli */}
      {blockModalBuyer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <Ban className="w-6 h-6" />
              <h3 className="font-bold text-base text-slate-900">Blokir Akun Pembeli</h3>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Anda akan memblokir pembeli <strong>{blockModalBuyer.namaLengkap}</strong> (@
              {blockModalBuyer.username}). Akun ini tidak akan dapat login, melakukan penawaran lelang,
              ataupun memesan ikan cupang dari semua mitra.
            </p>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alasan Pemblokiran Akun:
            </label>
            <textarea
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              placeholder="Contoh: Terbukti 3 kali bid and run lelang, menolak membayar transaksi lelang yang sudah dimenangkan."
              rows={3}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-rose-500 mb-4"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setBlockModalBuyer(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onBlockBuyer(
                    blockModalBuyer.id,
                    blockReason || "Melanggar syarat & ketentuan transaksi lelang eCupFish."
                  );
                  setBlockModalBuyer(null);
                  if (selectedBuyer?.id === blockModalBuyer.id) {
                    onSelectBuyer(null);
                  }
                  setBlockReason("");
                }}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs"
              >
                Konfirmasi Blokir Akun
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Pembeli Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 bg-[#0B1A30] text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white">Daftarkan Akun Pembeli Baru</h3>
                <p className="text-xs text-slate-300">Pendaftaran manual akun pembeli oleh Super Admin</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBuyer} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formNama}
                    onChange={(e) => setFormNama(e.target.value)}
                    placeholder="Nama Lengkap Pembeli"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={formUsername}
                    onChange={(e) => setFormUsername(e.target.value)}
                    placeholder="nama_user"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="pembeli@gmail.com"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor WhatsApp</label>
                  <input
                    type="text"
                    value={formTelepon}
                    onChange={(e) => setFormTelepon(e.target.value)}
                    placeholder="08123456789"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kota</label>
                  <input
                    type="text"
                    value={formKota}
                    onChange={(e) => setFormKota(e.target.value)}
                    placeholder="Jakarta / Bandung / Surabaya"
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
                    <option value="DKI Jakarta">DKI Jakarta</option>
                    <option value="Jawa Barat">Jawa Barat</option>
                    <option value="Jawa Timur">Jawa Timur</option>
                    <option value="Jawa Tengah">Jawa Tengah</option>
                    <option value="Banten">Banten</option>
                    <option value="DI Yogyakarta">DI Yogyakarta</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alamat Pengiriman Utama</label>
                <textarea
                  value={formAlamat}
                  onChange={(e) => setFormAlamat(e.target.value)}
                  placeholder="Jl. Mawar No. 12 RT 04/01, Kelurahan..."
                  rows={2}
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
                  Simpan & Buat Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
