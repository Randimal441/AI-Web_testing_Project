import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// ─────────────────────────────────────────────────────────────────────────────
// Axios API Client with Interceptors
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1';

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ── Request interceptor ────────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Future: Attach auth token here
    // const token = getAuthToken();
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor ───────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // Normalise error messages
    if (error.response) {
      const serverMessage = error.response.data?.message ?? 'An error occurred';
      error.message = serverMessage;
    } else if (error.request) {
      error.message = 'No response from server. Check your connection.';
    }
    return Promise.reject(error);
  },
);

export default apiClient;
