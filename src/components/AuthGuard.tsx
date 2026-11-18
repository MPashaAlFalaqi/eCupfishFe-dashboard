'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, session, type Role, type SessionUser } from '@/lib/api';

export default function AuthGuard({
  roles,
  children,
}: {
  roles: Role[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [siap, setSiap] = useState(false);

  useEffect(() => {
    let batal = false;
    (async () => {
      try {
        const { user } = await api<{ user: SessionUser }>('/api/me');
        if (!roles.includes(user.role)) throw new Error('peran tidak sesuai');
        if (!batal) setSiap(true);
      } catch {
        session.clear();
        router.replace('/login');
      }
    })();
    return () => {
      batal = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return siap ? <>{children}</> : null;
}