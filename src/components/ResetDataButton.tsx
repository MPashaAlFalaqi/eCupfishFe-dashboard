"use client";

import { useState } from "react";
import { RotateCcw, Trash2, Database, AlertCircle } from "lucide-react";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui";
import { useToast } from "@/components/Toast";
import { useDashboardData } from "@/components/DashboardDataProvider";

interface ResetDataButtonProps {
  className?: string;
  label?: string;
}

export default function ResetDataButton({
  className,
  label = "Reset Data",
}: ResetDataButtonProps) {
  const [open, setOpen] = useState(false);
  const { resetSemuaData, setSemuaDataNol } = useDashboardData();
  const toast = useToast();

  const handleResetDefault = () => {
    resetSemuaData();
    toast("Semua data berhasil dipulihkan ke setelan awal default!");
    setOpen(false);
  };

  const handleResetNol = () => {
    setSemuaDataNol();
    toast("Semua data pesanan, pengiriman & lelang berhasil dikosongkan (0)!");
    setOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen(true)}
        className={className || "!px-3.5 !py-2 text-xs sm:text-sm font-medium border-primary-200 text-primary-700 hover:bg-primary-50"}
        title="Reset data ke default atau kosongkan ke 0"
      >
        <RotateCcw size={15} className="shrink-0" />
        <span>{label}</span>
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        size="max-w-md"
        title="Reset & Kelola Data"
        subtitle="Pilih opsi reset data untuk simulasi atau demonstrasi aplikasi"
        icon={
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-100 text-primary-600">
            <Database size={18} />
          </div>
        }
        footer={
          <Button variant="outline" onClick={() => setOpen(false)}>
            Batal
          </Button>
        }
      >
        <div className="space-y-3">
          {/* Opsi 1: Reset ke default */}
          <div className="rounded-xl border border-primary-100 bg-white p-3.5 transition-all hover:border-primary-300 hover:shadow-sm">
            <div className="flex items-start gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary-50 text-primary-600">
                <RotateCcw size={17} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-primary-950">
                  Reset ke Data Default
                </p>
                <p className="mt-0.5 text-xs text-primary-500 leading-relaxed">
                  Kembalikan seluruh varian stok ikan, daftar pesanan, pengiriman terintegrasi, sesi lelang aktif, dan ulasan ke data demo lengkap.
                </p>
                <Button
                  variant="primary"
                  onClick={handleResetDefault}
                  className="mt-2.5 !px-3 !py-1 text-xs"
                >
                  <RotateCcw size={13} />
                  Pulihkan Data Default
                </Button>
              </div>
            </div>
          </div>

          {/* Opsi 2: Set ke 0 / Kosongkan */}
          <div className="rounded-xl border border-red-100 bg-red-50/30 p-3.5 transition-all hover:border-red-300 hover:shadow-sm">
            <div className="flex items-start gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-red-100 text-red-600">
                <Trash2 size={17} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-red-700">
                  Kosongkan Data (Set ke 0)
                </p>
                <p className="mt-0.5 text-xs text-red-600/80 leading-relaxed">
                  Kosongkan semua pesanan, riwayat kirim, sesi lelang, dan setel stok ikan menjadi 0 (simulasi kondisi awal toko baru).
                </p>
                <button
                  type="button"
                  onClick={handleResetNol}
                  className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={13} />
                  Set Seluruh Data Jadi 0
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-2.5 text-xs text-slate-500">
            <AlertCircle size={15} className="shrink-0 text-slate-400" />
            <span>Perubahan data tersimpan di penyimpanan browser (Local Storage).</span>
          </div>
        </div>
      </Modal>
    </>
  );
}
