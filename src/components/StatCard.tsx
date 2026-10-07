import type { LucideIcon } from "lucide-react";
import clsx from "clsx";
import CountUp from "./CountUp";
const noteColor = { red: "text-red-500", blue: "text-primary-500", gold: "text-secondary-500" };
export default function StatCard({ label, value, note, noteTone, icon: Icon, iconTone = "blue", variant = "default" }:
  { label: string; value: string; note?: string; noteTone?: keyof typeof noteColor; icon?: LucideIcon; iconTone?: "blue" | "gold"; variant?: "default" | "navy" | "gold" | "blue" }) {
  const tile = variant === "navy" ? "bg-white/10 text-secondary-300" : variant === "gold" ? "bg-white/30 text-primary-950"
    : iconTone === "gold" ? "bg-secondary-100 text-secondary-600" : "bg-primary-50 text-primary-500";
  return (
    <div className={clsx("stat-card rounded-card p-4 shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-lg",
      variant === "default" && "bg-white", variant === "navy" && "bg-navy text-white", variant === "blue" && "bg-gradient-to-b from-primary-500 to-primary-700 text-white", variant === "gold" && "bg-gold text-primary-950")}>
      <div className="flex items-start justify-between">
        <p className={clsx("text-sm", variant === "navy" || variant === "blue" ? "text-primary-200" : "text-primary-500")}>{label}</p>
        {Icon && <span className={clsx("grid h-8 w-8 place-items-center rounded-lg", tile)}><Icon size={16} /></span>}
      </div>
      <p className="mt-2 text-2xl font-bold"><CountUp value={value} /></p>
      {note && <p className={clsx("mt-1 text-xs", noteTone ? noteColor[noteTone] : variant === "navy" ? "text-secondary-300" : "text-primary-400")}>{note}</p>}
    </div>
  );
}
