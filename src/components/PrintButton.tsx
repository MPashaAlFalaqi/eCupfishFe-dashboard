"use client";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui";
export default function PrintButton({ label = "Cetak / Simpan PDF" }: { label?: string }) {
  return <Button onClick={() => window.print()}><Printer size={16} />{label}</Button>;
}
