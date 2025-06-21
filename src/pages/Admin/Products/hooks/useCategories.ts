import { useState, useEffect } from 'react';
import { getCategories } from '../../../../api/categories';
import { Category } from '../types';

const DEFAULT_PAGE = 1;
const PAGE_LIMIT = 100;

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async (page = DEFAULT_PAGE, limit = PAGE_LIMIT) => {
    try {
      setIsLoading(true);
      const { data } = await getCategories(page, limit);
      
      setCategories(prevCategories => [...prevCategories, ...data]);
      
      if (data.length === limit) {
        await fetchCategories(page + 1, limit);
      }
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, isLoading };
};