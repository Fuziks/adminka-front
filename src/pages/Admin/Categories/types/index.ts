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
