/*
  Centralized API client for the University Platform.
  Base URL defaults to http://localhost:5000 in development.
  Credentials: 'include' sends httpOnly cookies (JWT access + refresh tokens).
*/

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // send httpOnly cookies
    ...options,
  });

  // Rate limiter returns HTML, not JSON
  if (res.status === 429) {
    const error = new Error('Too many attempts. Please wait a few minutes and try again.');
    error.status = 429;
    error.code = 'RATE_LIMITED';
    throw error;
  }

  let data;
  try {
    data = await res.json();
  } catch {
    const error = new Error('Server error. Please try again later.');
    error.status = res.status;
    throw error;
  }

  if (!res.ok) {
    const message = data?.error?.message || data?.message || 'Something went wrong';
    const error = new Error(message);
    error.status = res.status;
    error.code = data?.error?.code;
    throw error;
  }

  return data;
}

/* ── Auth API ───────────────────────────────────────────────── */

export const authAPI = {
  login: (email, password) =>
    request('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (userData) =>
    request('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  logout: () =>
    request('/api/v1/auth/logout', { method: 'POST' }),

  refreshToken: () =>
    request('/api/v1/auth/refresh-token', { method: 'POST' }),

  getMe: () =>
    request('/api/v1/auth/me'),

  verifyEmail: (token) =>
    request(`/api/v1/auth/verify-email?token=${token}`),

  resendVerification: (email) =>
    request('/api/v1/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
};

export default request;
