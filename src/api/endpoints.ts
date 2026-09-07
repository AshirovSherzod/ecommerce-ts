export const ENDPOINTS = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    // Hali ulanmagan: sessiya muddati tugaganda foydalanuvchi to'satdan
    // chiqarib yuboriladi. Endpoint ishlaydi va {refreshToken} kutadi.
    REFRESH_TOKEN: "/auth/refresh-token",
    LOGOUT: "/auth/logout",
  },
  USERS: {
    ME: "/users/me",
  },
  PRODUCTS: {
    GET_ALL: "/products",
    GET_ONE: (id: string) => `/products/${id}`,
  },
  CATEGORY: {
    GET_ALL: "/categories",
    GET_ONE: (id: string) => `/categories/${id}`,
  },
} as const;
