"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import IkanForm from "../../_components/IkanForm";
import { api, ApiError } from "@/lib/api";
import type { ApiProduct } from "@/lib/products";

// Simpan sebagai: src/app/(dashboard)/stok/[id]/edit/page.tsx
export default function EditIkanPage() {
  const { id } = useParams<{ id: string }>();
  const [produk, setProduk] = useState<ApiProduct | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ data: ApiProduct }>(`/api/seller/products/${id}`)
      .then((r) => setProduk(r.data))
      .catch((e) => setError(e instanceof ApiError ? e.message : "Gagal memuat data ikan."));
  }, [id]);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!produk) return <p className="text-sm text-primary-400">Memuat data ikan...</p>;
  return <IkanForm produk={produk} />;
}
