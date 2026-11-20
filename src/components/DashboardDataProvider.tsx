"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import {
  ikanList,
  klaimList,
  notifList,
  pembayaranList,
  pengirimanList,
  pesananList,
  rekeningList,
  sesiList,
  ulasanList,
} from "@/lib/mock-data";
import type {
  Bid,
  Ikan,
  Klaim,
  Notif,
  Pembayaran,
  Pengiriman,
  Pesanan,
  SesiLelang,
  StatusKirim,
  StatusKlaim,
  StatusPesanan,
  Ulasan,
} from "@/lib/types";
import { getSocket } from "@/lib/socket";

const STORAGE_KEY = "ecupfish_dashboard_zero_v3";
const CHANNEL_NAME = "ecupfish_realtime_bus";

function formatTanggalHariIni() {
  const d = new Date();
  const bln = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agt",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];
  return `${String(d.getDate()).padStart(2, "0")} ${bln[d.getMonth()]} ${d.getFullYear()}`;
}

export interface PengeluaranOperasional {
  id: string;
  tanggal: string;
  kategori: string;
  jumlah: number;
}

const initialPengeluaran: PengeluaranOperasional[] = [
  { id: "exp-1", tanggal: "26 Sep 2026", kategori: "Pakan", jumlah: 450000 },
  { id: "exp-2", tanggal: "28 Sep 2026", kategori: "Obat & Vitamin", jumlah: 220000 },
  { id: "exp-3", tanggal: "01 Okt 2026", kategori: "Gaji & Upah", jumlah: 1500000 },
  { id: "exp-4", tanggal: "02 Okt 2026", kategori: "Packing", jumlah: 185000 },
  { id: "exp-5", tanggal: "03 Okt 2026", kategori: "Listrik & Air", jumlah: 620000 },
];

interface DashboardState {
  ikan: Ikan[];
  pesanan: Pesanan[];
  pengiriman: Pengiriman[];
  pembayaran: Pembayaran[];
  klaim: Klaim[];
  sesi: SesiLelang[];
  ulasan: Ulasan[];
  notif: Notif[];
  rekening: string[];
  pengeluaran: PengeluaranOperasional[];
}

function buildInitialState(): DashboardState {
  return {
    ikan: [],
    pesanan: [],
    pengiriman: [],
    pembayaran: [],
    klaim: [],
    sesi: [],
    ulasan: [],
    notif: [],
    rekening: ["BCA - 1234567890 (PT eCupFish Indonesia)"],
    pengeluaran: [],
  };
}

interface DashboardContextValue extends DashboardState {
  isRealtimeActive: boolean;
  setIkan: Dispatch<SetStateAction<Ikan[]>>;
  addIkan: (item: Ikan) => void;
  updateIkan: (id: string, patch: Partial<Ikan>) => void;
  deleteIkan: (id: string) => void;
  addSesi: (item: SesiLelang) => void;
  updateSesi: (id: string, patch: Partial<SesiLelang>) => void;
  addBid: (sesiId: string, bid: { nama: string; jumlah: number; waktu?: string }) => void;
  selesaikanSesi: (sesiId: string, customWinner?: { nama: string; jumlah: number }) => void;
  updateStatusPesanan: (id: string, status: StatusPesanan, resi?: string) => void;
  konfirmasiBayarPesanan: (pesananId: string) => void;
  kirimPesanan: (pesananId: string, resi: string, kurir?: string) => void;
  selesaikanPesanan: (pesananId: string) => void;
  updatePengiriman: (id: string, patch: Partial<Pengiriman>) => void;
  updateKlaim: (id: string, status: StatusKlaim) => void;
  tarikSaldo: (nominal: number, rekeningTujuan: string) => boolean;
  setUlasan: Dispatch<SetStateAction<Ulasan[]>>;
  setNotif: Dispatch<SetStateAction<Notif[]>>;
  setRekening: Dispatch<SetStateAction<string[]>>;
  resetSemuaData: () => void;
  setSemuaDataNol: () => void;
}

const DashboardDataContext = createContext<DashboardContextValue | null>(null);

