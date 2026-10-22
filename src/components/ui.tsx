import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "gold" | "outline" | "ghost";
export function Button({ variant = "primary", className, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button {...p} className={clsx(
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-base font-semibold transition duration-150 active:scale-[0.97] disabled:opacity-50",
    variant === "primary" && "bg-primary-400 text-white hover:bg-primary-500",
    variant === "gold" && "bg-gold text-primary-950 hover:brightness-95",
    variant === "outline" && "border border-primary-200 bg-white text-primary-700 hover:bg-primary-50",
    variant === "ghost" && "text-primary-700 hover:bg-primary-50", className)} />;
}
export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={clsx("min-w-0 rounded-card bg-white p-4 shadow-card transition-shadow duration-200 hover:shadow-[0_2px_4px_rgba(8,36,64,.05),0_10px_28px_rgba(8,36,64,.09)]", className)}>{children}</div>;
}
const tones = { blue: "bg-primary-100 text-primary-600", gold: "bg-secondary-100 text-secondary-700", red: "bg-red-50 text-red-600", green: "bg-emerald-50 text-emerald-600", gray: "bg-slate-100 text-slate-600" };
export function Badge({ tone = "blue", children }: { tone?: keyof typeof tones; children: ReactNode }) {
  return <span className={clsx("rounded-full px-2 py-0.5 text-xs font-medium", tones[tone])}>{children}</span>;
}

const pillTone = {
  blue: ["bg-primary-50 text-primary-600", "bg-primary-400"], gold: ["bg-secondary-100 text-secondary-700", "bg-secondary-500"],
  gray: ["bg-slate-100 text-slate-500", "bg-slate-400"], red: ["bg-red-50 text-red-600", "bg-red-500"], green: ["bg-emerald-50 text-emerald-600", "bg-emerald-500"],
} as const;
export function Pill({ tone = "blue", children }: { tone?: keyof typeof pillTone; children: ReactNode }) {
  const [c, d] = pillTone[tone];
  return <span className={clsx("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", c)}><span className={clsx("h-1.5 w-1.5 rounded-full", d)} />{children}</span>;
}
