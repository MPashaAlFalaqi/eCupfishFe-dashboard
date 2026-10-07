import { notFound } from "next/navigation";
import KlaimDetailView from "../_components/KlaimDetailView";
import { klaimList } from "@/lib/mock-data";
export default function DetailKlaimPage({ params }: { params: { id: string } }) {
  const klaim = klaimList.find(x => x.id === params.id);
  if (!klaim) notFound();
  return <KlaimDetailView klaim={klaim} />;
}
