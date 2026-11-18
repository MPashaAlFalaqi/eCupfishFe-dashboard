'use client';

import { useEffect, useState } from 'react';
import StokTable from './_components/StokTable';
import { api, ApiError } from '@/lib/api';
import { toIkan, type ApiProduct } from '@/lib/products';
import type { Ikan } from '@/lib/types';

interface Hasil {
  data: ApiProduct[];
  summary: { variants: number; activeStock: number };
}

export default function StokPage() {
  const [data, setData] = useState<Ikan[] | null>(null);
  const [ringkasan, setRingkasan] = useState({ variants: 0, activeStock: 0 });
  const [error, setError] = useState('');

  useEffect(() => {
    api<Hasil>('/api/seller/products?limit=100')
      .then((r) => {
        setData(r.data.map(toIkan));
        setRingkasan(r.summary);
      })
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Gagal memuat data.'));
  }, []);

  if (error) return <p className='text-red-600'>{error}</p>;
  if (!data) return <p className='text-sm text-gray-500'>Memuat data stok...</p>;

  return (
    <>
      {/* gunakan ringkasan.variants dan ringkasan.activeStock pada judul halaman */}
      <StokTable data={data} />
    </>
  );
}