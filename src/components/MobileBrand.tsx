import Image from "next/image";
// Logo di atas form untuk layar kecil (panel kiri disembunyikan di bawah 1024 px)
export default function MobileBrand() {
  return <div className="flex justify-center lg:hidden"><Image src="/logo.png" alt="eCupFish" width={96} height={104} priority /></div>;
}
