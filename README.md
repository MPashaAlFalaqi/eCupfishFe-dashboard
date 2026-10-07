# eCupFish — Dashboard Pembudidaya

Dashboard web untuk **pembudidaya (penjual) ikan cupang** pada ekosistem **eCupFish**, yaitu aplikasi mobile marketplace dan lelang ikan cupang.
Lewat dashboard ini pembudidaya mengelola stok ikan, membuat dan memantau sesi lelang, memproses pesanan dan pengiriman, menanggapi klaim garansi,
membalas chat dan ulasan pembeli, serta memantau pembayaran dan laporan keuangan.

> **Catatan:** proyek ini adalah **front-end** dengan data contoh (*mock data*). Belum terhubung ke backend atau database,
> sehingga perubahan data (simpan, hapus, ubah status) hanya berlaku di tampilan dan kembali seperti semula setelah halaman di-refresh.

## Tim

| Nama | NIM | Peran |
|------|-----|-------|
| M PASHA AL FALAQI | 253140701111028 | frontend dev
| James Martyno Susanto | | |
| Muktabar zaki pramana | | |



## Fitur

- **Autentikasi (tampilan):** login, register, lupa kata sandi 3 langkah (email/HP → OTP → sandi baru).
- **Dashboard:** ringkasan pendapatan, stok, lelang aktif, grafik penjualan 7 hari, pesanan perlu tindakan, stok menipis.
- **Manajemen Stok:** tabel dengan pencarian dan filter, tambah/edit ikan (harga, grade, status tampil di marketplace), upload hingga 6 foto/video, **AI Health Scanner** (simulasi), atur ketersediaan stok.
- **Lelang:** buat sesi, daftar sesi, monitor sesi live (bid, hitung mundur, perpanjang, akhiri, batalkan), penanganan pemenang yang tidak membayar.
- **Pesanan & Pengiriman:** alur status pesanan, detail dan invoice yang bisa dicetak, label pengiriman 10×15 cm, pelacakan.
- **Klaim Garansi:** tinjau bukti video unboxing, setujui (refund penuh/sebagian/ganti ikan) atau tolak dengan alasan wajib.
- **Komunikasi:** chat dengan pembeli (balasan cepat), ulasan & rating (balas, laporkan), notifikasi.
- **Keuangan:** pembayaran masuk (dana diteruskan langsung ke rekening penjual), laporan keuangan dengan ekspor CSV / cetak PDF.
- **Pengaturan:** profil tambak, akun & keamanan, profil toko, alamat asal pengiriman, jam operasional, notifikasi.
- **Interaksi:** transisi antar halaman, popup beranimasi, indikator menu yang meluncur, toast, daftar rekening yang bisa diseret.

## Teknologi dan Library

