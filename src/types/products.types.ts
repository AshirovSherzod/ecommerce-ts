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
