const BASE_URL = 'https://nonepithelial-resiliently-rubie.ngrok-free.dev/api/v1';
let accessToken: string | null = null;
let refreshToken: string | null = null;

export const storeTokens = (access: string, refresh: string) => {
  accessToken = access;
  refreshToken = refresh;
};

export const clearTokens = () => {
  accessToken = null;
  refreshToken = null;
};

export const isLoggedIn = () => !!accessToken;

const refreshAccessToken = async (): Promise<string | null> => {
  if (!refreshToken) return null;

  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    clearTokens();
    return null;
  }

  const data = await res.json();
  accessToken = data.accessToken;
  return data.accessToken;
};

const authHeaders = async (): Promise<Record<string, string>> => {
  let token = accessToken;
  if (!token) token = await refreshAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  post: async (path: string, body: object, auth = false) => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (auth) Object.assign(headers, await authHeaders());

    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    return res.json();
  },

  get: async (path: string, auth = true) => {
    const headers = auth ? await authHeaders() : {};
    const res = await fetch(`${BASE_URL}${path}`, { headers });
    return res.json();
  },

  patch: async (path: string, body: object, auth = true) => {
    const headers = { 'Content-Type': 'application/json', ...(auth ? await authHeaders() : {}) };
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(body),
    });
    return res.json();
  },

  delete: async (path: string, auth = true) => {
    const headers = auth ? await authHeaders() : {};
    const res = await fetch(`${BASE_URL}${path}`, { method: 'DELETE', headers });
    if (!res.ok) throw new Error('Delete request failed');
    return true;
  },
};