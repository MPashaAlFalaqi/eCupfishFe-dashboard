"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import clsx from "clsx";
import FormField from "@/components/FormField";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui";

const EMAIL = /^\S+@\S+\.\S+$/, HP = /^(\+62|62|0)8\d{8,11}$/;
const judul = ["Cari akun Anda", "Masukkan kode OTP", "Buat kata sandi baru"];

export default function LupaSandiForm() {
  const [step, setStep] = useState(0);
  const [id, setId] = useState(""); const [otp, setOtp] = useState("");
  const [pw, setPw] = useState(""); const [pw2, setPw2] = useState("");
  const [err, setErr] = useState(""); const [detik, setDetik] = useState(0); const [done, setDone] = useState(false);
  useEffect(() => { if (detik <= 0) return; const t = setTimeout(() => setDetik(d => d - 1), 1000); return () => clearTimeout(t); }, [detik]);

  const lanjut = () => {
    setErr("");
    if (step === 0) {
      const v = id.trim().replace(/[\s-]/g, "");
      if (!EMAIL.test(v) && !HP.test(v)) return setErr("Format email atau nomor HP belum sesuai. Contoh: nama@email.com atau 08123456789.");
      setStep(1); setDetik(30);
    } else if (step === 1) {
      if (otp !== "123456") return setErr("Kode OTP salah. Periksa lagi atau kirim ulang kode.");
      setStep(2);
    } else {
      if (pw.length < 8) return setErr("Kata sandi minimal 8 karakter.");
      if (pw !== pw2) return setErr("Konfirmasi kata sandi belum sama. Ketik ulang dengan teliti ya.");
      setDone(true);
    }
  };
  return (
    <div className="w-full max-w-sm space-y-4">
      <Link href="/login" className="inline-flex items-center gap-1 text-sm text-primary-500"><ArrowLeft size={16} />Kembali ke login</Link>
      <div className="flex gap-1.5">{[0, 1, 2].map(i => <span key={i} className={clsx("h-1.5 flex-1 rounded-full", i <= step ? "bg-primary-400" : "bg-primary-100")} />)}</div>
      <div><p className="text-xs font-semibold uppercase tracking-wider text-primary-400">Langkah {step + 1} dari 3</p><h1 className="text-2xl font-bold">{judul[step]}</h1></div>
      {step === 0 && <FormField label="Email atau Nomor HP" error={err} hint="Kami kirim kode OTP ke sini"><input className="input" value={id} onChange={e => setId(e.target.value)} placeholder="nama@tambakanda.id" /></FormField>}
      {step === 1 && (<>
        <FormField label="Kode OTP 6 digit" error={err} hint={`Kode dikirim ke ${id}. Untuk contoh, gunakan 123456.`}>
          <input className="input tracking-[0.4em]" inputMode="numeric" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ""))} placeholder="••••••" /></FormField>
        <button disabled={detik > 0} onClick={() => setDetik(30)} className="text-sm font-medium text-primary-500 disabled:text-primary-300">{detik > 0 ? `Kirim ulang kode dalam ${detik} detik` : "Kirim ulang kode"}</button>
      </>)}
      {step === 2 && (<>
        <FormField label="Kata sandi baru" hint="Minimal 8 karakter"><input className="input" type="password" value={pw} onChange={e => setPw(e.target.value)} /></FormField>
        <FormField label="Konfirmasi kata sandi" error={err}><input className="input" type="password" value={pw2} onChange={e => setPw2(e.target.value)} /></FormField>
      </>)}
      <Button className="w-full" onClick={lanjut}>{step === 2 ? "Simpan Kata Sandi" : "Lanjut"}</Button>
      <Modal open={done} onClose={() => {}} title="Kata sandi berhasil diubah" subtitle="Silakan masuk dengan kata sandi baru Anda"
        footer={<Link href="/login"><Button>Kembali ke Login</Button></Link>}>
        <p className="text-sm text-primary-600">Akun Anda sudah aman kembali. Selamat berjualan!</p>
      </Modal>
    </div>
  );
}
