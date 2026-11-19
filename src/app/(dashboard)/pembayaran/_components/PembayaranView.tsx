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

export default function PembayaranView() {
  const toast = useToast();
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
    }>("/api/seller/payouts").then((r) => {
      setPayouts(r.data.map((payout) => ({ ...payout, id: String(payout.id) })));
      setSummary(r.summary);
      setBanks(r.bankAccounts);
    });
  };

  useEffect(() => {
    load();
  }, []);

  const tambahRekening = async (e: React.FormEvent) => {
    e.preventDefault();
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
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Gagal menambah rekening.");
    }
  };

  const tarikDana = async () => {
    try {
      const res = await api<{ message: string }>("/api/seller/payouts/withdraw", {
        method: "POST",
      });
      toast(res.message);
      load();
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Gagal memproses pencairan.");
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
          <Button onClick={tarikDana}>
            <ArrowUpRight size={16} /> Tarik Dana Tersedia
          </Button>
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