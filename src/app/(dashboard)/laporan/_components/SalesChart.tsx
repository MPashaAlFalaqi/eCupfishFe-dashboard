import { Card } from "@/components/ui";
const data = [["Sen", 55], ["Sel", 80], ["Rab", 35], ["Kam", 70], ["Jum", 50], ["Sab", 95], ["Min", 45]] as const;
export default function SalesChart() {
  return (
    <Card>
      <h3 className="mb-4 font-semibold">Grafik Penjualan Bulanan</h3>
      <div className="flex h-56 gap-4">
        {data.map(([d, h]) => (
          <div key={d} className="flex h-full flex-1 flex-col items-center gap-1">
            <div className="flex w-full flex-1 items-end"><div className={`w-full origin-bottom animate-grow-y rounded-t-md ${d === "Sab" ? "bg-gold" : "bg-primary-400"}`} style={{ height: `${h}%`, animationDelay: `${data.findIndex(x => x[0] === d) * 70}ms` }} /></div>
            <span className="text-xs text-primary-400">{d}</span>
          </div>))}
      </div>
    </Card>
  );
}
