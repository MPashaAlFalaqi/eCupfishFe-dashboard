import PembayaranView from "./_components/PembayaranView";
import { pembayaranList, rekeningList } from "@/lib/mock-data";
export default function PembayaranPage() { return <PembayaranView data={pembayaranList} rekening={rekeningList} />; }
