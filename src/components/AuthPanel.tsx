import type { ReactNode } from "react";
// Panel kiri halaman login/register: gradasi + gelombang + titik emas (warna diambil dari Figma)
const dots = [["84%", "19%", 10], ["75%", "27%", 6], ["90%", "34%", 8]] as const;
export default function AuthPanel({ children, showDots = true }: { children: ReactNode; showDots?: boolean }) {
  return (
    <section className="relative hidden flex-col overflow-hidden p-12 text-white lg:flex"
      style={{ background: "linear-gradient(200deg,#041727 0%,#0a2a44 50%,#0e3858 78%,#18507b 100%)" }}>
      {showDots && dots.map(([l, t, s]) => (
        <span key={l} aria-hidden className="absolute rounded-full bg-secondary-500/80" style={{ left: l, top: t, width: s, height: s }} />
      ))}
      <svg aria-hidden viewBox="0 0 570 230" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%] w-full">
        <defs><linearGradient id="wave" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1a5785" /><stop offset="1" stopColor="#113e60" /></linearGradient></defs>
        <path d="M0 60 C90 20 170 20 260 55 S440 100 570 40 L570 230 L0 230Z" fill="url(#wave)" />
        <path d="M0 175 C100 150 200 160 300 180 S470 195 570 165 L570 230 L0 230Z" fill="#03101c" />
      </svg>
      <div className="relative z-10 flex flex-1 flex-col">{children}</div>
    </section>
  );
}
