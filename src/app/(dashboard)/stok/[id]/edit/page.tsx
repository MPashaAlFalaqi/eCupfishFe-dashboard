"use client";
import { notFound } from "next/navigation";
import IkanForm from "../../_components/IkanForm";
import { useDashboardData } from "@/components/DashboardDataProvider";

export default function EditIkanPage({ params }: { params: { id: string } }) {
  const { ikan } = useDashboardData();
  const target = ikan.find(i => i.id === params.id);
  if (!target) notFound();
  return <IkanForm ikan={target} />;
}