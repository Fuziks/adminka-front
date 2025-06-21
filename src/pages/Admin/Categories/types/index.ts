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
  category?: Category | null;
  onSubmit: (data: { name: string }, shouldClose?: boolean) => void;
  onCancel: () => void;
}

export interface CategoriesTableProps {
  categories: Category[];
  sortConfig: SortConfig;
  selectedIds: number[];
  onSort: (key: string, direction: 'asc' | 'desc') => void;
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
  onSelect: (id: number, isSelected: boolean) => void;
  onSelectAll: (isSelected: boolean) => void;
}

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
}

export interface BulkDeleteConfirmModalProps {
  isOpen: boolean;
  selectedCount: number;
  onClose: () => void;
  onConfirm: () => void;
}