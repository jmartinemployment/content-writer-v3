import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiResponse, PaginatedResponse } from './types';
import { getApiBaseUrl } from './config';

class ApiClient {
  private instance: AxiosInstance;

  constructor(baseURL: string = '/api') {
    this.instance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for auth token
    this.instance.interceptors.request.use((config) => {
      // Resolve at request time so deployed hosts never stick to a localhost build fallback.
      config.baseURL = getApiBaseUrl();
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        // Only force re-login on explicit unauthorized from the API — never on network/CORS failures.
        if (error.response?.status === 401 && typeof window !== 'undefined') {
          const body = error.response.data as { error?: string } | undefined;
          // Keep token if GeekAPI rejected Bearer as missing API key (misconfigured gate).
          if (body?.error === 'API key is missing' || body?.error === 'Invalid API key') {
            return Promise.reject(error);
          }
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: any) {
    return this.instance.get<ApiResponse<T> | T>(url, config).then((res) => {
      // Handle both wrapped (ApiResponse<T>) and unwrapped (T) responses
      if (res.data && typeof res.data === 'object' && 'data' in res.data) {
        return (res.data as ApiResponse<T>).data;
      }
      return res.data as T;
    });
  }

  async post<T>(url: string, data?: any, config?: any) {
    return this.instance.post<ApiResponse<T> | T>(url, data, config).then((res) => {
      if (res.data && typeof res.data === 'object' && 'data' in res.data) {
        return (res.data as ApiResponse<T>).data;
      }
      return res.data as T;
    });
  }

  async patch<T>(url: string, data?: any, config?: any) {
    return this.instance.patch<ApiResponse<T> | T>(url, data, config).then((res) => {
      if (res.data && typeof res.data === 'object' && 'data' in res.data) {
        return (res.data as ApiResponse<T>).data;
      }
      return res.data as T;
    });
  }

  async put<T>(url: string, data?: any, config?: any) {
    return this.instance.put<ApiResponse<T> | T>(url, data, config).then((res) => {
      if (res.data && typeof res.data === 'object' && 'data' in res.data) {
        return (res.data as ApiResponse<T>).data;
      }
      return res.data as T;
    });
  }

  async delete<T>(url: string, config?: any) {
    return this.instance.delete<ApiResponse<T> | T>(url, config).then((res) => {
      if (res.data && typeof res.data === 'object' && 'data' in res.data) {
        return (res.data as ApiResponse<T>).data;
      }
      return res.data as T;
    });
  }

  getAxiosInstance() {
    return this.instance;
  }
}

export const apiClient = new ApiClient(getApiBaseUrl());
