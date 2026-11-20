"use client";

import { notFound } from "next/navigation";
import MonitorLelang from "../_components/MonitorLelang";
import { useDashboardData } from "@/components/DashboardDataProvider";
import { sesiList } from "@/lib/mock-data";

export default function MonitorPage({ params }: { params: { id: string } }) {
  const { sesi: ctxSesi } = useDashboardData();
  const sesi =
    ctxSesi.find(s => s.id === params.id) ||
    sesiList.find(s => s.id === params.id);

  if (!sesi) notFound();
  return <MonitorLelang sesi={sesi} />;
}
