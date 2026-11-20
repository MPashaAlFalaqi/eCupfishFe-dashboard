"use client";

import { useState, useEffect, useMemo, type ReactNode } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import clsx from "clsx";
import TableBody from "./TableBody";

export interface Column<T> {
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
}

export interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[];
  rows: T[];
  empty?: string;
  rowClassName?: (row: T) => string;
  pageSize?: number;
  paginate?: boolean;
  pageSizeOptions?: number[];
}

export default function DataTable<T extends { id: string }>({
  columns,
  rows,
  empty = "Belum ada data",
  rowClassName,
  pageSize: initialPageSize = 5,
  paginate = true,
  pageSizeOptions = [5, 10, 20, 50],
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Jika jumlah data atau filter berubah, sesuaikan halaman saat ini
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const { displayedRows, startIdx, endIdx } = useMemo(() => {
    if (!paginate) {
      return {
        displayedRows: rows,
        startIdx: 0,
        endIdx: rows.length,
      };
    }
    const start = (currentPage - 1) * pageSize;
    const end = Math.min(start + pageSize, rows.length);
    return {
      displayedRows: rows.slice(start, end),
      startIdx: start,
      endIdx: end,
    };
  }, [rows, currentPage, pageSize, paginate]);

  // Logika pembuatan nomor halaman pintar (dengan elipsis ...)
  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "...")[] = [];
    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);
    return pages;
  }, [totalPages, currentPage]);

  const body = displayedRows.map(r => ({
    id: r.id,
    cls: rowClassName?.(r) ?? "",
    cells: columns.map(c => ({
      k: c.header,
      cls: c.className ?? "",
      node: c.cell(r),
    })),
  }));

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-primary-50 text-xs uppercase tracking-wide text-primary-400">
              {columns.map(c => (
                <th
                  key={c.header}
                  className={`px-3 py-2.5 font-medium ${c.className ?? ""}`}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <TableBody rows={body} cols={columns.length} empty={empty} />
        </table>
      </div>

      {/* Bar Navigasi Pagination */}
      {paginate && rows.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-primary-50 px-3 py-3 text-xs text-primary-500">
          {/* Info Jumlah Data */}
          <div className="flex items-center gap-2">
            <span>
              Menampilkan <b className="text-primary-800">{startIdx + 1}</b>–
              <b className="text-primary-800">{endIdx}</b> dari{" "}
              <b className="text-primary-800">{rows.length}</b> data
            </span>

            {/* Pilihan Ukuran Halaman */}
            <div className="ml-2 flex items-center gap-1.5">
              <span className="text-[11px] text-primary-400">Baris:</span>
              <select
                aria-label="Pilih jumlah baris per halaman"
                value={pageSize}
                onChange={e => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="rounded border border-primary-200 bg-white px-2 py-1 text-xs font-semibold text-primary-700 outline-none hover:border-primary-400 focus:border-primary-500"
              >
                {pageSizeOptions.map(opt => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Kontrol Navigasi Halaman */}
          <div className="flex items-center gap-1">
            {/* Ke Halaman Pertama */}
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              aria-label="Ke halaman pertama"
              title="Halaman Pertama"
              className="grid h-7 w-7 place-items-center rounded-lg border border-primary-100 bg-white text-primary-500 transition-colors hover:bg-primary-50 hover:text-primary-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronsLeft size={14} />
            </button>

            {/* Halaman Sebelumnya */}
            <button
              type="button"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Halaman sebelumnya"
              title="Halaman Sebelumnya"
              className="grid h-7 w-7 place-items-center rounded-lg border border-primary-100 bg-white text-primary-500 transition-colors hover:bg-primary-50 hover:text-primary-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={14} />
            </button>

            {/* Nomor Halaman */}
            <div className="flex items-center gap-1 px-1">
              {pageNumbers.map((num, i) =>
                num === "..." ? (
                  <span
                    key={`ellipsis-${i}`}
                    className="px-1 text-xs text-primary-300"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setCurrentPage(num)}
                    className={clsx(
                      "grid h-7 min-w-[1.75rem] px-1.5 place-items-center rounded-lg text-xs font-semibold transition-all",
                      currentPage === num
                        ? "bg-primary-900 text-white shadow-xs"
                        : "border border-primary-100 bg-white text-primary-700 hover:bg-primary-50"
                    )}
                  >
                    {num}
                  </button>
                )
              )}
            </div>

            {/* Halaman Selanjutnya */}
            <button
              type="button"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="Halaman selanjutnya"
              title="Halaman Selanjutnya"
              className="grid h-7 w-7 place-items-center rounded-lg border border-primary-100 bg-white text-primary-500 transition-colors hover:bg-primary-50 hover:text-primary-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={14} />
            </button>

            {/* Ke Halaman Terakhir */}
            <button
              type="button"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              aria-label="Ke halaman terakhir"
              title="Halaman Terakhir"
              className="grid h-7 w-7 place-items-center rounded-lg border border-primary-100 bg-white text-primary-500 transition-colors hover:bg-primary-50 hover:text-primary-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronsRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
