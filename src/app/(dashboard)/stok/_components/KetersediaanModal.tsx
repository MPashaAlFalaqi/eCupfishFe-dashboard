"use client";
import { useEffect, useState } from "react";
import { Check, Fish } from "lucide-react";
import Modal from "@/components/Modal";
import Toggle from "@/components/Toggle";
import FormField from "@/components/FormField";
import { Button } from "@/components/ui";
import { useToast } from "@/components/Toast";
import { useDashboardData } from "@/components/DashboardDataProvider";
import type { Ikan } from "@/lib/types";

function Suffix({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-primary-400">
        ekor
      </span>
    </div>
  );
}

export default function KetersediaanModal({
  ikan,
  onClose,
}: {
  ikan: Ikan | null;
  onClose: () => void;
}) {
  const dashboardData = useDashboardData();
  const updateIkan = (
    dashboardData as typeof dashboardData & {
      updateIkan?: (id: Ikan["id"], updates: Partial<Ikan>) => void;
    }
  ).updateIkan;
  const toast = useToast();
  const [tersedia, setTersedia] = useState(true);
  const [otomatis, setOtomatis] = useState(true);
  const [stokBaru, setStokBaru] = useState(0);

  useEffect(() => {
    if (ikan) {
      setTersedia(ikan.status === "Tersedia");
      setStokBaru(ikan.stok);
    }
  }, [ikan]);

  const handleSimpan = () => {
    if (!ikan || !updateIkan) return;
    const statusAkhir = otomatis
      ? stokBaru > 0
        ? "Tersedia"
        : "Habis"
      : tersedia
      ? "Tersedia"
      : "Habis";
    updateIkan(ikan.id, {
      stok: Math.max(0, stokBaru),
      status: statusAkhir,
      publish: statusAkhir === "Tersedia",
    });
    toast("Ketersediaan stok diperbarui");
    onClose();
  };

  return (
    <Modal
      open={!!ikan}
      onClose={onClose}
      title="Atur Ketersediaan Stok"
      subtitle={
        ikan
          ? `${ikan.nama} · ${ikan.varian.split(" · ")[0]} · Grade ${ikan.grade}`
          : ""
      }
      icon={
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-b from-primary-500 to-primary-800 text-white">
          <Fish size={18} />
        </div>
      }
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleSimpan}>
            <Check size={16} />
            Simpan Perubahan
          </Button>
        </>
      }
    >
      <div className="flex items-center justify-between gap-4 pb-4">
        <div>
          <p className="font-semibold">Status ketersediaan</p>
          <p className="text-sm text-primary-500">
            Tersedia — tampil ke pembeli & bisa dijadikan sesi lelang
          </p>
        </div>
        <Toggle
          checked={tersedia}
          onChange={setTersedia}
          label="Status ketersediaan"
        />
      </div>
      <div className="flex items-center justify-between gap-4 border-t border-primary-50 pt-4">
        <div>
          <p className="font-semibold">Ikuti jumlah stok otomatis</p>
          <p className="text-sm text-primary-500">
            Saat aktif, status otomatis berubah jadi “Habis” bila stok mencapai 0
            ekor, dan kembali “Tersedia” saat stok ditambah.
          </p>
        </div>
        <Toggle
          checked={otomatis}
          onChange={setOtomatis}
          label="Ikuti jumlah stok otomatis"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Jumlah Stok Saat Ini">
          <Suffix>
            <input
              className="input pr-14"
              type="number"
              min={0}
              value={stokBaru}
              onChange={e => setStokBaru(Number(e.target.value))}
            />
          </Suffix>
        </FormField>
        <FormField label="Ambang Batas “Hampir Habis”">
          <Suffix>
            <input className="input pr-14" type="number" defaultValue={20} />
          </Suffix>
        </FormField>
      </div>
      <FormField label="Alasan perubahan manual (opsional)">
        <textarea
          className="input"
          rows={3}
          placeholder="cth. Sedang dipindahkan ke kolam lain untuk sortasi ulang"
        />
      </FormField>
    </Modal>
  );
}