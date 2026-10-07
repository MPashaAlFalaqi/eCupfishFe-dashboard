export const rp = (n: number) => "Rp " + n.toLocaleString("id-ID");
import type { SesiLelang } from "./types";
export const hms = (s: number) => { const p = (n: number) => String(Math.max(0, n)).padStart(2, "0"); return `${p(Math.floor(s / 3600))}:${p(Math.floor(s / 60) % 60)}:${p(s % 60)}`; };
export const bidTertinggi = (s: SesiLelang) => s.bids[0]?.jumlah ?? s.hargaAwal;
