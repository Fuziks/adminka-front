import { useState, useCallback, useEffect } from 'react';
import { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  bulkDeleteProducts,
  bulkUpdateProducts,
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
      setPagination(prev => ({
        ...prev,
        total: response.total,
        page
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки товаров';
      setError(errorMessage);
      console.error('Ошибка при загрузке товаров:', err);
    } finally {
      setLoading(false);
    }
  }, [sortConfig.key, sortConfig.direction]);

  const createProductHandler = useCallback(async (productData: CreateProductDto) => {
    try {
      setLoading(true);
      const createdProduct = await createProduct({
        ...productData,
        price: Number(productData.price)
      });
      setSuccessMessage('Товар успешно создан');
      fetchProducts(pagination.page, pagination.limit);
      return createdProduct;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка создания товара';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchProducts, pagination.page, pagination.limit]);

  const updateProductHandler = useCallback(async (id: number, productData: UpdateProductDto) => {
    try {
      setLoading(true);
      const data: UpdateProductDto = {
        ...productData,
        price: productData.price !== undefined ? Number(productData.price) : undefined
      };
      const updatedProduct = await updateProduct(id, data);
      setSuccessMessage('Товар успешно обновлен');
      fetchProducts(pagination.page, pagination.limit);
      return updatedProduct;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка обновления товара';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchProducts, pagination.page, pagination.limit]);

  const deleteProductHandler = useCallback(async (id: number) => {
    try {
      setLoading(true);
      await deleteProduct(id);
      setSuccessMessage('Товар успешно удален');
      fetchProducts(pagination.page, pagination.limit);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка удаления товара';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchProducts, pagination.page, pagination.limit]);

  const bulkDeleteHandler = useCallback(async (ids: number[]) => {
    try {
      setLoading(true);
      await bulkDeleteProducts(ids);
      setSuccessMessage(`Успешно удалено ${ids.length} товаров`);
      fetchProducts(pagination.page, pagination.limit);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка массового удаления';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchProducts, pagination.page, pagination.limit]);

  const bulkUpdateHandler = useCallback(async (
    ids: number[], 
    updateData: Partial<UpdateProductDto>
  ) => {
    try {
      setLoading(true);
      await bulkUpdateProducts(ids, updateData);
      setSuccessMessage(`Успешно обновлено ${ids.length} товаров`);
      fetchProducts(pagination.page, pagination.limit);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка изменения';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchProducts, pagination.page, pagination.limit]);

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
    setError,
    setSuccessMessage,
    setSortConfig,
    setPagination
  };
};