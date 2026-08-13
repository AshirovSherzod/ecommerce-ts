import { axiosInstance } from "@/api/axiosInstance";
import { ENDPOINTS } from "@/api/endpoints";
import { handleError } from "@/api/handleError";
import type {
  CategoryListResponse,
  CategoryResponse,
} from "@/types/category.types";

// ─── Barcha kategoriyalarni olish ────────────────────────────────────
// GET /categories
export const getCategories = async () => {
  try {
    const response = await axiosInstance.get<CategoryListResponse>(
      ENDPOINTS.CATEGORY.GET_ALL,
    );

    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// ─── Bitta kategoriyani olish ────────────────────────────────────
// GET /categories/abc-123
export const getCategory = async (id: string) => {
  try {
    const response = await axiosInstance.get<CategoryResponse>(
      ENDPOINTS.CATEGORY.GET_ONE(id),
    );

    // Bu yerda ham javob o'ralgan holda keladi
    return response.data.data;
  } catch (error) {
    return handleError(error);
  }
};
