"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Plus, SquarePen, Trash2 } from "lucide-react";
import clsx from "clsx";
import Topbar from "@/components/Topbar";
import Modal from "@/components/Modal";
import { useToast } from "@/components/Toast";
import FilterBar from "@/components/FilterBar";
import DataTable, { type Column } from "@/components/DataTable";
import { Button, Card } from "@/components/ui";
import type { Grade, Ikan } from "@/lib/types";
import KetersediaanModal from "./KetersediaanModal";

const gradeStyle: Record<Grade, string> = { A: "bg-secondary-100 text-secondary-700", B: "bg-primary-100 text-primary-600", C: "bg-slate-100 text-slate-600" };

export default function StokTable({ data }: { data: Ikan[] }) {
  const [items, setItems] = useState(data);
  const toast = useToast();
  const [q, setQ] = useState("");
  const [jenis, setJenis] = useState("");
  const [grade, setGrade] = useState("");
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState<Ikan | null>(null);
  const [toDelete, setToDelete] = useState<Ikan | null>(null);

  const total = items.reduce((n, i) => n + i.stok, 0);
  const jenisList = useMemo(() => Array.from(new Set(data.map(i => i.jenis))), [data]);
  const rows = items.filter(i =>
    (i.nama.toLowerCase().includes(q.toLowerCase()) || i.jenis.toLowerCase().includes(q.toLowerCase())) &&
    (!jenis || i.jenis === jenis) && (!grade || i.grade === grade) && (!status || i.status === status));

  const columns: Column<Ikan>[] = [
    { header: "Foto", cell: () => <div className="h-10 w-10 rounded-lg bg-primary-200" /> },
    { header: "Jenis Ikan", className: "max-w-[180px]", cell: i => <div><p className="font-bold leading-snug">{i.nama}</p><p className="text-xs text-primary-400">{i.varian}</p></div> },
    { header: "Grade", cell: i => <span className={clsx("grid h-7 w-7 place-items-center rounded-md text-xs font-bold", gradeStyle[i.grade])}>{i.grade}</span> },
    { header: "Usia", cell: i => `${i.usia} bulan` },
    { header: "Stok", cell: i => <b>{i.stok} ekor</b> },
    { header: "Status", cell: i => (
      <button onClick={() => setSelected(i)} aria-label={`Atur ketersediaan ${i.nama}`}
        className={clsx("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", i.status === "Tersedia" ? "bg-primary-50 text-primary-600" : "bg-slate-100 text-slate-500")}>
        <span className={clsx("h-1.5 w-1.5 rounded-full", i.status === "Tersedia" ? "bg-primary-400" : "bg-slate-400")} />{i.status}
      </button>) },
    { header: "Kondisi Kesehatan", className: "max-w-[220px]", cell: i => i.kesehatan },
    { header: "Aksi", cell: i => (
      <div className="flex gap-2">
        <Link href={`/stok/${i.id}/edit`} aria-label={`Edit ${i.nama}`} className="grid h-9 w-9 place-items-center rounded-lg border border-primary-100 text-primary-600 hover:bg-primary-50"><SquarePen size={15} /></Link>
        <button onClick={() => setToDelete(i)} aria-label={`Hapus ${i.nama}`} className="grid h-9 w-9 place-items-center rounded-lg border border-red-100 text-red-500 hover:bg-red-50"><Trash2 size={15} /></button>
      </div>) },
  ];

  return (
    <>
      <Topbar title="Manajemen Stok Cupang" subtitle={`${items.length} varian cupang · ${total.toLocaleString("id-ID")} ekor total stok aktif`}
        action={<Link href="/stok/baru"><Button><Plus size={16} />Tambah Ikan Baru</Button></Link>} />
      <FilterBar total={rows.length} search={{ value: q, onChange: setQ, placeholder: "Cari nama atau jenis ikan..." }}
        filters={[{ label: "Jenis", value: jenis, onChange: setJenis, options: jenisList }, { label: "Grade", value: grade, onChange: setGrade, options: [{ value: "A", label: "Grade A" }, { value: "B", label: "Grade B" }, { value: "C", label: "Grade C" }] },
          { label: "Status", value: status, onChange: setStatus, options: ["Tersedia", "Habis"] }]} />
      <Card className="!p-2">
        <DataTable columns={columns} rows={rows} empty="Ikan tidak ditemukan" />
      </Card>

      <KetersediaanModal ikan={selected} onClose={() => setSelected(null)} />
      <Modal open={!!toDelete} onClose={() => setToDelete(null)} title="Hapus data ikan?" subtitle={toDelete?.nama}
        footer={<><Button variant="outline" onClick={() => setToDelete(null)}>Batal</Button>
          <Button className="!bg-red-500 hover:!bg-red-600" onClick={() => { setItems(s => s.filter(i => i.id !== toDelete?.id)); setToDelete(null); toast("Data ikan dihapus"); }}>Hapus</Button></>}>
        <p className="text-sm text-primary-600">Data ini akan dihapus dari daftar stok dan tidak bisa dikembalikan.</p>
      </Modal>
    </>
  );
}
