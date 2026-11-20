"use client";
import { useEffect, useState } from "react";
import { ArrowUpRight, Hourglass, Landmark, Plus, Receipt, Wallet } from "lucide-react";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import Modal from "@/components/Modal";
import FormField from "@/components/FormField";
import { useToast } from "@/components/Toast";
import DataTable, { type Column } from "@/components/DataTable";
import { Button, Card, Pill } from "@/components/ui";
import { api, ApiError, jsonBody } from "@/lib/api";
import { rp } from "@/lib/format";
import ResetDataButton from "@/components/ResetDataButton";
import { useDashboardData } from "@/components/DashboardDataProvider";
import { pembayaranList, rekeningList } from "@/lib/mock-data";

interface PayoutItem {
  id: string;
  grossAmount: number;
  platformFee: number;
  gatewayFee: number;
  netAmount: number;
  status: "IN_ESCROW" | "RELEASED" | "REFUNDED";
  createdAt: string;
  order: {
    orderCode: string;
    paymentMethod: string | null;
    buyer: { name: string };
  };
}

interface BankItem {
  id: number;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  isPrimary: boolean;
}

const toneMap = {
  IN_ESCROW: "gold",
  RELEASED: "green",
  REFUNDED: "red",
} as const;

const labelMap = {
  IN_ESCROW: "Dalam Proses",
  RELEASED: "Diteruskan",
  REFUNDED: "Dikembalikan",
};

