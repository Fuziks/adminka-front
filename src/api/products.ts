import apiClient from './apiClient';

export interface Product {
  id: number;
  name: string;
  price: number;
  brand?: string;
  category?: {
    id: number;
    name: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateProductDto {
  name: string;
  price: number;
  brand?: string;
  categoryId?: number;
}

export interface UpdateProductDto {
  name?: string;
  price?: number;
  brand?: string;
  categoryId?: number | null;
}

export interface CheckNameResponse {
  exists: boolean;
}

export const getProducts = async (
  page = 1,
  limit = 10,
  sort = 'id',
  order: 'asc' | 'desc' = 'asc'
): Promise<PaginatedResponse<Product>> => {
  const response = await apiClient.get<PaginatedResponse<Product>>('/products', {
    params: { page, limit, sort, order },
  });
  return response.data;
};

export const getProduct = async (id: number): Promise<Product> => {
  const response = await apiClient.get<Product>(`/products/${id}`);
  return response.data;
};

export const createProduct = async (
  productData: CreateProductDto
): Promise<Product> => {
  const response = await apiClient.post<Product>('/products', productData);
  return response.data;
};

export const updateProduct = async (
  id: number,
  productData: UpdateProductDto
): Promise<Product> => {
  const response = await apiClient.put<Product>(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await apiClient.delete(`/products/${id}`);
};

export const bulkDeleteProducts = async (ids: number[]): Promise<void> => {
  await apiClient.post('/products/bulk-delete', { ids });
};

export const bulkUpdateProducts = async (
  ids: number[],
  updateData: Partial<UpdateProductDto>
): Promise<void> => {
  await apiClient.post('/products/bulk-update', { ids, ...updateData });
};

export const checkProductName = async (
  name: string
): Promise<CheckNameResponse> => {
  const response = await apiClient.get<CheckNameResponse>(
    `/products/check-name/${encodeURIComponent(name)}`
  );
  return response.data;
};