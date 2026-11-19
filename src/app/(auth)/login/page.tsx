"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Check,
  ShieldCheck,
  Truck,
  User,
  type LucideIcon,
} from "lucide-react";
import clsx from "clsx";
import Topbar from "@/components/Topbar";
import FormField from "@/components/FormField";
import Toggle from "@/components/Toggle";
import Modal from "@/components/Modal";
import { useToast } from "@/components/Toast";
import { Button, Card } from "@/components/ui";
import { api, ApiError, jsonBody, session } from "@/lib/api";

type Key = "profil" | "pengiriman" | "notifikasi" | "keamanan";

interface SellerProfileData {
  businessName?: string;
  description?: string | null;
  location?: string | null;
  originAddress?: string | null;
  city?: string | null;
  postalCode?: string | null;
  openTime?: string | null;
  closeTime?: string | null;
  notifyNewOrder?: boolean;
  notifyClaim?: boolean;
  notifyLowStock?: boolean;
}

interface MeResponse {
  user: {
    id: number;
    name: string;
    username?: string | null;
    email: string;
    phoneNumber?: string | null;
    role: "SUPERADMIN" | "ADMIN" | "BUYER";
    sellerProfile?: SellerProfileData | null;
  };
}

const bagian: { key: Key; label: string; desc: string; icon: LucideIcon }[] = [
  { key: "profil", label: "Profil", desc: "Data pemilik dan toko", icon: User },
  { key: "pengiriman", label: "Pengiriman", desc: "Alamat asal dan jam buka", icon: Truck },
  { key: "notifikasi", label: "Notifikasi", desc: "Pengingat yang Anda terima", icon: Bell },
  { key: "keamanan", label: "Keamanan", desc: "Email, username, kata sandi", icon: ShieldCheck },
];

const notifItems = [
  {
    key: "notifyNewOrder" as const,
    title: "Pesanan baru",
    desc: "Beri tahu saya saat ada pesanan masuk",
  },
  {
    key: "notifyClaim" as const,
    title: "Klaim pembeli",
    desc: "Beri tahu saya saat pembeli mengajukan klaim",
  },
  {
    key: "notifyLowStock" as const,
    title: "Stok menipis",
    desc: "Beri tahu saya saat stok hampir habis",
  },
];

