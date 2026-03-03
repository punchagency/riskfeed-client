/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG, API_ERROR_CODES } from './config';
import Session from '../utils/Session';
import { store } from '../store';
import { clearAuth, setAuth } from '../store/slices/authSlice';
import { toast } from 'sonner';
import API_ENDPOINTS from './api_endpoints';
import AuthApi from './services/auth';

interface ApiRequestConfig extends AxiosRequestConfig {
  authenticated?: boolean;
  _retry?: boolean;
}

const apiClient = axios.create({
  ...API_CONFIG,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig & { authenticated?: boolean }) => {
    try {
      if (!config.headers) {
        config.headers = {} as any;
      }
      const shouldAuthenticate = config.authenticated !== false;
      if (shouldAuthenticate) {
        const token = await Session.getCookie('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      if (!config.headers['x-retry-count']) {
        config.headers['x-retry-count'] = 0;
      }

      // Handle FormData
      if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
      }

      return config;
    } catch (error) {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error('Request failed:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use((response: AxiosResponse) => response, async (error) => {
  const originalRequest = error.config;

  // Capture API errors in Sentry (production only)
  if (import.meta.env.PROD && error.response?.status >= 500) {
    const Sentry = await import('@sentry/react');
    Sentry.captureException(error, {
      contexts: {
        api: {
          url: originalRequest.url,
          method: originalRequest.method,
          status: error.response?.status,
          statusText: error.response?.statusText,
        },
      },
    });
  }

  if (error.response) {
    const { status, data } = error.response;
    const errorCode = data?.code || data?.error?.code;
    console.log({ status, data, errorCode })
    // Check if the request URL is an authentication endpoint
    const isAuthUrl = Object.values(API_ENDPOINTS.auth).some(authUrl => originalRequest.url?.includes(authUrl));

    // Handle authentication errors (skip for auth URLs)
    if (!isAuthUrl && status === API_ERROR_CODES.UNAUTHORIZED && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Session.getCookie('refreshToken');

        if (refreshToken) {
          const response = await AuthApi.refreshAccessToken({ refreshToken });

          const { accessToken: newToken, refreshToken: newRefreshToken } = response.data;

          Session.setCookie('token', newToken);
          if (newRefreshToken) {
            Session.setCookie('refreshToken', newRefreshToken);
          }

          store.dispatch(setAuth({ token: newToken, refreshToken: newRefreshToken }));

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        toast.error('Session expired. Please login again.', {
          duration: 5000,
          position: 'top-right',
        });
        Session.clearAllCookies()
        Session.removeAll();
        store.dispatch(clearAuth());


        if (typeof window !== 'undefined') {
          window.location.href = '/signin';
        }

        return Promise.reject(refreshError);
      }
      toast.error('Session expired. Please login again.', {
        duration: 5000,
        position: 'top-right',
      });

      Session.clearAllCookies()
      Session.removeAll();
      store.dispatch(clearAuth());


      if (typeof window !== 'undefined') {
        window.location.href = '/signin';
      }

      return Promise.reject({
        status,
        message: 'Authentication required. Please login again.',
        code: errorCode,
        originalError: error,
      });
    }

    // Enhanced logging for 429 errors
    if (status === 429) {

      const retryAfter = error.response.headers["retry-after"];
      if (retryAfter) {
        console.log(`🔄 [API Interceptor] Retrying after ${retryAfter} seconds...`);
        await new Promise((resolve) =>
          setTimeout(resolve, parseInt(retryAfter) * 1000)
        );
        return apiClient(originalRequest);
      }
    }
  } else if (error.request) {
    console.log("No response received:", JSON.stringify(error, null, 2));
    if (originalRequest.headers && originalRequest.headers['x-retry-count'] < 3) {
      originalRequest.headers['x-retry-count'] += 1;
      return apiClient(originalRequest);
    }
  } else {
    console.error("Error setting up request:", error.message);
  }

  return Promise.reject({
    status: error.response?.status || 500,
    message: error.response?.data?.message || error.message,
    response: error.response,
    code: error.code,
    originalError: error,
  });
}
);

// Enhanced API methods with authentication parameter
export const api = {
  get: <T = any>(url: string, config?: ApiRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.get(url, config),

  post: <T = any>(url: string, data?: any, config?: ApiRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.post(url, data, config),

  put: <T = any>(url: string, data?: any, config?: ApiRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.put(url, data, config),

  patch: <T = any>(url: string, data?: any, config?: ApiRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.patch(url, data, config),

  delete: <T = any>(url: string, config?: ApiRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.delete(url, config),
};

export default api;