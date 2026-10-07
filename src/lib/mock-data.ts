import type { Ikan } from "./types";
export const ikanList: Ikan[] = [
  { id: "1", harga: 85000, publish: true, nama: "Cupang Halfmoon Merah", jenis: "Halfmoon", warna: "blue", varian: "Akuarium A-01 · Sortir", grade: "A", usia: 4, stok: 320, status: "Tersedia", kesehatan: "Sehat, nafsu makan baik, tidak ada luka" },
  { id: "2", harga: 55000, publish: false, nama: "Cupang Plakat Koi", jenis: "Plakat", warna: "gold", varian: "Rak Toples B-02 · Karantina", grade: "B", usia: 3, stok: 0, status: "Habis", kesehatan: "Terjual habis pada lelang minggu lalu" },
  { id: "3", harga: 120000, publish: true, nama: "Cupang Giant Blue Rim", jenis: "Giant", warna: "navy", varian: "Akuarium A-03 · Display", grade: "A", usia: 7, stok: 185, status: "Tersedia", kesehatan: "Sehat, ukuran seragam, siap jual" },
  { id: "4", harga: 40000, publish: true, nama: "Cupang Serit Avatar", jenis: "Serit", warna: "gold", varian: "Akuarium C-01 · Sortir", grade: "C", usia: 5, stok: 410, status: "Tersedia", kesehatan: "Beberapa ekor lesu, dalam pemantauan" },
  { id: "5", harga: 65000, publish: true, nama: "Cupang Nemo Galaxy", jenis: "Nemo", warna: "blue", varian: "Rak Toples B-04 · Karantina", grade: "B", usia: 6, stok: 325, status: "Tersedia", kesehatan: "Sehat, kualitas air stabil" },
];
import type { Pengiriman } from "./types";
export const pengirimanList: Pengiriman[] = [
  { id: "#ORD-2298", alamat: "Jl. Raya Darmo No. 45, Surabaya", telp: "0812-3456-7801", berat: 3.5, pembeli: "Toko Ikan Segar Betta", ikan: "Cupang Giant Blue Rim · 25 ekor", kurir: "JNE Live Fish", resi: "12345678", grade: "A", tanggalKirim: "24 Sep 2026", status: "Dalam Pengiriman" },
  { id: "#ORD-2295", alamat: "Jl. Veteran No. 12, Malang", telp: "0813-9988-2210", berat: 6, pembeli: "CV Mina Sejahtera", ikan: "Cupang Serit Avatar · 60 ekor", kurir: "Kurir Tambak Sendiri", resi: "—", grade: "C", tanggalKirim: "25 Sep 2026", status: "Diproses" },
  { id: "#ORD-2291", alamat: "Jl. Pantai Indah No. 3, Banyuwangi", telp: "0857-1122-3344", berat: 4, pembeli: "Warung Ikan Bahari", ikan: "Cupang Halfmoon Merah · 40 ekor", kurir: "JNE Live Fish", resi: "12293841", grade: "A", tanggalKirim: "22 Sep 2026", status: "Terlambat" },
];
import type { Klaim } from "./types";
export const klaimList: Klaim[] = [
  { id: "CLM-1044", pesanan: "#PS-2091", bermasalah: 8, total: 40, nilai: 224000, batas: "1 hari 4 jam", pembeli: "Warung Ikan Bahari", ikan: "Cupang Giant Blue Rim · 8 ekor", tanggal: "25 Sep 2026", alasan: "Cupang mati saat tiba", status: "Pending" },
  { id: "CLM-1041", pesanan: "#PS-2081", bermasalah: 3, total: 15, nilai: 135000, pembeli: "Pakai Ikan Segar Jaya", ikan: "Cupang Giant Avatar · 15 ekor", tanggal: "24 Sep 2026", alasan: "Cacat fisik", status: "Disetujui" },
  { id: "CLM-1038", pesanan: "#PS-2079", bermasalah: 2, total: 5, nilai: 170000, pembeli: "CV Mina Sejahtera", ikan: "Cupang Halfmoon Merah · 5 ekor", tanggal: "20 Sep 2026", alasan: "Cupang mati saat tiba", status: "Ditolak" },
  { id: "CLM-1035", pesanan: "#PS-2085", bermasalah: 3, total: 12, nilai: 96000, batas: "6 jam", pembeli: "Toko Kurnitamur", ikan: "Cupang Nemo Galaxy · 12 ekor", tanggal: "18 Sep 2026", alasan: "Cupang mati saat tiba", status: "Pending" },
];
export const laporanMingguan = [
  { minggu: "Minggu 1", pendapatan: 10400000, pengeluaran: 4000000 },
  { minggu: "Minggu 2", pendapatan: 14200000, pengeluaran: 5100000 },
  { minggu: "Minggu 3", pendapatan: 7800000, pengeluaran: 4800000 },
  { minggu: "Minggu 4", pendapatan: 15700000, pengeluaran: 5600000 },
];
export const pesananTindakan = [
  { id: "PS-2091", ikan: "Halfmoon Blue Rim", pembeli: "Rina W.", total: "Rp 850.000", status: "Bayar", warna: "blue" },
  { id: "PS-2088", ikan: "Plakat Koi Galaxy", pembeli: "Doni A.", total: "Rp 420.000", status: "Kemas", warna: "gold" },
  { id: "PS-2085", ikan: "Giant Nemo Fancy", pembeli: "Sari M.", total: "Rp 1.250.000", status: "Kirim", warna: "blue" },
  { id: "PS-2081", ikan: "Crowntail Red Dragon", pembeli: "Eko P.", total: "Rp 600.000", status: "Klaim", warna: "gold" },
] as const;
export const stokMenipis = [
  { nama: "Halfmoon Blue Rim", qty: 3 }, { nama: "Crowntail Red Dragon", qty: 5 },
  { nama: "Plakat Koi Galaxy", qty: 7 }, { nama: "Giant Nemo Fancy", qty: 12 },
];

