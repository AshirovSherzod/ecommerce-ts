import { axiosInstance } from "@/api/axiosInstance";
import { ENDPOINTS } from "@/api/endpoints";
import { handleError } from "@/api/handleError";
import type {
  CreateProductRequest,
  Product,
  ProductQueryParams,
  ProductResponse,
  ProductsListResponse,
  UpdateProductRequest,
} from "@/types/products.types";

// ─── Barcha Maxsulotlarni olish ────────────────────────────────────
// GET /products
export const getProducts = async (params: ProductQueryParams) => {
  try {
    const response = await axiosInstance.get<ProductsListResponse>(
      ENDPOINTS.PRODUCTS.GET_ALL,
      { params },
    );

    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// ─── Bitta Mahsulotni olish ────────────────────────────────────
// GET /products/abc-123
export const getProduct = async (id: string) => {
  try {
    const response = await axiosInstance.get<ProductResponse>(
      ENDPOINTS.PRODUCTS.GET_ONE(id),
    );
    // Javob {data, message, success} ichida o'ralgan — mahsulotning o'zini
    // qaytarish kerak, aks holda `product.title` undefined bo'lib qoladi
    return response.data.data;
  } catch (error) {
    return handleError(error);
  }
};

// ─── Yangi Maxsulot yaratish ────────────────────────────────────
// POST /products
export const postProducts = async (data: CreateProductRequest) => {
  try {
    const response = await axiosInstance.post<Product>(
      ENDPOINTS.PRODUCTS.CREATE,
      data,
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// ─── Maxsulotni taxrirlash ────────────────────────────────────
// PUT /products
export const putProducts = async (id: string, data: UpdateProductRequest) => {
  try {
    const response = await axiosInstance.put<Product>(
      ENDPOINTS.PRODUCTS.UPDATE(id),
      data,
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// ─── Maxsulotni o'chirish ────────────────────────────────────
// DELETE /products
export const deleteProducts = async (id: string) => {
  try {
    const response = await axiosInstance.delete(ENDPOINTS.PRODUCTS.DELETE(id));
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};
