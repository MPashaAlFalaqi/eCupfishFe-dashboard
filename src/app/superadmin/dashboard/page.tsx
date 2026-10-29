"use client";

import React, { useState } from "react";
import { Sidebar, NavTab } from "../../../components/componentssu/Sidebar";
import { Header } from "../../../components/componentssu/Header";
import { DashboardOverview } from "../../../components/componentssu/DashboardOverview";
import { PembudidayaManager } from "../../../components/componentssu/PembudidayaManager";
import { PembeliManager } from "../../../components/componentssu/PembeliManager";
import { ActivityLogsView } from "../../../components/componentssu/ActivityLogsView";
import { SettingsView } from "../../../components/componentssu/SettingsView";
import { ToastContainer, ToastMessage } from "../../../components/componentssu/Toast";
import {
  initialPembudidaya,
  initialPembeli,
  initialActivityLogs,
  Pembudidaya,
  Pembeli,
  ActivityLog,
} from "../../../data/mockData";

export default function SuperAdminApp() {
  const [currentTab, setCurrentTab] = useState<NavTab>("dashboard");
  // Sidebar expanded by default so it's ALWAYS visible when opening the web!
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Core Data States
  const [pembudidayaList, setPembudidayaList] = useState<Pembudidaya[]>(initialPembudidaya);
  const [pembeliList, setPembeliList] = useState<Pembeli[]>(initialPembeli);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(initialActivityLogs);

  // Selected Detail Modal States
  const [selectedMitra, setSelectedMitra] = useState<Pembudidaya | null>(null);
  const [selectedBuyer, setSelectedBuyer] = useState<Pembeli | null>(null);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: "success" | "error" | "warning" | "info", message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleToggleSidebar = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setIsSidebarExpanded(!isSidebarExpanded);
    }
  };

  // --- Pembudidaya Handlers ---
  const handleApproveMitra = (id: string) => {
    const target = pembudidayaList.find((p) => p.id === id);
    if (!target) return;

    setPembudidayaList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "aktif", alasanStatus: undefined } : p))
    );

    const newLog: ActivityLog = {
      id: `LOG-${Date.now()}`,
      timestamp: "Baru saja",
      tipe: "aktifkan_mitra",
      judul: "Kemitraan Disetujui",
      detail: `Akun budidaya ${target.namaFarm} telah diverifikasi dan diaktifkan.`,
      adminName: "Pasha (Super Admin)",
      targetName: target.namaFarm,
      targetRole: "Pembudidaya",
      badgeVariant: "green",
    };
    setActivityLogs((prev) => [newLog, ...prev]);

    addToast("success", `Mitra "${target.namaFarm}" berhasil disetujui & diaktifkan!`);
  };

  const handleRejectMitra = (id: string, reason: string) => {
    const target = pembudidayaList.find((p) => p.id === id);
    if (!target) return;

    setPembudidayaList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "ditolak", alasanStatus: reason } : p))
    );

    const newLog: ActivityLog = {
      id: `LOG-${Date.now()}`,
      timestamp: "Baru saja",
      tipe: "suspend_mitra",
      judul: "Pengajuan Kemitraan Ditolak",
      detail: `Pengajuan ${target.namaFarm} ditolak: ${reason}`,
      adminName: "Pasha (Super Admin)",
      targetName: target.namaFarm,
      targetRole: "Pembudidaya",
      badgeVariant: "red",
    };
    setActivityLogs((prev) => [newLog, ...prev]);

    addToast("info", `Pendaftaran mitra "${target.namaFarm}" telah ditolak.`);
  };

  const handleSuspendMitra = (id: string, reason: string) => {
    const target = pembudidayaList.find((p) => p.id === id);
    if (!target) return;

    setPembudidayaList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "ditangguhkan", alasanStatus: reason } : p))
    );

    const newLog: ActivityLog = {
      id: `LOG-${Date.now()}`,
      timestamp: "Baru saja",
      tipe: "suspend_mitra",
      judul: "Mitra Ditangguhkan (Suspend)",
      detail: `Akun ${target.namaFarm} disuspend dengan alasan: ${reason}`,
      adminName: "Pasha (Super Admin)",
      targetName: target.namaFarm,
      targetRole: "Pembudidaya",
      badgeVariant: "red",
    };
    setActivityLogs((prev) => [newLog, ...prev]);

    addToast("warning", `Akun mitra "${target.namaFarm}" berhasil ditangguhkan.`);
  };

  const handleUnsuspendMitra = (id: string) => {
    const target = pembudidayaList.find((p) => p.id === id);
    if (!target) return;

    setPembudidayaList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "aktif", alasanStatus: undefined } : p))
    );

    const newLog: ActivityLog = {
      id: `LOG-${Date.now()}`,
      timestamp: "Baru saja",
      tipe: "aktifkan_mitra",
      judul: "Penangguhan Mitra Dibuka",
      detail: `Akun ${target.namaFarm} telah dipulihkan dan dapat bertransaksi kembali.`,
      adminName: "Pasha (Super Admin)",
      targetName: target.namaFarm,
      targetRole: "Pembudidaya",
      badgeVariant: "green",
    };
    setActivityLogs((prev) => [newLog, ...prev]);

    addToast("success", `Penangguhan mitra "${target.namaFarm}" berhasil dibuka.`);
  };

  const handleAddMitra = (newMitraData: Omit<Pembudidaya, "id" | "statistik">) => {
    const newId = `FARM-${(pembudidayaList.length + 1).toString().padStart(3, "0")}`;
    const newMitra: Pembudidaya = {
      ...newMitraData,
      id: newId,
      statistik: {
        totalIkanTerjual: 0,
        rating: 5.0,
        totalUlasan: 0,
        lelangDiikuti: 0,
      },
    };

    setPembudidayaList((prev) => [newMitra, ...prev]);

    const newLog: ActivityLog = {
      id: `LOG-${Date.now()}`,
      timestamp: "Baru saja",
      tipe: "tambah_akun",
      judul: "Penambahan Mitra Manual",
      detail: `Super admin mendaftarkan mitra baru: ${newMitra.namaFarm} (${newMitra.kota}).`,
      adminName: "Pasha (Super Admin)",
      targetName: newMitra.namaFarm,
      targetRole: "Pembudidaya",
      badgeVariant: "blue",
    };
    setActivityLogs((prev) => [newLog, ...prev]);

    addToast("success", `Mitra baru "${newMitra.namaFarm}" berhasil ditambahkan!`);
  };

  // --- Pembeli Handlers ---
  const handleBlockBuyer = (id: string, reason: string) => {
    const target = pembeliList.find((b) => b.id === id);
    if (!target) return;

    setPembeliList((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "diblokir", alasanStatus: reason } : b))
    );

    const newLog: ActivityLog = {
      id: `LOG-${Date.now()}`,
      timestamp: "Baru saja",
      tipe: "blokir_pembeli",
      judul: "Akun Pembeli Diblokir",
      detail: `Akun ${target.namaLengkap} (@${target.username}) diblokir: ${reason}`,
      adminName: "Pasha (Super Admin)",
      targetName: target.namaLengkap,
      targetRole: "Pembeli",
      badgeVariant: "red",
    };
    setActivityLogs((prev) => [newLog, ...prev]);

    addToast("error", `Akun pembeli "${target.namaLengkap}" berhasil diblokir.`);
  };

  const handleUnblockBuyer = (id: string) => {
    const target = pembeliList.find((b) => b.id === id);
    if (!target) return;

    setPembeliList((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "aktif", alasanStatus: undefined } : b))
    );

    const newLog: ActivityLog = {
      id: `LOG-${Date.now()}`,
      timestamp: "Baru saja",
      tipe: "buka_blokir_pembeli",
      judul: "Blokir Pembeli Dibuka",
      detail: `Akun pembeli ${target.namaLengkap} telah dipulihkan.`,
      adminName: "Pasha (Super Admin)",
      targetName: target.namaLengkap,
      targetRole: "Pembeli",
      badgeVariant: "green",
    };
    setActivityLogs((prev) => [newLog, ...prev]);

    addToast("success", `Blokir akun pembeli "${target.namaLengkap}" berhasil dibuka.`);
  };

  const handleAddBuyer = (newBuyerData: Omit<Pembeli, "id" | "statistik" | "terakhirLogin">) => {
    const newId = `BUY-${(pembeliList.length + 1).toString().padStart(3, "0")}`;
    const newBuyer: Pembeli = {
      ...newBuyerData,
      id: newId,
      terakhirLogin: "Baru saja",
      statistik: {
        totalPesanan: 0,
        totalTransaksiRp: 0,
        lelangDimasuki: 0,
        lelangDimenangkan: 0,
      },
    };

    setPembeliList((prev) => [newBuyer, ...prev]);

    const newLog: ActivityLog = {
      id: `LOG-${Date.now()}`,
      timestamp: "Baru saja",
      tipe: "tambah_akun",
      judul: "Penambahan Pembeli Manual",
      detail: `Super admin mendaftarkan akun pembeli baru: ${newBuyer.namaLengkap}.`,
      adminName: "Pasha (Super Admin)",
      targetName: newBuyer.namaLengkap,
      targetRole: "Pembeli",
      badgeVariant: "blue",
    };
    setActivityLogs((prev) => [newLog, ...prev]);

    addToast("success", `Akun pembeli "${newBuyer.namaLengkap}" berhasil dibuat!`);
  };

  // Counts
  const pendingMitraCount = pembudidayaList.filter(
    (p) => p.status === "menunggu_verifikasi"
  ).length;
  const blockedBuyerCount = pembeliList.filter((b) => b.status === "diblokir").length;

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex">
      {/* Sidebar Navigation - Always present & visible by default */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        pendingMitraCount={pendingMitraCount}
        blockedBuyerCount={blockedBuyerCount}
        isExpanded={isSidebarExpanded}
        onToggleExpand={handleToggleSidebar}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area: dynamically adjusts left padding based on sidebar state */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out flex flex-col min-w-0 min-h-screen ${
          isSidebarExpanded ? "md:pl-64" : "md:pl-20"
        }`}
      >
        {/* Top Navbar Header - Always visible with toggle icon and breadcrumbs */}
        <Header
          currentTab={currentTab}
          isSidebarExpanded={isSidebarExpanded}
          onToggleSidebar={handleToggleSidebar}
          pendingMitraCount={pendingMitraCount}
          onNavigateToTab={setCurrentTab}
        />

        {/* View Router */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {currentTab === "dashboard" && (
            <DashboardOverview
              pembudidayaList={pembudidayaList}
              pembeliList={pembeliList}
              onNavigateToTab={setCurrentTab}
              onOpenMitraDetail={setSelectedMitra}
              onOpenBuyerDetail={setSelectedBuyer}
              onApproveMitra={handleApproveMitra}
              onRejectMitra={(id) => handleRejectMitra(id, "Ditolak dari dashboard ringkasan.")}
            />
          )}

          {currentTab === "pembudidaya" && (
            <PembudidayaManager
              mitraList={pembudidayaList}
              selectedMitra={selectedMitra}
              onSelectMitra={setSelectedMitra}
              onApproveMitra={handleApproveMitra}
              onRejectMitra={handleRejectMitra}
              onSuspendMitra={handleSuspendMitra}
              onUnsuspendMitra={handleUnsuspendMitra}
              onAddMitra={handleAddMitra}
            />
          )}

          {currentTab === "pembeli" && (
            <PembeliManager
              pembeliList={pembeliList}
              selectedBuyer={selectedBuyer}
              onSelectBuyer={setSelectedBuyer}
              onBlockBuyer={handleBlockBuyer}
              onUnblockBuyer={handleUnblockBuyer}
              onAddBuyer={handleAddBuyer}
            />
          )}

          {currentTab === "audit" && <ActivityLogsView logs={activityLogs} />}

          {currentTab === "pengaturan" && <SettingsView />}
        </main>
      </div>

      {/* Floating Toast Notification Stack */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
