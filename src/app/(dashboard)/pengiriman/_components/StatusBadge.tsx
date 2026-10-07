import { Pill } from "@/components/ui";
import type { StatusKirim } from "@/lib/types";
const tone = { "Dalam Pengiriman": "blue", Terlambat: "gold", Diterima: "green" } as const;
export default function StatusBadge({ status }: { status: StatusKirim }) {
  if (status === "Diproses")
    return <span className="inline-flex rounded-full border border-primary-100 bg-white px-2.5 py-1 text-xs font-semibold text-primary-600">Diproses</span>;
  return <Pill tone={tone[status]}>{status}</Pill>;
}
