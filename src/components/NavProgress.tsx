"use client";
import { usePathname } from "next/navigation";
// Garis emas tipis di atas layar setiap pindah halaman
export default function NavProgress() {
  const path = usePathname();
  return <div key={path} aria-hidden className="pointer-events-none print:hidden fixed left-0 top-0 z-[60] h-0.5 animate-progress bg-gold" />;
}
