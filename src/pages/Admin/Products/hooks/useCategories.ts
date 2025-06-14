import { useState, useEffect } from 'react';
import { getCategories } from '../../../../api/categories';
import { Category } from '../types';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCategories = async (page = 1, limit = 100) => {
    try {
      setLoading(true);
      const response = await getCategories(page, limit);
      setCategories(prev => [...prev, ...response.data]);
      if (response.data.length === limit) {
        await loadCategories(page + 1, limit);
      }
    } catch (err) {
      console.error('Ошибка загрузки категорий:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return { categories, loading };
};