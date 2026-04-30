export const ENDPOINTS = {
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
