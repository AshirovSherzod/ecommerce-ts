import { axiosInstance } from "@/api/axiosInstance";
import { ENDPOINTS } from "@/api/endpoints";
import { handleError } from "@/api/handleError";
import type { Category, CategoryListResponse } from "@/types/category.types";

// ─── Barcha kategoriyalarni olish ────────────────────────────────────
// GET /categories
export const getCategories = async () => {
  try {
    const response = await axiosInstance.get<CategoryListResponse>(
      ENDPOINTS.CATEGORY.GET_ALL,
    );

    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// ─── Bitta kategoriyani olish ────────────────────────────────────
// GET /categories/abc-123
export const getCategory = async (id: string) => {
  try {
    const response = await axiosInstance.get<Category>(
      ENDPOINTS.CATEGORY.GET_ONE(id),
    );

    return response.data;
  } catch (error) {
    handleError(error);
  }
};
