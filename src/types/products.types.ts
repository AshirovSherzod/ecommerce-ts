export type Currency = "UZS" | "USD" | "EUR";

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  oldPrice: number | null;
  currency: Currency;
  categoryId: string;
  brand: string;
  images: string[];
  createdAt: string;
  // API hozircha yubormaydi — kelsa, mahsulot sahifasida o'zi paydo bo'ladi
  sku?: string;
  measurements?: string;
  saleEndsAt?: string;
}

// Bitta mahsulot ham ro'yxat kabi {data, message, success} ichida keladi
export interface ProductResponse {
  data: Product;
  message: string;
  success: boolean;
}

export interface ProductsListResponse {
  data: {
    pagination: {
      limit: number;
      page: number;
      total: number;
      totalPages: number;
    };
    products: Product[];
  };
  message: string;
  success: boolean;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  /** Sarlavha va brend bo'yicha qidiradi (tavsif bo'yicha emas) */
  search?: string;
  brand?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface CreateProductRequest {
  title: string;
  description: string;
  price: number;
  oldPrice?: number;
  currency: Currency;
  categoryId: string;
  brand: string;
  images: string[];
}

export type UpdateProductRequest = Partial<CreateProductRequest>;
