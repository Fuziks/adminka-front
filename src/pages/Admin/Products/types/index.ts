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

export interface BulkDeleteConfirmModalProps {
  isOpen: boolean;
  selectedCount: number;
  onClose: () => void;
  onConfirm: () => void;
}

export interface BulkEditModalProps {
  isOpen: boolean;
  selectedCount: number;
  categories: any[];
  onClose: () => void;
  onConfirm: (data: { price?: number; categoryId?: number }) => Promise<void>;
}

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
}

export interface ProductFormProps {
  product?: any;
  categories: any[];
  onSubmit: (data: any, shouldClose: boolean) => void;
  onCancel: () => void;
}

export interface CheckNameResponse {
  exists: boolean;
}

export interface ProductsTableProps {
  products: Product[];
  sortConfig: SortConfig;
  selectedIds: number[];
  onSort: (key: string, direction: 'asc' | 'desc') => void;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  onSelect: (id: number, isSelected: boolean) => void;
  onSelectAll: (isSelected: boolean) => void;
}