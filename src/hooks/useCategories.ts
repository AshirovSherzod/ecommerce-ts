import { getCategories, getCategory } from "@/services/categoryService";
import { useQuery } from "@tanstack/react-query";

export const CATEGORY_KEYS = {
  all: ["categories"] as const,
  byId: (id: string) => ["categories", id] as const,
};

export const useGetCategories = () => {
  return useQuery({
    queryKey: CATEGORY_KEYS.all,
    queryFn: getCategories,
    // Kategoriyalar kam o'zgaradi
    staleTime: 1000 * 60 * 10,
  });
};

export const useGetCategory = (id: string) => {
  return useQuery({
    queryKey: CATEGORY_KEYS.byId(id),
    queryFn: () => getCategory(id),
    enabled: !!id,
  });
};