export function DashboardDataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DashboardState>(buildInitialState);
  const [isRealtimeActive, setIsRealtimeActive] = useState<boolean>(true);
  const broadcastRef = useRef<BroadcastChannel | null>(null);
  const isSyncingFromExternal = useRef<boolean>(false);

  // Inisialisasi awal dari LocalStorage & listener lintas-tab (BroadcastChannel & Storage Event)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<DashboardState>;
        setState(prev => ({ ...prev, ...parsed }));
      }
    } catch {}

    // 1. BroadcastChannel untuk sinkronisasi seketika antar-tab tanpa reload
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      const channel = new BroadcastChannel(CHANNEL_NAME);
      broadcastRef.current = channel;

      channel.onmessage = (event) => {
        if (event.data?.type === "SYNC_STATE" && event.data?.state) {
          isSyncingFromExternal.current = true;
          setState(event.data.state);
        } else if (event.data?.type === "NEW_ORDER" && event.data?.order) {
          const o = event.data.order;
          const mapped: Pesanan = {
            id: o.id || `PS-${Date.now().toString().slice(-4)}`,
            pembeli: o.pembeli || "Pembeli Baru",
            alamat: o.alamat || "Alamat Pembeli",
            ikan: o.ikan || "Ikan Cupang",
            jumlah: o.jumlah || 1,
            hargaSatuan: o.hargaSatuan || 50000,
            ongkir: o.ongkir || 25000,
            sumber: o.sumber || "Beli langsung",
            metode: o.metode || "Transfer Bank",
            tanggal: formatTanggalHariIni(),
            status: o.status || "Dibayar",
          };
          setState(prev => {
            if (prev.pesanan.some(p => p.id === mapped.id)) return prev;
            return {
              ...prev,
              pesanan: [mapped, ...prev.pesanan],
              notif: [
                {
                  id: `nt-${Date.now()}`,
                  jenis: "Pesanan",
                  judul: `Pesanan Baru Masuk (${mapped.id})`,
                  isi: `${mapped.pembeli} memesan ${mapped.ikan} (${mapped.jumlah} ekor).`,
                  waktu: "Baru saja",
                  grup: "Hari ini",
                  href: "/pesanan",
                  dibaca: false,
                },
                ...prev.notif,
              ],
            };
          });
        } else if (event.data?.type === "NEW_BID" && event.data?.bid) {
          const { sesiId, nama, jumlah } = event.data.bid;
          addBid(String(sesiId), { nama, jumlah });
        }
      };
    }

    // 2. Storage event fallback
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const remoteState = JSON.parse(e.newValue);
          isSyncingFromExternal.current = true;
          setState(remoteState);
        } catch {}
      } else if (e.key === "ecupfish_new_order_event" && e.newValue) {
        try {
          const o = JSON.parse(e.newValue);
          const mapped: Pesanan = {
            id: o.id || `PS-${Date.now().toString().slice(-4)}`,
            pembeli: o.pembeli || "Pembeli Baru",
            alamat: o.alamat || "Alamat Pembeli",
            ikan: o.ikan || "Ikan Cupang",
            jumlah: o.jumlah || 1,
            hargaSatuan: o.hargaSatuan || 50000,
            ongkir: o.ongkir || 25000,
            sumber: o.sumber || "Beli langsung",
            metode: o.metode || "Transfer Bank",
            tanggal: formatTanggalHariIni(),
            status: o.status || "Dibayar",
          };
          setState(prev => {
            if (prev.pesanan.some(p => p.id === mapped.id)) return prev;
            return { ...prev, pesanan: [mapped, ...prev.pesanan] };
          });
        } catch {}
      } else if (e.key === "ecupfish_new_bid_event" && e.newValue) {
        try {
          const b = JSON.parse(e.newValue);
          addBid(String(b.sesiId), { nama: b.nama, jumlah: b.jumlah });
        } catch {}
      }
    };
    window.addEventListener("storage", handleStorage);

    // 3. Socket.IO connection ke backend (jika backend aktif)
    try {
      const sock = getSocket();
      sock.on("connect", () => {
        setIsRealtimeActive(true);
      });

      sock.on("auction:started", (data: { auctionId: number | string }) => {
        setState(prev => ({
          ...prev,
          sesi: prev.sesi.map(s =>
            String(s.id) === String(data.auctionId) ? { ...s, status: "Live" } : s
          ),
        }));
      });

      sock.on("auction:bid", (data: any) => {
        if (!data?.auctionId) return;
        const sesiId = String(data.auctionId);
        const bidderName = data.bid?.bidder?.name || "Pembeli";
        const amount = data.currentPrice || data.bid?.amount;
        if (amount) {
          addBid(sesiId, { nama: bidderName, jumlah: amount });
        }
      });

      sock.on("auction:ended", (data: { auctionId: number | string; winnerId?: number; finalPrice?: number }) => {
        // Otomatis akhiri sesi di frontend jika backend mengirim event
        selesaikanSesi(String(data.auctionId));
      });

      sock.on("order:new", (orderData: any) => {
        if (!orderData) return;
        const mapped: Pesanan = {
          id: orderData.orderCode || `P-${Date.now().toString().slice(-4)}`,
          pembeli: orderData.recipientName || orderData.buyer?.name || "Pembeli Baru",
          alamat: orderData.shippingAddress || "Alamat Pembeli",
          ikan: orderData.items?.[0]?.productName || "Ikan Cupang",
          jumlah: orderData.items?.[0]?.quantity || 1,
          hargaSatuan: orderData.items?.[0]?.unitPrice || orderData.grandTotal || 50000,
          ongkir: orderData.shippingCost || 25000,
          sumber: orderData.source === "AUCTION" ? "Lelang" : "Beli langsung",
          metode: "Transfer Bank",
          tanggal: formatTanggalHariIni(),
          status: "Menunggu Bayar",
        };
        setState(prev => {
          if (prev.pesanan.some(p => p.id === mapped.id)) return prev;
          return { ...prev, pesanan: [mapped, ...prev.pesanan] };
        });
      });
    } catch {}

    return () => {
      window.removeEventListener("storage", handleStorage);
      if (broadcastRef.current) {
        broadcastRef.current.close();
      }
    };
  }, []);

  // Simpan ke LocalStorage dan broadcast setiap kali state lokal berubah
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}

    if (!isSyncingFromExternal.current && broadcastRef.current) {
      broadcastRef.current.postMessage({ type: "SYNC_STATE", state });
    }
    isSyncingFromExternal.current = false;
  }, [state]);

  const addIkan = (item: Ikan) => {
    setState(prev => ({
      ...prev,
      ikan: [item, ...prev.ikan],
    }));
  };

  const updateIkan = (id: string, patch: Partial<Ikan>) => {
    setState(prev => ({
      ...prev,
      ikan: prev.ikan.map(item => (item.id === id ? { ...item, ...patch } : item)),
    }));
  };

  const deleteIkan = (id: string) => {
    setState(prev => ({
      ...prev,
      ikan: prev.ikan.filter(item => item.id !== id),
    }));
  };

  const addSesi = (item: SesiLelang) => {
    setState(prev => ({
      ...prev,
      sesi: [item, ...prev.sesi],
    }));
  };

  const updateSesi = (id: string, patch: Partial<SesiLelang>) => {
    setState(prev => ({
      ...prev,
      sesi: prev.sesi.map(s => (s.id === id ? { ...s, ...patch } : s)),
    }));
  };

  // 1. Eksekusi Live Bidding Real-Time
  const addBid = (
    sesiId: string,
    newBid: { nama: string; jumlah: number; waktu?: string }
  ) => {
    setState(prev => {
      const sesiTarget = prev.sesi.find(s => s.id === sesiId);
      if (!sesiTarget) return prev;

      const bidItem: Bid = {
        nama: newBid.nama.trim() || "Penawar Anonim",
        jumlah: newBid.jumlah,
        waktu: newBid.waktu || "Baru saja",
      };

      const bidsBaru = [
        bidItem,
        ...sesiTarget.bids.filter(
          b => !(b.nama === bidItem.nama && b.jumlah === bidItem.jumlah)
        ),
      ].sort((a, b) => b.jumlah - a.jumlah);

      // Perpanjangan anti-sniping 30 detik jika waktu tersisa menipis
      const sisaBaru =
        sesiTarget.sisaDetik < 30 ? sesiTarget.sisaDetik + 30 : sesiTarget.sisaDetik;

      const notifBaru: Notif = {
        id: `nt-${Date.now()}`,
        jenis: "Lelang",
        judul: `Tawaran Baru di Sesi #${sesiTarget.id}`,
        isi: `${bidItem.nama} memasang tawaran sebesar Rp ${bidItem.jumlah.toLocaleString("id-ID")}`,
        waktu: "Baru saja",
        grup: "Hari ini",
        href: `/lelang/sesi/${sesiTarget.id}`,
        dibaca: false,
      };

      return {
        ...prev,
        sesi: prev.sesi.map(s =>
          s.id === sesiId
            ? {
                ...s,
                bids: bidsBaru,
                sisaDetik: sisaBaru,
              }
            : s
        ),
        notif: [notifBaru, ...prev.notif],
      };
    });
  };

  // 2. Eksekusi Pengakhiran Sesi Lelang -> Otomatis Buat Pesanan & Kurangi Stok
  const selesaikanSesi = (
    sesiId: string,
    customWinner?: { nama: string; jumlah: number }
  ) => {
    setState(prev => {
      const sesiTarget = prev.sesi.find(s => s.id === sesiId);
      if (!sesiTarget) return prev;

      const winnerBid = customWinner || sesiTarget.bids[0];
      const newOrderId = `LL-${Date.now().toString().slice(-4)}`;
      const tanggalSkrg = formatTanggalHariIni();

      let pesananBaru = [...prev.pesanan];
      let ikanBaru = [...prev.ikan];
      let notifBaru = [...prev.notif];

      if (winnerBid) {
        const createdOrder: Pesanan = {
          id: newOrderId,
          pembeli: winnerBid.nama,
          alamat: "Jl. Rungkut Asri Timur No. 18, Surabaya",
          ikan: `${sesiTarget.produk}`,
          jumlah: 1,
          hargaSatuan: winnerBid.jumlah,
          ongkir: 25000,
          sumber: "Lelang",
          metode: "Transfer Bank (BCA)",
          tanggal: tanggalSkrg,
          status: "Menunggu Bayar",
        };
        pesananBaru = [createdOrder, ...pesananBaru];

        // Kurangi stok ikan terkait
        ikanBaru = ikanBaru.map(ik => {
          const match =
            ik.nama.toLowerCase().includes(sesiTarget.produk.toLowerCase()) ||
            sesiTarget.produk.toLowerCase().includes(ik.nama.toLowerCase());
          if (match && ik.stok > 0) {
            const sisaStok = ik.stok - 1;
            return {
              ...ik,
              stok: sisaStok,
              status: sisaStok === 0 ? "Habis" : ik.status,
            };
          }
          return ik;
        });

        notifBaru.unshift({
          id: `nt-${Date.now()}`,
          jenis: "Lelang",
          judul: `Sesi Lelang #${sesiTarget.id} Selesai!`,
          isi: `Dimenangkan oleh ${winnerBid.nama} sebesar Rp ${winnerBid.jumlah.toLocaleString("id-ID")}. Pesanan #${newOrderId} otomatis dibuat.`,
          waktu: "Baru saja",
          grup: "Hari ini",
          href: `/pesanan`,
          dibaca: false,
        });
      }

      return {
        ...prev,
        sesi: prev.sesi.map(s =>
          s.id === sesiId
            ? {
                ...s,
                status: "Selesai",
                pemenang: winnerBid?.nama,
                bayar: winnerBid ? "Menunggu Bayar" : undefined,
              }
            : s
        ),
        pesanan: pesananBaru,
        ikan: ikanBaru,
        notif: notifBaru,
      };
    });
  };

  const updateStatusPesanan = (id: string, status: StatusPesanan, resi?: string) => {
    setState(prev => {
      const target = prev.pesanan.find(p => p.id === id);
      const pesananBaru = prev.pesanan.map(p => (p.id === id ? { ...p, status } : p));

      let pengirimanBaru = [...prev.pengiriman];
      if (target && ["Dibayar", "Dikemas", "Dikirim", "Selesai"].includes(status)) {
        const statusKirim: StatusKirim =
          status === "Dikirim"
            ? "Dalam Pengiriman"
            : status === "Selesai"
            ? "Diterima"
            : "Diproses";
        const ada = pengirimanBaru.some(k => k.id === id);
        if (ada) {
          pengirimanBaru = pengirimanBaru.map(k =>
            k.id === id
              ? {
                  ...k,
                  status: statusKirim,
                  resi: resi && resi.trim() ? resi.trim() : k.resi,
                }
              : k
          );
        } else {
          pengirimanBaru.unshift({
            id: target.id,
            pembeli: target.pembeli,
            ikan: `${target.ikan} · ${target.jumlah} ekor`,
            kurir: "JNE Live Fish",
            resi: resi && resi.trim() ? resi.trim() : "—",
            grade: "A",
            tanggalKirim: target.tanggal,
            alamat: target.alamat,
            telp: "0812-3456-7890",
            berat: Math.max(1, Number((target.jumlah * 0.25).toFixed(1))),
            status: statusKirim,
          });
        }
      } else if (status === "Dibatalkan") {
        pengirimanBaru = pengirimanBaru.filter(k => k.id !== id);
      }

      const pembayaranBaru = prev.pembayaran.map(b => {
        if (b.pesanan !== id) return b;
        if (status === "Selesai") {
          return {
            ...b,
            status: "Diteruskan" as const,
            estimasi: "Sudah diteruskan ke rekening",
          };
        }
        if (status === "Dibatalkan") {
          return {
            ...b,
            status: "Dikembalikan" as const,
            estimasi: "Dikembalikan ke pembeli",
          };
        }
        return b;
      });

      // Jika belum ada di pembayaran dan status berubah jadi Dibayar, tambahkan ke pembayaran escrow
      if (
        target &&
        status === "Dibayar" &&
        !pembayaranBaru.some(b => b.pesanan === id)
      ) {
        const kotor = target.hargaSatuan * target.jumlah + target.ongkir;
        const komisi = Math.round(kotor * 0.05);
        const gateway = 4000;
        pembayaranBaru.unshift({
          id: `b-${Date.now()}`,
          tanggal: target.tanggal,
          pesanan: target.id,
          pembeli: target.pembeli,
          metode: target.metode,
          kotor,
          komisi,
          gateway,
          status: "Dalam Proses",
          estimasi: "Setelah pesanan tiba + 1×24 jam",
        });
      }

      return {
        ...prev,
        pesanan: pesananBaru,
        pengiriman: pengirimanBaru,
        pembayaran: pembayaranBaru,
      };
    });
  };

  // 3. Konfirmasi Bayar Pesanan
  const konfirmasiBayarPesanan = (pesananId: string) => {
    updateStatusPesanan(pesananId, "Dibayar");
  };

  // 4. Kirim Pesanan dengan No. Resi & Kurir
  const kirimPesanan = (pesananId: string, resi: string, kurir?: string) => {
    setState(prev => {
      const target = prev.pesanan.find(p => p.id === pesananId);
      if (!target) return prev;

      const resiFinal =
        resi && resi.trim()
          ? resi.trim()
          : `122938${Math.floor(10 + Math.random() * 89)}`;
      const kurirFinal = kurir || "JNE Live Fish";

      const pesananBaru = prev.pesanan.map(p =>
        p.id === pesananId ? { ...p, status: "Dikirim" as StatusPesanan } : p
      );

      let pengirimanBaru = prev.pengiriman.map(k =>
        k.id === pesananId
          ? {
              ...k,
              status: "Dalam Pengiriman" as StatusKirim,
              resi: resiFinal,
              kurir: kurirFinal,
            }
          : k
      );

      if (!pengirimanBaru.some(k => k.id === pesananId)) {
        pengirimanBaru.unshift({
          id: target.id,
          pembeli: target.pembeli,
          ikan: `${target.ikan} · ${target.jumlah} ekor`,
          kurir: kurirFinal,
          resi: resiFinal,
          grade: "A",
          tanggalKirim: formatTanggalHariIni(),
          alamat: target.alamat,
          telp: "0812-3456-7890",
          berat: Math.max(1, Number((target.jumlah * 0.25).toFixed(1))),
          status: "Dalam Pengiriman",
        });
      }

      const notifBaru: Notif = {
        id: `nt-${Date.now()}`,
        jenis: "Pesanan",
        judul: `Pesanan #${pesananId} Dikirim`,
        isi: `Paket telah diserahkan ke ${kurirFinal} dengan No. Resi ${resiFinal}`,
        waktu: "Baru saja",
        grup: "Hari ini",
        href: `/pengiriman`,
        dibaca: false,
      };

      return {
        ...prev,
        pesanan: pesananBaru,
        pengiriman: pengirimanBaru,
        notif: [notifBaru, ...prev.notif],
      };
    });
  };

  // 5. Selesaikan Pesanan -> Dana Masuk Saldo & Otomatis Buat Ulasan Pembeli
  const selesaikanPesanan = (pesananId: string) => {
    setState(prev => {
      const target = prev.pesanan.find(p => p.id === pesananId);
      if (!target) return prev;

      const tanggalSkrg = formatTanggalHariIni();
      const pesananBaru = prev.pesanan.map(p =>
        p.id === pesananId ? { ...p, status: "Selesai" as StatusPesanan } : p
      );

      const pengirimanBaru = prev.pengiriman.map(k =>
        k.id === pesananId ? { ...k, status: "Diterima" as StatusKirim } : k
      );

      const pembayaranBaru = prev.pembayaran.map(b =>
        b.pesanan === pesananId
          ? {
              ...b,
              status: "Diteruskan" as const,
              estimasi: `Sudah diteruskan (${tanggalSkrg})`,
            }
          : b
      );

      // Otomatis buat ulasan pembeli bintang 5
      const ulasanBaru: Ulasan = {
        id: `ul-${Date.now()}`,
        nama: target.pembeli,
        produk: target.ikan,
        bintang: 5,
        komentar:
          "Ikan cupang sampai dalam kondisi sangat sehat, lincah, warna cerah sesuai foto. Pengemasan double plastik + oksigen sangat rapi!",
        tags: ["Ikan Sehat & Aktif", "Pengiriman Cepat", "Sesuai Foto"],
        foto: 1,
        tanggal: tanggalSkrg,
      };

      const notifBaru: Notif = {
        id: `nt-${Date.now()}`,
        jenis: "Pesanan",
        judul: `Pesanan #${pesananId} Selesai & Diterima`,
        isi: `Pembeli mengonfirmasi pesanan tiba. Dana telah diteruskan ke saldo rekening.`,
        waktu: "Baru saja",
        grup: "Hari ini",
        href: `/pembayaran`,
        dibaca: false,
      };

      return {
        ...prev,
        pesanan: pesananBaru,
        pengiriman: pengirimanBaru,
        pembayaran: pembayaranBaru,
        ulasan: [ulasanBaru, ...prev.ulasan],
        notif: [notifBaru, ...prev.notif],
      };
    });
  };

  const updatePengiriman = (id: string, patch: Partial<Pengiriman>) => {
    setState(prev => {
      const pengirimanBaru = prev.pengiriman.map(k =>
        k.id === id ? { ...k, ...patch } : k
      );
      let pesananBaru = prev.pesanan;
      let pembayaranBaru = prev.pembayaran;

      if (patch.status === "Dalam Pengiriman") {
        pesananBaru = pesananBaru.map(p =>
          p.id === id ? { ...p, status: "Dikirim" } : p
        );
      } else if (patch.status === "Diterima") {
        pesananBaru = pesananBaru.map(p =>
          p.id === id ? { ...p, status: "Selesai" } : p
        );
        pembayaranBaru = pembayaranBaru.map(b =>
          b.pesanan === id
            ? {
                ...b,
                status: "Diteruskan",
                estimasi: "Sudah diteruskan ke rekening",
              }
            : b
        );
      } else if (patch.status === "Diproses") {
        pesananBaru = pesananBaru.map(p =>
          p.id === id && p.status !== "Dibayar" ? { ...p, status: "Dikemas" } : p
        );
      }

      return {
        ...prev,
        pengiriman: pengirimanBaru,
        pesanan: pesananBaru,
        pembayaran: pembayaranBaru,
      };
    });
  };

  const updateKlaim = (id: string, status: StatusKlaim) => {
    setState(prev => {
      const target = prev.klaim.find(k => k.id === id);
      const klaimBaru = prev.klaim.map(k => (k.id === id ? { ...k, status } : k));
      let pembayaranBaru = prev.pembayaran;

      if (target && status === "Disetujui") {
        pembayaranBaru = pembayaranBaru.map(b =>
          b.pesanan === target.pesanan
            ? {
                ...b,
                status: "Dikembalikan",
                estimasi: `Dikembalikan (Klaim #${target.id})`,
              }
            : b
        );
      }

      return { ...prev, klaim: klaimBaru, pembayaran: pembayaranBaru };
    });
  };

  // 6. Tarik Saldo / Pencairan Dana
  const tarikSaldo = (nominal: number, rekeningTujuan: string) => {
    const tanggalSkrg = formatTanggalHariIni();
    setState(prev => {
      const idBaru = `wd-${Date.now()}`;
      const newPayout: Pembayaran = {
        id: idBaru,
        tanggal: tanggalSkrg,
        pesanan: `Pencairan Saldo (${rekeningTujuan})`,
        pembeli: "Toko eCupFish (Penjual)",
        metode: rekeningTujuan,
        kotor: nominal,
        komisi: 0,
        gateway: 2500,
        status: "Diteruskan",
        estimasi: "Pencairan berhasil ditransfer",
      };

      const notifBaru: Notif = {
        id: `nt-${Date.now()}`,
        jenis: "Pesanan",
        judul: `Pencairan Dana Berhasil`,
        isi: `Penarikan saldo sebesar Rp ${nominal.toLocaleString("id-ID")} telah dikirim ke rekening ${rekeningTujuan}.`,
        waktu: "Baru saja",
        grup: "Hari ini",
        href: `/pembayaran`,
        dibaca: false,
      };

      return {
        ...prev,
        pembayaran: [newPayout, ...prev.pembayaran],
        notif: [notifBaru, ...prev.notif],
      };
    });
    return true;
  };

  const resetSemuaData = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("ecupfish_dashboard_state_v1");
      localStorage.removeItem("ecupfish_dashboard_clean_v1");
      localStorage.removeItem("ecupfish_new_order_event");
      localStorage.removeItem("ecupfish_new_bid_event");
      localStorage.removeItem("ecupfish_chat_sync");
    } catch {}
    // Reset chat backend relay juga
    try {
      fetch("http://localhost:3000/api/chat/messages", { method: "DELETE" }).catch(() => {});
    } catch {}
    const fresh = buildInitialState();
    setState(fresh);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    } catch {}
  };

  const setSemuaDataNol = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("ecupfish_dashboard_state_v1");
      localStorage.removeItem("ecupfish_dashboard_clean_v1");
    } catch {}
    try {
      fetch("http://localhost:3000/api/chat/messages", { method: "DELETE" }).catch(() => {});
    } catch {}
    const emptyState: DashboardState = {
      ikan: [],
      pesanan: [],
      pengiriman: [],
      pembayaran: [],
      klaim: [],
      sesi: [],
      ulasan: [],
      notif: [],
      rekening: ["BCA - 1234567890 (PT eCupFish Indonesia)"],
      pengeluaran: [],
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(emptyState));
    } catch {}
    setState(emptyState);
  };

  return (
    <DashboardDataContext.Provider
      value={{
        ...state,
        isRealtimeActive,
        setIkan: updater =>
          setState(prev => ({
            ...prev,
            ikan: typeof updater === "function" ? updater(prev.ikan) : updater,
          })),
        addIkan,
        updateIkan,
        deleteIkan,
        addSesi,
        updateSesi,
        addBid,
        selesaikanSesi,
        updateStatusPesanan,
        konfirmasiBayarPesanan,
        kirimPesanan,
        selesaikanPesanan,
        updatePengiriman,
        updateKlaim,
        tarikSaldo,
        setUlasan: updater =>
          setState(prev => ({
            ...prev,
            ulasan: typeof updater === "function" ? updater(prev.ulasan) : updater,
          })),
        setNotif: updater =>
          setState(prev => ({
            ...prev,
            notif: typeof updater === "function" ? updater(prev.notif) : updater,
          })),
        setRekening: updater =>
          setState(prev => ({
            ...prev,
            rekening:
              typeof updater === "function" ? updater(prev.rekening) : updater,
          })),
        resetSemuaData,
        setSemuaDataNol,
      }}
    >
      {children}
    </DashboardDataContext.Provider>
  );
}

export function useDashboardData() {
  const ctx = useContext(DashboardDataContext);
  if (!ctx) {
    throw new Error(
      "useDashboardData harus dipakai di dalam DashboardDataProvider"
    );
  }
  return ctx;
}