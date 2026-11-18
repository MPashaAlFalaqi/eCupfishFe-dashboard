"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Film, Star, Trash2 } from "lucide-react";
import Toggle from "@/components/Toggle";
import { useToast } from "@/components/Toast";
import Topbar from "@/components/Topbar";
import FormField from "@/components/FormField";
import { Button, Card } from "@/components/ui";
import { api, ApiError, fileUrl, jsonBody } from "@/lib/api";
import type { ApiMedia, ApiProduct } from "@/lib/products";
import MediaUploader, { type MediaItem } from "./MediaUploader";
import AiScanner from "./AiScanner";

type Tipe = "" | "CONTEST" | "PLAYER" | "PET";
type Kelas = "" | "S" | "A" | "B" | "C";
interface Kategori { id: number; name: string }

interface FormState {
  nama: string;
  categoryId: string;
  tipe: Tipe;
  kelas: Kelas;
  usia: string;
  stok: string;
  harga: string;
  lokasi: string;
  catatan: string;
}
type Errors = Partial<Record<keyof FormState | "kesehatan", string>>;

// Nama field di backend -> nama field di form ini (untuk menampilkan error dari server)
const FIELD_SERVER: Record<string, keyof FormState | "kesehatan"> = {
  name: "nama",
  categoryId: "categoryId",
  grade: "tipe",
  tier: "kelas",
  ageMonths: "usia",
  price: "harga",
  stock: "stok",
  tankLocation: "lokasi",
  healthDescription: "kesehatan",
  notes: "catatan",
};

function validasi(f: FormState): Errors {
  const e: Errors = {};
  if (f.nama.trim().length < 3) e.nama = "Nama jenis ikan minimal 3 karakter.";
  if (!f.categoryId) e.categoryId = "Pilih kategori ikan.";
  if (!f.tipe) e.tipe = "Pilih tipe: Contest, Player, atau Pet.";
  if (!f.kelas) e.kelas = "Pilih grade.";
  if (f.usia !== "") {
    const u = Number(f.usia);
    if (!Number.isInteger(u) || u < 0 || u > 60) e.usia = "Usia harus angka bulat 0 sampai 60.";
  }
  const stok = Number(f.stok);
  if (f.stok === "" || !Number.isInteger(stok) || stok < 0) e.stok = "Stok harus angka bulat, minimal 0.";
  const harga = Number(f.harga);
  if (f.harga === "" || !Number.isInteger(harga) || harga < 1000) e.harga = "Harga minimal Rp 1.000 (angka bulat).";
  return e;
}

