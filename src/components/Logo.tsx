import Image from "next/image";
// Ikon bulat + tulisan, dipakai di sidebar
export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <Image src="/logo-icon.png" alt="" width={size} height={size} priority />
      <span className="text-xl font-bold text-white">eCup<span className="text-secondary-400">Fish</span></span>
    </div>
  );
}
