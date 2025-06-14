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

export interface Category {
  id: number;
  name: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}
