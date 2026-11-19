"use client";

import { useEffect, useState } from "react";
import { ScanSearch, Sparkles } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useToast } from "@/components/Toast";
import { Button, Card } from "@/components/ui";

// Sesuaikan path endpoint ini jika route AI scan di backend Anda memakai nama lain
const SCAN_ENDPOINT = "/api/seller/products/scan";

export interface HasilScanIkan {
  jenis?: string;
  category?: string;
  categoryId?: number;
  polaWarna?: string;
  colorPattern?: string;
  grade?: string;
  tier?: string;
  kesehatan?: string;
  healthDescription?: string;
}

interface AiScannerProps {
  fileFoto?: File | null;
  onHasil?: (hasil: HasilScanIkan) => void;
  onTerapkan?: (teks: string) => void;
}

export default function AiScanner({
  fileFoto,
  onHasil,
  onTerapkan,
}: AiScannerProps) {
  const toast = useToast();
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");

  const activeFile = localFile ?? (fileFoto instanceof Blob ? (fileFoto as File) : null);

  useEffect(() => {
    if (!activeFile || !(activeFile instanceof Blob)) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(activeFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [activeFile]);

  const handleScan = async () => {
    if (!activeFile) {
      setError("Pilih atau unggah foto ikan terlebih dahulu.");
      return;
    }

    setError("");
    setScanning(true);

    try {
      const formData = new FormData();
      formData.append("file", activeFile);

      const res = await api<Record<string, unknown>>(SCAN_ENDPOINT, {
        method: "POST",
        body: formData,
      });

      const hasil = (res.data ?? res) as HasilScanIkan;
      onHasil?.(hasil);

      const deskripsi = hasil.healthDescription ?? hasil.kesehatan;
      if (deskripsi) {
        onTerapkan?.(deskripsi);
      }

      toast("Foto berhasil dipindai dan kolom terisi otomatis");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Gagal memindai foto ikan. Pastikan backend aktif."
      );
    } finally {
      setScanning(false);
    }
  };

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-secondary-600" />
            <h3 className="font-semibold">Deteksi Otomatis Foto Ikan</h3>
          </div>
          <p className="text-xs text-primary-500">
            Analisis foto pertama untuk mengisi jenis, pola warna, grade, dan tier.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleScan}
          disabled={!activeFile || scanning}
          className="!bg-primary-950 hover:!bg-primary-900"
        >
          <ScanSearch size={16} />
          {scanning ? "Memindai..." : "Pindai Foto"}
        </Button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg border border-primary-100 bg-primary-50/50 p-3">
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Pratinjau foto ikan"
            className="h-14 w-14 rounded-lg border border-primary-100 object-cover"
          />
        )}
        <div className="min-w-0 flex-1">
          {activeFile && (
            <p className="mb-1 truncate text-xs font-medium text-primary-700">
              {activeFile.name}
            </p>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0] ?? null;
              setLocalFile(f);
              setError("");
            }}
            className="text-xs text-primary-600"
          />
        </div>
      </div>

      {error && (
        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
          {error}
        </div>
      )}
    </Card>
  );
}