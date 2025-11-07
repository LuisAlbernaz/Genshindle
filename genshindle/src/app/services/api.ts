// src/services/api.ts
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, '') || 'http://localhost:8000';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail: any = null;
    try { detail = await res.json(); } catch {}
    throw new Error(detail?.message ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const apiPost = async <T>(path: string, body: any) => {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
};

export const apiGet = async <T>(path: string) => {
  const res = await fetch(`${API_BASE_URL}${path}`, { cache: 'no-store' });
  return handleResponse<T>(res);
};
