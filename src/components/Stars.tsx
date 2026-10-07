import { Star } from "lucide-react";
import clsx from "clsx";
export default function Stars({ n, size = 16 }: { n: number; size?: number }) {
  return <span className="inline-flex gap-0.5" aria-label={`${n} dari 5 bintang`}>{[1, 2, 3, 4, 5].map(i => <Star key={i} size={size} className={i <= Math.round(n) ? "fill-secondary-500 text-secondary-500" : "text-primary-100"} />)}</span>;
}
