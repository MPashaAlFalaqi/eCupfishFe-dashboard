import type { Ikan } from "@/lib/types";

// Simpan sebagai: src/lib/products.ts
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
  ageMonths: number | null;
  price: number;
  stock: number;
  lowStockThreshold: number;
  autoStatus: boolean;
  status: "AVAILABLE" | "SOLD_OUT" | "INACTIVE";
  listed: boolean;
  tankLocation: string | null;
  healthDescription: string | null;
  notes: string | null;
  ratingAvg: number;
  reviewCount: number;
  seller: { id: number; name: string | null };
  media: ApiMedia[];
}

export const GRADE_LABEL = { CONTEST: "Contest", PLAYER: "Player", PET: "Pet" } as const;

// Menerjemahkan data API ke bentuk Ikan yang dipakai StokTable.
// Catatan: StokTable menampilkan `varian` di bawah nama ikan, jadi diisi lokasi akuarium
// (bila kosong, tampilkan tipe Contest/Player/Pet).
export function toIkan(p: ApiProduct): Ikan {
  return {
    id: String(p.id),
    nama: p.name,
    jenis: p.category,
    varian: p.tankLocation || GRADE_LABEL[p.grade],
    grade: (p.tier ?? "C") as Ikan["grade"],
    usia: p.ageMonths ?? 0,
    stok: p.stock,
    harga: p.price,
    publish: p.listed,
    status: p.status === "AVAILABLE" ? "Tersedia" : "Habis",
    kesehatan: p.healthDescription ?? "",
    warna: "blue",
  };
}