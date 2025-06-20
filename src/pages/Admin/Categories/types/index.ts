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


export interface CategoryFormProps {
  category?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export interface CategoriesTableProps {
  categories: Category[];
  sortConfig: SortConfig;
  onSort: (key: string, direction: 'asc' | 'desc') => void;
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
}

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
}