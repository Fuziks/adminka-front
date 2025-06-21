import { useState, useCallback, useEffect } from 'react';
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  checkCategoryName,
  CreateCategoryDto,
  UpdateCategoryDto,
  bulkDeleteCategories
} from '../../../../api/categories';
import { Category, Pagination, SortConfig } from '../types';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0 });
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'id', direction: 'asc' });
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const showSuccess = useCallback((message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 5000);
  }, []);

  const showError = useCallback((message: string) => {
    setError(message);
    setTimeout(() => setError(''), 5000);
  }, []);

  const fetchCategories = useCallback(async (
    page: number, 
    limit: number, 
    sort?: string, 
    order?: 'asc' | 'desc'
  ) => {
    try {
      setLoading(true);
      setError('');
      
      const sortKey = sort || sortConfig.key;
      const sortOrder = order || sortConfig.direction;

      const response = await getCategories(page, limit, sortKey, sortOrder);
      
      setCategories(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.total,
        page
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки категорий';
      showError(errorMessage);
      console.error('Ошибка при загрузке категорий:', err);
    } finally {
      setLoading(false);
    }
  }, [sortConfig.key, sortConfig.direction, showError]);

  const checkCategoryExists = async (name: string) => {
    try {
      const response = await checkCategoryName(name);
      return response.exists;
    } catch (err) {
      console.error('Ошибка проверки имени категории:', err);
      return false;
    }
  };

  const bulkDeleteHandler = useCallback(async (ids: number[]) => {
    try {
      setLoading(true);
      await bulkDeleteCategories(ids);
      showSuccess(`Успешно удалено ${ids.length} категорий`);
      fetchCategories(pagination.page, pagination.limit);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка массового удаления';
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCategories, pagination.page, pagination.limit, showSuccess, showError]);

  const createCategoryHandler = useCallback(async (categoryData: CreateCategoryDto) => {
    try {
      setLoading(true);
      if (!categoryData.name.trim()) {
        throw new Error('Название категории не может быть пустым');
      }
      const createdCategory = await createCategory(categoryData);
      showSuccess('Категория успешно создана');
      fetchCategories(pagination.page, pagination.limit);
      return createdCategory;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка создания категории';
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCategories, pagination.page, pagination.limit, showSuccess, showError]);

  const updateCategoryHandler = useCallback(async (id: number, categoryData: UpdateCategoryDto) => {
    try {
      setLoading(true);
      const updatedCategory = await updateCategory(id, categoryData);
      showSuccess('Категория успешно обновлена');
      await fetchCategories(pagination.page, pagination.limit);
      return updatedCategory;
    } catch (err) {
      const error = err as {
        response?: {
          data?: {
            message?: string | string[]
          }
        },
        message?: string
      };
  
      let errorMessage = 'Ошибка обновления категории';
      
      if (error.response?.data?.message) {
        errorMessage = Array.isArray(error.response.data.message)
          ? error.response.data.message.join(', ')
          : error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
  
      showError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchCategories, pagination.page, pagination.limit, showSuccess, showError]);
  

  const deleteCategoryHandler = useCallback(async (id: number) => {
    try {
      setLoading(true);
      await deleteCategory(id);
      showSuccess('Категория успешно удалена');
      fetchCategories(pagination.page, pagination.limit);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка удаления категории';
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCategories, pagination.page, pagination.limit, showSuccess, showError]);

  useEffect(() => {
    fetchCategories(pagination.page, pagination.limit);
  }, [fetchCategories, pagination.limit]);

  return {
    categories,
    loading,
    error,
    successMessage,
    pagination,
    sortConfig,
    selectedCategories,
    fetchCategories,
    createCategory: createCategoryHandler,
    updateCategory: updateCategoryHandler,
    deleteCategory: deleteCategoryHandler,
    bulkDelete: bulkDeleteHandler,
    checkCategoryExists,
    setSortConfig,
    setSelectedCategories,
    setPagination
  };
};