import type { Pesanan } from "./types";
export const pesananList: Pesanan[] = [
  { id: "#PS-2094", pembeli: "Maya L.", alamat: "Jl. Kenanga No. 7, Malang", ikan: "Cupang Serit Avatar", jumlah: 6, hargaSatuan: 45000, ongkir: 30000, sumber: "Beli langsung", metode: "GoPay", tanggal: "04 Okt 2026", status: "Menunggu Bayar" },
  { id: "#PS-2091", pembeli: "Rina W.", alamat: "Jl. Melati No. 12, Surabaya", ikan: "Halfmoon Blue Rim", jumlah: 10, hargaSatuan: 80000, ongkir: 50000, sumber: "Lelang", metode: "Virtual Account BCA", tanggal: "03 Okt 2026", status: "Dibayar" },
  { id: "#PS-2088", pembeli: "Doni A.", alamat: "Jl. Anggrek No. 3, Kediri", ikan: "Plakat Koi Galaxy", jumlah: 7, hargaSatuan: 55000, ongkir: 35000, sumber: "Beli langsung", metode: "OVO", tanggal: "02 Okt 2026", status: "Dikemas" },
  { id: "#PS-2085", pembeli: "Sari M.", alamat: "Jl. Mawar No. 21, Blitar", ikan: "Giant Nemo Fancy", jumlah: 10, hargaSatuan: 115000, ongkir: 100000, sumber: "Lelang", metode: "Kartu Kredit", tanggal: "30 Sep 2026", status: "Dikirim" },
  { id: "#PS-2081", pembeli: "Eko P.", alamat: "Jl. Dahlia No. 9, Madiun", ikan: "Crowntail Red Dragon", jumlah: 8, hargaSatuan: 70000, ongkir: 40000, sumber: "Beli langsung", metode: "DANA", tanggal: "27 Sep 2026", status: "Selesai" },
  { id: "#PS-2079", pembeli: "Andi T.", alamat: "Jl. Cempaka No. 5, Jombang", ikan: "Cupang Halfmoon Merah", jumlah: 3, hargaSatuan: 85000, ongkir: 0, sumber: "Beli langsung", metode: "GoPay", tanggal: "26 Sep 2026", status: "Dibatalkan" },
];

