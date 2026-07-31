import axios, { type InternalAxiosRequestConfig } from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }

    if (status === 403) {
      console.warn("Ruxsat yo'q");
    }

    if (status >= 500) {
      console.warn("Serverda xato keyinroq uruning");
    }

    // Xatoni yuqoriga uzatamiz, aks holda so'rov `undefined` bilan muvaffaqiyatli tugaydi
    return Promise.reject(error);
  },
);
