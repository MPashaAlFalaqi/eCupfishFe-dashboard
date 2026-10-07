import { notFound } from "next/navigation";
import IkanForm from "../../_components/IkanForm";
import { ikanList } from "@/lib/mock-data";
export default function EditIkanPage({ params }: { params: { id: string } }) {
  const ikan = ikanList.find(i => i.id === params.id);
  if (!ikan) notFound();
  return <IkanForm ikan={ikan} />;
}
