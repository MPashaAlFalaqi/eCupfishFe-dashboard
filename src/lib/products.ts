import type { Ikan } from "@/lib/types";

export interface ApiMedia {
  id: number;
  type: "PHOTO" | "VIDEO";
  url: string;
  isCover: boolean;
}

export interface ApiProduct {
  id: number;
  name: string;
  category: string;
  categorySlug: string;
  categoryId: number;
  grade: "CONTEST" | "PLAYER" | "PET";
  tier: string | null;
  colorPattern?: string | null;
  aiConfidence?: number | null;
  ageMonths: number | null;
  price: number;
  stock: number;
  sellableStock?: number;
  lowStockThreshold: number;
  autoStatus: boolean;
  strictThreshold?: boolean;
  isLowStock?: boolean;
  status: "AVAILABLE" | "LOW_STOCK" | "SOLD_OUT" | "INACTIVE";
  listed: boolean;
  tankLocation: string | null;
  healthDescription: string | null;
  notes: string | null;
  ratingAvg: number;
  reviewCount: number;
  seller: { id: number; name: string | null };
  media: ApiMedia[];
}

export const GRADE_LABEL = {
  CONTEST: "Contest",
  PLAYER: "Player",
  PET: "Pet",
} as const;

export function toIkan(p: ApiProduct): Ikan {
  const status: Ikan["status"] =
    p.status === "AVAILABLE"
      ? "Tersedia"
      : p.status === "LOW_STOCK"
      ? "Menipis"
      : "Habis";

  return {
    id: String(p.id),
    nama: p.name,
    jenis: p.category,
    varian: GRADE_LABEL[p.grade],
    grade: (p.tier ?? "C") as Ikan["grade"],
    usia: p.ageMonths ?? 0,
    stok: p.stock,
    ambangBatas: p.lowStockThreshold,
    otomatis: p.autoStatus,
    kunciAmbang: p.strictThreshold ?? false,
    harga: p.price,
    publish: p.listed,
    status,
    kesehatan: p.healthDescription ?? "",
    warna: "blue",
  };
}