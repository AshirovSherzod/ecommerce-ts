import axios, { type InternalAxiosRequestConfig } from "axios";
import { clearToken, getToken } from "@/utils/authStorage";
import { notifyUnauthorized } from "@/utils/authEvents";

const baseURL = import.meta.env.VITE_API_URL;

// Vite `VITE_*` qiymatlarini build paytida bundle ichiga yozadi. Hosting'da
// o'zgaruvchi berilmasa baseURL bo'sh qoladi va so'rovlar API o'rniga saytning
// o'z domeniga ketib 404 qaytaradi. Sababi ko'rinib tursin.
if (!baseURL) {
  console.error(
    "VITE_API_URL topilmadi — API so'rovlari noto'g'ri manzilga ketadi. " +
      "Hosting sozlamalarida muhit o'zgaruvchisini qo'shib, qayta deploy qiling.",
  );
}

export const axiosInstance = axios.create({
  baseURL,
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // "Remember me" ga qarab token local yoki sessionStorage'da bo'ladi
    const token = getToken();

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
      // Token yaroqsiz — tozalaymiz va sessiya tugaganini e'lon qilamiz.
      // Faqat tokenni o'chirish yetarli emas edi: auth store hamon
      // `isAuthenticated: true` bo'lib qolib, header foydalanuvchini
      // kirgan holatda ko'rsatib turardi.
      clearToken();
      notifyUnauthorized();
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
