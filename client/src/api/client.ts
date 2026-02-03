const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

function getToken(): string | null {
  const token = localStorage.getItem('tempo-mode-auth');
  // Token is stored as plain string, not JSON
  return token && token.startsWith('eyJ') ? token : null;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers
      ? Object.fromEntries(
          options.headers instanceof Headers
            ? options.headers.entries()
            : Object.entries(options.headers as Record<string, string>)
        )
      : {}),
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
  });
  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text as any;
  }
  if (!res.ok) {
    const message =
      data?.error?.message || data?.message || `HTTP ${res.status}`;
    throw new Error(message);
  }
  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
};

export const sessionApi = {
  createSession: (
    plannedMinutes: number,
    label?: string,
    actualMinutes?: number
  ) =>
    api.post('/api/sessions', {
      plannedMinutes,
      label,
      actualMinutes,
    }),
  getTodayStats: () => api.get('/api/sessions/today'),
  getWeekStats: () => api.get('/api/sessions/week'),
  getMonthStats: () => api.get('/api/sessions/month'),
  getHourlyStats: () => api.get('/api/sessions/hourly'),
};
