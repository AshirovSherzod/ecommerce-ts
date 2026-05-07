export interface Category {
  id: string;
  title: string;
  img: string;
  productsCount?: number;
  createdAt: string;
}

export interface CategoryListResponse {
  data: {
    categories: Category[];
  };
  message: string;
  success: boolean;
}

export interface CreateCategoryRequest {
  id: string;
  title: string;
  img: string;
  productsCount?: number;
  createdAt: string;
}

export type UpdateCategoryRequest = Partial<CreateCategoryRequest>;
