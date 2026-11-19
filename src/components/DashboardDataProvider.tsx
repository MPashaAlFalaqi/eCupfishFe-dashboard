"use client";
import {
  createContext,
  useContext,
  useEffect,
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

const STORAGE_KEY = "ecupfish_dashboard_state_v1";

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
  const pengirimanSinkron: Pengiriman[] = pesananList
    .filter(p => ["Dikemas", "Dikirim", "Selesai"].includes(p.status))
    .map((p, idx) => {
      const ref = pengirimanList[idx];
      const statusKirim: StatusKirim =
        p.status === "Dikemas"
          ? "Diproses"
          : p.status === "Dikirim"
          ? "Dalam Pengiriman"
          : "Diterima";
      return {
        id: p.id,
        pembeli: p.pembeli,
        ikan: `${p.ikan} · ${p.jumlah} ekor`,
        kurir: ref?.kurir ?? "JNE Live Fish",
        resi:
          p.status === "Dikemas"
            ? "—"
            : ref?.resi && ref.resi !== "—"
            ? ref.resi
            : `122938${40 + idx}`,
        grade: ref?.grade ?? "A",
        tanggalKirim: p.tanggal,
        alamat: p.alamat,
        telp: ref?.telp ?? "0812-3456-7890",
        berat: Math.max(1, Number((p.jumlah * 0.25).toFixed(1))),
        status: statusKirim,
      };
    });

  const pembayaranSinkron: Pembayaran[] = pesananList
    .filter(p => p.status !== "Menunggu Bayar" && p.status !== "Dibatalkan")
    .map((p, idx) => {
      const ref = pembayaranList.find(b => b.pesanan === p.id);
      const kotor = p.hargaSatuan * p.jumlah + p.ongkir;
      const komisi = ref?.komisi ?? Math.round(kotor * 0.05);
      const gateway = ref?.gateway ?? 4000;
      const selesai = p.status === "Selesai";
      return {
        id: ref?.id ?? `b-${idx + 1}`,
        tanggal: p.tanggal,
        pesanan: p.id,
        pembeli: p.pembeli,
        metode: p.metode,
        kotor,
        komisi,
        gateway,
        status: selesai ? "Diteruskan" : "Dalam Proses",
        estimasi: selesai
          ? `Diteruskan (${p.tanggal})`
          : "Setelah pesanan tiba + 1×24 jam",
      };
    });

  return {
    ikan: ikanList,
    pesanan: pesananList,
    pengiriman: pengirimanSinkron,
    pembayaran: pembayaranSinkron,
    klaim: klaimList,
    sesi: sesiList,
    ulasan: ulasanList,
    notif: notifList,
    rekening: rekeningList,
    pengeluaran: initialPengeluaran,
  };
}

interface DashboardContextValue extends DashboardState {
  setIkan: Dispatch<SetStateAction<Ikan[]>>;
  addIkan: (item: Ikan) => void;
  updateIkan: (id: string, patch: Partial<Ikan>) => void;
  deleteIkan: (id: string) => void;
  addSesi: (item: SesiLelang) => void;
  updateStatusPesanan: (id: string, status: StatusPesanan, resi?: string) => void;
  updatePengiriman: (id: string, patch: Partial<Pengiriman>) => void;
  updateKlaim: (id: string, status: StatusKlaim) => void;
  setUlasan: Dispatch<SetStateAction<Ulasan[]>>;
  setNotif: Dispatch<SetStateAction<Notif[]>>;
  setRekening: Dispatch<SetStateAction<string[]>>;
  resetSemuaData: () => void;
}

const DashboardDataContext = createContext<DashboardContextValue | null>(null);

export function DashboardDataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DashboardState>(buildInitialState);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<DashboardState>;
        setState(prev => ({ ...prev, ...parsed }));
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
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

  const updateStatusPesanan = (id: string, status: StatusPesanan, resi?: string) => {
    setState(prev => {
      const target = prev.pesanan.find(p => p.id === id);
      const pesananBaru = prev.pesanan.map(p => (p.id === id ? { ...p, status } : p));

      let pengirimanBaru = [...prev.pengiriman];
      if (target && ["Dikemas", "Dikirim", "Selesai"].includes(status)) {
        const statusKirim: StatusKirim =
          status === "Dikemas"
            ? "Diproses"
            : status === "Dikirim"
            ? "Dalam Pengiriman"
            : "Diterima";
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

      return {
        ...prev,
        pesanan: pesananBaru,
        pengiriman: pengirimanBaru,
        pembayaran: pembayaranBaru,
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

  const resetSemuaData = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setState(buildInitialState());
  };

  return (
    <DashboardDataContext.Provider
      value={{
        ...state,
        setIkan: updater =>
          setState(prev => ({
            ...prev,
            ikan: typeof updater === "function" ? updater(prev.ikan) : updater,
          })),
        addIkan,
        updateIkan,
        deleteIkan,
        addSesi,
        updateStatusPesanan,
        updatePengiriman,
        updateKlaim,
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