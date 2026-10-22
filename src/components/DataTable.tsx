import type { ReactNode } from "react";
import TableBody from "./TableBody";
export interface Column<T> { header: string; cell: (row: T) => ReactNode; className?: string }
export default function DataTable<T extends { id: string }>({ columns, rows, empty = "Belum ada data", rowClassName }:
  { columns: Column<T>[]; rows: T[]; empty?: string; rowClassName?: (row: T) => string }) {
  const body = rows.map(r => ({ id: r.id, cls: rowClassName?.(r) ?? "", cells: columns.map(c => ({ k: c.header, cls: c.className ?? "", node: c.cell(r) })) }));
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead><tr className="border-b border-primary-50 text-xs uppercase tracking-wide text-primary-400">
          {columns.map(c => <th key={c.header} className={`px-3 py-2.5 font-medium ${c.className ?? ""}`}>{c.header}</th>)}
        </tr></thead>
        <TableBody rows={body} cols={columns.length} empty={empty} />
      </table>
    </div>
  );
}
