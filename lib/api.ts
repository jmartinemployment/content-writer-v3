import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiResponse, PaginatedResponse } from './types';

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
        if (error.response?.status === 401) {
          // Handle unauthorized
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: any) {
    return this.instance.get<ApiResponse<T>>(url, config).then((res) => res.data.data);
  }

  async post<T>(url: string, data?: any, config?: any) {
    return this.instance.post<ApiResponse<T>>(url, data, config).then((res) => res.data.data);
  }

  async patch<T>(url: string, data?: any, config?: any) {
    return this.instance.patch<ApiResponse<T>>(url, data, config).then((res) => res.data.data);
  }

  async put<T>(url: string, data?: any, config?: any) {
    return this.instance.put<ApiResponse<T>>(url, data, config).then((res) => res.data.data);
  }

  async delete<T>(url: string, config?: any) {
    return this.instance.delete<ApiResponse<T>>(url, config).then((res) => res.data.data);
  }

  getAxiosInstance() {
    return this.instance;
  }
}

export const apiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/content-writer/v3'
);
