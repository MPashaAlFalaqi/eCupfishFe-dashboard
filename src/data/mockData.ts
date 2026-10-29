export interface Pembudidaya {
  id: string;
  namaFarm: string;
  namaPemilik: string;
  avatar: string;
  email: string;
  telepon: string;
  kota: string;
  provinsi: string;
  alamatLengkap: string;
  tanggalGabung: string;
  spesialisasi: string[]; // e.g. ["Halfmoon", "Plakat", "Blue Rim"]
  status: "aktif" | "menunggu_verifikasi" | "ditangguhkan" | "ditolak";
  dokumen: {
    nik: string;
    fotoKtp: string;
    fotoFarm: string;
    suratIzin?: string;
  };
  bank: {
    namaBank: string;
    nomorRekening: string;
    atasNama: string;
  };
  statistik: {
    totalIkanTerjual: number;
    rating: number;
    totalUlasan: number;
    lelangDiikuti: number;
  };
  alasanStatus?: string;
}

export interface Pembeli {
  id: string;
  namaLengkap: string;
  username: string;
  avatar: string;
  email: string;
  telepon: string;
  kota: string;
  provinsi: string;
  alamatUtama: string;
  tanggalDaftar: string;
  status: "aktif" | "nonaktif" | "diblokir";
  statistik: {
    totalPesanan: number;
    totalTransaksiRp: number;
    lelangDimasuki: number;
    lelangDimenangkan: number;
  };
  alasanStatus?: string;
  terakhirLogin: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  tipe: "verifikasi_mitra" | "suspend_mitra" | "aktifkan_mitra" | "blokir_pembeli" | "buka_blokir_pembeli" | "tambah_akun";
  judul: string;
  detail: string;
  adminName: string;
  targetName: string;
  targetRole: "Pembudidaya" | "Pembeli";
  badgeVariant: "amber" | "green" | "red" | "blue";
}

