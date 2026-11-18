const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export type Role = 'SUPERADMIN' | 'ADMIN' | 'BUYER';

export interface SessionUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  phoneNumber?: string | null;
}

interface SessionPayload {
  token: string;
  refreshToken: string;
  user: SessionUser;
}

const KEY = { token: 'ecf_token', refresh: 'ecf_refresh', user: 'ecf_user' };

export const session = {
  get token(): string | null {
    return typeof window === 'undefined' ? null : localStorage.getItem(KEY.token);
  },
  get refreshToken(): string | null {
    return typeof window === 'undefined' ? null : localStorage.getItem(KEY.refresh);
  },
  get user(): SessionUser | null {
    if (typeof window === 'undefined') return null;
    try {
      return JSON.parse(localStorage.getItem(KEY.user) ?? 'null');
    } catch {
      return null;
    }
  },
  save(data: SessionPayload) {
    localStorage.setItem(KEY.token, data.token);
    localStorage.setItem(KEY.refresh, data.refreshToken);
    localStorage.setItem(KEY.user, JSON.stringify(data.user));
  },
  clear() {
    Object.values(KEY).forEach((k) => localStorage.removeItem(k));
  },
};

export class ApiError extends Error {
  status: number;
  errors?: { field: string; message: string }[];
  constructor(status: number, message: string, errors?: { field: string; message: string }[]) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

let refreshing: Promise<boolean> | null = null;

async function doRefresh(): Promise<boolean> {
  const rt = session.refreshToken;
  if (!rt) return false;
  try {
    const res = await fetch(`${BASE}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: rt }),
    });
    if (!res.ok) {
      session.clear();
      return false;
    }
    session.save(await res.json());
    return true;
  } catch {
    return false;
  }
}

// Beberapa permintaan yang gagal bersamaan hanya memicu satu refresh
function refreshOnce(): Promise<boolean> {
  if (!refreshing) {
    refreshing = doRefresh().finally(() => {
      refreshing = null;
    });
  }
  return refreshing;
}

async function send(path: string, init: RequestInit, retry: boolean): Promise<Response> {
  const headers = new Headers(init.headers);
  if (!(init.body instanceof FormData)) headers.set('Content-Type', 'application/json');
  const token = session.token;
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const res = await fetch(`${BASE}${path}`, { ...init, headers });
  if (res.status === 401 && retry && session.refreshToken && (await refreshOnce())) {
    return send(path, init, false);
  }
  return res;
}

export async function api<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await send(path, init, true);
  } catch {
    throw new ApiError(0, 'Tidak dapat terhubung ke server. Periksa koneksi Anda.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data.message ?? 'Terjadi kesalahan.', data.errors);
  return data as T;
}

export const jsonBody = (nilai: unknown) => JSON.stringify(nilai);

// Alamat file upload dari backend (foto dan video)
export const fileUrl = (path: string) => (path.startsWith('http') ? path : `${BASE}${path}`);