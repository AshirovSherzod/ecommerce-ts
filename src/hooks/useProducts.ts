import {
  deleteProducts,
  getProduct,
  getProducts,
  postProducts,
  putProducts,
} from "@/services/productsService";
import type {
  CreateProductRequest,
  ProductQueryParams,
  UpdateProductRequest,
} from "@/types/products.types";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const PRODUCT_KEYS = {
  all: ["products"] as const,
  byId: (id: string) => ["products", id] as const,
  filter: (params: ProductQueryParams) => ["products", params] as const,
  infinite: (params: ProductQueryParams) =>
    ["products", "infinite", params] as const,
};

export const useGetProducts = (params?: ProductQueryParams) => {
  return useQuery({
    queryKey: params ? PRODUCT_KEYS.filter(params) : PRODUCT_KEYS.all,
    queryFn: () => getProducts(params ?? {}),
    staleTime: 1000 * 60 * 3,
  });
};

// Shop sahifasidagi "Show more" uchun — sahifalar ustma-ust yig'iladi
export const useGetInfiniteProducts = (
  params: Omit<ProductQueryParams, "page"> = {},
) => {
  return useInfiniteQuery({
    queryKey: PRODUCT_KEYS.infinite(params),
    queryFn: ({ pageParam }) => getProducts({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.data.pagination;

      if (!pagination || pagination.page >= pagination.totalPages) {
        return undefined;
      }

      return pagination.page + 1;
    },
    staleTime: 1000 * 60 * 3,
  });
};

export const useGetProduct = (id: string) => {
  return useQuery({
    queryKey: PRODUCT_KEYS.byId(id),
    queryFn: () => getProduct(id),
    enabled: !!id,
  });
};

export const usePostProducts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProductRequest) => postProducts(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
    },
  });
};

export const useUpdateProducts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductRequest }) =>
      putProducts(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: PRODUCT_KEYS.byId(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
    },
  });
};

export const useDeleteProducts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProducts(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
    },
  });
};
