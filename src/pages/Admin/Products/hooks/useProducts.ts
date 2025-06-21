import { useState, useCallback, useEffect } from 'react';
import { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  bulkDeleteProducts,
  bulkUpdateProducts,
  checkProductName,
  CreateProductDto,
  UpdateProductDto
} from '../../../../api/products';
import { Product, Pagination, SortConfig } from '../types';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0 });
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'id', direction: 'asc' });

  const showMessage = useCallback((setter: (msg: string) => void, message: string) => {
    setter(message);
    setTimeout(() => setter(''), 5000);
  }, []);

  const showSuccess = useCallback((message: string) => showMessage(setSuccessMessage, message), [showMessage]);
  const showError = useCallback((message: string) => showMessage(setError, message), [showMessage]);

  const handleApiError = useCallback((err: unknown, defaultMessage: string) => {
    const errorMessage = err instanceof Error ? err.message : defaultMessage;
    showError(errorMessage);
    console.error(`${defaultMessage}:`, err);
    throw err;
  }, [showError]);

  const fetchProducts = useCallback(async (
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

      const response = await getProducts(page, limit, sortKey, sortOrder);
      
      setProducts(response.data);
      setPagination(prev => ({ ...prev, total: response.total, page }));
    } catch (err) {
      handleApiError(err, 'Ошибка загрузки товаров');
    } finally {
      setLoading(false);
    }
  }, [sortConfig, handleApiError]);

  const checkProductExists = async (name: string) => {
    try {
      const response = await checkProductName(name);
      return response.exists;
    } catch (err) {
      console.error('Ошибка проверки имени товара:', err);
      return false;
    }
  };

  const withProductHandling = <T extends any[], R>(
    handler: (...args: T) => Promise<R>,
    successMessage: string
  ) => {
    return async (...args: T): Promise<R> => {
      try {
        setLoading(true);
        const result = await handler(...args);
        showSuccess(successMessage);
        fetchProducts(pagination.page, pagination.limit);
        return result;
      } catch (err) {
        throw err;
      } finally {
        setLoading(false);
      }
    };
  };

  const createProductHandler = useCallback(async (productData: CreateProductDto) => {
    const handler = async (data: CreateProductDto) => {
      return await createProduct({
        ...data,
        price: Number(data.price)
      });
    };
    return withProductHandling(handler, 'Товар успешно создан')(productData);
  }, [fetchProducts, pagination, showSuccess]);

  const updateProductHandler = useCallback(async (id: number, productData: UpdateProductDto) => {
    const handler = async (id: number, data: UpdateProductDto) => {
      const updateData = {
        ...data,
        price: data.price !== undefined ? Number(data.price) : undefined
      };
      return await updateProduct(id, updateData);
    };
    return withProductHandling(handler, 'Товар успешно обновлен')(id, productData);
  }, [fetchProducts, pagination, showSuccess]);

  const deleteProductHandler = useCallback(async (id: number) => {
    return withProductHandling(deleteProduct, 'Товар успешно удален')(id);
  }, [fetchProducts, pagination, showSuccess]);

  const bulkDeleteHandler = useCallback(async (ids: number[]) => {
    const handler = async (ids: number[]) => {
      await bulkDeleteProducts(ids);
      return ids.length;
    };
    return withProductHandling(handler, `Успешно удалено ${ids.length} товаров`)(ids);
  }, [fetchProducts, pagination, showSuccess]);

  const bulkUpdateHandler = useCallback(async (ids: number[], updateData: Partial<UpdateProductDto>) => {
    const handler = async (ids: number[], data: Partial<UpdateProductDto>) => {
      await bulkUpdateProducts(ids, data);
      return ids.length;
    };
    return withProductHandling(handler, `Успешно обновлено ${ids.length} товаров`)(ids, updateData);
  }, [fetchProducts, pagination, showSuccess]);

  useEffect(() => {
    fetchProducts(pagination.page, pagination.limit);
  }, [fetchProducts, pagination.limit]);

  return {
    products,
    loading,
    error,
    successMessage,
    pagination,
    sortConfig,
    fetchProducts,
    createProduct: createProductHandler,
    updateProduct: updateProductHandler,
    deleteProduct: deleteProductHandler,
    bulkDelete: bulkDeleteHandler,
    bulkUpdate: bulkUpdateHandler,
    checkProductExists,
    setError,
    setSuccessMessage,
    setSortConfig,
    setPagination
  };
};