| Library | Versi | Fungsi |
|---------|-------|--------|
| [Next.js](https://nextjs.org/) (App Router) | ^14.2 | Framework React, routing, server rendering |
| [React](https://react.dev/) dan React DOM | ^18.3 | Library UI |
| [TypeScript](https://www.typescriptlang.org/) | ^5.4 | Bahasa dengan pengecekan tipe |
| [Tailwind CSS](https://tailwindcss.com/) | ^3.4 | Styling berbasis utility class dan design token |
| [PostCSS](https://postcss.org/) dan Autoprefixer | ^8 / ^10 | Pemrosesan CSS |
| [Framer Motion](https://www.framer.com/motion/) | ^11 | Animasi popup, tab, tabel, toast, drag-and-drop |
| [lucide-react](https://lucide.dev/) | 0.383 | Ikon |
| [clsx](https://github.com/lukeed/clsx) | ^2.1 | Menggabungkan class CSS secara kondisional |
| Plus Jakarta Sans (`next/font/google`) | — | Font utama |

## Cara Menjalankan

### Prasyarat

- **Node.js 18.17 atau lebih baru** (cek dengan `node -v`). Unduh versi LTS dari <https://nodejs.org>.
- **npm** (sudah termasuk saat memasang Node.js).
- **Koneksi internet** pada saat `npm install`, dan saat `npm run dev` / `npm run build` pertama kali karena font Plus Jakarta Sans diunduh dari Google Fonts.

### Langkah-langkah

```bash
# 1. Unduh proyek
git clone https://github.com/MPashaAlFalaqi/eCupfish-dashboard.git
cd NAMA-REPO

# 2. Pasang dependensi
npm install

# 3. Jalankan mode pengembangan
npm run dev
```

Buka <http://localhost:3000> di browser. Halaman akan otomatis menuju `/dashboard`; halaman login ada di `/login`.
Login tidak memvalidasi akun, jadi klik **Masuk ke Dashboard** langsung membuka dashboard.

### Perintah lain

| Perintah | Fungsi |
|----------|--------|
| `npm run dev` | Menjalankan server pengembangan (hot reload) |
| `npm run build` | Membuat build produksi (folder `.next`) |
| `npm run start` | Menjalankan hasil build produksi di <http://localhost:3000> |
| `npx tsc --noEmit` | Mengecek tipe TypeScript tanpa membuat file |

### Akun contoh dan data uji

- Halaman **Lupa Kata Sandi**: gunakan kode OTP **`123456`**.
- Semua data (ikan, pesanan, lelang, chat, dan lain-lain) berasal dari `src/lib/mock-data.ts`.
- Untuk melihat lelang yang sedang live buka **Lelang → Semua Sesi Lelang → Pantau**; sesi `L-105` menunjukkan kondisi pemenang yang tidak membayar.

## Struktur Proyek

```
.
├── public/                  # logo dan aset statis
├── docs/screenshots/        # tangkapan layar untuk README
├── src/
│   ├── app/
│   │   ├── (auth)/          # login, register, lupa-sandi
│   │   ├── (dashboard)/     # halaman dengan sidebar (dashboard, stok, lelang, pesanan, dst.)
│   │   ├── invoice/[id]/    # halaman invoice (cetak)
│   │   ├── label/[id]/      # label pengiriman 10×15 cm (cetak)
│   │   ├── globals.css      # gaya global dan animasi
│   │   └── not-found.tsx    # halaman 404
│   ├── components/          # komponen UI bersama (Sidebar, Topbar, Modal, DataTable, StatCard, Tabs, Toast, ...)
│   └── lib/                 # tipe data, data contoh, helper format
├── tailwind.config.ts       # design token (warna, bayangan, keyframes)
└── package.json
```

## Daftar Halaman

| Rute | Halaman |
|------|---------|
| `/login`, `/register`, `/lupa-sandi` | Autentikasi |
| `/dashboard` | Dashboard |
| `/stok`, `/stok/baru`, `/stok/[id]/edit` | Manajemen stok, tambah dan edit ikan |
| `/lelang`, `/lelang/sesi`, `/lelang/sesi/[id]` | Buat sesi, daftar sesi, monitor lelang |
| `/pesanan` | Semua pesanan |
| `/pengiriman` | Pengiriman |
| `/chat` | Chat dengan pembeli |
| `/klaim`, `/klaim/[id]` | Klaim garansi dan detailnya |
| `/ulasan` | Ulasan dan rating |
| `/laporan` | Laporan keuangan |
| `/pembayaran` | Pembayaran masuk |
| `/notifikasi` | Notifikasi |
| `/pengaturan` | Pengaturan toko |
| `/invoice/[id]`, `/label/[id]` | Invoice dan label pengiriman (cetak) |

## Hasil Build

Hasil `npm run build` (Next.js 14, semua halaman berhasil dibuat):

```
Route (app)                              Size     First Load JS
┌ ○ /                                    155 B          87.4 kB
├ ○ /_not-found                          155 B          87.4 kB
├ ○ /chat                                3.5 kB          137 kB
├ ƒ /dashboard                           4.27 kB         137 kB
├ ƒ /invoice/[id]                        1.75 kB         103 kB
├ ○ /klaim                               3.55 kB         137 kB
├ ƒ /klaim/[id]                          6.88 kB         140 kB
├ ƒ /label/[id]                          1.74 kB        97.7 kB
├ ○ /laporan                             3.75 kB         139 kB
├ ○ /lelang                              3.54 kB         142 kB
├ ○ /lelang/sesi                         3.48 kB         139 kB
├ ƒ /lelang/sesi/[id]                    6.48 kB         142 kB
├ ○ /login                               195 B           101 kB
├ ○ /lupa-sandi                          4.62 kB         143 kB
├ ○ /notifikasi                          2.55 kB         139 kB
├ ○ /pembayaran                          8.95 kB         142 kB
├ ○ /pengaturan                          5.38 kB         138 kB
├ ○ /pengiriman                          7.26 kB         140 kB
├ ○ /pesanan                             8.05 kB         141 kB
├ ○ /register                            195 B           101 kB
├ ○ /stok                                7.78 kB         141 kB
├ ƒ /stok/[id]/edit                      150 B           141 kB
├ ○ /stok/baru                           150 B           141 kB
└ ○ /ulasan                              7.03 kB         140 kB

○ (Static)  prerendered as static content
ƒ (Dynamic) server-rendered on demand
```

## Tangkapan Layar

### Autentikasi

| Login | Register |
|:--:|:--:|
| ![Login](docs/screenshots/01-login.png) | ![Register](docs/screenshots/02-register.png) |

**Lupa kata sandi**

![Lupa kata sandi](docs/screenshots/03-lupa-kata-sandi.png)

### Dashboard

![Dashboard](docs/screenshots/04-dashboard.png)

### Manajemen Stok

**Daftar stok**

![Manajemen stok](docs/screenshots/05-manajemen-stok.png)

**Popup atur ketersediaan stok**

![Popup atur ketersediaan](docs/screenshots/06-popup-atur-ketersediaan.png)

**Tambah data ikan (upload media dan AI Health Scanner)**

![Tambah ikan](docs/screenshots/07-tambah-ikan.png)

### Lelang

**Buat sesi lelang**

![Buat sesi lelang](docs/screenshots/08-lelang-buat-sesi.png)

**Monitor lelang live**

![Monitor lelang live](docs/screenshots/09-monitor-lelang-live.png)

**Pemenang tidak membayar**

![Pemenang tidak bayar](docs/screenshots/10-lelang-pemenang-tidak-bayar.png)

### Pesanan dan Pengiriman

**Semua pesanan**

![Semua pesanan](docs/screenshots/11-semua-pesanan.png)

**Popup detail pesanan**

![Popup detail pesanan](docs/screenshots/12-popup-detail-pesanan.png)

**Pengiriman**

![Pengiriman](docs/screenshots/13-pengiriman.png)

**Popup detail pengiriman**

![Popup detail pengiriman](docs/screenshots/14-popup-detail-pengiriman.png)

### Chat, Klaim, dan Ulasan

**Chat**

![Chat](docs/screenshots/15-chat.png)

**Klaim pembeli**

![Klaim pembeli](docs/screenshots/16-klaim-pembeli.png)

**Detail klaim**

![Detail klaim](docs/screenshots/17-detail-klaim.png)

**Ulasan dan rating**

![Ulasan](docs/screenshots/18-ulasan.png)

### Keuangan

**Laporan keuangan**

![Laporan keuangan](docs/screenshots/19-laporan-keuangan.png)

**Pembayaran masuk**

![Pembayaran masuk](docs/screenshots/20-pembayaran-masuk.png)

### Notifikasi dan Pengaturan

**Notifikasi**

![Notifikasi](docs/screenshots/21-notifikasi.png)

**Pengaturan**

![Pengaturan](docs/screenshots/22-pengaturan.png)

### Cetak 

| Invoice | Label pengiriman |
|:--:|:--:|
| ![Invoice](docs/screenshots/23-invoice.png) | ![Label pengiriman](docs/screenshots/24-label-pengiriman.png) |



## Keterbatasan

- Belum ada backend: data bersifat contoh, belum ada login sungguhan, proteksi halaman, atau penyimpanan ke database.
- Hasil **AI Health Scanner** adalah simulasi tampilan (nilai acak), bukan analisis gambar sungguhan.
- Fitur *real-time* (bid lelang, chat, hitung mundur dari server) dan pengiriman OTP memerlukan server tambahan.

## Lisensi

Proyek ini dibuat untuk keperluan tugas perkuliahan.