export const initialPembudidaya: Pembudidaya[] = [
  {
    id: "FARM-001",
    namaFarm: "Betta Nusantara Gemilang",
    namaPemilik: "Pasha Syahputra",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
    email: "pasha.betta@ecupfish.id",
    telepon: "081234567890",
    kota: "Kediri",
    provinsi: "Jawa Timur",
    alamatLengkap: "Jl. Ikan Hias No. 45, Gurah, Kediri",
    tanggalGabung: "12 Januari 2026",
    spesialisasi: ["Halfmoon", "Plakat Koi", "Blue Rim Grade A"],
    status: "aktif",
    dokumen: {
      nik: "3506123456780001",
      fotoKtp: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80",
      fotoFarm: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=600&auto=format&fit=crop&q=80",
      suratIzin: "NIB: 9120003418721"
    },
    bank: {
      namaBank: "BCA",
      nomorRekening: "8291048291",
      atasNama: "Pasha Syahputra"
    },
    statistik: {
      totalIkanTerjual: 342,
      rating: 4.9,
      totalUlasan: 128,
      lelangDiikuti: 45
    }
  },
  {
    id: "FARM-002",
    namaFarm: "Galaxy Betta Farm",
    namaPemilik: "Ahmad Riyadi",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80",
    email: "ahmad.riyadi@gmail.com",
    telepon: "081987654321",
    kota: "Bogor",
    provinsi: "Jawa Barat",
    alamatLengkap: "Jl. Raya Parung No. 112, Parung, Bogor",
    tanggalGabung: "20 Oktober 2026",
    spesialisasi: ["Galaxy Multicolor", "Avatar Gordon", "Copper"],
    status: "menunggu_verifikasi",
    dokumen: {
      nik: "3201123456780003",
      fotoKtp: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80",
      fotoFarm: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=600&auto=format&fit=crop&q=80"
    },
    bank: {
      namaBank: "Mandiri",
      nomorRekening: "1330029481920",
      atasNama: "Ahmad Riyadi"
    },
    statistik: {
      totalIkanTerjual: 0,
      rating: 0,
      totalUlasan: 0,
      lelangDiikuti: 0
    }
  },
  {
    id: "FARM-003",
    namaFarm: "Blue Rim Exotic Breeding",
    namaPemilik: "Hendrik Gunawan",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    email: "hendrik.bluerim@gmail.com",
    telepon: "082155667788",
    kota: "Tulungagung",
    provinsi: "Jawa Timur",
    alamatLengkap: "Desa Ngunut RT 03/RW 02, Tulungagung",
    tanggalGabung: "15 Maret 2026",
    spesialisasi: ["Blue Rim Clean Dorsal", "Crowntail King Crown"],
    status: "aktif",
    dokumen: {
      nik: "3504123456780005",
      fotoKtp: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80",
      fotoFarm: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=600&auto=format&fit=crop&q=80"
    },
    bank: {
      namaBank: "BRI",
      nomorRekening: "019283746592817",
      atasNama: "Hendrik Gunawan"
    },
    statistik: {
      totalIkanTerjual: 218,
      rating: 4.8,
      totalUlasan: 94,
      lelangDiikuti: 29
    }
  },
  {
    id: "FARM-004",
    namaFarm: "Plakat Super Red Specialist",
    namaPemilik: "Bambang Sujarwo",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    email: "bambang.red@yahoo.com",
    telepon: "085712398451",
    kota: "Semarang",
    provinsi: "Jawa Tengah",
    alamatLengkap: "Jl. Bandungan Indah No. 88, Semarang",
    tanggalGabung: "5 Mei 2026",
    spesialisasi: ["Super Red PK", "Super Black Melano"],
    status: "ditangguhkan",
    dokumen: {
      nik: "3302123456780002",
      fotoKtp: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80",
      fotoFarm: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=600&auto=format&fit=crop&q=80"
    },
    bank: {
      namaBank: "BCA",
      nomorRekening: "4529182741",
      atasNama: "Bambang Sujarwo"
    },
    statistik: {
      totalIkanTerjual: 87,
      rating: 3.2,
      totalUlasan: 41,
      lelangDiikuti: 12
    },
    alasanStatus: "Terindikasi mengirim ikan tidak sesuai foto lelang (laporan 3 pembeli)."
  },
  {
    id: "FARM-005",
    namaFarm: "Nemo Fancy Solo",
    namaPemilik: "Fajar Prasetyo",
    avatar: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=120&auto=format&fit=crop&q=80",
    email: "fajar.nemo@gmail.com",
    telepon: "087812984523",
    kota: "Surakarta",
    provinsi: "Jawa Tengah",
    alamatLengkap: "Jl. Slamet Riyadi No. 301, Solo",
    tanggalGabung: "18 Oktober 2026",
    spesialisasi: ["Nemo Galaxy", "Tiger Plakat", "Samurai"],
    status: "menunggu_verifikasi",
    dokumen: {
      nik: "3372123456780004",
      fotoKtp: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80",
      fotoFarm: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=600&auto=format&fit=crop&q=80"
    },
    bank: {
      namaBank: "BNI",
      nomorRekening: "0891823741",
      atasNama: "Fajar Prasetyo"
    },
    statistik: {
      totalIkanTerjual: 0,
      rating: 0,
      totalUlasan: 0,
      lelangDiikuti: 0
    }
  },
  {
    id: "FARM-006",
    namaFarm: "Royal Crown Farm",
    namaPemilik: "Deni Irawan",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&auto=format&fit=crop&q=80",
    email: "deni.crowntail@gmail.com",
    telepon: "081389472190",
    kota: "Bandung",
    provinsi: "Jawa Barat",
    alamatLengkap: "Kopo Permai Blok C No. 14, Bandung",
    tanggalGabung: "10 Februari 2026",
    spesialisasi: ["Crowntail Black Orchid", "Crowntail Red"],
    status: "aktif",
    dokumen: {
      nik: "3273123456780009",
      fotoKtp: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80",
      fotoFarm: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=600&auto=format&fit=crop&q=80"
    },
    bank: {
      namaBank: "BCA",
      nomorRekening: "2837194012",
      atasNama: "Deni Irawan"
    },
    statistik: {
      totalIkanTerjual: 145,
      rating: 4.7,
      totalUlasan: 62,
      lelangDiikuti: 22
    }
  }
];

