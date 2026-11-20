'use client';

import { useEffect, useState } from 'react';
import StokTable from './_components/StokTable';
import { api } from '@/lib/api';
import { toIkan, type ApiProduct } from '@/lib/products';
import { useDashboardData } from '@/components/DashboardDataProvider';
import type { Ikan } from '@/lib/types';

interface Hasil {
  data: ApiProduct[];
  summary: { variants: number; activeStock: number };
}

export default function StokPage() {
  const { ikan: contextIkan } = useDashboardData();
  const [data, setData] = useState<Ikan[] | null>(null);

  useEffect(() => {
    api<Hasil>('/api/seller/products?limit=100')
      .then((r) => {
        if (r.data && r.data.length > 0) {
          setData(r.data.map(toIkan));
        } else {
          setData(contextIkan);
        }
      })
      .catch(() => {
        setData(contextIkan);
      });
  }, [contextIkan]);

  return <StokTable data={data ?? contextIkan} />;
}