export default function PengaturanPage() {
  const toast = useToast();
  const [tab, setTab] = useState<Key>("profil");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Data User
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Data SellerProfile
  const [businessName, setBusinessName] = useState("");
  const [openTime, setOpenTime] = useState("08:00");
  const [closeTime, setCloseTime] = useState("17:00");
  const [description, setDescription] = useState("");
  const [originAddress, setOriginAddress] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // Preferensi Notifikasi
  const [notif, setNotif] = useState({
    notifyNewOrder: true,
    notifyClaim: true,
    notifyLowStock: false,
  });

  // Modal Ubah Kata Sandi
  const [pwOpen, setPwOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    let batal = false;
    (async () => {
      try {
        const { user } = await api<MeResponse>("/api/me");
        if (batal) return;
        setName(user.name ?? "");
        setUsername(user.username ?? "");
        setEmail(user.email ?? "");
        setPhoneNumber(user.phoneNumber ?? "");

        const sp = user.sellerProfile;
        setBusinessName(sp?.businessName ?? "");
        setOpenTime(sp?.openTime ?? "08:00");
        setCloseTime(sp?.closeTime ?? "17:00");
        setDescription(sp?.description ?? "");
        setOriginAddress(sp?.originAddress ?? "");
        setLocation(sp?.location ?? "");
        setCity(sp?.city ?? "");
        setPostalCode(sp?.postalCode ?? "");
        setNotif({
          notifyNewOrder: sp?.notifyNewOrder ?? true,
          notifyClaim: sp?.notifyClaim ?? true,
          notifyLowStock: sp?.notifyLowStock ?? false,
        });
      } catch (err) {
        if (!batal) {
          setError(
            err instanceof ApiError
              ? err.message
              : "Gagal memuat data pengaturan toko."
          );
        }
      } finally {
        if (!batal) setLoading(false);
      }
    })();
    return () => {
      batal = true;
    };
  }, []);

  const aktif = bagian.find((b) => b.key === tab)!;

  const handleSimpan = async () => {
    setError("");
    setSaving(true);
    try {
      const res = await api<MeResponse>("/api/me", {
        method: "PUT",
        body: jsonBody({
          name: name.trim() || undefined,
          username: username.trim() || undefined,
          phoneNumber: phoneNumber.trim() || undefined,
          sellerProfile: {
            businessName: businessName.trim() || "Betta Farm",
            description: description.trim() || null,
            location: location.trim() || null,
            originAddress: originAddress.trim() || null,
            city: city.trim() || null,
            postalCode: postalCode.trim() || null,
            openTime: openTime || "08:00",
            closeTime: closeTime || "17:00",
            ...notif,
          },
        }),
      });

      if (session.token && res.user) {
        session.save({
          token: session.token,
          refreshToken: session.refreshToken ?? undefined,
          user: {
            id: res.user.id,
            name: res.user.name,
            email: res.user.email,
            role: res.user.role,
            phoneNumber: res.user.phoneNumber,
          },
        });
      }

      toast(`${aktif.label} berhasil disimpan`);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Gagal menyimpan pengaturan."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleGantiSandi = async () => {
    setPwError("");
    if (newPassword.length < 8) {
      setPwError("Kata sandi baru minimal 8 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("Konfirmasi kata sandi belum cocok.");
      return;
    }

    setPwSaving(true);
    try {
      await api("/api/me/password", {
        method: "PUT",
        body: jsonBody({ currentPassword, newPassword }),
      });
      setPwOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast("Kata sandi diperbarui");
    } catch (err) {
      setPwError(
        err instanceof ApiError ? err.message : "Gagal mengubah kata sandi."
      );
    } finally {
      setPwSaving(false);
    }
  };

  const tombolSimpan = (
    <div className="mt-6 flex justify-end border-t border-primary-50 pt-4">
      <Button type="button" onClick={handleSimpan} disabled={saving || loading}>
        <Check size={16} />
        {saving ? "Menyimpan..." : "Simpan Perubahan"}
      </Button>
    </div>
  );

  return (
    <>
      <Topbar
        title="Pengaturan Toko"
        subtitle="Kelola informasi profil, alamat pengiriman, preferensi notifikasi, dan keamanan akun."
      />

      <div className="grid gap-4 lg:grid-cols-[250px_1fr]">
        <Card className="self-start !p-2">
          <nav aria-label="Bagian pengaturan" className="flex gap-1 overflow-x-auto lg:flex-col">
            {bagian.map((b) => (
              <button
                key={b.key}
                type="button"
                onClick={() => setTab(b.key)}
                aria-current={tab === b.key ? "page" : undefined}
                className={clsx(
                  "flex shrink-0 items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                  tab === b.key
                    ? "bg-primary-50 font-semibold text-primary-700"
                    : "text-primary-600 hover:bg-primary-50/60"
                )}
              >
                <b.icon
                  size={17}
                  className={tab === b.key ? "text-primary-500" : "text-primary-400"}
                />
                <span>
                  <span className="block">{b.label}</span>
                  <span className="hidden text-xs font-normal text-primary-400 lg:block">
                    {b.desc}
                  </span>
                </span>
              </button>
            ))}
          </nav>
        </Card>

        <Card className="min-h-[420px]">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {loading ? (
            <p className="text-sm text-primary-500">Memuat pengaturan toko...</p>
          ) : (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                <h2 className="text-base font-bold">
                  {tab === "profil" ? "Profil Pemilik & Toko" : aktif.label}
                </h2>
                <p className="mb-5 text-sm text-primary-500">{aktif.desc}</p>

                {tab === "profil" && (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField label="Nama Pemilik">
                        <input
                          className="input"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </FormField>
                      <FormField label="Email">
                        <input
                          className="input bg-primary-50/60"
                          type="email"
                          value={email}
                          disabled
                        />
                      </FormField>
                      <FormField label="Nomor Telepon / WhatsApp">
                        <input
                          className="input"
                          type="tel"
                          placeholder="08123456789"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                      </FormField>
                      <FormField label="Nama Toko / Farm">
                        <input
                          className="input"
                          placeholder="cth. Betta Farm"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                        />
                      </FormField>
                      <FormField label="Jam Buka Operasional">
                        <input
                          className="input"
                          type="time"
                          value={openTime}
                          onChange={(e) => setOpenTime(e.target.value)}
                        />
                      </FormField>
                      <FormField label="Jam Tutup Operasional">
                        <input
                          className="input"
                          type="time"
                          value={closeTime}
                          onChange={(e) => setCloseTime(e.target.value)}
                        />
                      </FormField>
                      <div className="sm:col-span-2">
                        <FormField label="Deskripsi Toko">
                          <textarea
                            className="input"
                            rows={3}
                            placeholder="Ceritakan keunggulan farm atau ikan cupang Anda..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                          />
                        </FormField>
                      </div>
                    </div>
                    {tombolSimpan}
                  </>
                )}

                {tab === "pengiriman" && (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <FormField label="Alamat lengkap asal pengiriman">
                          <textarea
                            className="input"
                            rows={2}
                            placeholder="Jl. Raya Tambak No. 12..."
                            value={originAddress}
                            onChange={(e) => setOriginAddress(e.target.value)}
                          />
                        </FormField>
                      </div>
                      <FormField label="Lokasi / Wilayah Tambak">
                        <input
                          className="input"
                          placeholder="cth. Jakarta Timur"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                      </FormField>
                      <FormField label="Kota">
                        <input
                          className="input"
                          placeholder="cth. Jakarta"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                      </FormField>
                      <FormField label="Kode pos">
                        <input
                          className="input"
                          placeholder="cth. 13220"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                        />
                      </FormField>
                    </div>
                    {tombolSimpan}
                  </>
                )}

                {tab === "notifikasi" && (
                  <>
                    <ul className="divide-y divide-primary-50">
                      {notifItems.map((n) => (
                        <li
                          key={n.key}
                          className="flex items-center justify-between gap-4 py-3.5 first:pt-0"
                        >
                          <div>
                            <p className="font-medium">{n.title}</p>
                            <p className="text-sm text-primary-500">{n.desc}</p>
                          </div>
                          <Toggle
                            checked={notif[n.key]}
                            onChange={(v) =>
                              setNotif((s) => ({ ...s, [n.key]: v }))
                            }
                            label={n.title}
                          />
                        </li>
                      ))}
                    </ul>
                    {tombolSimpan}
                  </>
                )}

                {tab === "keamanan" && (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField label="Email">
                        <input
                          className="input bg-primary-50/60"
                          type="email"
                          value={email}
                          disabled
                        />
                      </FormField>
                      <FormField label="Username">
                        <input
                          className="input"
                          placeholder="cth. bettafarm"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </FormField>
                      <div className="sm:col-span-2">
                        <FormField
                          label="Kata sandi"
                          hint="Disarankan diganti secara berkala"
                        >
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setPwError("");
                              setPwOpen(true);
                            }}
                          >
                            Ubah Kata Sandi
                          </Button>
                        </FormField>
                      </div>
                    </div>
                    {tombolSimpan}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </Card>
      </div>

      <Modal
        open={pwOpen}
        onClose={() => setPwOpen(false)}
        title="Ubah Kata Sandi"
        subtitle="Gunakan kombinasi minimal 8 karakter"
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => setPwOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleGantiSandi}
              disabled={pwSaving}
            >
              {pwSaving ? "Menyimpan..." : "Simpan Sandi"}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          {pwError && (
            <p className="rounded-md bg-red-50 p-2.5 text-xs font-medium text-red-600">
              {pwError}
            </p>
          )}
          <FormField label="Kata sandi lama">
            <input
              className="input"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </FormField>
          <FormField label="Kata sandi baru" hint="Minimal 8 karakter">
            <input
              className="input"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </FormField>
          <FormField label="Konfirmasi kata sandi baru">
            <input
              className="input"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </FormField>
        </div>
      </Modal>
    </>
  );
}