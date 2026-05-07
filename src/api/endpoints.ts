export const ENDPOINTS = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    REFRESH_TOKEN: "/auth/refresh-token",
    LOGOUT: "/auth/logout",
  },
  PRODUCTS: {
    GET_ALL: "/products",
    GET_ONE: (id: string) => `/products/${id}`,
    GET_CATEGORY: (id: string) => `/products/category/${id}`,
    CREATE: "/products",
    UPDATE: (id: string) => `/products/${id}`,
    DELETE: (id: string) => `/products/${id}`,
  },
  CATEGORY: {
    GET_ALL: "/categories",
    GET_ONE: (id: string) => `/categories/${id}`,
    CREATE: "/categories",
    UPDATE: (id: string) => `/categories/${id}`,
    DELETE: (id: string) => `/categories/${id}`,
  },
} as const;