import type { SesiLelang, Percakapan, Notif } from "./types";
export const sesiList: SesiLelang[] = [
  { id: "L-101", produk: "Halfmoon Blue Rim", grade: "A", hargaAwal: 600000, kelipatan: 50000, status: "Live", sisaDetik: 8076, jadwal: "Mulai 04 Okt 2026, 08:00", bids: [
    { nama: "Rina W.", jumlah: 850000, waktu: "2 mnt lalu" }, { nama: "Doni A.", jumlah: 800000, waktu: "6 mnt lalu" }, { nama: "Sari M.", jumlah: 750000, waktu: "11 mnt lalu" },
    { nama: "Eko P.", jumlah: 700000, waktu: "18 mnt lalu" }, { nama: "Maya L.", jumlah: 650000, waktu: "25 mnt lalu" }] },
  { id: "L-102", produk: "Giant Blue Rim", grade: "A", hargaAwal: 28000, kelipatan: 2000, status: "Live", sisaDetik: 2700, jadwal: "Mulai 04 Okt 2026, 10:00", bids: [
    { nama: "Andi T.", jumlah: 36000, waktu: "1 mnt lalu" }, { nama: "Rina W.", jumlah: 34000, waktu: "9 mnt lalu" }, { nama: "Doni A.", jumlah: 30000, waktu: "20 mnt lalu" }] },
  { id: "L-103", produk: "Plakat Koi Galaxy", grade: "B", hargaAwal: 45000, kelipatan: 5000, status: "Terjadwal", sisaDetik: 0, jadwal: "05 Okt 2026, 19:00", bids: [] },
  { id: "L-104", produk: "Crowntail Red Dragon", grade: "B", hargaAwal: 50000, kelipatan: 5000, status: "Draft", sisaDetik: 0, jadwal: "Belum dijadwalkan", bids: [] },
  { id: "L-105", produk: "Cupang Nemo Galaxy", grade: "B", hargaAwal: 900000, kelipatan: 50000, status: "Selesai", sisaDetik: 0, jadwal: "Selesai 01 Okt 2026, 21:00", pemenang: "Sari M.", bayar: "Gagal Bayar", bids: [
    { nama: "Sari M.", jumlah: 1250000, waktu: "01 Okt, 20:58" }, { nama: "Eko P.", jumlah: 1200000, waktu: "01 Okt, 20:51" }] },
  { id: "L-106", produk: "Cupang Serit Avatar", grade: "C", hargaAwal: 40000, kelipatan: 2000, status: "Dibatalkan", sisaDetik: 0, jadwal: "Dibatalkan 28 Sep 2026", bids: [] },
];
export const chatList: Percakapan[] = [
  { id: "c1", nama: "Rina W.", produk: "Halfmoon Blue Rim", harga: "Rp 80.000 / ekor", belumDibaca: 2, terakhir: "Boleh minta video terbarunya juga kak", pesan: [
    { dari: "pembeli", teks: "Halo kak, Halfmoon Blue Rim-nya masih ada 10 ekor?", waktu: "09:12" }, { dari: "penjual", teks: "Halo kak Rina! Masih ada, stok 185 ekor 😊", waktu: "09:14" },
    { dari: "pembeli", teks: "Bisa dikirim hari ini? Dan ikannya sudah sehat semua?", waktu: "09:20" }, { dari: "pembeli", teks: "Boleh minta video terbarunya juga kak", waktu: "09:21" }] },
  { id: "c2", nama: "Doni A.", produk: "Plakat Koi Galaxy", harga: "Rp 55.000 / ekor", belumDibaca: 0, terakhir: "Siap kak, ditunggu ya", pesan: [
    { dari: "pembeli", teks: "Pesanan saya sudah dikemas belum kak?", waktu: "Kemarin" }, { dari: "penjual", teks: "Sedang dikemas kak, besok pagi dikirim.", waktu: "Kemarin" }, { dari: "pembeli", teks: "Siap kak, ditunggu ya", waktu: "Kemarin" }] },
  { id: "c3", nama: "Sari M.", produk: "Giant Nemo Fancy", harga: "Rp 115.000 / ekor", belumDibaca: 1, terakhir: "Resinya boleh dikirim kak?", pesan: [
    { dari: "pembeli", teks: "Terima kasih kak, pesanan sudah dikirim ya?", waktu: "08:30" }, { dari: "pembeli", teks: "Resinya boleh dikirim kak?", waktu: "08:31" }] },
  { id: "c4", nama: "Eko P.", produk: "Crowntail Red Dragon", harga: "Rp 70.000 / ekor", belumDibaca: 0, terakhir: "Baik kak, saya tunggu keputusan klaimnya", pesan: [
    { dari: "pembeli", teks: "Ikan yang datang ada yang lesu kak, saya sudah kirim video unboxing", waktu: "2 hari lalu" }, { dari: "penjual", teks: "Baik kak, kami cek dulu videonya ya.", waktu: "2 hari lalu" }, { dari: "pembeli", teks: "Baik kak, saya tunggu keputusan klaimnya", waktu: "2 hari lalu" }] },
];
export const rekeningList = ["BCA •••• 4821 · Pasha Santoso", "BRI •••• 7733 · Pasha Santoso"];
export const pembayaranList: Pembayaran[] = [
  { id: "b1", tanggal: "03 Okt 2026", pesanan: "#PS-2091", pembeli: "Rina W.", metode: "Virtual Account BCA", kotor: 850000, komisi: 42500, gateway: 4000, status: "Dalam Proses", estimasi: "Setelah pesanan tiba + 1×24 jam" },
  { id: "b2", tanggal: "02 Okt 2026", pesanan: "#PS-2088", pembeli: "Doni A.", metode: "OVO", kotor: 420000, komisi: 21000, gateway: 6300, status: "Dalam Proses", estimasi: "Setelah pesanan tiba + 1×24 jam" },
  { id: "b3", tanggal: "30 Sep 2026", pesanan: "#PS-2085", pembeli: "Sari M.", metode: "Kartu Kredit", kotor: 1250000, komisi: 62500, gateway: 36250, status: "Dalam Proses", estimasi: "Setelah pesanan tiba + 1×24 jam" },
  { id: "b4", tanggal: "27 Sep 2026", pesanan: "#PS-2081", pembeli: "Eko P.", metode: "DANA", kotor: 600000, komisi: 30000, gateway: 9000, status: "Diteruskan", estimasi: "Diteruskan 29 Sep 2026" },
  { id: "b5", tanggal: "25 Sep 2026", pesanan: "Klaim #CLM-1041", pembeli: "Pasar Ikan Segar Jaya", metode: "Virtual Account BNI", kotor: 224000, komisi: 0, gateway: 0, status: "Dikembalikan", estimasi: "Dikembalikan ke pembeli" },
];
export const notifList: Notif[] = [
  { id: "n1", jenis: "Pesanan", judul: "Pembayaran masuk", isi: "Rina W. membayar pesanan #PS-2091. Segera proses & kemas.", waktu: "5 mnt lalu", grup: "Hari ini", href: "/pesanan", dibaca: false },
  { id: "n2", jenis: "Lelang", judul: "Bid baru di Halfmoon Blue Rim", isi: "Rina W. menawar Rp 850.000. Lelang berakhir dalam 2 jam.", waktu: "12 mnt lalu", grup: "Hari ini", href: "/lelang/sesi/L-101", dibaca: false },
  { id: "n3", jenis: "Pesan", judul: "Pesan baru dari Sari M.", isi: "Resinya boleh dikirim kak?", waktu: "1 jam lalu", grup: "Hari ini", href: "/chat", dibaca: false },
  { id: "n4", jenis: "Stok", judul: "Stok hampir habis", isi: "Halfmoon Blue Rim tersisa 3 ekor. Tambah stok agar tetap tampil.", waktu: "3 jam lalu", grup: "Hari ini", href: "/stok", dibaca: true },
  { id: "n5", jenis: "Klaim", judul: "Klaim baru #CLM-1044", isi: "Warung Ikan Bahari mengajukan klaim dengan video unboxing.", waktu: "Kemarin, 16:20", grup: "Kemarin", href: "/klaim/CLM-1044", dibaca: true },
  { id: "n6", jenis: "Lelang", judul: "Lelang selesai", isi: "Cupang Nemo Galaxy dimenangkan Sari M. Rp 1.250.000. Pesanan otomatis dibuat.", waktu: "Kemarin, 21:00", grup: "Kemarin", href: "/lelang/sesi/L-105", dibaca: true },
];

