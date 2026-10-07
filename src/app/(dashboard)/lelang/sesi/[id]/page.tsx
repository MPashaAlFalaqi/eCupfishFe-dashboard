import { notFound } from "next/navigation";
import MonitorLelang from "../_components/MonitorLelang";
import { sesiList } from "@/lib/mock-data";
export default function MonitorPage({ params }: { params: { id: string } }) {
  const sesi = sesiList.find(s => s.id === params.id);
  if (!sesi) notFound();
  return <MonitorLelang sesi={sesi} />;
}
