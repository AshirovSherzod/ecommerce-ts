import { axiosInstance } from "@/api/axiosInstance";
import { ENDPOINTS } from "@/api/endpoints";
import { handleError } from "@/api/handleError";
import type {
  ProductQueryParams,
  ProductResponse,
  ProductsListResponse,
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