import type { Ulasan, Pembayaran } from "./types";
export const ulasanList: Ulasan[] = [
  { id: "u1", nama: "Rina W.", produk: "Halfmoon Blue Rim", bintang: 5, komentar: "Ikan sehat semua, warna persis seperti di foto. Packing rapi dan sampai cepat!", tags: ["Ikan sehat", "Packing aman", "Pengiriman cepat"], foto: 2, tanggal: "03 Okt 2026", balasan: "Terima kasih kak Rina, ditunggu order berikutnya 🐟" },
  { id: "u2", nama: "Doni A.", produk: "Plakat Koi Galaxy", bintang: 5, komentar: "Mantap, ekornya bagus-bagus. Penjual ramah dan fast respon.", tags: ["Penjual ramah"], foto: 0, tanggal: "02 Okt 2026" },
  { id: "u3", nama: "Sari M.", produk: "Giant Nemo Fancy", bintang: 4, komentar: "Ikan bagus, tapi pengirimannya agak lama dari estimasi.", tags: ["Ikan sehat"], foto: 1, tanggal: "30 Sep 2026" },
  { id: "u4", nama: "Eko P.", produk: "Crowntail Red Dragon", bintang: 2, komentar: "Ada 2 ekor yang lesu saat tiba. Sudah ajukan klaim.", tags: [], foto: 3, tanggal: "28 Sep 2026" },
  { id: "u5", nama: "Maya L.", produk: "Cupang Serit Avatar", bintang: 5, komentar: "Sesuai deskripsi, grade-nya pas. Recommended seller.", tags: ["Sesuai deskripsi", "Packing aman"], foto: 0, tanggal: "26 Sep 2026", balasan: "Makasih kak Maya! 🙏" },
  { id: "u6", nama: "Andi T.", produk: "Halfmoon Merah", bintang: 3, komentar: "Lumayan, warnanya sedikit beda dari foto.", tags: [], foto: 0, tanggal: "24 Sep 2026" },
];
