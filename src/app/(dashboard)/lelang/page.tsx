import Link from "next/link";
import Topbar from "@/components/Topbar";
import { Button } from "@/components/ui";
import LelangForm from "./_components/LelangForm";
import SesiAktif from "./_components/SesiAktif";
export default function LelangPage() {
  return (
    <>
      <Topbar title="Buat Sesi Lelang Baru" subtitle="Lelang · Buat Baru" action={<Link href="/lelang/sesi"><Button variant="outline">Semua Sesi Lelang</Button></Link>} />
      <LelangForm />
      <SesiAktif />
    </>
  );
}
