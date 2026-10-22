export const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
// "Hari ini" untuk data contoh (tetap, supaya filter periode selalu menghasilkan data). Ganti dengan new Date() saat memakai backend.
export const REFERENSI = new Date(2026, 9, 5);

export type PeriodeKey = "" | "7h" | "30h" | "bulan" | "bulan-lalu" | "3bulan" | "tahun" | "custom";
export const PERIODE_OPSI: { value: PeriodeKey; label: string }[] = [
  { value: "", label: "Semua waktu" }, { value: "7h", label: "7 hari terakhir" }, { value: "30h", label: "30 hari terakhir" },
  { value: "bulan", label: "Bulan ini" }, { value: "bulan-lalu", label: "Bulan lalu" }, { value: "3bulan", label: "3 bulan terakhir" },
  { value: "tahun", label: "Tahun ini" }, { value: "custom", label: "Rentang tanggal" },
];
const tgl = (y: number, m: number, d: number) => new Date(y, m, d);
export const fmtTanggal = (d: Date) => `${String(d.getDate()).padStart(2, "0")} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
export const isoTanggal = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const dariIso = (s: string) => { if (!s) return null; const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };

/** Mengambil tanggal pertama berformat "03 Okt 2026" dari teks bebas; null jika tidak ada. */
export function ekstrakTanggal(s: string): Date | null {
  const m = /(\d{1,2}) (Jan|Feb|Mar|Apr|Mei|Jun|Jul|Agu|Sep|Okt|Nov|Des) (\d{4})/.exec(s);
  return m ? new Date(+m[3], BULAN.indexOf(m[2]), +m[1]) : null;
}
export function rentang(p: PeriodeKey, dari = "", sampai = ""): [Date | null, Date | null] {
  const y = REFERENSI.getFullYear(), m = REFERENSI.getMonth(), d = REFERENSI.getDate();
  switch (p) {
    case "7h": return [tgl(y, m, d - 6), REFERENSI];
    case "30h": return [tgl(y, m, d - 29), REFERENSI];
    case "bulan": return [tgl(y, m, 1), tgl(y, m + 1, 0)];
    case "bulan-lalu": return [tgl(y, m - 1, 1), tgl(y, m, 0)];
    case "3bulan": return [tgl(y, m - 2, 1), REFERENSI];
    case "tahun": return [tgl(y, 0, 1), tgl(y, 11, 31)];
    case "custom": return [dariIso(dari), dariIso(sampai)];
    default: return [null, null];
  }
}
export function dalamPeriode(t: Date | null, p: PeriodeKey, dari = "", sampai = ""): boolean {
  if (!p) return true;
  if (!t) return false;
  const [a, b] = rentang(p, dari, sampai);
  return (!a || t >= a) && (!b || t <= b);
}
