import Image from "next/image";
import AuthPanel from "@/components/AuthPanel";
import LupaSandiForm from "./LupaSandiForm";

export default function LupaSandiPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <AuthPanel>
        <div className="flex min-h-[200px] flex-1 items-center justify-center py-6"><Image src="/logo.png" alt="eCupFish" width={300} height={325} priority /></div>
        <div>
          <p className="mb-4 text-xl font-bold">eCup<span className="text-secondary-400">Fish</span></p>
          <h2 className="max-w-xl text-4xl font-bold leading-tight">Lupa kata sandi? Tenang, kami bantu.</h2>
          <p className="mb-10 mt-3 max-w-md text-base text-primary-200">Pulihkan akses akun tambak Anda dalam 3 langkah mudah.</p>
        </div>
      </AuthPanel>
      <section className="grid place-items-center bg-white p-8"><LupaSandiForm /></section>
    </div>
  );
}
