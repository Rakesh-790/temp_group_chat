import type { AxiosError, InternalAxiosRequestConfig, } from "axios";
import axios from "axios";
import { refreshAccessToken } from "../service/auth.service";
import { logoutUser } from "../utils/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}


let refreshPromise: Promise<void> | null = null;

const refreshAccessTokenOnce = (): Promise<void> => {

  if (!refreshPromise) {

    refreshPromise = refreshAccessToken().finally(() => {

      refreshPromise = null;

    });

  }
  return refreshPromise;
};


api.interceptors.response.use((response) => response,
  async (error: AxiosError) => {

    const originalRequest = error.config as RetryRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Don't try to refresh these endpoints
    if (
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {

      originalRequest._retry = true;

      try {
        await refreshAccessTokenOnce();

        // Retry the original request.
        // The browser will automatically send the new cookies.
        return api(originalRequest);

      } catch (refreshError) {
        logoutUser();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);

  }
);

export default api;