import StokTable from "./_components/StokTable";
import { ikanList } from "@/lib/mock-data";
export default function StokPage() {
  return <StokTable data={ikanList} />;
}
