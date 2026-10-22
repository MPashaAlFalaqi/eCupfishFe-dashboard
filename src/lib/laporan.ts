import { REFERENSI } from "./periode";
import { rp } from "./format";

export type JenisTrx = "Pendapatan" | "Pengeluaran";
export interface Trx { tanggal: Date; jenis: JenisTrx; kategori: string; produk: string; sumber: "Lelang" | "Beli langsung" | ""; jumlah: number }
export const PRODUK: [string, number][] = [["Halfmoon Merah", 85000], ["Giant Blue Rim", 120000], ["Plakat Koi Galaxy", 55000], ["Serit Avatar", 40000], ["Nemo Galaxy", 65000]];
export const MULAI_DATA = new Date(2026, 6, 1);

function mulberry32(a: number) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

// Data contoh deterministik (1 Jul – 5 Okt 2026). Ganti dengan data dari API saat backend siap.
function buat(): Trx[] {
  const r = mulberry32(2026), out: Trx[] = [];
  for (let d = new Date(MULAI_DATA); d <= REFERENSI; d.setDate(d.getDate() + 1)) {
    const tanggal = new Date(d), hari = tanggal.getDate(), n = Math.floor(r() * 4);
    for (let i = 0; i < n; i++) {
      const [produk, harga] = PRODUK[Math.floor(r() * PRODUK.length)], lelang = r() < 0.35, qty = 3 + Math.floor(r() * 22);
      out.push({ tanggal, jenis: "Pendapatan", kategori: "Penjualan", produk, sumber: lelang ? "Lelang" : "Beli langsung", jumlah: Math.round((harga * qty * (lelang ? 1.15 : 1)) / 1000) * 1000 });
    }
    const keluar = (kategori: string, jumlah: number) => out.push({ tanggal, jenis: "Pengeluaran", kategori, produk: "", sumber: "", jumlah: Math.round(jumlah / 1000) * 1000 });
    if (hari % 3 === 0) keluar("Pakan", 250000 + r() * 350000);
    if (hari % 7 === 0) keluar("Obat & Vitamin", 150000 + r() * 200000);
    if (hari === 1) keluar("Gaji & Upah", 2500000);
    if (hari === 25) keluar("Listrik & Air", 900000 + r() * 300000);
    if (n > 0 && r() < 0.5) keluar("Packing", 60000 + r() * 90000);
  }
  return out;
}
export const transaksi = buat();
export const rpRingkas = (n: number) => (Math.abs(n) >= 1e6 ? `${n < 0 ? "-" : ""}Rp ${(Math.abs(n) / 1e6).toFixed(1).replace(".", ",")} jt` : rp(n));
