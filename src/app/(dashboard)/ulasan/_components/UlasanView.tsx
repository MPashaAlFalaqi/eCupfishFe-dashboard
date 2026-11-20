"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "@/components/Toast";
import { Flag, MessageSquare, Star, ThumbsUp, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import FilterBar, { usePeriode } from "@/components/FilterBar";
import { dalamPeriode, ekstrakTanggal } from "@/lib/periode";
import Stars from "@/components/Stars";
import Modal from "@/components/Modal";
import { Button, Card, Pill } from "@/components/ui";
import { useDashboardData } from "@/components/DashboardDataProvider";
import ResetDataButton from "@/components/ResetDataButton";
import type { Ulasan } from "@/lib/types";

const initials = (n: string) =>
  n
    .split(" ")
    .map(w => w[0])
    .join("")
    .slice(0, 2);

export default function UlasanView({ data }: { data?: Ulasan[] }) {
  const { ulasan, setUlasan } = useDashboardData();
  const items = ulasan.length > 0 ? ulasan : data ?? [];
  const toast = useToast();
  const [q, setQ] = useState("");
  const [rating, setRating] = useState("");
  const [balasF, setBalasF] = useState("");
  const periode = usePeriode();
  const [balas, setBalas] = useState<string | null>(null);
  const [teks, setTeks] = useState("");
  const [lapor, setLapor] = useState<Ulasan | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const avg = items.length
    ? items.reduce((n, i) => n + i.bintang, 0) / items.length
    : 0;
  const belum = items.filter(i => !i.balasan).length;
  const lima = items.length
    ? Math.round(
        (items.filter(i => i.bintang === 5).length / items.length) * 100
      )
    : 0;

  const k = q.toLowerCase();
  const rows = items.filter(
    i =>
      (!rating || i.bintang === Number(rating)) &&
      (!balasF || (balasF === "Belum dibalas" ? !i.balasan : !!i.balasan)) &&
      dalamPeriode(
        ekstrakTanggal(i.tanggal),
        periode.value,
        periode.dari,
        periode.sampai
      ) &&
      [i.nama, i.produk, i.komentar].some(v => v.toLowerCase().includes(k))
  );

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedRows = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const kirim = (id: string) => {
    if (!teks.trim()) return;
    setUlasan(s =>
      s.map(i => (i.id === id ? { ...i, balasan: teks.trim() } : i))
    );
    setBalas(null);
    setTeks("");
    toast("Balasan terkirim");
  };

  return (
    <>
      <Topbar
        title="Ulasan & Rating"
        subtitle="Tanggapi ulasan pembeli untuk membangun kepercayaan toko"
        action={<ResetDataButton label="Reset Data" />}
      />
      <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          variant="blue"
          label="Rating Rata-rata"
          value={`${avg.toFixed(1).replace(".", ",")} / 5`}
          icon={Star}
        />
        <StatCard
          label="Total Ulasan"
          value={String(items.length)}
          icon={MessageSquare}
        />
        <StatCard
          label="Belum Dibalas"
          value={String(belum)}
          note={belum ? "Balas dalam 2 hari ya" : "Semua sudah dibalas"}
          noteTone={belum ? "red" : "blue"}
          icon={MessageSquare}
        />
        <StatCard
          label="Ulasan Bintang 5"
          value={`${lima}%`}
          icon={ThumbsUp}
        />
      </div>
      <FilterBar
        total={rows.length}
        periode={periode}
        search={{
          value: q,
          onChange: setQ,
          placeholder: "Cari pembeli, produk, komentar...",
        }}
        filters={[
          {
            label: "Rating",
            value: rating,
            onChange: setRating,
            options: [5, 4, 3, 2, 1].map(n => ({
              value: String(n),
              label: `${n} ★`,
            })),
          },
          {
            label: "Balasan",
            value: balasF,
            onChange: setBalasF,
            options: ["Belum dibalas", "Sudah dibalas"],
          },
        ]}
      />
      {rows.length === 0 && (
        <Card>
          <p className="py-10 text-center text-primary-400">
            Belum ada ulasan di kategori ini.
          </p>
        </Card>
      )}
      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {paginatedRows.map(u => (
            <motion.div
              key={u.id}
              layout
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.22 }}
            >
              <Card>
                <div className="flex flex-wrap items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-100 text-sm font-bold text-primary-600">
                    {initials(u.nama)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <b>{u.nama}</b>
                      <Stars n={u.bintang} />
                      <span className="text-xs text-primary-400">
                        {u.tanggal}
                      </span>
                      {u.dilaporkan && <Pill tone="red">Dilaporkan</Pill>}
                    </div>
                    <p className="text-xs text-primary-400">{u.produk}</p>
                    <p className="mt-2 text-sm">{u.komentar}</p>
                    {u.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {u.tags.map(t => (
                          <span
                            key={t}
                            className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs text-primary-600"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                    {u.balasan && (
                      <div className="mt-3 rounded-lg bg-primary-50 p-3 text-sm">
                        <p className="mb-0.5 text-xs font-semibold text-primary-500">
                          Balasan Anda
                        </p>
                        {u.balasan}
                      </div>
                    )}
                    {balas === u.id && (
                      <div className="mt-3">
                        <textarea
                          className="input"
                          rows={2}
                          value={teks}
                          onChange={e => setTeks(e.target.value)}
                          placeholder="Tulis balasan yang ramah untuk pembeli..."
                        />
                        <div className="mt-2 flex gap-2">
                          <Button
                            className="!py-1.5"
                            onClick={() => kirim(u.id)}
                          >
                            Kirim Balasan
                          </Button>
                          <Button
                            variant="outline"
                            className="!py-1.5"
                            onClick={() => {
                              setBalas(null);
                              setTeks("");
                            }}
                          >
                            Batal
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-2 max-sm:w-full max-sm:justify-end">
                    {!u.balasan && balas !== u.id && (
                      <Button
                        variant="outline"
                        className="!px-3 !py-1.5"
                        onClick={() => {
                          setBalas(u.id);
                          setTeks("");
                        }}
                      >
                        Balas
                      </Button>
                    )}
                    {!u.dilaporkan && (
                      <button
                        aria-label="Laporkan ulasan"
                        onClick={() => setLapor(u)}
                        className="grid h-9 w-9 place-items-center rounded-lg border border-primary-100 text-primary-400 hover:bg-primary-50"
                      >
                        <Flag size={15} />
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Bar Pagination */}
      {rows.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary-100 bg-white p-3 text-xs text-primary-600 shadow-2xs">
          <div className="flex items-center gap-2">
            <span>
              Menampilkan <b>{(currentPage - 1) * pageSize + 1}</b>–
              <b>{Math.min(currentPage * pageSize, rows.length)}</b> dari{" "}
              <b>{rows.length}</b> ulasan
            </span>
            <div className="ml-2 flex items-center gap-1.5">
              <span className="text-[11px] text-primary-400">Baris:</span>
              <select
                value={pageSize}
                onChange={e => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="rounded border border-primary-200 bg-white px-2 py-0.5 text-xs font-semibold text-primary-700 outline-none"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage(1)}
              disabled={currentPage === 1}
              className="grid h-7 w-7 place-items-center rounded-lg border border-primary-200 bg-white text-primary-600 hover:bg-primary-50 disabled:opacity-40"
              title="Halaman Pertama"
            >
              <ChevronsLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="grid h-7 w-7 place-items-center rounded-lg border border-primary-200 bg-white text-primary-600 hover:bg-primary-50 disabled:opacity-40"
              title="Halaman Sebelumnya"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <span className="px-2 text-xs font-semibold text-primary-700">
              Hal {currentPage} dari {totalPages}
            </span>

            <button
              type="button"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="grid h-7 w-7 place-items-center rounded-lg border border-primary-200 bg-white text-primary-600 hover:bg-primary-50 disabled:opacity-40"
              title="Halaman Berikutnya"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setPage(totalPages)}
              disabled={currentPage === totalPages}
              className="grid h-7 w-7 place-items-center rounded-lg border border-primary-200 bg-white text-primary-600 hover:bg-primary-50 disabled:opacity-40"
              title="Halaman Terakhir"
            >
              <ChevronsRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
      <Modal
        open={!!lapor}
        onClose={() => setLapor(null)}
        title="Laporkan ulasan?"
        subtitle={lapor ? `${lapor.nama} · ${lapor.produk}` : ""}
        footer={
          <>
            <Button variant="outline" onClick={() => setLapor(null)}>
              Batal
            </Button>
            <Button
              onClick={() => {
                setUlasan(s =>
                  s.map(i =>
                    i.id === lapor?.id ? { ...i, dilaporkan: true } : i
                  )
                );
                setLapor(null);
                toast("Laporan terkirim, terima kasih");
              }}
            >
              Laporkan
            </Button>
          </>
        }
      >
        <label className="label">Alasan</label>
        <select className="input">
          <option>Mengandung kata kasar</option>
          <option>Bukan ulasan produk ini</option>
          <option>Spam atau iklan</option>
          <option>Lainnya</option>
        </select>
        <p className="text-sm text-primary-500">
          Tim eCupFish akan meninjau laporanmu. Ulasan tetap tampil sampai ada
          keputusan.
        </p>
      </Modal>
    </>
  );
}