import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as authService from "@/services/authService";
import type { AuthState } from "@/types/auth.types";
import { AUTH_UNAUTHORIZED } from "@/utils/authEvents";
import { clearToken, getToken, setToken } from "@/utils/authStorage";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Sahifa yangilanganda token joyida bo'lsa sessiya davom etadi
      user: null,
      isAuthenticated: !!getToken(),

      signIn: async (credentials, remember) => {
        const payload = await authService.login(credentials);

        setToken(payload.accessToken, remember);
        set({ user: payload.user ?? null, isAuthenticated: true });

        // Login javobida foydalanuvchi kelmasa alohida so'raymiz
        if (!payload.user) {
          try {
            set({ user: await authService.getMe() });
          } catch {
            // Profil yuklanmasa ham sessiya haqiqiy — keyin qayta urinamiz
          }
        }
      },

      signUp: async (data, remember) => {
        const payload = await authService.register(data);

        // Backend darhol token bermasligi mumkin — u holda foydalanuvchi
        // alohida kirishi kerak, buni chaqiruvchi joy hal qiladi
        if (!payload.accessToken) return false;

        setToken(payload.accessToken, remember);
        set({ user: payload.user ?? null, isAuthenticated: true });

        if (!payload.user) {
          try {
            set({ user: await authService.getMe() });
          } catch {
            // Profil keyinroq yuklanadi
          }
        }

        return true;
      },

      signOut: () => {
        void authService.logout();
        clearToken();
        set({ user: null, isAuthenticated: false });
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      // Tokenni bu yerda saqlamaymiz — u authStorage orqali boshqariladi.
      // Faqat profil ma'lumoti keshlanadi, shuning uchun sahifa ochilishi
      // bilan ism ko'rinadi va /users/me javobini kutish shart emas.
      partialize: (state) => ({ user: state.user }),
      // Kesh qolgan, lekin token yo'q bo'lsa — sessiya tugagan
      onRehydrateStorage: () => (state) => {
        if (state && !getToken()) {
          state.user = null;
          state.isAuthenticated = false;
        }
      },
    },
  ),
);

// Server 401 qaytarganda sessiyani yopamiz. Aks holda token o'chsa ham
// store `isAuthenticated: true` bo'lib qolib, foydalanuvchi kirgan
// ko'rinishda turaverardi — bosgan har bir amali xato bilan tugardi.
window.addEventListener(AUTH_UNAUTHORIZED, () => {
  if (!useAuthStore.getState().isAuthenticated) return;

  useAuthStore.setState({ user: null, isAuthenticated: false });
});