export default function IkanForm({ produk }: { produk?: ApiProduct }) {
  const router = useRouter();
  const toast = useToast();
  const edit = !!produk;

  const [f, setF] = useState<FormState>({
    nama: produk?.name ?? "",
    categoryId: produk ? String(produk.categoryId) : "",
    tipe: produk?.grade ?? "",
    kelas: (produk?.tier as Kelas | null | undefined) ?? "",
    usia: produk?.ageMonths != null ? String(produk.ageMonths) : "",
    stok: produk ? String(produk.stock) : "",
    harga: produk ? String(produk.price) : "",
    lokasi: produk?.tankLocation ?? "",
    catatan: produk?.notes ?? "",
  });
  const [kesehatan, setKesehatan] = useState(produk?.healthDescription ?? "");
  const [publish, setPublish] = useState(produk?.listed ?? true);
  const [media, setMedia] = useState<MediaItem[]>([]);          // file baru yang akan diunggah
  const [tersimpan, setTersimpan] = useState<ApiMedia[]>(produk?.media ?? []); // media yang sudah ada di server
  const [kategori, setKategori] = useState<Kategori[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api<{ data: Kategori[] }>("/api/categories")
      .then((r) => setKategori(r.data))
      .catch(() => setFormError("Gagal memuat daftar kategori. Muat ulang halaman."));
  }, []);

  const ubah =
    (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setF((p) => ({ ...p, [k]: e.target.value }) as FormState);
      setErrors((p) => ({ ...p, [k]: undefined }));
    };

  const hapusTersimpan = async (m: ApiMedia) => {
    if (!window.confirm("Hapus media ini dari ikan?")) return;
    try {
      await api(`/api/seller/media/${m.id}`, { method: "DELETE" });
      setTersimpan((p) => {
        const sisa = p.filter((x) => x.id !== m.id);
        if (!m.isCover) return sisa;
        // server memindahkan sampul ke foto pertama yang tersisa
        const berikut = sisa.find((x) => x.type === "PHOTO");
        return sisa.map((x) => ({ ...x, isCover: berikut ? x.id === berikut.id : false }));
      });
    } catch (e) {
      toast(e instanceof ApiError ? e.message : "Gagal menghapus media.");
    }
  };

  const jadikanSampul = async (m: ApiMedia) => {
    try {
      await api(`/api/seller/media/${m.id}/cover`, { method: "PATCH" });
      setTersimpan((p) => p.map((x) => ({ ...x, isCover: x.id === m.id })));
    } catch (e) {
      toast(e instanceof ApiError ? e.message : "Gagal mengubah sampul.");
    }
  };

  const simpan = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    const err = validasi(f);
    setErrors(err);
    if (Object.keys(err).length > 0) {
      setFormError("Periksa kembali isian yang ditandai merah.");
      return;
    }

    // Saat edit, kolom teks yang dikosongkan dikirim sebagai teks kosong agar nilai lama terhapus
    const teks = (v: string) => (edit ? v.trim() : v.trim() || undefined);
    const body = {
      name: f.nama.trim(),
      categoryId: Number(f.categoryId),
      grade: f.tipe,
      tier: f.kelas,
      ageMonths: f.usia === "" ? undefined : Number(f.usia),
      price: Number(f.harga),
      stock: Number(f.stok),
      listed: publish,
      tankLocation: teks(f.lokasi),
      healthDescription: teks(kesehatan),
      notes: teks(f.catatan),
    };

    setSaving(true);
    let id: number;
    try {
      const r = edit
        ? await api<{ data: ApiProduct }>(`/api/seller/products/${produk!.id}`, { method: "PUT", body: jsonBody(body) })
        : await api<{ data: ApiProduct }>("/api/seller/products", { method: "POST", body: jsonBody(body) });
      id = r.data.id;
    } catch (e2) {
      if (e2 instanceof ApiError && e2.errors?.length) {
        const dariServer: Errors = {};
        for (const it of e2.errors) {
          const key = FIELD_SERVER[it.field];
          if (key) dariServer[key] = it.message;
        }
        setErrors(dariServer);
      }
      setFormError(e2 instanceof ApiError ? e2.message : "Gagal menyimpan data.");
      setSaving(false);
      return;
    }

    if (media.length > 0) {
      try {
        const fd = new FormData();
        media.forEach((m) => {
          const file = Object.values(m).find((value): value is File => value instanceof File);
          if (!file) throw new Error("File media tidak ditemukan.");
          fd.append("files", file);
        }); // urutan file = urutan di pengunggah (pertama = sampul)
        await api(`/api/seller/products/${id}/media`, { method: "POST", body: fd });
      } catch (e3) {
        const alasan = e3 instanceof ApiError ? e3.message : "terjadi kesalahan";
        if (edit) {
          setFormError(`Data tersimpan, tetapi unggah foto gagal: ${alasan}`);
          setSaving(false);
        } else {
          toast(`Data ikan tersimpan, tetapi unggah foto gagal: ${alasan}. Coba lagi dari halaman edit.`);
          router.replace(`/stok/${id}/edit`);
        }
        return;
      }
    }
    toast(edit ? "Perubahan data ikan disimpan" : "Data ikan baru disimpan");
    router.push("/stok");
  };

  return (
    <>
      <Topbar
        title={edit ? "Edit Data Ikan" : "Tambah Data Ikan Baru"}
        subtitle={`Manajemen Stok · ${edit ? produk!.name : "Tambah Baru"}`}
      />
      <form onSubmit={simpan} noValidate className="grid gap-4 lg:grid-cols-[340px_1fr]">
        <div className="space-y-4 self-start">
          {edit && tersimpan.length > 0 && (
            <Card>
              <h3 className="mb-3 font-semibold">Media Tersimpan</h3>
              <ul className="grid grid-cols-3 gap-2">
                {tersimpan.map((m) => (
                  <li key={m.id} className="group relative aspect-square overflow-hidden rounded-lg bg-primary-100">
                    {m.type === "PHOTO" ? (
                      <img src={fileUrl(m.url)} alt="Foto ikan" className="h-full w-full object-cover" />
                    ) : (
                      <div className="grid h-full w-full place-items-center bg-primary-900 text-white"><Film size={22} /></div>
                    )}
                    {m.isCover && (
                      <span className="absolute left-1 top-1 rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold text-primary-950">Sampul</span>
                    )}
                    <button type="button" aria-label="Hapus media" onClick={() => hapusTersimpan(m)}
                      className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-primary-950/70 text-white opacity-0 transition group-hover:opacity-100">
                      <Trash2 size={13} />
                    </button>
                    {!m.isCover && m.type === "PHOTO" && (
                      <button type="button" onClick={() => jadikanSampul(m)}
                        className="absolute inset-x-1 bottom-1 flex items-center justify-center gap-1 rounded bg-primary-950/70 py-0.5 text-[10px] font-semibold text-white opacity-0 transition group-hover:opacity-100">
                        <Star size={10} />Jadikan sampul
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </Card>
          )}
          <MediaUploader onChange={setMedia} />
          <AiScanner
            fotoSiap={media.some((m) => m.type === "image") || tersimpan.some((m) => m.type === "PHOTO")}
            onTerapkan={setKesehatan}
          />
        </div>

        <Card>
          <h3 className="mb-4 font-semibold">Detail Ikan</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Jenis ikan" error={errors.nama}>
              <input className="input" placeholder="cth. Cupang Halfmoon Merah" value={f.nama} onChange={ubah("nama")} />
            </FormField>
            <FormField label="Kategori" error={errors.categoryId}>
              <select className="input" value={f.categoryId} onChange={ubah("categoryId")}>
                <option value="">Pilih kategori</option>
                {kategori.map((k) => <option key={k.id} value={k.id}>{k.name}</option>)}
              </select>
            </FormField>
            <FormField label="Tipe" error={errors.tipe}>
              <select className="input" value={f.tipe} onChange={ubah("tipe")}>
                <option value="">Pilih tipe</option>
                <option value="CONTEST">Contest</option>
                <option value="PLAYER">Player</option>
                <option value="PET">Pet</option>
              </select>
            </FormField>
            <FormField label="Grade" error={errors.kelas}>
              <select className="input" value={f.kelas} onChange={ubah("kelas")}>
                <option value="">Pilih grade</option>
                <option value="S">Grade S</option>
                <option value="A">Grade A</option>
                <option value="B">Grade B</option>
                <option value="C">Grade C</option>
              </select>
            </FormField>
            <FormField label="Usia (bulan)" error={errors.usia}>
              <input className="input" type="number" placeholder="cth. 4" value={f.usia} onChange={ubah("usia")} />
            </FormField>
            <FormField label="Jumlah stok (ekor)" error={errors.stok}
              hint={edit ? "Untuk mengatur status manual, gunakan Atur Ketersediaan di tabel stok." : undefined}>
              <input className="input" type="number" placeholder="cth. 330" value={f.stok} onChange={ubah("stok")} />
            </FormField>
            <FormField label="Harga (Rp / ekor)" error={errors.harga}>
              <input className="input" type="number" placeholder="cth. 85000" value={f.harga} onChange={ubah("harga")} />
            </FormField>
            <div className="flex items-center justify-between gap-3 self-end rounded-lg border border-primary-100 px-3 py-2">
              <div>
                <p className="text-sm font-medium">Tampilkan di marketplace</p>
                <p className="text-xs text-primary-400">Pembeli bisa melihat dan memesan</p>
              </div>
              <Toggle checked={publish} onChange={setPublish} label="Tampilkan di marketplace" />
            </div>
            <div className="sm:col-span-2">
              <FormField label="Lokasi akuarium / toples" error={errors.lokasi}>
                <input className="input" placeholder="cth. Akuarium A-12, Kediri" value={f.lokasi} onChange={ubah("lokasi")} />
              </FormField>
            </div>
            <div className="sm:col-span-2">
              <FormField label="Deskripsi kesehatan ikan" error={errors.kesehatan}>
                <textarea className="input" rows={3} placeholder="Kondisi sirip, aktivitas, warna, dan nafsu makan"
                  value={kesehatan} onChange={(e) => setKesehatan(e.target.value)} />
              </FormField>
            </div>
            <div className="sm:col-span-2">
              <FormField label="Catatan tambahan" error={errors.catatan}>
                <textarea className="input" rows={2} placeholder="Opsional" value={f.catatan} onChange={ubah("catatan")} />
              </FormField>
            </div>
          </div>

          {formError && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{formError}</p>}

          <div className="mt-5 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={saving}>Batal</Button>
            <Button type="submit" disabled={saving}>
              <Check size={16} />{saving ? "Menyimpan..." : edit ? "Simpan Perubahan" : "Simpan Data"}
            </Button>
          </div>
        </Card>
      </form>
    </>
  );
}
