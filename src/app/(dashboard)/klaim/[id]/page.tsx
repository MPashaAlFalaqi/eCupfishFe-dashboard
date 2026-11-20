"use client";

import { notFound } from "next/navigation";
import KlaimDetailView from "../_components/KlaimDetailView";
import { useDashboardData } from "@/components/DashboardDataProvider";
import { klaimList } from "@/lib/mock-data";

export default function DetailKlaimPage({ params }: { params: { id: string } }) {
  const { klaim: ctxKlaim } = useDashboardData();
  const klaim =
    ctxKlaim.find(x => x.id === params.id) ||
    klaimList.find(x => x.id === params.id);

  if (!klaim) notFound();
  return <KlaimDetailView klaim={klaim} />;
}