export const initialPembeli: Pembeli[] = [
  {
    id: "BUY-001",
    namaLengkap: "Rina Wulandari",
    username: "rina_cupanglovers",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    email: "rina.wulandari@gmail.com",
    telepon: "081299887766",
    kota: "Jakarta Selatan",
    provinsi: "DKI Jakarta",
    alamatUtama: "Apartemen Kalibata City Tower Kemuning Lt. 12, Pancoran, Jakarta Selatan",
    tanggalDaftar: "14 Februari 2026",
    status: "aktif",
    statistik: {
      totalPesanan: 28,
      totalTransaksiRp: 14500000,
      lelangDimasuki: 42,
      lelangDimenangkan: 19
    },
    terakhirLogin: "Hari ini, 15:42 WIB"
  },
  {
    id: "BUY-002",
    namaLengkap: "Doni Arya Putra",
    username: "doni_aquascape",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80",
    email: "doni.arya@gmail.com",
    telepon: "085677889900",
    kota: "Surabaya",
    provinsi: "Jawa Timur",
    alamatUtama: "Rungkut Asri Timur No. 23, Rungkut, Surabaya",
    tanggalDaftar: "3 Maret 2026",
    status: "aktif",
    statistik: {
      totalPesanan: 14,
      totalTransaksiRp: 6850000,
      lelangDimasuki: 25,
      lelangDimenangkan: 9
    },
    terakhirLogin: "Kemarin, 21:10 WIB"
  },
  {
    id: "BUY-003",
    namaLengkap: "Sari Mustika",
    username: "saribetta_collector",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
    email: "sari.mustika@yahoo.com",
    telepon: "087711223344",
    kota: "Yogyakarta",
    provinsi: "DI Yogyakarta",
    alamatUtama: "Jl. Kaliurang KM 7.5 No. 40, Sleman, Yogyakarta",
    tanggalDaftar: "10 April 2026",
    status: "aktif",
    statistik: {
      totalPesanan: 35,
      totalTransaksiRp: 22400000,
      lelangDimasuki: 60,
      lelangDimenangkan: 26
    },
    terakhirLogin: "Hari ini, 12:15 WIB"
  },
  {
    id: "BUY-004",
    namaLengkap: "Eko Prasetyo",
    username: "eko_bidder99",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80",
    email: "eko.prasetyo@gmail.com",
    telepon: "081822334455",
    kota: "Tangerang",
    provinsi: "Banten",
    alamatUtama: "Gading Serpong Sektor 7B No. 19, Kelapa Dua, Tangerang",
    tanggalDaftar: "25 Mei 2026",
    status: "diblokir",
    statistik: {
      totalPesanan: 4,
      totalTransaksiRp: 1200000,
      lelangDimasuki: 18,
      lelangDimenangkan: 6
    },
    alasanStatus: "Bid and Run lelang 3 kali berturut-turut tanpa penyelesaian pembayaran dalam batas waktu 24 jam.",
    terakhirLogin: "3 hari yang lalu"
  },
  {
    id: "BUY-005",
    namaLengkap: "Kevin Wijaya",
    username: "kevin_betta_mania",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    email: "kevin.wijaya@outlook.com",
    telepon: "081266554433",
    kota: "Medan",
    provinsi: "Sumatera Utara",
    alamatUtama: "Jl. Asia No. 88, Medan Area, Medan",
    tanggalDaftar: "1 Juni 2026",
    status: "aktif",
    statistik: {
      totalPesanan: 19,
      totalTransaksiRp: 11200000,
      lelangDimasuki: 31,
      lelangDimenangkan: 13
    },
    terakhirLogin: "Hari ini, 09:30 WIB"
  },
  {
    id: "BUY-006",
    namaLengkap: "Dewi Anggraini",
    username: "dewi_hobiikan",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80",
    email: "dewi.anggraini@gmail.com",
    telepon: "085811992288",
    kota: "Semarang",
    provinsi: "Jawa Tengah",
    alamatUtama: "Jl. Dr. Wahidin No. 56, Candisari, Semarang",
    tanggalDaftar: "18 Juli 2026",
    status: "aktif",
    statistik: {
      totalPesanan: 9,
      totalTransaksiRp: 4300000,
      lelangDimasuki: 15,
      lelangDimenangkan: 7
    },
    terakhirLogin: "2 hari yang lalu"
  }
];

export const initialActivityLogs: ActivityLog[] = [
  {
    id: "LOG-101",
    timestamp: "10 menit yang lalu",
    tipe: "verifikasi_mitra",
    judul: "Pendaftaran Mitra Baru",
    detail: "Galaxy Betta Farm mengunggah KTP dan foto farm untuk verifikasi.",
    adminName: "Sistem Otomatis",
    targetName: "Galaxy Betta Farm",
    targetRole: "Pembudidaya",
    badgeVariant: "amber"
  },
  {
    id: "LOG-102",
    timestamp: "1 jam yang lalu",
    tipe: "aktifkan_mitra",
    judul: "Verifikasi Mitra Disetujui",
    detail: "Akun Blue Rim Exotic Breeding telah disetujui untuk mulai lelang & katalog.",
    adminName: "Super Admin",
    targetName: "Blue Rim Exotic Breeding",
    targetRole: "Pembudidaya",
    badgeVariant: "green"
  },
  {
    id: "LOG-103",
    timestamp: "3 jam yang lalu",
    tipe: "blokir_pembeli",
    judul: "Pemblokiran Akun Pembeli",
    detail: "Akun eko_bidder99 diblokir otomatis karena 3x bid and run.",
    adminName: "Super Admin",
    targetName: "Eko Prasetyo",
    targetRole: "Pembeli",
    badgeVariant: "red"
  },
  {
    id: "LOG-104",
    timestamp: "Kemarin, 14:20 WIB",
    tipe: "suspend_mitra",
    judul: "Penangguhan Mitra",
    detail: "Plakat Super Red Specialist ditangguhkan karena klaim ikan tidak sesuai.",
    adminName: "Super Admin",
    targetName: "Plakat Super Red Specialist",
    targetRole: "Pembudidaya",
    badgeVariant: "red"
  }
];