export default function PembayaranView({
  data,
  rekening,
}: {
  data?: any;
  rekening?: any;
} = {}) {
  const toast = useToast();
  const { pembayaran: ctxPembayaran, tarikSaldo } = useDashboardData();
  const [payouts, setPayouts] = useState<PayoutItem[]>([]);
  const [banks, setBanks] = useState<BankItem[]>([]);
  const [summary, setSummary] = useState({
    released: 0,
    inEscrow: 0,
    platformFee: 0,
    gatewayFee: 0,
  });
  const [openBank, setOpenBank] = useState(false);
  const [bankName, setBankName] = useState("BCA");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");

  const load = () => {
    api<{
      data: (Omit<PayoutItem, "id"> & { id: number })[];
      summary: typeof summary;
      bankAccounts: BankItem[];
    }>("/api/seller/payouts")
      .then((r) => {
        if (r.data && r.data.length > 0) {
          setPayouts(r.data.map((payout) => ({ ...payout, id: String(payout.id) })));
          setSummary(r.summary);
          setBanks(r.bankAccounts);
        } else {
          loadFallback();
        }
      })
      .catch(() => {
        loadFallback();
      });

    function loadFallback() {
      const src = ctxPembayaran.length > 0 ? ctxPembayaran : pembayaranList;
      const mapped: PayoutItem[] = src.map((b, idx) => ({
        id: String(idx + 1),
        grossAmount: b.kotor,
        platformFee: b.komisi,
        gatewayFee: b.gateway,
        netAmount: b.kotor - b.komisi - b.gateway,
        status:
          b.status === "Diteruskan"
            ? "RELEASED"
            : b.status === "Dikembalikan"
            ? "REFUNDED"
            : "IN_ESCROW",
        createdAt: new Date().toISOString(),
        order: {
          orderCode: b.pesanan,
          paymentMethod: b.metode,
          buyer: { name: b.pembeli },
        },
      }));
      setPayouts(mapped);
      const rel = mapped
        .filter((m) => m.status === "RELEASED")
        .reduce((n, m) => n + m.netAmount, 0);
      const esc = mapped
        .filter((m) => m.status === "IN_ESCROW")
        .reduce((n, m) => n + m.netAmount, 0);
      const pf = mapped.reduce((n, m) => n + m.platformFee, 0);
      const gf = mapped.reduce((n, m) => n + m.gatewayFee, 0);
      setSummary({ released: rel, inEscrow: esc, platformFee: pf, gatewayFee: gf });
      setBanks([
        {
          id: 1,
          bankName: "BCA",
          accountNumber: "8820192841",
          accountHolder: "Pasha Santoso",
          isPrimary: true,
        },
        {
          id: 2,
          bankName: "BRI",
          accountNumber: "02194819284",
          accountHolder: "Pasha Santoso",
          isPrimary: false,
        },
      ]);
    }
  };

  useEffect(() => {
    load();
  }, [ctxPembayaran]);

  const tambahRekening = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber || !accountHolder) {
      toast("Lengkapi nomor rekening dan nama pemilik.");
      return;
    }
    try {
      await api("/api/seller/bank-accounts", {
        method: "POST",
        body: jsonBody({ bankName, accountNumber, accountHolder }),
      });
      setOpenBank(false);
      setAccountNumber("");
      setAccountHolder("");
      load();
      toast("Rekening bank berhasil ditambahkan");
    } catch {
      setBanks(prev => [
        ...prev,
        {
          id: Date.now(),
          bankName,
          accountNumber,
          accountHolder,
          isPrimary: prev.length === 0,
        },
      ]);
      setOpenBank(false);
      setAccountNumber("");
      setAccountHolder("");
      toast("Rekening bank baru berhasil disimpan!");
    }
  };

  const tarikDana = async () => {
    if (summary.released <= 0) {
      toast("Tidak ada saldo yang siap dicairkan.");
      return;
    }
    const bankTujuan = banks[0]?.bankName || "BCA";
    try {
      const res = await api<{ message: string }>("/api/seller/payouts/withdraw", {
        method: "POST",
      });
      toast(res.message);
      load();
    } catch {
      tarikSaldo(summary.released, bankTujuan);
      toast(
        `Pencairan ${rp(summary.released)} ke rekening ${bankTujuan} berhasil diproses!`
      );
    }
  };

  const columns: Column<PayoutItem>[] = [
    {
      header: "Tanggal",
      cell: (r) => new Date(r.createdAt).toLocaleDateString("id-ID"),
    },
    {
      header: "Pesanan",
      cell: (r) => (
        <div>
          <p className="font-bold">{r.order.orderCode}</p>
          <p className="text-xs text-primary-400">{r.order.buyer.name}</p>
        </div>
      ),
    },
    { header: "Metode", cell: (r) => r.order.paymentMethod ?? "Transfer" },
    { header: "Dibayar Pembeli", cell: (r) => rp(r.grossAmount) },
    {
      header: "Potongan",
      cell: (r) => (
        <span className="text-red-500">
          - {rp(r.platformFee + r.gatewayFee)}
        </span>
      ),
    },
    {
      header: "Diterima Bersih",
      cell: (r) => <b>{rp(r.status === "REFUNDED" ? 0 : r.netAmount)}</b>,
    },
    {
      header: "Status",
      cell: (r) => <Pill tone={toneMap[r.status]}>{labelMap[r.status]}</Pill>,
    },
  ];

  return (
    <>
      <Topbar
        title="Pembayaran Masuk"
        subtitle="Dana escrow diteruskan ke rekening tambak setelah pesanan selesai"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <ResetDataButton label="Reset Data" />
            <Button onClick={tarikDana}>
              <ArrowUpRight size={16} /> Tarik Dana Tersedia
            </Button>
          </div>
        }
      />

      <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          variant="blue"
          label="Dana Diteruskan"
          value={rp(summary.released)}
          note="Siap dicairkan"
          icon={Wallet}
        />
        <StatCard
          label="Dalam Escrow"
          value={rp(summary.inEscrow)}
          note="Menunggu konfirmasi tiba"
          icon={Hourglass}
        />
        <StatCard
          label="Komisi Platform (5%)"
          value={rp(summary.platformFee)}
          icon={Receipt}
        />
        <StatCard
          label="Rekening Utama"
          value={banks[0] ? `${banks[0].bankName} • ${banks[0].accountNumber}` : "Belum diatur"}
          icon={Landmark}
        />
      </div>

      <Card className="mb-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold">Rekening Pencairan</h3>
          <Button variant="outline" onClick={() => setOpenBank(true)}>
            <Plus size={15} /> Tambah Rekening
          </Button>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {banks.map((b) => (
            <div
              key={b.id}
              className="flex items-center justify-between rounded-xl border border-primary-100 p-3 text-sm"
            >
              <div>
                <p className="font-bold">
                  {b.bankName} — {b.accountNumber}
                </p>
                <p className="text-xs text-primary-500">a.n. {b.accountHolder}</p>
              </div>
              {b.isPrimary && <Pill tone="blue">Utama</Pill>}
            </div>
          ))}
        </div>
      </Card>

      <Card className="!p-2">
        <DataTable<PayoutItem>
          columns={columns}
          rows={payouts}
          empty="Belum ada transaksi pembayaran masuk."
        />
      </Card>

      <Modal
        open={openBank}
        onClose={() => setOpenBank(false)}
        title="Tambah Rekening Pencairan"
        footer={
          <>
            <Button variant="outline" onClick={() => setOpenBank(false)}>
              Batal
            </Button>
            <Button onClick={tambahRekening}>Simpan Rekening</Button>
          </>
        }
      >
        <div className="space-y-3">
          <FormField label="Nama Bank">
            <input
              className="input"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
            />
          </FormField>
          <FormField label="Nomor Rekening">
            <input
              className="input"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
          </FormField>
          <FormField label="Nama Pemilik Rekening">
            <input
              className="input"
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
            />
          </FormField>
        </div>
      </Modal>
    </>
  );
}