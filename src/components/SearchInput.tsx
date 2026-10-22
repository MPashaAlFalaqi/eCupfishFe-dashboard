import { Search } from "lucide-react";
export default function SearchInput({ value, onChange, placeholder = "Cari...", className = "w-full sm:w-64" }: { value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-300" />
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="input pl-9" />
    </div>
  );
}
