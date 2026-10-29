"use client";

import React, { useState } from "react";
import { Shield, Key, Bell, Save, Check } from "lucide-react";

export const SettingsView: React.FC = () => {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Pengaturan Super Admin
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Konfigurasi akun administrator utama dan aturan moderasi akun eCupFish.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs text-slate-700">
        {/* Admin Profile Card */}
        <div className="rounded-2xl bg-white p-6 shadow-xs border border-slate-200/80 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" /> Profil Super Admin
          </h3>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#0B1A30] text-amber-400 font-bold text-xl flex items-center justify-center ring-4 ring-slate-100">
              PA
            </div>
            <div>
              <p className="font-bold text-sm text-slate-900">Pasha Syahputra</p>
              <p className="text-xs text-slate-500">Super Administrator (Owner / Sistem eCupFish)</p>
              <span className="inline-block mt-1 text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Hak Akses Penuh
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Administrator</label>
              <input
                type="email"
                defaultValue="superadmin@ecupfish.id"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nomor WhatsApp Darurat</label>
              <input
                type="text"
                defaultValue="081234567890"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Security & Rules Card */}
        <div className="rounded-2xl bg-white p-6 shadow-xs border border-slate-200/80 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-500" /> Kebijakan Moderasi Akun
          </h3>

          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="mt-1 rounded text-blue-600 focus:ring-0"
              />
              <div>
                <p className="font-bold text-slate-800">
                  Wajibkan verifikasi manual KTP & Foto Farm sebelum mitra bisa jualan lelang
                </p>
                <p className="text-[11px] text-slate-500">
                  Mitra baru yang mendaftar akan berstatus 'Menunggu Verifikasi' sampai disetujui Super Admin.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="mt-1 rounded text-blue-600 focus:ring-0"
              />
              <div>
                <p className="font-bold text-slate-800">
                  Otomatis tandai pembeli sebagai tersangka jika 2x Bid and Run dalam sebulan
                </p>
                <p className="text-[11px] text-slate-500">
                  Mengirim peringatan otomatis ke dashboard Super Admin untuk tindakan pemblokiran.
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          {saved && (
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <Check className="w-4 h-4" /> Pengaturan berhasil disimpan
            </span>
          )}
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0B1A30] hover:bg-[#142D52] text-white font-semibold rounded-xl transition-colors shadow-xs"
          >
            <Save className="w-4 h-4 text-amber-400" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </form>
    </div>
  );
};
