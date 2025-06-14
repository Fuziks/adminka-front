import apiClient from './apiClient';
import { PaginatedResponse } from './products';

export interface Category {
  id: number;
  name: string;
}

export interface CreateCategoryDto {
  name: string;
}

export interface UpdateCategoryDto {
  name: string;
}

export const getCategories = async (
  page = 1,
  limit = 10,
  sort = 'id',
  order: 'asc' | 'desc' = 'asc'
): Promise<PaginatedResponse<Category>> => {
  const response = await apiClient.get<PaginatedResponse<Category>>('/categories', {
    params: { page, limit, sort, order },
    timeout: 5000
  });
  return response.data;
};

export const getCategory = async (id: number): Promise<Category> => {
  const response = await apiClient.get<Category>(`/categories/${id}`);
  return response.data;
};

export const createCategory = async (categoryData: CreateCategoryDto): Promise<Category> => {
  const response = await apiClient.post<Category>('/categories', categoryData);
  return response.data;
};

export const updateCategory = async (
  id: number, 
  categoryData: { name: string }
): Promise<Category> => {

  const cleanData = { 
    name: categoryData.name 
  };
  
  const response = await apiClient.put<Category>(
    `/categories/${id}`,
    cleanData
  );
  
  return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await apiClient.delete(`/categories/${id}`);
};