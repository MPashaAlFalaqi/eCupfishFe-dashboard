export type Grade = "A" | "B" | "C";
export type StatusStok = "Tersedia" | "Habis";
export interface Ikan { id: string; harga: number; publish: boolean; nama: string; jenis: string; warna: "blue" | "gold" | "navy"; varian: string; grade: Grade; usia: number; stok: number; status: StatusStok; kesehatan: string; }
export type StatusKirim = "Diproses" | "Dalam Pengiriman" | "Diterima" | "Terlambat";
export interface Pengiriman { id: string; pembeli: string; ikan: string; kurir: string; resi: string; grade: string; tanggalKirim: string; alamat: string; telp: string; berat: number; status: StatusKirim; }
export type StatusKlaim = "Pending" | "Disetujui" | "Ditolak";
export interface Klaim { id: string; pembeli: string; ikan: string; tanggal: string; alasan: string; status: StatusKlaim; pesanan: string; bermasalah: number; total: number; nilai: number; batas?: string }

export type StatusPesanan = "Menunggu Bayar" | "Dibayar" | "Dikemas" | "Dikirim" | "Selesai" | "Dibatalkan";
export interface Pesanan { id: string; pembeli: string; alamat: string; ikan: string; jumlah: number; hargaSatuan: number; ongkir: number; sumber: "Beli langsung" | "Lelang"; metode: string; tanggal: string; status: StatusPesanan; }

export type StatusSesi = "Live" | "Terjadwal" | "Draft" | "Selesai" | "Dibatalkan";
export interface Bid { nama: string; jumlah: number; waktu: string }
export interface SesiLelang { id: string; produk: string; grade: string; hargaAwal: number; kelipatan: number; status: StatusSesi; sisaDetik: number; jadwal: string; bids: Bid[]; pemenang?: string; bayar?: "Menunggu Bayar" | "Dibayar" | "Gagal Bayar" }
export interface Pesan { dari: "pembeli" | "penjual"; teks: string; waktu: string }
export interface Percakapan { id: string; nama: string; produk: string; harga: string; belumDibaca: number; terakhir: string; pesan: Pesan[] }
export interface Pembayaran { id: string; tanggal: string; pesanan: string; pembeli: string; metode: string; kotor: number; komisi: number; gateway: number; status: "Dalam Proses" | "Diteruskan" | "Dikembalikan"; estimasi: string }
export interface Notif { id: string; jenis: "Pesanan" | "Lelang" | "Klaim" | "Stok" | "Pesan"; judul: string; isi: string; waktu: string; grup: "Hari ini" | "Kemarin"; href: string; dibaca: boolean }

export interface Ulasan { id: string; nama: string; produk: string; bintang: 1 | 2 | 3 | 4 | 5; komentar: string; tags: string[]; foto: number; tanggal: string; balasan?: string; dilaporkan?: boolean }
