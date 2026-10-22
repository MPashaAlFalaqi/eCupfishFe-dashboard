"use client";
import { useState } from "react";
import { CalendarDays, ChevronDown, RotateCcw, type LucideIcon } from "lucide-react";
import clsx from "clsx";
import SearchInput from "./SearchInput";
import { Button, Card } from "./ui";
import { PERIODE_OPSI, type PeriodeKey } from "@/lib/periode";

type Opt = string | { value: string; label: string };
const norm = (o: Opt) => (typeof o === "string" ? { value: o, label: o } : o);

export function FilterSelect({ value, onChange, label, options, allLabel, icon: Icon, hideAll }:
  { value: string; onChange: (v: string) => void; label: string; options: Opt[]; allLabel?: string; icon?: LucideIcon; hideAll?: boolean }) {
  return (
    <div className="relative">
      {Icon && <Icon size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-primary-500" />}
      <select aria-label={label} value={value} onChange={e => onChange(e.target.value)} className={clsx("input !w-auto appearance-none pr-9 font-medium", Icon ? "pl-9" : "pl-3")}>
        {!hideAll && <option value="">{allLabel ?? `Semua ${label}`}</option>}
        {options.map(o => { const x = norm(o); return <option key={x.value} value={x.value}>{x.label}</option>; })}
      </select>
      <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-primary-500" />
    </div>
  );
}

/** State filter periode (preset + rentang tanggal). `awal` = nilai bawaan saat Reset. */
export function usePeriode(awal: PeriodeKey = "") {
  const [value, setValue] = useState<PeriodeKey>(awal);
  const [dari, setDari] = useState("");
  const [sampai, setSampai] = useState("");
  return { value, dari, sampai, awal, setValue, setDari, setSampai, reset: () => { setValue(awal); setDari(""); setSampai(""); } };
}

export interface FilterDef { label: string; value: string; onChange: (v: string) => void; options: Opt[]; allLabel?: string }

/** Bilah filter standar untuk semua halaman daftar: pencarian, dropdown, periode, jumlah hasil, dan reset. */
export default function FilterBar({ search, filters = [], periode, opsiPeriode = PERIODE_OPSI, total }:
  { search?: { value: string; onChange: (v: string) => void; placeholder: string }; filters?: FilterDef[]; periode?: ReturnType<typeof usePeriode>; opsiPeriode?: { value: string; label: string }[]; total?: number }) {
  const aktif = !!search?.value || filters.some(f => f.value) || (!!periode && (periode.value !== periode.awal || !!periode.dari || !!periode.sampai));
  const reset = () => { search?.onChange(""); filters.forEach(f => f.onChange("")); periode?.reset(); };
  return (
    <Card className="mb-4 !p-3">
      <div className="flex flex-wrap items-center gap-2">
        {search && <SearchInput value={search.value} onChange={search.onChange} placeholder={search.placeholder} />}
        {filters.map(f => <FilterSelect key={f.label} label={f.label} value={f.value} onChange={f.onChange} options={f.options} allLabel={f.allLabel} />)}
        {periode && (<>
          <FilterSelect icon={CalendarDays} hideAll label="Periode" value={periode.value} onChange={v => periode.setValue(v as PeriodeKey)} options={opsiPeriode} />
          {periode.value === "custom" && (
            <div className="flex items-center gap-2">
              <input type="date" aria-label="Dari tanggal" className="input !w-auto" value={periode.dari} max={periode.sampai || undefined} onChange={e => periode.setDari(e.target.value)} />
              <span className="text-primary-400">–</span>
              <input type="date" aria-label="Sampai tanggal" className="input !w-auto" value={periode.sampai} min={periode.dari || undefined} onChange={e => periode.setSampai(e.target.value)} />
            </div>)}
        </>)}
        <div className="ml-auto flex items-center gap-3">
          {total !== undefined && <span className="text-sm text-primary-400">{total} hasil</span>}
          <Button variant="ghost" disabled={!aktif} onClick={reset} className="!px-3 !py-1.5"><RotateCcw size={14} />Reset</Button>
        </div>
      </div>
    </Card>
  );
}
