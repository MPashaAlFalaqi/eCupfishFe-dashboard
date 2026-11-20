"use client";

import { useState } from "react";
import { Gavel, Plus, ListFilter } from "lucide-react";
import clsx from "clsx";
import Topbar from "@/components/Topbar";
import { Button } from "@/components/ui";
import ResetDataButton from "@/components/ResetDataButton";
import { useDashboardData } from "@/components/DashboardDataProvider";
import LelangForm from "./_components/LelangForm";
import SesiView from "./sesi/_components/SesiView";

export default function LelangPage() {
  const [activeTab, setActiveTab] = useState<"daftar" | "tambah">("daftar");
  const { sesi } = useDashboardData();

  return (
    <>
      <Topbar
        title="Lelang Ikan Cupang"
        subtitle={
          activeTab === "daftar"
            ? "Pantau dan kelola seluruh sesi lelang: live, terjadwal, draft, dan selesai"
            : "Formulir pembuatan sesi lelang cupang baru untuk pembeli"
        }
        action={
          <div className="flex flex-wrap items-center gap-2">
            <ResetDataButton label="Reset Data" />
            {activeTab === "daftar" ? (
              <Button variant="gold" onClick={() => setActiveTab("tambah")}>
                <Plus size={16} />
                Tambah Sesi Lelang
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setActiveTab("daftar")}>
                <ListFilter size={16} />
                Daftar Sesi Lelang ({sesi.length})
              </Button>
            )}
          </div>
        }
      />

      {/* Tab Navigasi Sub-Halaman */}
      <div className="mb-4 flex items-center gap-2 border-b border-primary-100 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("daftar")}
          className={clsx(
            "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all",
            activeTab === "daftar"
              ? "bg-primary-900 text-white shadow-sm"
              : "bg-white text-primary-600 border border-primary-100 hover:bg-primary-50"
          )}
        >
          <Gavel size={15} />
          <span>Daftar Sesi Lelang</span>
          <span
            className={clsx(
              "ml-1 rounded-full px-2 py-0.5 text-xs",
              activeTab === "daftar"
                ? "bg-secondary-400 text-primary-950 font-bold"
                : "bg-primary-100 text-primary-700"
            )}
          >
            {sesi.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("tambah")}
          className={clsx(
            "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all",
            activeTab === "tambah"
              ? "bg-primary-900 text-white shadow-sm"
              : "bg-white text-primary-600 border border-primary-100 hover:bg-primary-50"
          )}
        >
          <Plus size={15} />
          <span>Tambah Sesi Lelang</span>
        </button>
      </div>

      {activeTab === "daftar" ? (
        <SesiView showTopbar={false} onTambah={() => setActiveTab("tambah")} />
      ) : (
        <LelangForm
          onSuccess={() => setActiveTab("daftar")}
          onCancel={() => setActiveTab("daftar")}
        />
      )}
    </>
  );
}
