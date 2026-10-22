import Image from "next/image";
// Ikon bulat + tulisan (compact = ikon saja), dipakai di sidebar
export default function Logo({ size = 32, compact = false }: { size?: number; compact?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <Image src="/logo-icon.png" alt="eCupFish" width={size} height={size} priority />
      {!compact && <span className="text-xl font-bold text-white">eCup<span className="text-secondary-400">Fish</span></span>}
    </div>
  );
}
