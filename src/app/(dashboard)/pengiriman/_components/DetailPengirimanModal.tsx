"use client";
import { useEffect, useState } from "react";
import { Check, Copy, Home, Printer, Truck } from "lucide-react";
import clsx from "clsx";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui";
import { useToast } from "@/components/Toast";
import { useDashboardData } from "@/components/DashboardDataProvider";
import type { Pengiriman, StatusKirim } from "@/lib/types";
import StatusBadge from "./StatusBadge";

const stage: Record<StatusKirim, number> = {
  Diproses: 0,
  "Dalam Pengiriman": 1,
  Terlambat: 1,
  Diterima: 2,
};
const steps = [
  {
    label: "Diproses",
    icon: Check,
    done: "Pesanan disiapkan & dikemas",
    wait: "Pesanan sedang disiapkan",
  },
  {
    label: "Dalam Pengiriman",
    icon: Truck,
    done: "Paket dalam perjalanan ke pembeli",
    wait: "Menunggu diserahkan ke kurir",
  },
  {
    label: "Tiba",
    icon: Home,
    done: "Diterima pembeli & dana diteruskan",
    wait: "Menunggu konfirmasi pembeli",
  },
];
const sub = "text-sm font-semibold text-primary-500";

export default function DetailPengirimanModal({
  data,
  onClose,
}: {
  data: Pengiriman | null;
  onClose: () => void;
}) {
  const { updatePengiriman } = useDashboardData();
  const toast = useToast();
  const [kurirInput, setKurirInput] = useState("");
  const [resiInput, setResiInput] = useState("");
  const [statusInput, setStatusInput] = useState<StatusKirim>("Diproses");

  useEffect(() => {
    if (data) {
      setKurirInput(data.kurir);
      setResiInput(data.resi === "—" ? "" : data.resi);
      setStatusInput(data.status);
    }
  }, [data]);

  if (!data) return null;

  const now = stage[statusInput];
  const kurirOpsi = ["JNE Live Fish", "Dayak Fresh", "Kurir Tambak Sendiri"];

  const handleSimpan = () => {
    updatePengiriman(data.id, {
      kurir: kurirInput,
      resi: resiInput.trim() || "—",
      status: statusInput,
    });
    toast("Status & info pengiriman diperbarui");
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      size="max-w-md"
      title="Detail Pengiriman"
      subtitle={`${data.id} · ${data.pembeli}`}
      icon={
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary-500">
          <Truck size={18} />
        </div>
      }
      footer={
        <>
          <a href={`/label/${data.id.slice(1)}`} target="_blank" rel="noreferrer">
            <Button variant="outline">
              <Printer size={16} />
              Cetak Label
            </Button>
          </a>
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
          <Button onClick={handleSimpan}>
            <Check size={16} />
            Simpan Perubahan
          </Button>
        </>
      }
    >
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 shrink-0 rounded-xl bg-primary-200" />
        <div className="min-w-0 flex-1">
          <p className="font-bold">{data.ikan}</p>
          <p className="text-xs text-primary-400">
            Grade {data.grade} · Dikirim {data.tanggalKirim}
          </p>
        </div>
        <StatusBadge status={statusInput} />
      </div>
      <hr className="-mx-5 border-primary-50" />
      <p className={sub}>Informasi Kurir & Status</p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Kurir</label>
          <select
            className="input"
            value={kurirInput}
            onChange={e => setKurirInput(e.target.value)}
          >
            {kurirOpsi.map(k => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Nomor Resi</label>
          <div className="relative">
            <input
              className="input pr-10"
              value={resiInput}
              onChange={e => setResiInput(e.target.value)}
              placeholder="Masukkan nomor resi"
            />
            <button
              type="button"
              aria-label="Salin nomor resi"
              onClick={() =>
                resiInput && navigator.clipboard?.writeText(resiInput)
              }
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-primary-400 hover:text-primary-600"
            >
              <Copy size={15} />
            </button>
          </div>
        </div>
        <div className="col-span-2">
          <label className="label">Status Pengiriman</label>
          <select
            className="input"
            value={statusInput}
            onChange={e => setStatusInput(e.target.value as StatusKirim)}
          >
            <option value="Diproses">Diproses</option>
            <option value="Dalam Pengiriman">Dalam Pengiriman</option>
            <option value="Diterima">Diterima</option>
            <option value="Terlambat">Terlambat</option>
          </select>
        </div>
      </div>
      <hr className="-mx-5 border-primary-50" />
      <p className={sub}>Lacak Pesanan</p>
      <ol>
        {steps.map((s, i) => {
          const done = i <= now;
          return (
            <li key={s.label} className="relative flex gap-3 pb-4 last:pb-0">
              {i < 2 && (
                <span
                  className={clsx(
                    "absolute bottom-0 left-[11px] top-6 w-0.5",
                    i < now ? "bg-primary-900" : "bg-primary-100"
                  )}
                />
              )}
              <span
                className={clsx(
                  "relative z-10 grid h-6 w-6 shrink-0 place-items-center rounded-full",
                  done
                    ? "bg-primary-900 text-white"
                    : "border border-primary-100 bg-white text-primary-300"
                )}
              >
                <s.icon size={12} />
              </span>
              <div>
                <p
                  className={clsx(
                    "text-sm font-semibold",
                    !done && "text-primary-400"
                  )}
                >
                  {s.label}
                </p>
                <p className="text-xs text-primary-400">
                  {done ? s.done : s.wait}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </Modal>
  );
}